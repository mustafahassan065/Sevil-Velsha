import { config } from './config.js';

export function esc(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function layout({ heading, bodyHtml, buttonText, buttonUrl, note = '', unsubUrl = '' }) {
  return `
<div style="background:#FAF5EC;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#FFFDF9;border-radius:16px;padding:40px 32px;">
    <p style="margin:0 0 28px;font-family:Georgia,serif;font-size:18px;letter-spacing:4px;color:#0D3045;">SEAGLORÉ</p>
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#16324A;">${heading}</h1>
    <div style="font-size:15px;line-height:1.7;color:#6E7B82;">${bodyHtml}</div>
    <p style="margin:32px 0;">
      <a href="${buttonUrl}" style="display:inline-block;background:#1E4D6B;color:#ffffff;text-decoration:none;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;padding:16px 32px;border-radius:999px;">${esc(buttonText)}</a>
    </p>
    ${note ? `<p style="margin:0;font-size:12px;line-height:1.6;color:#9AA3A8;">${note}</p>` : ''}
    ${
      unsubUrl
        ? `<p style="margin:24px 0 0;font-size:12px;color:#9AA3A8;"><a href="${unsubUrl}" style="color:#9AA3A8;">Unsubscribe</a></p>`
        : ''
    }
  </div>
</div>`;
}

const hello = (name) => (name ? `Hi ${esc(name.split(' ')[0])},` : 'Hello,');
const p = (text) => `<p style="margin:0 0 12px;">${text}</p>`;

// ---------- Phase 1 ----------
export function verifyEmailTemplate({ name, url }) {
  return layout({
    heading: 'Verify your email',
    bodyHtml: p(hello(name)) + p('Tap the button below to confirm your email and start your Ocean Reset.'),
    buttonText: 'Verify my email',
    buttonUrl: url,
    note: 'This link is valid for 24 hours. If you did not create an account, you can ignore this email.',
  });
}

export function welcomeTemplate({ name }) {
  return layout({
    heading: 'Welcome to your Ocean Reset',
    bodyHtml: p(hello(name)) + p('Your email is verified. Your 3-minute Ocean Reset is ready whenever you are.'),
    buttonText: 'Go to my dashboard',
    buttonUrl: `${config.clientUrl}/dashboard`,
  });
}

export function resetPasswordTemplate({ name, url }) {
  return layout({
    heading: 'Reset your password',
    bodyHtml: p(hello(name)) + p('We received a request to reset your password. Tap the button below to choose a new one.'),
    buttonText: 'Reset password',
    buttonUrl: url,
    note: 'This link is valid for 1 hour. If you did not ask for this, you can safely ignore this email.',
  });
}

// ---------- Phase 2 ----------
export function quizResultTemplate({ name, result, unsubUrl }) {
  return layout({
    heading: 'Your Ocean Reset result',
    bodyHtml:
      p(hello(name)) +
      (result ? p(`Your result: <strong>${esc(result)}</strong>`) : '') +
      p('Create your free account to start your first 3-minute Ocean Reset.'),
    buttonText: 'Start my Ocean Reset',
    buttonUrl: `${config.clientUrl}/signup`,
    unsubUrl,
  });
}

// 7-day sequence. COPY YAHAN EDIT HOTI HAI (client ka text aane par badal dena).
// upsell: true wali emails Premium users ko nahi jaati ("did not purchase" follow-up).
export const SEQUENCE = [
  { heading: 'Day 1 – Start small', body: 'One slow breath is enough to begin. Take your first 3-minute Ocean Reset today.', button: 'Open Ocean Reset', upsell: false },
  { heading: 'Day 2 – Let the water slow you down', body: 'Notice how your shoulders drop when you picture the sea. Come back to the same reset tonight.', button: 'Open Ocean Reset', upsell: false },
  { heading: 'Day 3 – A tiny habit', body: 'Pair your reset with something you already do, like your morning coffee. Small and steady wins.', button: 'Open Ocean Reset', upsell: false },
  { heading: 'Day 4 – Go deeper with Premium', body: 'Premium unlocks the full ritual library, guided audio and a daily reset chosen for you.', button: 'See Premium', upsell: true },
  { heading: 'Day 5 – Your calm, on repeat', body: 'Consistency matters more than length. Even three minutes a day changes how the day feels.', button: 'Open Ocean Reset', upsell: false },
  { heading: 'Day 6 – You are nearly there', body: 'One more day of this week. Notice what has shifted since Day 1.', button: 'Open Ocean Reset', upsell: false },
  { heading: 'Day 7 – Keep the ocean with you', body: 'Make your reset a daily ritual with Premium: the full library and a personal daily recommendation.', button: 'See Premium', upsell: true },
];

export function sequenceTemplate({ name, step, unsubUrl }) {
  const s = SEQUENCE[step - 1];
  return layout({
    heading: esc(s.heading),
    bodyHtml: p(hello(name)) + p(esc(s.body)),
    buttonText: s.button,
    buttonUrl: `${config.clientUrl}/ocean-reset`,
    unsubUrl,
  });
}

export const sequenceSubject = (step) => `${SEQUENCE[step - 1].heading} – Seagloré`;

// ---------- Phase 3 ----------
// Image/audio nahi hon to "No Image Still" / "No Audio Still" dikhta hai.
export function ritualTemplate({ name, ritual, reason = '', unsubUrl }) {
  const imageBlock = ritual.imageUrl
    ? `<img src="${esc(ritual.imageUrl)}" alt="${esc(ritual.title)}" style="width:100%;border-radius:12px;margin:0 0 16px;display:block;">`
    : `<div style="background:#F1EADB;border-radius:12px;padding:40px 16px;text-align:center;color:#9AA3A8;margin:0 0 16px;">No Image Still</div>`;
  const audioBlock = ritual.audioUrl ? '' : `<p style="margin:12px 0 0;color:#9AA3A8;">No Audio Still</p>`;
  return layout({
    heading: esc(ritual.title),
    bodyHtml:
      p(hello(name)) +
      (reason ? p(`<em>${esc(reason)}</em>`) : '') +
      imageBlock +
      (ritual.description ? p(esc(ritual.description)) : '') +
      audioBlock,
    buttonText: ritual.audioUrl ? 'Listen' : 'Open ritual',
    buttonUrl: ritual.audioUrl || `${config.clientUrl}/dashboard`,
    unsubUrl,
  });
}

// ---------- Phase 4 ----------
export function premiumWelcomeTemplate({ name }) {
  return layout({
    heading: 'Welcome to Premium',
    bodyHtml: p(hello(name)) + p('Thank you. The full ritual library and guided audio are now unlocked for you.'),
    buttonText: 'Open my dashboard',
    buttonUrl: `${config.clientUrl}/dashboard`,
  });
}
// ---------- Phase 6 ----------
export function certificateTemplate({ name, verifyUrl }) {
  return layout({
    heading: 'Your certificate is ready',
    bodyHtml:
      p(hello(name)) +
      p('Congratulations, you passed the certification. You can download your certificate PDF from your dashboard.'),
    buttonText: 'View my certificate',
    buttonUrl: verifyUrl,
  });
}