// api/ocean-verify-confirm/route.js
// User clicks verify link → decode token → send free lesson email → redirect to thank you page
//
// ENV VARS:
//   GMAIL_USER, GMAIL_APP_PASSWORD
//   NEXT_PUBLIC_BASE_URL
//
// Free content links (update these with your actual Drive links):
const FREE_LESSON_VIDEO    = 'https://drive.google.com/file/d/1h3FuJ2HOOpbtfck5TpPgik5MWjpnXpac/view';
const FREE_BROCHURE        = 'https://drive.google.com/uc?export=download&id=1F3LXJjYFQ97ZkSQMTRyG7S9VvYsK2oqI';

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { token } = req.query;
  if (!token) return res.status(400).send('Invalid link.');

  // Decode email from token
  let email;
  try {
    email = Buffer.from(token, 'base64').toString('utf-8');
    if (!email || !/\S+@\S+\.\S+/.test(email)) throw new Error('invalid');
  } catch {
    return res.status(400).send('Invalid or expired verification link.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    // Send free lesson email to verified user
    await transporter.sendMail({
      from: `"Ocean Living" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your Free Ocean Living Lesson is here ✦',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 48px 40px; background: #ffffff;">
          <!-- Header -->
          <div style="border-bottom: 1px solid #e8e4dc; padding-bottom: 24px; margin-bottom: 36px;">
            <p style="font-family: Georgia, serif; font-size: 11px; letter-spacing: 4px;
              text-transform: uppercase; color: #4a7c76; margin: 0 0 6px;">Ocean Living</p>
            <p style="font-family: Georgia, serif; font-size: 11px; letter-spacing: 2px;
              text-transform: uppercase; color: #aaa; margin: 0;">Your Free Lesson</p>
          </div>

          <!-- Welcome -->
          <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 400; font-style: italic;
            color: #2d4a47; margin: 0 0 16px; line-height: 1.3;">
            Welcome. Your journey begins now.
          </h1>
          <p style="font-family: Arial, sans-serif; font-size: 15px; color: #555; line-height: 1.8; margin: 0 0 36px;">
            Thank you for verifying your email. Below you'll find your free Ocean Living lesson — a genuine preview of what awaits inside the full experience.
          </p>

          <!-- Free Video -->
          <div style="background: #f0ede8; padding: 28px; margin-bottom: 20px; border-left: 3px solid #4a7c76;">
            <p style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 3px;
              text-transform: uppercase; color: #4a7c76; margin: 0 0 10px;">Lesson 1 — Free Video</p>
            <p style="font-family: Georgia, serif; font-size: 18px; color: #2d4a47;
              margin: 0 0 16px; font-style: italic;">The Art of Slowing Down</p>
            <a href="${FREE_LESSON_VIDEO}"
              style="display: inline-block; background: #2d4a47; color: #eee9e2;
                font-family: Arial, sans-serif; font-size: 11px; font-weight: 700;
                letter-spacing: 2px; text-transform: uppercase;
                padding: 14px 28px; text-decoration: none;">
              Watch Free Lesson →
            </a>
          </div>

          <!-- Free Guide -->
          <div style="background: #f0ede8; padding: 28px; margin-bottom: 36px; border-left: 3px solid #4a7c76;">
            <p style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 3px;
              text-transform: uppercase; color: #4a7c76; margin: 0 0 10px;">Free Downloadable Guide</p>
            <p style="font-family: Georgia, serif; font-size: 18px; color: #2d4a47;
              margin: 0 0 16px; font-style: italic;">Ocean Living — Introductory Guide</p>
            <a href="${FREE_BROCHURE}"
              style="display: inline-block; background: #2d4a47; color: #eee9e2;
                font-family: Arial, sans-serif; font-size: 11px; font-weight: 700;
                letter-spacing: 2px; text-transform: uppercase;
                padding: 14px 28px; text-decoration: none;">
              Download Free Guide →
            </a>
          </div>

          <!-- Upsell -->
          <div style="text-align: center; padding: 32px; background: #2d4a47; margin-bottom: 32px;">
            <p style="font-family: Georgia, serif; font-size: 11px; letter-spacing: 3px;
              text-transform: uppercase; color: #4a7c76; margin: 0 0 12px;">Ready for more?</p>
            <p style="font-family: Georgia, serif; font-size: 22px; font-style: italic;
              color: #eee9e2; margin: 0 0 20px; line-height: 1.3;">
              Join the full 7-Day Ocean Reset Experience
            </p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/checkout-ocean-living"
              style="display: inline-block; background: #eee9e2; color: #2d4a47;
                font-family: Arial, sans-serif; font-size: 11px; font-weight: 700;
                letter-spacing: 2px; text-transform: uppercase;
                padding: 16px 36px; text-decoration: none;">
              Begin the Full Experience — $49 →
            </a>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #e8e4dc; padding-top: 24px; text-align: center;">
            <p style="font-family: Georgia, serif; font-size: 12px; color: #bbb;
              font-style: italic; margin: 0;">
              You can unsubscribe at any time.
            </p>
          </div>
        </div>
      `,
    });

    // Notify admin (optional)
    await transporter.sendMail({
      from: `"Ocean Living" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New Free Experience Signup — ${email}`,
      text: `A new user verified their email and received the free lesson.\n\nEmail: ${email}`,
    });

    // Redirect to thank you page
    return res.redirect(302, `${process.env.NEXT_PUBLIC_BASE_URL}/ocean-free-confirmed`);

  } catch (err) {
    console.error('ocean-verify-confirm error:', err);
    return res.status(500).send('Something went wrong. Please try again.');
  }
}