// api/ocean-lead.js
// Same format as send-contact.js — drop in api/ folder
// Handles free lesson email capture form

import SibApiV3Sdk from 'sib-api-v3-sdk';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required.' });
  }

  // ── Brevo setup ───────────────────────────────────────────────
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

  const contactsApi = new SibApiV3Sdk.ContactsApi();
  const emailApi    = new SibApiV3Sdk.TransactionalEmailsApi();

  try {
    // 1. Add to Brevo Leads list
    const contact = new SibApiV3Sdk.CreateContact();
    contact.email         = email;
    contact.listIds       = [parseInt(process.env.BREVO_LEADS_LIST_ID)];
    contact.updateEnabled = true;
    contact.attributes    = { SOURCE: 'ocean_living_free_lesson' };

    await contactsApi.createContact(contact);

    // 2. Send first lesson email
    const sendEmail       = new SibApiV3Sdk.SendSmtpEmail();
    sendEmail.to          = [{ email }];
    sendEmail.sender      = { name: 'Seagloré', email: 'info@seaglore.com' };
    sendEmail.subject     = 'Your first Ocean Living lesson';
    sendEmail.htmlContent = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #3a3a3a;">
        <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #7a8a88; margin-bottom: 32px;">SEAGLORÉ</p>
        <h1 style="font-size: 2rem; font-weight: 400; color: #2d4a47; margin-bottom: 16px;">Welcome to Ocean Living.</h1>
        <p style="font-size: 16px; line-height: 1.8; color: #5a6a68; margin-bottom: 24px;">
          You are not tired. You are disconnected.<br><br>
          This is your first Ocean Living lesson.
        </p>
        <div style="background: #eee9e2; padding: 28px; margin: 32px 0; border-left: 3px solid #2d4a47;">
          <h2 style="font-size: 1.3rem; color: #2d4a47; margin-bottom: 12px;">Lesson 1: Return to Stillness</h2>
          <p style="font-size: 15px; line-height: 1.8; color: #3a3a3a;">
            Take 5 minutes today. Sit without your phone. Without noise. Without purpose.<br><br>
            Notice what remains when nothing is required of you.<br><br>
            That feeling — of quiet, of space — is what Ocean Living is about.
          </p>
        </div>
        <a href="https://www.seaglore.com/ocean-living-certification"
           style="display: inline-block; padding: 16px 40px; background: #2d4a47; color: #ffffff; text-decoration: none; font-family: sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">
          Begin the Full Experience — $49
        </a>
        <p style="font-size: 12px; color: #aaa; margin-top: 48px;">SEAGLORÉ · Where Nature Becomes Couture</p>
      </div>
    `;

    await emailApi.sendTransacEmail(sendEmail);

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Ocean lead error:', err?.response?.body || err.message);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}