import { Router } from 'express';
import db from '../db.js';

const router = Router();

const page = (msg) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Seagloré</title></head>
<body style="margin:0;background:#FAF5EC;font-family:Georgia,serif;color:#16324A;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:16px;">
<div style="max-width:420px;text-align:center;"><p style="letter-spacing:4px;">SEAGLORÉ</p><h1 style="font-weight:400;font-size:24px;">${msg}</h1></div></body></html>`;

function unsubscribe(token) {
  if (!token || typeof token !== 'string') return false;
  const a = db.prepare('UPDATE leads SET unsubscribed = 1 WHERE unsubscribe_token = ?').run(token);
  const b = db.prepare('UPDATE users SET unsubscribed = 1 WHERE unsubscribe_token = ?').run(token);
  return a.changes + b.changes > 0;
}

// Email link (GET) aur one-click header (POST), dono idempotent hain
router.get('/', (req, res) => {
  const ok = unsubscribe(req.query.token);
  res.status(ok ? 200 : 400).send(
    page(ok ? 'You have been unsubscribed.' : 'This unsubscribe link is not valid.')
  );
});

router.post('/', (req, res) => {
  const ok = unsubscribe(req.query.token);
  res.status(ok ? 200 : 400).json({ ok });
});

export default router;