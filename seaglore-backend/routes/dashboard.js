import { Router } from 'express';
import db from '../db.js';
import { requireAuth, hasPremium } from '../middleware.js';
import { publicRitual } from '../ritualUtil.js';
import { getTodayRec } from '../recommend.js';
import { localNow, shiftDate } from '../timeutil.js';

const router = Router();
router.use(requireAuth);

function streakFor(userId, today) {
  const dates = db
    .prepare(
      `SELECT DISTINCT completed_date AS d FROM ritual_completions
       WHERE user_id = ? ORDER BY d DESC LIMIT 400`
    )
    .all(userId)
    .map((r) => r.d);
  if (!dates.length) return 0;
  let cursor;
  if (dates[0] === today) cursor = today;
  else if (dates[0] === shiftDate(today, -1)) cursor = dates[0];
  else return 0;
  let streak = 0;
  for (const d of dates) {
    if (d !== cursor) break;
    streak += 1;
    cursor = shiftDate(cursor, -1);
  }
  return streak;
}

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const user = req.user;
    const canPremium = hasPremium(user);
    const { date } = localNow(user.timezone);

    let today = null;
    const rec = await getTodayRec(user);
    if (rec) {
      const ritual = db.prepare('SELECT * FROM rituals WHERE id = ?').get(rec.ritual_id);
      if (ritual) {
        const done = db
          .prepare(
            'SELECT 1 FROM ritual_completions WHERE user_id = ? AND ritual_id = ? AND completed_date = ?'
          )
          .get(user.id, ritual.id, date);
        today = { ritual: publicRitual(ritual, canPremium), reason: rec.reason, completed: !!done };
      }
    }

    const total = db
      .prepare('SELECT COUNT(*) AS n FROM ritual_completions WHERE user_id = ?')
      .get(user.id).n;
    const recent = db
      .prepare(
        `SELECT c.completed_date AS date, r.id AS ritualId, r.title
         FROM ritual_completions c JOIN rituals r ON r.id = c.ritual_id
         WHERE c.user_id = ? ORDER BY c.completed_date DESC, c.id DESC LIMIT 10`
      )
      .all(user.id);

    res.json({
      name: user.name,
      plan: user.plan,
      premiumAccess: canPremium,
      today,
      streak: streakFor(user.id, date),
      totalCompleted: total,
      recent,
    });
  } catch (err) {
    console.error('dashboard error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// POST /api/dashboard/complete  { ritualId }
router.post('/complete', (req, res) => {
  const ritual = db
    .prepare('SELECT * FROM rituals WHERE id = ? AND is_active = 1')
    .get(Number(req.body.ritualId));
  if (!ritual) return res.status(404).json({ error: 'Ritual not found.' });
  if (ritual.access === 'premium' && !hasPremium(req.user))
    return res.status(403).json({ error: 'This ritual is for Premium members.' });

  const { date } = localNow(req.user.timezone);
  db.prepare(
    `INSERT OR IGNORE INTO ritual_completions (user_id, ritual_id, completed_date) VALUES (?, ?, ?)`
  ).run(req.user.id, ritual.id, date);
  res.json({ ok: true, streak: streakFor(req.user.id, date) });
});

export default router;