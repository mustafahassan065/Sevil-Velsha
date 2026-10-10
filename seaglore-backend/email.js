import { Resend } from 'resend';
import { config } from './config.js';
import db from './db.js';

const resend = config.resendKey ? new Resend(config.resendKey) : null;

const logEmail = db.prepare(
  `INSERT INTO email_log (user_id, to_email, template, subject, status, provider_id, error)
   VALUES (?, ?, ?, ?, ?, ?, ?)`
);

/**
 * Har email yahin se jati hai taake log ho. Kabhi throw nahi karta.
 * headers: optional (List-Unsubscribe wagera).
 */
export async function sendEmail({ userId = null, to, template, subject, html, headers }) {
  if (!resend) {
    const link = (html.match(/href="([^"]+)"/) || [])[1] || '';
    console.log(`[email:skipped] ${template} -> ${to}${link ? `\n  link: ${link}` : ''}`);
    logEmail.run(userId, to, template, subject, 'skipped', null, 'RESEND_API_KEY not set');
    return { ok: false, skipped: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: config.emailFrom,
      to,
      subject,
      html,
      ...(headers ? { headers } : {}),
    });
    if (error) {
      console.error(`[email:failed] ${template} -> ${to}:`, error.message);
      logEmail.run(userId, to, template, subject, 'failed', null, error.message);
      return { ok: false };
    }
    logEmail.run(userId, to, template, subject, 'sent', data?.id || null, null);
    return { ok: true, id: data?.id };
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