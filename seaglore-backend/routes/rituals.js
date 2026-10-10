import { Router } from 'express';
import db from '../db.js';
import { hasPremium } from '../middleware.js';
import { publicRitual } from '../ritualUtil.js';

const router = Router();

// Login zaroori nahi; premium audio sirf premium user ko milti hai
router.get('/', (req, res) => {
  const canSee = hasPremium(req.user);
  const rows = db
    .prepare('SELECT * FROM rituals WHERE is_active = 1 ORDER BY sort_order, id')
    .all();
  res.json({ rituals: rows.map((r) => publicRitual(r, canSee)) });
});

router.get('/:id', (req, res) => {
  const r = db.prepare('SELECT * FROM rituals WHERE id = ? AND is_active = 1').get(Number(req.params.id));
  if (!r) return res.status(404).json({ error: 'Ritual not found.' });
  res.json({ ritual: publicRitual(r, hasPremium(req.user)) });
});

export default router;