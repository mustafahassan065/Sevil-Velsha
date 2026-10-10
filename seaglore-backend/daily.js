import db from './db.js';
import { config } from './config.js';
import { sendEmail, unsubHeaders } from './email.js';
import { ritualTemplate } from './templates.js';
import { adminRitual } from './ritualUtil.js';
import { getTodayRec } from './recommend.js';
import { localNow, slotMinutes } from './timeutil.js';

const WINDOW_MIN = 180; // slot ke baad 3 ghante tak bhej sakte hain, phir us din skip

const optedIn = db.prepare(
  `SELECT * FROM users
   WHERE daily_email_opt_in = 1 AND email_verified = 1 AND unsubscribed = 0`
);
const claim = db.prepare(
  `UPDATE daily_recs SET emailed_at = datetime('now') WHERE id = ? AND emailed_at IS NULL`
);
const getRitual = db.prepare('SELECT * FROM rituals WHERE id = ?');

// Har user ko din me sirf EK email (daily_recs me user+date unique, aur emailed_at ek hi baar set hota hai)
export async function processDailyEmails() {
  for (const user of optedIn.all()) {
    try {
      const now = localNow(user.timezone);
      const slot = slotMinutes(user.preferred_time);
      if (now.minutes < slot || now.minutes >= slot + WINDOW_MIN) continue;

      const rec = await getTodayRec(user);
      if (!rec || rec.emailed_at) continue;
      if (claim.run(rec.id).changes === 0) continue; // kisi aur tick ne le liya

      const ritual = getRitual.get(rec.ritual_id);
      if (!ritual) continue;

      const unsubUrl = `${config.clientUrl}/api/unsubscribe?token=${user.unsubscribe_token}`;
      await sendEmail({
        userId: user.id,
        to: user.email,
        template: 'daily_ritual',
        subject: `${ritual.title} – your ritual for today`,
        html: ritualTemplate({
          name: user.name,
          ritual: adminRitual(ritual),
          reason: rec.reason,
          unsubUrl,
        }),
        headers: unsubHeaders(unsubUrl),
      });
    } catch (err) {
      console.error('daily email error for user', user.id, err.message);
    }
  }
}