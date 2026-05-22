// api/ocean-living-leads.js
// Same format as ocean-lead.js — drop in api/ folder
// Handles free Ocean Living Guide PDF form submissions
// Route called by: FreeOceanGuide.jsx → /api/ocean-living-leads

import SibApiV3Sdk from 'sib-api-v3-sdk';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, source, tag } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required.' });
  }

  // ── Brevo setup ───────────────────────────────────────────────
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

  const contactsApi = new SibApiV3Sdk.ContactsApi();
  const emailApi    = new SibApiV3Sdk.TransactionalEmailsApi();

  try {
    // 1. Add contact to Brevo Leads list
    const contact = new SibApiV3Sdk.CreateContact();
    contact.email         = email;
    contact.listIds       = [parseInt(process.env.BREVO_LEADS_LIST_ID)];
    contact.updateEnabled = true;
    contact.attributes    = {
      FIRSTNAME: name || 'Ocean Student',
      SOURCE: source || 'free_ocean_living_guide',
      TAG: tag || 'seaglore-free-pdf',
    };

    await contactsApi.createContact(contact);

    // 2. Send confirmation email with PDF link
    const sendEmail       = new SibApiV3Sdk.SendSmtpEmail();
    sendEmail.to          = [{ email, name: name || 'Ocean Student' }];
    sendEmail.sender      = { name: 'SEAGLORÉ', email: 'info@seaglore.com' };
    sendEmail.subject     = '📖 Your Free Ocean Living Guide is Here';
    sendEmail.htmlContent = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #3a3a3a; background: #fafaf8;">
        
        <!-- Header -->
        <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #7a8a88; margin-bottom: 32px; text-align: center;">
          SEAGLORÉ
        </p>
        
        <!-- Greeting -->
        <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; font-weight: 400; color: #2d4a47; margin-bottom: 8px; text-align: center;">
          Your Free Ocean Living Guide
        </h1>
        <p style="font-size: 15px; line-height: 1.8; color: #7a8a88; margin-bottom: 24px; text-align: center; font-style: italic;">
          "Where Nature Becomes Couture"
        </p>
        
        <!-- Body -->
        <p style="font-size: 16px; line-height: 1.9; color: #3a3a3a; margin-bottom: 20px;">
          ${name ? 'Hi ' + name.split(' ')[0] + ',' : 'Hello,'}
        </p>
        <p style="font-size: 16px; line-height: 1.9; color: #3a3a3a; margin-bottom: 20px;">
          Thank you for requesting the <strong>Ocean Living Guide</strong>. As promised, your free PDF is attached below for download.
        </p>
        <p style="font-size: 16px; line-height: 1.9; color: #3a3a3a; margin-bottom: 24px;">
          This guide is your introduction to calm, clarity, and intentional living — inspired by the rhythm of the ocean.
        </p>
        
        <!-- What's Inside Box -->
        <div style="background: #eee9e2; padding: 28px; margin: 28px 0; border-left: 3px solid #2d4a47;">
          <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.3rem; color: #2d4a47; margin-bottom: 14px; font-weight: 500;">
            📖 Inside Your Free Guide
          </h2>
          <ul style="font-size: 14px; line-height: 2; color: #3a3a3a; padding-left: 18px; margin: 0;">
            <li>Introduction to Ocean-Inspired Living</li>
            <li>The 3 Pillars of Calm & Clarity</li>
            <li>Simple Daily Reset Rituals</li>
            <li>Ocean Studies Overview</li>
            <li>Next Steps for Certification</li>
          </ul>
        </div>
        
        <!-- Download Button -->
        <div style="text-align: center; margin: 36px 0;">
          <a href="https://drive.google.com/uc?export=download&id=1uZsahpwezi7C4_WR3kPQEShwJwL9etud"
             style="display: inline-block; padding: 16px 44px; background: #2d4a47; color: #ffffff; text-decoration: none; font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; border-radius: 2px;">
            ↓ Download Your Free Guide
          </a>
          <p style="font-size: 12px; color: #aaa; margin-top: 8px;">
            You can also read it online anytime.
          </p>
        </div>
        
        <!-- Upsell -->
        <div style="background: #ffffff; border: 1px solid #d8d3cc; padding: 24px; margin: 28px 0; text-align: center;">
          <p style="font-size: 15px; font-weight: 600; color: #2d4a47; margin-bottom: 8px;">
            🌊 Ready for the Full Experience?
          </p>
          <p style="font-size: 14px; line-height: 1.7; color: #5a6a68; margin-bottom: 16px;">
            Join the complete 7-Day Ocean Reset Program and earn your Ocean Living Certification.
          </p>
          <a href="https://www.seaglore.com/checkout-ocean-living"
             style="display: inline-block; padding: 14px 36px; background: #2d4a47; color: #ffffff; text-decoration: none; font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; border-radius: 2px;">
            Explore the 7-Day Reset — $49
          </a>
        </div>
        
        <!-- Contact -->
        <p style="font-size: 13px; color: #aaa; margin-top: 32px; text-align: center;">
          Need help? Reply to this email or contact us at <a href="mailto:info@seaglore.com" style="color: #2d4a47;">info@seaglore.com</a>
        </p>
        
        <!-- Footer -->
        <hr style="border: none; border-top: 1px solid #d8d3cc; margin: 32px 0;" />
        <p style="font-size: 11px; color: #ccc; text-align: center; font-family: 'Jost', sans-serif;">
          SEAGLORÉ · Where Nature Becomes Couture<br>
          © ${new Date().getFullYear()} SEAGLORÉ. All rights reserved.
        </p>
        
      </div>
    `;

    await emailApi.sendTransacEmail(sendEmail);

    return res.status(200).json({ success: true, message: 'Guide sent to your email!' });

  } catch (err) {
    console.error('Ocean Living lead error:', err?.response?.body || err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}