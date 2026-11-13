import { Resend } from 'resend';
import { config } from './config.js';
import db from './db.js';

// Provider: BREVO_API_KEY .env mein ho to Brevo, warna RESEND_API_KEY (Resend).
const brevoKey = (process.env.BREVO_API_KEY || '').trim();
const resend = !brevoKey && config.resendKey ? new Resend(config.resendKey) : null;

const logEmail = db.prepare(
  `INSERT INTO email_log (user_id, to_email, template, subject, status, provider_id, error)
   VALUES (?, ?, ?, ?, ?, ?, ?)`
);

// 'Seagloré <info@seaglore.com>' -> { name, email }
function parseFrom(from) {
  const m = String(from).match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  return m ? { name: m[1].trim() || undefined, email: m[2].trim() } : { email: String(from).trim() };
}

async function sendViaBrevo({ to, subject, html, headers }) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': brevoKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: parseFrom(config.emailFrom),
      to: [{ email: to }],
      subject,
      htmlContent: html,
      ...(headers ? { headers } : {}),
    }),
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Brevo HTTP ${res.status}`);
  return data.messageId || null;
}

/**
 * Har email yahin se jati hai taake log ho. Kabhi throw nahi karta.
 * Return: { ok: true } agar bheji gayi, warna { ok: false }.
 * headers: optional (List-Unsubscribe wagera).
 */
export async function sendEmail({ userId = null, to, template, subject, html, headers }) {
  if (!brevoKey && !resend) {
    const link = (html.match(/href="([^"]+)"/) || [])[1] || '';
    console.log(`[email:skipped] ${template} -> ${to}${link ? `\n  link: ${link}` : ''}`);
    logEmail.run(userId, to, template, subject, 'skipped', null, 'No BREVO_API_KEY / RESEND_API_KEY set');
    return { ok: false, skipped: true };
  }

  try {
    let id = null;
    if (brevoKey) {
      id = await sendViaBrevo({ to, subject, html, headers });
    } else {
      const { data, error } = await resend.emails.send({
        from: config.emailFrom,
        to,
        subject,
        html,
        ...(headers ? { headers } : {}),
      });
      if (error) throw new Error(error.message);
      id = data?.id || null;
    }
    logEmail.run(userId, to, template, subject, 'sent', id, null);
    return { ok: true, id };
  } catch (err) {
    console.error(`[email:failed] ${template} -> ${to}:`, err.message);
    logEmail.run(userId, to, template, subject, 'failed', null, err.message);
    return { ok: false };
  }
}

// Marketing/sequence emails ke liye unsubscribe headers
export function unsubHeaders(url) {
  return {
    'List-Unsubscribe': `<${url}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}