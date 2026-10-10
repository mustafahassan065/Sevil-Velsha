import { Router } from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import db from '../db.js';
import { config } from '../config.js';
import { requireAuth } from '../middleware.js';
import { sendEmail } from '../email.js';
import { certificateTemplate, esc } from '../templates.js';
import { buildCertificatePdf } from '../certificatePdf.js';

const router = Router();

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function newCode() {
  const bytes = crypto.randomBytes(10);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
  return `SG-${chars.slice(0, 5)}-${chars.slice(5)}`;
}

const verifyUrl = (code) => `${config.clientUrl}/api/certificate/v/${code}`;
const dateOnly = (s) => String(s).slice(0, 10);
const getMine = db.prepare('SELECT * FROM certificates WHERE user_id = ?');
const shape = (c) => ({
  code: c.code,
  name: c.name,
  issuedAt: dateOnly(c.issued_at),
  scorePercent: c.score_percent,
  verifyUrl: verifyUrl(c.code),
});

// ---------- public verification ----------
router.get('/verify/:code', (req, res) => {
  const c = db.prepare('SELECT * FROM certificates WHERE code = ?').get(String(req.params.code).toUpperCase());
  if (!c) return res.status(404).json({ valid: false });
  res.json({ valid: true, name: c.name, issuedAt: dateOnly(c.issued_at), code: c.code });
});

// QR code yahin aata hai: seedha chhota HTML page (frontend page ki zaroorat nahi)
router.get('/v/:code', (req, res) => {
  const c = db.prepare('SELECT * FROM certificates WHERE code = ?').get(String(req.params.code).toUpperCase());
  const body = c
    ? `<p style="color:#2E7D5B;letter-spacing:2px;font-size:13px;">VERIFIED</p>
       <h1 style="font-weight:400;font-size:28px;margin:8px 0;">${esc(c.name)}</h1>
       <p>has successfully completed the Seagloré Ocean Reset Certification.</p>
       <p style="color:#6E7B82;font-size:14px;">Issued ${esc(dateOnly(c.issued_at))}<br>Certificate ID: ${esc(c.code)}</p>`
    : `<h1 style="font-weight:400;font-size:24px;">Certificate not found</h1><p>We could not find a certificate with this ID.</p>`;
  res.status(c ? 200 : 404).send(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Certificate verification – Seagloré</title></head>
<body style="margin:0;background:#FAF5EC;font-family:Georgia,serif;color:#16324A;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:16px;">
<div style="max-width:480px;text-align:center;background:#FFFDF9;border-radius:16px;padding:40px 28px;"><p style="letter-spacing:4px;">SEAGLORÉ</p>${body}</div></body></html>`);
});

// ---------- logged-in user ----------
router.use(requireAuth);

router.get('/mine', (req, res) => {
  const c = getMine.get(req.user.id);
  res.json({ certificate: c ? shape(c) : null });
});

// Sawal (sahi jawab ke baghair)
router.get('/quiz', (req, res) => {
  const rows = db
    .prepare('SELECT id, question, options FROM cert_questions WHERE is_active = 1 ORDER BY sort_order, id')
    .all();
  const c = getMine.get(req.user.id);
  res.json({
    passPercent: config.certPassPercent,
    alreadyCertified: !!c,
    questions: rows.map((r) => ({ id: r.id, question: r.question, options: JSON.parse(r.options) })),
  });
});

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `u${req.user?.id}`,
  message: { error: 'Too many attempts. Please try again later.' },
});

// POST /api/certificate/submit  { answers: { "<questionId>": <optionIndex> }, name }
router.post('/submit', submitLimiter, async (req, res) => {
  try {
    const existing = getMine.get(req.user.id);
    if (existing) return res.json({ passed: true, certificate: shape(existing) });

    const questions = db.prepare('SELECT * FROM cert_questions WHERE is_active = 1').all();
    if (!questions.length) return res.status(503).json({ error: 'The certification quiz is not available yet.' });

    const name = String(req.body.name || req.user.name || '').trim().slice(0, 80);
    if (!name) return res.status(400).json({ error: 'Please enter the name for your certificate.' });

    const answers = req.body.answers && typeof req.body.answers === 'object' ? req.body.answers : {};
    let correct = 0;
    for (const q of questions) {
      if (Number(answers[q.id]) === q.correct_index && answers[q.id] !== null && answers[q.id] !== '') correct += 1;
    }
    const percent = Math.round((correct / questions.length) * 100);
    const passed = percent >= config.certPassPercent;

    if (!passed) {
      return res.json({ passed: false, percent, correct, total: questions.length, passPercent: config.certPassPercent });
    }

    const code = newCode();
    db.prepare(
      'INSERT INTO certificates (code, user_id, name, score_percent) VALUES (?, ?, ?, ?)'
    ).run(code, req.user.id, name, percent);
    const cert = getMine.get(req.user.id);

    await sendEmail({
      userId: req.user.id,
      to: req.user.email,
      template: 'certificate',
      subject: 'Your Seagloré certificate',
      html: certificateTemplate({ name, verifyUrl: verifyUrl(code) }),
    });

    res.json({ passed: true, percent, correct, total: questions.length, certificate: shape(cert) });
  } catch (err) {
    console.error('certificate submit error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// PDF download (sirf apna)
router.get('/pdf', async (req, res) => {
  try {
    const c = getMine.get(req.user.id);
    if (!c) return res.status(404).json({ error: 'No certificate yet.' });
    const pdf = await buildCertificatePdf({
      name: c.name,
      code: c.code,
      issuedAt: dateOnly(c.issued_at),
      verifyUrl: verifyUrl(c.code),
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="seaglore-certificate-${c.code}.pdf"`);
    res.send(pdf);
  } catch (err) {
    console.error('certificate pdf error:', err);
    res.status(500).json({ error: 'Could not create the PDF.' });
  }
});

export default router;