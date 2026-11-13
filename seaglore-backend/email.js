import nodemailer from 'nodemailer';
import { config } from './config.js';
import db from './db.js';

const SMTP_HOST = (process.env.SMTP_HOST || '').trim();
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = (process.env.SMTP_USER || '').trim();
const SMTP_PASS = (process.env.SMTP_PASS || '').trim();
// 465 par secure=true, 587 par STARTTLS (secure=false)
const SMTP_SECURE = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === 'true'
  : SMTP_PORT === 465;

const transport =
  SMTP_HOST && SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
        pool: true,          // roz ki bulk emails ke liye connection reuse
        maxConnections: 3,
        maxMessages: 100,
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
      })
    : null;

if (transport) {
  transport
    .verify()
    .then(() => console.log(`[email] SMTP ready (${SMTP_HOST}:${SMTP_PORT})`))
    .catch((err) => console.error('[email] SMTP verify failed:', err.message));
} else {
  console.log('[email] SMTP not configured (SMTP_HOST / SMTP_USER / SMTP_PASS missing)');
}

const logEmail = db.prepare(
  `INSERT INTO email_log (user_id, to_email, template, subject, status, provider_id, error)
   VALUES (?, ?, ?, ?, ?, ?, ?)`
);

// HTML se simple plain-text version (spam score behtar hota hai)
function htmlToText(html) {
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Har email yahin se jati hai taake log ho. Kabhi throw nahi karta.
 * Return: { ok: true } agar bheji gayi, warna { ok: false }.
 * headers: optional (List-Unsubscribe wagera).
 */
export async function sendEmail({ userId = null, to, template, subject, html, headers }) {
  if (!transport) {
    const link = (html.match(/href="([^"]+)"/) || [])[1] || '';
    console.log(`[email:skipped] ${template} -> ${to}${link ? `\n  link: ${link}` : ''}`);
    logEmail.run(userId, to, template, subject, 'skipped', null, 'SMTP not configured');
    return { ok: false, skipped: true };
  }

  try {
    const info = await transport.sendMail({
      from: config.emailFrom, // 'Seagloré <info@seaglore.com>'
      to,
      subject,
      html,
      text: htmlToText(html),
      ...(headers ? { headers } : {}),
    });
    const id = info.messageId || null;
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