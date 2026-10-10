import crypto from 'crypto';
import db from '../db.js';
import { config } from '../config.js';

// Resend webhooks Svix ke signature use karte hain
function verifySvix(raw, headers, secret) {
  const id = headers['svix-id'];
  const ts = headers['svix-timestamp'];
  const sigHeader = headers['svix-signature'];
  if (!id || !ts || !sigHeader) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false; // 5 minute tolerance

  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const expected = crypto.createHmac('sha256', key).update(`${id}.${ts}.${raw}`).digest('base64');
  return String(sigHeader)
    .split(' ')
    .some((part) => {
      const [version, sig] = part.split(',');
      if (version !== 'v1' || !sig) return false;
      const a = Buffer.from(sig);
      const b = Buffer.from(expected);
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    });
}

const STATUS_FOR = {
  'email.delivered': 'delivered',
  'email.bounced': 'bounced',
  'email.complained': 'complained',
};

// server.js me express.json() se PEHLE, express.raw() ke saath lagta hai
export function resendWebhookHandler(req, res) {
  if (!config.resendWebhookSecret) return res.status(503).send('Not configured');

  const raw = req.body.toString('utf8');
  if (!verifySvix(raw, req.headers, config.resendWebhookSecret)) {
    return res.status(400).send('Invalid signature');
  }

  let evt;
  try {
    evt = JSON.parse(raw);
  } catch {
    return res.status(400).send('Bad payload');
  }

  const data = evt.data || {};
  const toList = (Array.isArray(data.to) ? data.to : [data.to]).filter(Boolean).map((e) => String(e).toLowerCase());
  const svixId = String(req.headers['svix-id']);

  const fresh = db
    .prepare('INSERT OR IGNORE INTO email_events (svix_id, provider_id, type, to_email) VALUES (?, ?, ?, ?)')
    .run(svixId, data.email_id || null, String(evt.type), toList[0] || null);
  if (fresh.changes === 0) return res.json({ received: true, duplicate: true });

  // email_log ka status update (delivered / bounced / complained)
  const status = STATUS_FOR[evt.type];
  if (status && data.email_id) {
    db.prepare('UPDATE email_log SET status = ? WHERE provider_id = ?').run(status, data.email_id);
  }

  // Hard bounce ya spam complaint: us address ko marketing emails band
  const hardBounce = evt.type === 'email.bounced' && data.bounce?.type !== 'Transient';
  if (hardBounce || evt.type === 'email.complained') {
    for (const email of toList) {
      db.prepare('UPDATE users SET unsubscribed = 1 WHERE email = ?').run(email);
      db.prepare('UPDATE leads SET unsubscribed = 1 WHERE email = ?').run(email);
    }
  }

  res.json({ received: true });
}