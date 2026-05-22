// api/ocean-living-leads.js
// Free Ocean Living Guide — Lead capture + Dual email notification
// Same SMTP settings as sendContact.js

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email required.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    // ── 1. EMAIL TO ADMIN (seaglore@gmail.com) ──────────────────
    await transporter.sendMail({
      from: `"Seagloré" <${process.env.GMAIL_USER}>`,
      to: 'seaglore@gmail.com',
      subject: `🌊 New Ocean Living Guide Download — ${name || 'No Name'}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fff;">
          <h1 style="font-size: 24px; letter-spacing: 4px; text-transform: uppercase; color: #111; border-bottom: 2px solid #111; padding-bottom: 16px;">
            SEAGLORÉ
          </h1>
          <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #999; margin-top: 24px;">
            New Free Guide Download
          </p>
          <div style="background: #f8f5f0; padding: 24px; margin: 24px 0; border-left: 3px solid #c9a84c;">
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #999; margin: 0 0 4px;">Name</p>
            <p style="font-size: 16px; color: #111; margin: 0 0 16px;">${name || 'Not Provided'}</p>
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #999; margin: 0 0 4px;">Email</p>
            <p style="font-size: 16px; color: #111; margin: 0 0 16px;">${email}</p>
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #999; margin: 0 0 4px;">Date</p>
            <p style="font-size: 16px; color: #111; margin: 0 0 16px;">${new Date().toLocaleString()}</p>
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #999; margin: 0 0 4px;">Source</p>
            <p style="font-size: 15px; color: #333; margin: 0;">Free Ocean Living Guide Page</p>
          </div>
          <p style="font-size: 11px; color: #999; font-style: italic; text-align: right; margin-top: 32px;">
            "We send beauty, not clutter."
          </p>
        </div>
      `,
    });

    // ── 2. EMAIL TO CUSTOMER (Confirmation + PDF Link) ──────────
    await transporter.sendMail({
      from: `"Seagloré" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '📖 Your Free Ocean Living Guide is Ready!',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fff;">
          <h1 style="font-size: 24px; letter-spacing: 4px; text-transform: uppercase; color: #111; border-bottom: 2px solid #111; padding-bottom: 16px;">
            SEAGLORÉ
          </h1>
          <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #999; margin-top: 24px;">
            Your Free Guide is Ready
          </p>
          <p style="font-size: 20px; font-style: italic; color: #c9a84c; margin: 8px 0 24px;">
            ${name ? 'Thank you, ' + name.split(' ')[0] + '.' : 'Thank you.'}
          </p>
          <p style="font-size: 14px; color: #555; line-height: 1.8; margin-bottom: 16px;">
            Your <strong>Ocean Living Guide</strong> is ready for download. This guide introduces you to calm, clarity, and intentional living — inspired by the rhythm of the ocean.
          </p>
          
          <!-- Download Button -->
          <div style="text-align: center; margin: 36px 0;">
            <a href="https://drive.google.com/uc?export=download&id=1uZsahpwezi7C4_WR3kPQEShwJwL9etud"
               style="display: inline-block; padding: 16px 48px; background: #111; color: #fff; text-decoration: none; font-family: Georgia, serif; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; border: 2px solid #111;">
              ↓ Download Your Free Guide
            </a>
          </div>

          <!-- Upsell Box -->
          <div style="background: #f8f5f0; padding: 24px; margin: 28px 0; border-left: 3px solid #c9a84c; text-align: center;">
            <p style="font-size: 13px; font-weight: bold; color: #111; margin-bottom: 8px; letter-spacing: 2px; text-transform: uppercase;">
              Ready for the Full Experience?
            </p>
            <p style="font-size: 13px; color: #555; line-height: 1.7; margin-bottom: 16px;">
              Join the complete 7-Day Ocean Reset Program and earn your Ocean Living Certification.
            </p>
            <a href="https://www.seaglore.com/checkout-ocean-living"
               style="display: inline-block; padding: 14px 36px; background: #c9a84c; color: #111; text-decoration: none; font-family: Georgia, serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">
              Explore 7-Day Reset — $49
            </a>
          </div>

          <div style="border-top: 1px solid #eee; margin-top: 32px; padding-top: 24px;">
            <p style="font-size: 11px; color: #999; font-style: italic; text-align: right;">
              "We send beauty, not clutter."
            </p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: 'Guide sent to your email!' });

  } catch (error) {
    console.error('Nodemailer error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
}