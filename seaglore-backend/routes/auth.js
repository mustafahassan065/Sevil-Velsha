import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import db from '../db.js';
import { config } from '../config.js';
import { sendEmail } from '../email.js';
import { verifyEmailTemplate, welcomeTemplate, resetPasswordTemplate } from '../templates.js';
import { setAuthCookie, clearAuthCookie, requireAuth, publicUser } from '../middleware.js';

const router = Router();

router.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
  })
);

// ---------- helpers ----------
const normEmail = (e) => String(e || '').trim().toLowerCase();
const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 254;
const isValidTz = (tz) => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};
const hashToken = (t) => crypto.createHash('sha256').update(t).digest('hex');
const PRESETS = ['morning', 'afternoon', 'after_work', 'evening'];
const isValidTime = (v) => PRESETS.includes(v) || /^([01]\d|2[0-3]):[0-5]\d$/.test(String(v));

const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', 10);

const insertToken = db.prepare(
  `INSERT INTO auth_tokens (user_id, type, token_hash, expires_at)
   VALUES (?, ?, ?, datetime('now', ?))`
);
const deleteTokens = db.prepare('DELETE FROM auth_tokens WHERE user_id = ? AND type = ?');
const findTokenStmt = db.prepare(
  `SELECT * FROM auth_tokens
   WHERE token_hash = ? AND type = ? AND expires_at > datetime('now')`
);

function createToken(userId, type, minutes) {
  const raw = crypto.randomBytes(32).toString('hex');
  deleteTokens.run(userId, type);
  insertToken.run(userId, type, hashToken(raw), `+${minutes} minutes`);
  return raw;
}
const findToken = (raw, type) => (raw ? findTokenStmt.get(hashToken(String(raw)), type) : undefined);

const getByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const getById = db.prepare('SELECT * FROM users WHERE id = ?');

async function sendVerification(user) {
  const raw = createToken(user.id, 'verify', 24 * 60);
  const url = `${config.clientUrl}/api/auth/verify-email?token=${raw}`;
  await sendEmail({
    userId: user.id,
    to: user.email,
    template: 'verify_email',
    subject: 'Verify your email – Seagloré',
    html: verifyEmailTemplate({ name: user.name, url }),
  });
}

// ---------- signup ----------
router.post('/signup', async (req, res) => {
  try {
    const email = normEmail(req.body.email);
    const password = String(req.body.password || '');
    const name = String(req.body.name || '').trim().slice(0, 80);
    const tzIn = String(req.body.timezone || '');
    const timezone = tzIn && isValidTz(tzIn) ? tzIn : 'UTC';
    const marketing = req.body.marketingConsent ? 1 : 0;

    if (!isEmail(email)) return res.status(400).json({ error: 'Please enter a valid email.' });
    if (password.length < 8 || password.length > 100)
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });

    const existing = getByEmail.get(email);
    if (existing) {
      if (!existing.email_verified) await sendVerification(existing);
      return res.status(201).json({ ok: true });
    }

    const hash = await bcrypt.hash(password, 10);
    const info = db
      .prepare(
        `INSERT INTO users (email, password_hash, name, timezone, marketing_consent, unsubscribe_token)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(email, hash, name, timezone, marketing, crypto.randomBytes(24).toString('hex'));

    await sendVerification(getById.get(info.lastInsertRowid));
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('signup error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// ---------- verify email ----------
router.get('/verify-email', async (req, res) => {
  try {
    const row = findToken(req.query.token, 'verify');
    if (!row) return res.redirect(config.invalidLinkUrl);

    let user = getById.get(row.user_id);
    if (!user) return res.redirect(config.invalidLinkUrl);

    if (!user.email_verified) {
      const makeAdmin = config.adminEmails.includes(user.email);
      db.prepare(
        `UPDATE users SET email_verified = 1, role = CASE WHEN ? THEN 'admin' ELSE role END WHERE id = ?`
      ).run(makeAdmin ? 1 : 0, user.id);
      user = getById.get(user.id);
      await sendEmail({
        userId: user.id,
        to: user.email,
        template: 'welcome',
        subject: 'Welcome to Seagloré',
        html: welcomeTemplate({ name: user.name }),
      });
    }
    setAuthCookie(res, user);
    res.redirect(config.afterVerifyUrl);
  } catch (err) {
    console.error('verify error:', err);
    res.redirect(config.invalidLinkUrl);
  }
});

router.post('/resend-verification', async (req, res) => {
  try {
    const user = getByEmail.get(normEmail(req.body.email));
    if (user && !user.email_verified) await sendVerification(user);
  } catch (err) {
    console.error('resend error:', err);
  }
  res.json({ ok: true });
});

// ---------- login / logout / me ----------
router.post('/login', async (req, res) => {
  try {
    const email = normEmail(req.body.email);
    const password = String(req.body.password || '');
    const user = getByEmail.get(email);
    const ok = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);
    if (!user || !ok) return res.status(401).json({ error: 'Incorrect email or password.' });
    if (!user.email_verified)
      return res.status(403).json({ code: 'EMAIL_NOT_VERIFIED', error: 'Please verify your email first.' });
    setAuthCookie(res, user);
    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.patch('/me', requireAuth, (req, res) => {
  const b = req.body || {};
  const sets = [];
  const vals = [];

  if (b.name !== undefined) {
    sets.push('name = ?');
    vals.push(String(b.name).trim().slice(0, 80));
  }
  if (b.timezone !== undefined) {
    if (!isValidTz(String(b.timezone))) return res.status(400).json({ error: 'Invalid timezone.' });
    sets.push('timezone = ?');
    vals.push(String(b.timezone));
  }
  if (b.marketingConsent !== undefined) {
    sets.push('marketing_consent = ?');
    vals.push(b.marketingConsent ? 1 : 0);
    if (b.marketingConsent) sets.push('unsubscribed = 0');
  }
  if (b.dailyEmailOptIn !== undefined) {
    sets.push('daily_email_opt_in = ?');
    vals.push(b.dailyEmailOptIn ? 1 : 0);
  }
  if (b.preferredTime !== undefined) {
    if (!isValidTime(b.preferredTime)) return res.status(400).json({ error: 'Invalid preferred time.' });
    sets.push('preferred_time = ?');
    vals.push(String(b.preferredTime));
  }

  if (sets.length) {
    db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...vals, req.user.id);
  }
  res.json({ user: publicUser(getById.get(req.user.id)) });
});

// ---------- password reset ----------
router.post('/forgot-password', async (req, res) => {
  try {
    const user = getByEmail.get(normEmail(req.body.email));
    if (user) {
      const raw = createToken(user.id, 'reset', 60);
      const url = `${config.clientUrl}/reset-password?token=${raw}`;
      await sendEmail({
        userId: user.id,
        to: user.email,
        template: 'reset_password',
        subject: 'Reset your password – Seagloré',
        html: resetPasswordTemplate({ name: user.name, url }),
      });
    }
  } catch (err) {
    console.error('forgot error:', err);
  }
  res.json({ ok: true });
});

router.post('/reset-password', async (req, res) => {
  try {
    const password = String(req.body.password || '');
    if (password.length < 8 || password.length > 100)
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    const row = findToken(req.body.token, 'reset');
    if (!row) return res.status(400).json({ error: 'This link is invalid or has expired.' });

    const hash = await bcrypt.hash(password, 10);
    db.prepare(
      `UPDATE users SET password_hash = ?, token_version = token_version + 1, email_verified = 1 WHERE id = ?`
    ).run(hash, row.user_id);
    deleteTokens.run(row.user_id, 'reset');
    res.json({ ok: true });
  } catch (err) {
    console.error('reset error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

export default router;