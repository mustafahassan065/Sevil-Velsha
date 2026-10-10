import { Router } from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import db from '../db.js';
import { config } from '../config.js';
import { sendEmail, unsubHeaders } from '../email.js';
import { quizResultTemplate, SEQUENCE } from '../templates.js';

const router = Router();

router.use(
  rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
  })
);

const normEmail = (e) => String(e || '').trim().toLowerCase();
const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 254;

const getLead = db.prepare('SELECT * FROM leads WHERE email = ?');
const scheduleCount = db.prepare('SELECT COUNT(*) AS n FROM email_schedule WHERE lead_id = ?');
const insertSchedule = db.prepare(
  `INSERT INTO email_schedule (lead_id, template, send_at) VALUES (?, ?, datetime('now', ?))`
);
const recentResultMail = db.prepare(
  `SELECT 1 FROM email_log WHERE to_email = ? AND template = 'quiz_result'
   AND created_at > datetime('now', '-1 hour') LIMIT 1`
);

export const unsubUrlFor = (token) => `${config.clientUrl}/api/unsubscribe?token=${token}`;

function scheduleSequence(leadId) {
  const tx = db.transaction(() => {
    SEQUENCE.forEach((_, i) => insertSchedule.run(leadId, `seq_${i + 1}`, `+${i + 1} days`));
  });
  tx();
}

// POST /api/quiz/submit
// { email, name, answers: [...], result: "text", marketingConsent: true|false }
router.post('/submit', async (req, res) => {
  try {
    const email = normEmail(req.body.email);
    const name = String(req.body.name || '').trim().slice(0, 80);
    const result = String(req.body.result || '').trim().slice(0, 120);
    const consent = req.body.marketingConsent ? 1 : 0;
    let answers = Array.isArray(req.body.answers) ? req.body.answers.slice(0, 50) : [];
    answers = JSON.stringify(answers);
    if (answers.length > 10000) return res.status(400).json({ error: 'Answers too long.' });

    if (!isEmail(email)) return res.status(400).json({ error: 'Please enter a valid email.' });

    let lead = getLead.get(email);
    if (lead) {
      db.prepare(
        `UPDATE leads SET name = COALESCE(NULLIF(?, ''), name), answers = ?, result = ?,
         marketing_consent = CASE WHEN ? = 1 THEN 1 ELSE marketing_consent END,
         unsubscribed = CASE WHEN ? = 1 THEN 0 ELSE unsubscribed END
         WHERE id = ?`
      ).run(name, answers, result, consent, consent, lead.id);
    } else {
      db.prepare(
        `INSERT INTO leads (email, name, answers, result, marketing_consent, unsubscribe_token)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).run(email, name, answers, result, consent, crypto.randomBytes(24).toString('hex'));
    }
    lead = getLead.get(email);

    // 7-day sequence sirf unko jinhon ne consent diya, aur sirf ek baar
    if (lead.marketing_consent && !lead.unsubscribed && scheduleCount.get(lead.id).n === 0) {
      scheduleSequence(lead.id);
    }

    // Result email (transactional). Ek ghante mein ek hi baar, abuse se bachne ke liye
    if (!recentResultMail.get(email)) {
      const unsubUrl = unsubUrlFor(lead.unsubscribe_token);
      await sendEmail({
        to: email,
        template: 'quiz_result',
        subject: 'Your Ocean Reset result – Seagloré',
        html: quizResultTemplate({ name: lead.name, result: lead.result, unsubUrl }),
        headers: unsubHeaders(unsubUrl),
      });
    }

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('quiz submit error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

export default router;