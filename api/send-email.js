import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email required' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    // 1. Notify the client (info@sevilvelsha.com)
    await transporter.sendMail({
      from: `"Seagloré" <${process.env.GMAIL_USER}>`,
      to: 'info@sevilvelsha.com',
      subject: 'New Archive Access Request — Seagloré',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fff;">
          <h1 style="font-size: 24px; letter-spacing: 4px; text-transform: uppercase; color: #111; border-bottom: 2px solid #111; padding-bottom: 16px;">
            SEAGLORÉ
          </h1>
          <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #999; margin-top: 24px;">
            New Access Request
          </p>
          <p style="font-size: 18px; font-style: italic; color: #c9a84c; margin: 8px 0;">
            Archive Entry Request
          </p>
          <div style="background: #f8f5f0; padding: 24px; margin: 24px 0; border-left: 3px solid #c9a84c;">
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #999; margin: 0 0 8px;">
              Email Address
            </p>
            <p style="font-size: 16px; color: #111; margin: 0;">${email}</p>
          </div>
          <p style="font-size: 11px; color: #999; font-style: italic; text-align: right; margin-top: 32px;">
            "We send beauty, not clutter."
          </p>
        </div>
      `,
    });

    // 2. Send confirmation to the user
    await transporter.sendMail({
      from: `"Seagloré" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your Access Request — Seagloré Archive',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fff;">
          <h1 style="font-size: 24px; letter-spacing: 4px; text-transform: uppercase; color: #111; border-bottom: 2px solid #111; padding-bottom: 16px;">
            SEAGLORÉ
          </h1>
          <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #999; margin-top: 24px;">
            Access Request Received
          </p>
          <p style="font-size: 20px; font-style: italic; color: #c9a84c; margin: 8px 0 24px;">
            Thank you for your interest.
          </p>
          <p style="font-size: 14px; color: #555; line-height: 1.8;">
            We have received your request to enter the Seagloré Archive. Our team will review your application and be in touch shortly.
          </p>
          <div style="border-top: 1px solid #eee; margin-top: 32px; padding-top: 24px;">
            <p style="font-size: 11px; color: #999; font-style: italic; text-align: right;">
              "We send beauty, not clutter."
            </p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: 'Request submitted successfully' });

  } catch (error) {
    console.error('Nodemailer error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
  }
}