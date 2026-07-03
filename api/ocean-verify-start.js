// api/ocean-verify-start/route.js
// Receives email → creates token (base64) → sends verification email via nodemailer
// No database needed — token IS the encoded email
//
// ENV VARS needed (same as your existing send-contact.js):
//   GMAIL_USER, GMAIL_APP_PASSWORD
// Add this one new var:
//   NEXT_PUBLIC_BASE_URL=https://yourdomain.com  (your frontend URL)

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  // Encode email as base64 token — no DB needed
  const token = Buffer.from(email.trim().toLowerCase()).toString('base64');
  const verifyUrl = `${process.env.CLIENT_URL}/api/ocean-verify-confirm?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Ocean Living" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verify your email — Ocean Living Free Experience',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 48px 40px; background: #ffffff;">
          <!-- Header -->
          <div style="border-bottom: 1px solid #e8e4dc; padding-bottom: 24px; margin-bottom: 36px;">
            <p style="font-family: 'Georgia', serif; font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
              color: #4a7c76; margin: 0 0 6px;">Ocean Living</p>
            <p style="font-family: 'Georgia', serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
              color: #aaa; margin: 0;">Free Experience</p>
          </div>

          <!-- Body -->
          <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 400; font-style: italic;
            color: #2d4a47; margin: 0 0 16px; line-height: 1.3;">
            One step away from your free lesson.
          </h1>
          <p style="font-family: Arial, sans-serif; font-size: 15px; color: #555; line-height: 1.8; margin: 0 0 32px;">
            Simply click the button below to verify your email address. Your free Ocean Living lesson will be delivered to your inbox immediately after.
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 0 0 36px;">
            <a href="${verifyUrl}"
              style="display: inline-block; background: #2d4a47; color: #eee9e2;
                font-family: Arial, sans-serif; font-size: 12px; font-weight: 700;
                letter-spacing: 3px; text-transform: uppercase;
                padding: 18px 40px; text-decoration: none;">
              Verify Email &amp; Get Free Lesson →
            </a>
          </div>

          <p style="font-family: Arial, sans-serif; font-size: 12px; color: #aaa;
            line-height: 1.7; margin: 0 0 8px; text-align: center;">
            Or paste this link into your browser:
          </p>
          <p style="font-family: Arial, sans-serif; font-size: 11px; color: #bbb;
            word-break: break-all; text-align: center; margin: 0 0 32px;">
            ${verifyUrl}
          </p>

          <!-- Footer -->
          <div style="border-top: 1px solid #e8e4dc; padding-top: 24px; text-align: center;">
            <p style="font-family: Georgia, serif; font-size: 12px; color: #bbb;
              font-style: italic; margin: 0;">
              If you didn't request this, simply ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('ocean-verify-start error:', err);
    return res.status(500).json({ error: 'Failed to send verification email.' });
  }
}