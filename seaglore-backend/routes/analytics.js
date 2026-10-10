import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import db from '../db.js';

const router = Router();

router.use(
  rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests.' },
  })
);

// Frontend se chhote events. Sirf ye naam allow hain.
const ALLOWED = ['page_view', 'quiz_started', 'quiz_completed', 'cta_click', 'checkout_started'];

// POST /api/analytics/event  { name, path }
router.post('/event', (req, res) => {
  const name = String(req.body.name || '');
  if (!ALLOWED.includes(name)) return res.status(400).json({ error: 'Unknown event.' });
  const path = String(req.body.path || '').slice(0, 200);
  db.prepare('INSERT INTO events (name, user_id, path) VALUES (?, ?, ?)').run(name, req.user?.id ?? null, path);
  res.json({ ok: true });
});

export default router;