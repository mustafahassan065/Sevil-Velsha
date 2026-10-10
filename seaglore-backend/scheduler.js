import db from './db.js';
import { sendEmail, unsubHeaders } from './email.js';
import { SEQUENCE, sequenceTemplate, sequenceSubject } from './templates.js';
import { unsubUrlFor } from './routes/quiz.js';
import { processDailyEmails } from './daily.js';

const due = db.prepare(
  `SELECT s.id, s.template, l.id AS lead_id, l.email, l.name, l.unsubscribed,
          l.marketing_consent, l.unsubscribe_token
   FROM email_schedule s JOIN leads l ON l.id = s.lead_id
   WHERE s.status = 'pending' AND s.send_at <= datetime('now')
   ORDER BY s.send_at LIMIT 20`
);
const setStatus = db.prepare(
  `UPDATE email_schedule SET status = ?, sent_at = datetime('now') WHERE id = ?`
);
const isPremiumEmail = db.prepare(
  `SELECT 1 FROM users WHERE email = ? AND plan = 'premium' LIMIT 1`
);

async function processSequence() {
  for (const row of due.all()) {
    const step = Number(row.template.replace('seq_', ''));
    const def = SEQUENCE[step - 1];

    if (!def || row.unsubscribed || !row.marketing_consent) {
      setStatus.run('skipped', row.id);
      continue;
    }
    // "Did not purchase" follow-up: Premium user ko upsell email nahi jaati
    if (def.upsell && isPremiumEmail.get(row.email)) {
      setStatus.run('skipped', row.id);
      continue;
    }

    const unsubUrl = unsubUrlFor(row.unsubscribe_token);
    const r = await sendEmail({
      to: row.email,
      template: row.template,
      subject: sequenceSubject(step),
      html: sequenceTemplate({ name: row.name, step, unsubUrl }),
      headers: unsubHeaders(unsubUrl),
    });
    // Dev mode (key nahi) mein 'skipped' hi manenge taake loop na bane
    setStatus.run(r.ok || r.skipped ? 'sent' : 'failed', row.id);
  }
}

let running = false;

export async function tick() {
  if (running) return;
  running = true;
  try {
    await processSequence();
    await processDailyEmails();
  } catch (err) {
    console.error('scheduler error:', err);
  } finally {
    running = false;
  }
}

export function startScheduler() {
  setInterval(tick, 60 * 1000);
  tick();
}