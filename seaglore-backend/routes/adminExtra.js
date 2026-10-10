import { Router } from 'express';
import db from '../db.js';
import { requireAdmin } from '../middleware.js';

const router = Router();
router.use(requireAdmin);

// ---------- certificate quiz questions ----------
function parseQuestion(b) {
  const question = String(b.question || '').trim();
  const options = Array.isArray(b.options) ? b.options.map((o) => String(o).trim()) : [];
  const correctIndex = Number(b.correctIndex);
  if (!question || question.length > 500) return { error: 'Question is required (max 500 characters).' };
  if (options.length < 2 || options.length > 6 || options.some((o) => !o || o.length > 200))
    return { error: 'Provide 2 to 6 options (each up to 200 characters).' };
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length)
    return { error: 'correctIndex must point to one of the options.' };
  const sortOrder = Number.isInteger(Number(b.sortOrder)) ? Number(b.sortOrder) : 0;
  const isActive = b.isActive === false || b.isActive === 0 || b.isActive === '0' ? 0 : 1;
  return { question, options: JSON.stringify(options), correctIndex, sortOrder, isActive };
}

const shapeQ = (r) => ({
  id: r.id,
  question: r.question,
  options: JSON.parse(r.options),
  correctIndex: r.correct_index,
  sortOrder: r.sort_order,
  isActive: !!r.is_active,
});

router.get('/cert-questions', (_req, res) => {
  const rows = db.prepare('SELECT * FROM cert_questions ORDER BY sort_order, id').all();
  res.json({ questions: rows.map(shapeQ) });
});

router.post('/cert-questions', (req, res) => {
  const q = parseQuestion(req.body);
  if (q.error) return res.status(400).json({ error: q.error });
  const info = db
    .prepare(
      'INSERT INTO cert_questions (question, options, correct_index, sort_order, is_active) VALUES (?, ?, ?, ?, ?)'
    )
    .run(q.question, q.options, q.correctIndex, q.sortOrder, q.isActive);
  const row = db.prepare('SELECT * FROM cert_questions WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ question: shapeQ(row) });
});

router.put('/cert-questions/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!db.prepare('SELECT 1 FROM cert_questions WHERE id = ?').get(id))
    return res.status(404).json({ error: 'Question not found.' });
  const q = parseQuestion(req.body);
  if (q.error) return res.status(400).json({ error: q.error });
  db.prepare(
    'UPDATE cert_questions SET question = ?, options = ?, correct_index = ?, sort_order = ?, is_active = ? WHERE id = ?'
  ).run(q.question, q.options, q.correctIndex, q.sortOrder, q.isActive, id);
  res.json({ question: shapeQ(db.prepare('SELECT * FROM cert_questions WHERE id = ?').get(id)) });
});

router.delete('/cert-questions/:id', (req, res) => {
  const info = db.prepare('DELETE FROM cert_questions WHERE id = ?').run(Number(req.params.id));
  if (!info.changes) return res.status(404).json({ error: 'Question not found.' });
  res.json({ ok: true });
});

router.get('/certificates', (_req, res) => {
  const rows = db
    .prepare(
      `SELECT c.code, c.name, c.score_percent AS scorePercent, c.issued_at AS issuedAt, u.email
       FROM certificates c JOIN users u ON u.id = c.user_id ORDER BY c.id DESC LIMIT 500`
    )
    .all();
  res.json({ certificates: rows });
});

// ---------- simple analytics ----------
const PRICE_MONTHLY = 9.99;
const PRICE_YEARLY = 79;

router.get('/analytics', (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 365);
  const since = `-${days} days`;
  const one = (sql, ...args) => db.prepare(sql).get(...args).n;
  const all = (sql, ...args) => db.prepare(sql).all(...args);

  const activeMonthly = one(
    "SELECT COUNT(*) AS n FROM subscriptions WHERE status IN ('active','trialing','past_due') AND interval = 'month'"
  );
  const activeYearly = one(
    "SELECT COUNT(*) AS n FROM subscriptions WHERE status IN ('active','trialing','past_due') AND interval = 'year'"
  );

  res.json({
    rangeDays: days,
    totals: {
      users: one('SELECT COUNT(*) AS n FROM users'),
      verifiedUsers: one('SELECT COUNT(*) AS n FROM users WHERE email_verified = 1'),
      premiumUsers: one("SELECT COUNT(*) AS n FROM users WHERE plan = 'premium'"),
      leads: one('SELECT COUNT(*) AS n FROM leads'),
      leadsWithConsent: one('SELECT COUNT(*) AS n FROM leads WHERE marketing_consent = 1'),
      leadsConverted: one('SELECT COUNT(*) AS n FROM leads l JOIN users u ON u.email = l.email'),
      certificates: one('SELECT COUNT(*) AS n FROM certificates'),
      ritualCompletions: one('SELECT COUNT(*) AS n FROM ritual_completions'),
    },
    estimatedMonthlyRevenueUsd: Math.round((activeMonthly * PRICE_MONTHLY + (activeYearly * PRICE_YEARLY) / 12) * 100) / 100,
    inRange: {
      newUsers: all(
        `SELECT date(created_at) AS date, COUNT(*) AS n FROM users
         WHERE created_at >= datetime('now', ?) GROUP BY date ORDER BY date`,
        since
      ),
      newLeads: all(
        `SELECT date(created_at) AS date, COUNT(*) AS n FROM leads
         WHERE created_at >= datetime('now', ?) GROUP BY date ORDER BY date`,
        since
      ),
      completions: all(
        `SELECT completed_date AS date, COUNT(*) AS n FROM ritual_completions
         WHERE created_at >= datetime('now', ?) GROUP BY date ORDER BY date`,
        since
      ),
      events: all(
        `SELECT name, COUNT(*) AS n FROM events WHERE created_at >= datetime('now', ?)
         GROUP BY name ORDER BY n DESC`,
        since
      ),
      emailsByStatus: all(
        `SELECT status, COUNT(*) AS n FROM email_log WHERE created_at >= datetime('now', ?)
         GROUP BY status ORDER BY n DESC`,
        since
      ),
      emailEvents: all(
        `SELECT type, COUNT(*) AS n FROM email_events WHERE created_at >= datetime('now', ?)
         GROUP BY type ORDER BY n DESC`,
        since
      ),
      topRituals: all(
        `SELECT r.id, r.title, COUNT(*) AS completions FROM ritual_completions c
         JOIN rituals r ON r.id = c.ritual_id WHERE c.created_at >= datetime('now', ?)
         GROUP BY r.id ORDER BY completions DESC LIMIT 10`,
        since
      ),
    },
  });
});

export default router;