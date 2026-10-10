import db from './db.js';
import { config } from './config.js';
import { hasPremium } from './middleware.js';
import { localNow } from './timeutil.js';

// AI sirf maujooda rituals mein se ID chunta hai. Wo ID candidates mein na ho to rule-based fallback chalta hai.

function candidatesFor(user) {
  const rows = db.prepare('SELECT * FROM rituals WHERE is_active = 1 ORDER BY sort_order, id').all();
  return hasPremium(user) ? rows : rows.filter((r) => r.access === 'free');
}

function recentRitualIds(userId, beforeDate) {
  return db
    .prepare(
      `SELECT ritual_id FROM daily_recs WHERE user_id = ? AND local_date < ?
       ORDER BY local_date DESC LIMIT 7`
    )
    .all(userId, beforeDate)
    .map((r) => r.ritual_id);
}

function lastRecDate(userId, ritualId) {
  return (
    db
      .prepare('SELECT MAX(local_date) AS d FROM daily_recs WHERE user_id = ? AND ritual_id = ?')
      .get(userId, ritualId)?.d || ''
  );
}

function ruleBased(user, pool, quizResult) {
  const q = (quizResult || '').toLowerCase();
  const scored = pool.map((r) => {
    const cat = (r.category || '').toLowerCase();
    const match = q && cat && (q.includes(cat) || cat.includes(q)) ? 1 : 0;
    return { r, match, last: lastRecDate(user.id, r.id) };
  });
  // Pehle quiz-match, phir jo sab se purana (ya kabhi nahi) dikhaya gaya, phir sort_order
  scored.sort((a, b) => b.match - a.match || a.last.localeCompare(b.last) || a.r.sort_order - b.r.sort_order);
  const best = scored[0];
  return {
    ritualId: best.r.id,
    reason: best.match ? `A ${best.r.category} ritual, picked from your quiz result.` : 'A gentle reset chosen for you today.',
    source: 'rule',
  };
}

async function askOpenAI(pool, quizResult, recentTitles) {
  const body = {
    model: config.openai.model,
    temperature: 0.7,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You choose ONE wellness ritual for a user today, only from the list provided. ' +
          'Reply with JSON only: {"ritualId": <number from the list>, "reason": "<one warm sentence, max 140 characters, speaking to the user as you>"}. ' +
          'Never invent a ritual. Prefer variety over rituals shown recently.',
      },
      {
        role: 'user',
        content: JSON.stringify({
          quizResult: quizResult || null,
          recentlyShown: recentTitles,
          rituals: pool.map((r) => ({
            id: r.id,
            title: r.title,
            category: r.category,
            durationMin: r.duration_min,
            description: (r.description || '').slice(0, 200),
          })),
        }),
      },
    ],
  };
  const res = await fetch(`${config.openai.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.openai.key}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(7000),
  });
  if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);
  const data = await res.json();
  const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');
  const id = Number(parsed.ritualId);
  if (!pool.some((r) => r.id === id)) throw new Error('AI returned an unknown ritual id');
  const reason = String(parsed.reason || '').replace(/\s+/g, ' ').trim().slice(0, 160);
  return { ritualId: id, reason: reason || 'Chosen for you today.', source: 'ai' };
}

async function pickRitual(user, today) {
  const all = candidatesFor(user);
  if (!all.length) return null;

  const recent = new Set(recentRitualIds(user.id, today));
  const fresh = all.filter((r) => !recent.has(r.id));
  const pool = fresh.length ? fresh : all;

  const quizResult = db.prepare('SELECT result FROM leads WHERE email = ?').get(user.email)?.result || '';

  if (config.openai.key && pool.length > 1) {
    try {
      const titles = all.filter((r) => recent.has(r.id)).map((r) => r.title);
      return await askOpenAI(pool, quizResult, titles);
    } catch (err) {
      console.error('AI recommendation failed, using rule-based:', err.message);
    }
  }
  return ruleBased(user, pool, quizResult);
}

// Aaj ki recommendation (user ki local date). Pehli dafa banti hai, phir wahi rehti hai.
export async function getTodayRec(user) {
  const { date } = localNow(user.timezone);
  const get = db.prepare('SELECT * FROM daily_recs WHERE user_id = ? AND local_date = ?');
  const existing = get.get(user.id, date);
  if (existing) return existing;

  const pick = await pickRitual(user, date);
  if (!pick) return null;
  db.prepare(
    `INSERT OR IGNORE INTO daily_recs (user_id, local_date, ritual_id, reason, source)
     VALUES (?, ?, ?, ?, ?)`
  ).run(user.id, date, pick.ritualId, pick.reason, pick.source);
  return get.get(user.id, date);
}