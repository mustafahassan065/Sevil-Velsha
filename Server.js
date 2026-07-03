// server.js
// Ocean Living Certification — Backend API
// Handles: Stripe checkout, Brevo leads/buyers, payment verification
//
// Install dependencies:
//   npm install express stripe sib-api-v3-sdk cors dotenv
//
// Run: node server.js

import express       from 'express';
import Stripe        from 'stripe';
import cors          from 'cors';
import dotenv        from 'dotenv';
import SibApiV3Sdk   from 'sib-api-v3-sdk';

dotenv.config();

const app    = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ── Brevo setup (sib-api-v3-sdk) ─────────────────────────────────
const brevoDefaultClient = SibApiV3Sdk.ApiClient.instance;
brevoDefaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
const brevoClient     = new SibApiV3Sdk.ContactsApi();
const brevoTransEmail = new SibApiV3Sdk.TransactionalEmailsApi();

// ── CORS + JSON ───────────────────────────────────────────────────
app.use(cors({ origin: '*' }));

// Raw body — Stripe webhook ke liye (express.json se pehle hona zaroori hai)
app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// ═══════════════════════════════════════════════════════════════
// POST /api/create-checkout-session
// CheckoutPage.jsx se call hota hai
// ═══════════════════════════════════════════════════════════════
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email required.' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      metadata: { customerName: name, product: 'ocean_living_certification' },
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/thank-you-ocean?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.CLIENT_URL}/checkout-ocean-living?cancelled=true`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// GET /api/verify-payment?session_id=xxx
// ThankYouPage.jsx payment confirm karta hai
// ═══════════════════════════════════════════════════════════════
app.get('/api/verify-payment', async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ error: 'session_id required' });

    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.json({
      paid:  session.payment_status === 'paid',
      email: session.customer_email || '',
      name:  session.metadata?.customerName || '',
    });
  } catch (err) {
    console.error('Verify payment error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// POST /api/ocean-lead
// Free lesson email form submit hone par
// ═══════════════════════════════════════════════════════════════
app.post('/api/ocean-lead', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required.' });

    // Brevo leads list mein add karo
    await addToBrevo({
      email,
      listId: parseInt(process.env.BREVO_LEADS_LIST_ID),
      attributes: { SOURCE: 'ocean_living_free_lesson' },
    });

    // Free lesson email bhejo
    await sendBrevoEmail({
      to:      email,
      subject: 'Your first Ocean Living lesson',
      html: `
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
          <a href="${process.env.CLIENT_URL}/ocean-living-certification"
             style="display: inline-block; padding: 16px 40px; background: #2d4a47; color: #ffffff; text-decoration: none; font-family: sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">
            Begin the Full Experience — $49
          </a>
          <p style="font-size: 12px; color: #aaa; margin-top: 48px;">SEAGLORÉ · Where Nature Becomes Couture</p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Lead capture error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// POST /api/ocean-living-leads
// Free Ocean Living Guide PDF form submit hone par
// ═══════════════════════════════════════════════════════════════
app.post('/api/ocean-living-leads', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required.' });
    }

    // 1. Brevo leads list mein add karo
    await addToBrevo({
      email,
      firstName: name?.split(' ')[0] || '',
      lastName:  name?.split(' ').slice(1).join(' ') || '',
      listId: parseInt(process.env.BREVO_LEADS_LIST_ID),
      attributes: {
        SOURCE: 'free_ocean_living_guide',
        TAG: 'seaglore-free-pdf',
      },
    });

    // 2. Customer ko PDF guide email bhejo
    await sendBrevoEmail({
      to: email,
      subject: '📖 Your Free Ocean Living Guide is Ready!',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #3a3a3a;">
          <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #7a8a88; margin-bottom: 32px;">SEAGLORÉ</p>
          <h1 style="font-size: 2rem; font-weight: 400; color: #2d4a47; margin-bottom: 8px;">Your Free Ocean Living Guide</h1>
          <p style="font-size: 15px; line-height: 1.8; color: #7a8a88; margin-bottom: 24px; font-style: italic;">"Where Nature Becomes Couture"</p>
          
          <p style="font-size: 16px; line-height: 1.9; color: #3a3a3a; margin-bottom: 20px;">
            ${name ? 'Hi ' + name.split(' ')[0] + ',' : 'Hello,'}
          </p>
          <p style="font-size: 16px; line-height: 1.9; color: #3a3a3a; margin-bottom: 20px;">
            Thank you for requesting the <strong>Ocean Living Guide</strong>. Your free PDF is ready for download below.
          </p>
          <p style="font-size: 16px; line-height: 1.9; color: #3a3a3a; margin-bottom: 24px;">
            This guide introduces you to calm, clarity, and intentional living — inspired by the rhythm of the ocean.
          </p>
          
          <div style="text-align: center; margin: 36px 0;">
            <a href="https://drive.google.com/uc?export=download&id=1uZsahpwezi7C4_WR3kPQEShwJwL9etud"
               style="display: inline-block; padding: 16px 44px; background: #2d4a47; color: #ffffff; text-decoration: none; font-family: sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">
              ↓ Download Your Free Guide
            </a>
          </div>

          <div style="background: #ffffff; border: 1px solid #d8d3cc; padding: 24px; margin: 28px 0; text-align: center;">
            <p style="font-size: 15px; font-weight: 600; color: #2d4a47; margin-bottom: 8px;">🌊 Ready for the Full Experience?</p>
            <p style="font-size: 14px; line-height: 1.7; color: #5a6a68; margin-bottom: 16px;">
              Join the complete 7-Day Ocean Reset Program and earn your Ocean Living Certification.
            </p>
            <a href="${process.env.CLIENT_URL}/checkout-ocean-living"
               style="display: inline-block; padding: 14px 36px; background: #2d4a47; color: #ffffff; text-decoration: none; font-family: sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">
              Explore the 7-Day Reset — $49
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #d8d3cc; margin: 32px 0;" />
          <p style="font-size: 11px; color: #aaa; text-align: center;">
            SEAGLORÉ · Where Nature Becomes Couture<br>
            © ${new Date().getFullYear()} SEAGLORÉ. All rights reserved.
          </p>
        </div>
      `,
    });

    // 3. Admin ko notification bhejo
    await sendBrevoEmail({
      to: 'info@seaglore.com',
      subject: `🌊 New Ocean Living Guide Download — ${name || 'No Name'}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #3a3a3a;">
          <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #7a8a88; margin-bottom: 32px;">SEAGLORÉ</p>
          <h1 style="font-size: 1.5rem; font-weight: 400; color: #2d4a47; margin-bottom: 16px;">New Lead — Free Ocean Living Guide</h1>
          <table style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
            <tr><td style="padding: 10px; background: #eee9e2; font-weight: bold; font-size: 12px; color: #7a8a88;">Name</td><td style="padding: 10px; font-size: 14px;">${name || 'Not Provided'}</td></tr>
            <tr><td style="padding: 10px; background: #eee9e2; font-weight: bold; font-size: 12px; color: #7a8a88;">Email</td><td style="padding: 10px; font-size: 14px;">${email}</td></tr>
            <tr><td style="padding: 10px; background: #eee9e2; font-weight: bold; font-size: 12px; color: #7a8a88;">Date</td><td style="padding: 10px; font-size: 14px;">${new Date().toLocaleString()}</td></tr>
            <tr><td style="padding: 10px; background: #eee9e2; font-weight: bold; font-size: 12px; color: #7a8a88;">Source</td><td style="padding: 10px; font-size: 14px;">Free Ocean Living Guide Page</td></tr>
          </table>
        </div>
      `,
    });

    res.json({ success: true, message: 'Guide sent to your email!' });
  } catch (err) {
    console.error('Ocean Living lead error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// POST /api/send-contact
// Contact form submit hone par
// ═══════════════════════════════════════════════════════════════
app.post('/api/send-contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !email.includes('@') || !message) {
      return res.status(400).json({ error: 'All fields required.' });
    }

    // 1. Admin ko notification bhejo
    await sendBrevoEmail({
      to: 'seaglore@gmail.com',
      subject: `New Contact Message — ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fff;">
          <h1 style="font-size: 24px; letter-spacing: 4px; text-transform: uppercase; color: #111; border-bottom: 2px solid #111; padding-bottom: 16px;">SEAGLORÉ</h1>
          <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #999; margin-top: 24px;">New Contact Message</p>
          <div style="background: #f8f5f0; padding: 24px; margin: 24px 0; border-left: 3px solid #c9a84c;">
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #999; margin: 0 0 4px;">Name</p>
            <p style="font-size: 16px; color: #111; margin: 0 0 16px;">${name}</p>
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #999; margin: 0 0 4px;">Email</p>
            <p style="font-size: 16px; color: #111; margin: 0 0 16px;">${email}</p>
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #999; margin: 0 0 4px;">Message</p>
            <p style="font-size: 15px; color: #333; margin: 0; line-height: 1.7;">${message.replace(/\n/g, '<br/>')}</p>
          </div>
          <p style="font-size: 11px; color: #999; font-style: italic; text-align: right; margin-top: 32px;">"We send beauty, not clutter."</p>
        </div>
      `,
    });

    // 2. Customer ko confirmation bhejo
    await sendBrevoEmail({
      to: email,
      subject: 'Your Message — Seagloré',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fff;">
          <h1 style="font-size: 24px; letter-spacing: 4px; text-transform: uppercase; color: #111; border-bottom: 2px solid #111; padding-bottom: 16px;">SEAGLORÉ</h1>
          <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #999; margin-top: 24px;">Message Received</p>
          <p style="font-size: 20px; font-style: italic; color: #c9a84c; margin: 8px 0 24px;">Thank you, ${name}.</p>
          <p style="font-size: 14px; color: #555; line-height: 1.8;">We have received your message and will be in touch shortly.</p>
          <div style="border-top: 1px solid #eee; margin-top: 32px; padding-top: 24px;">
            <p style="font-size: 11px; color: #999; font-style: italic; text-align: right;">"We send beauty, not clutter."</p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact form error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
// ═══════════════════════════════════════════════════════════════
// POST /api/stripe-webhook
// Stripe payment complete hone par automatically call hota hai
// ═══════════════════════════════════════════════════════════════
app.post('/api/stripe-webhook', async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session   = event.data.object;
    const email     = session.customer_email;
    const name      = session.metadata?.customerName || '';

    if (email && session.payment_status === 'paid') {
      try {
        // Brevo buyers list mein add karo
        await addToBrevo({
          email,
          firstName: name.split(' ')[0] || '',
          lastName:  name.split(' ').slice(1).join(' ') || '',
          listId:    parseInt(process.env.BREVO_BUYERS_LIST_ID),
          attributes: {
            PURCHASE_DATE:   new Date().toISOString(),
            STRIPE_SESSION:  session.id,
            PRODUCT:         'ocean_living_certification',
          },
        });

        // Welcome / access email bhejo
        await sendBrevoEmail({
          to:      email,
          subject: 'Your Ocean Living access',
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #3a3a3a;">
              <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #7a8a88; margin-bottom: 32px;">SEAGLORÉ</p>
              <h1 style="font-size: 2.2rem; font-weight: 400; color: #2d4a47; margin-bottom: 8px;">Welcome.</h1>
              <h2 style="font-size: 1.3rem; font-weight: 400; color: #5a6a68; margin-bottom: 28px;">Your Ocean Living journey begins now.</h2>
              <p style="font-size: 15px; line-height: 1.8; color: #3a3a3a; margin-bottom: 32px;">
                Thank you for joining the Ocean Living Certification Experience.<br><br>
                Your access is ready. Click below to open your course dashboard.
              </p>
              <a href="${process.env.CLIENT_URL}/course-ocean-living"
                 style="display: inline-block; padding: 18px 48px; background: #2d4a47; color: #ffffff; text-decoration: none; font-family: sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">
                Access Your Course
              </a>
              <p style="font-size: 12px; color: #aaa; margin-top: 48px;">SEAGLORÉ · Where Nature Becomes Couture</p>
            </div>
          `,
        });

        console.log(`✓ Buyer processed: ${email}`);
      } catch (err) {
        console.error('Webhook processing error:', err.message);
      }
    }
  }

  res.json({ received: true });
});


// ═══════════════════════════════════════════════════════════════
// POST /api/ocean-verify-start
// Free experience email verification — step 1
// ═══════════════════════════════════════════════════════════════
app.post('/api/ocean-verify-start', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required.' });
    }

    // Encode email as base64 token — no DB needed
    const token = Buffer.from(email.trim().toLowerCase()).toString('base64');
    const verifyUrl = `${process.env.CLIENT_URL}/api/ocean-verify-confirm?token=${token}`;

    await sendBrevoEmail({
      to: email,
      subject: 'Verify your email — Ocean Living Free Experience',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 48px 40px; background: #ffffff;">
          <div style="border-bottom: 1px solid #e8e4dc; padding-bottom: 24px; margin-bottom: 36px;">
            <p style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #4a7c76; margin: 0 0 6px;">Ocean Living</p>
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #aaa; margin: 0;">Free Experience</p>
          </div>
          <h1 style="font-size: 28px; font-weight: 400; font-style: italic; color: #2d4a47; margin: 0 0 16px; line-height: 1.3;">
            One step away from your free lesson.
          </h1>
          <p style="font-family: Arial, sans-serif; font-size: 15px; color: #555; line-height: 1.8; margin: 0 0 32px;">
            Click the button below to verify your email. Your free Ocean Living lesson will arrive immediately after.
          </p>
          <div style="text-align: center; margin: 0 0 36px;">
            <a href="${verifyUrl}"
              style="display: inline-block; background: #2d4a47; color: #eee9e2;
                font-family: Arial, sans-serif; font-size: 12px; font-weight: 700;
                letter-spacing: 3px; text-transform: uppercase;
                padding: 18px 40px; text-decoration: none;">
              Verify Email &amp; Get Free Lesson →
            </a>
          </div>
          <p style="font-family: Arial, sans-serif; font-size: 11px; color: #bbb; word-break: break-all; text-align: center; margin: 0 0 32px;">
            ${verifyUrl}
          </p>
          <div style="border-top: 1px solid #e8e4dc; padding-top: 24px; text-align: center;">
            <p style="font-size: 12px; color: #bbb; font-style: italic; margin: 0;">
              If you didn't request this, simply ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: 'Verification email sent' });
  } catch (err) {
    console.error('ocean-verify-start error:', err.message);
    res.status(500).json({ error: 'Failed to send verification email.' });
  }
});

// ═══════════════════════════════════════════════════════════════
// GET /api/ocean-verify-confirm?token=xxx
// Free experience email verification — step 2
// ═══════════════════════════════════════════════════════════════
app.get('/api/ocean-verify-confirm', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Invalid verification link.');

  let email;
  try {
    email = Buffer.from(token, 'base64').toString('utf-8');
    if (!email || !email.includes('@')) throw new Error('invalid');
  } catch {
    return res.status(400).send('Invalid or expired verification link.');
  }

  try {
    // Add to Brevo leads list
    await addToBrevo({
      email,
      listId: parseInt(process.env.BREVO_LEADS_LIST_ID),
      attributes: { SOURCE: 'ocean_living_free_verified' },
    });

    // Send free lesson + guide email
    await sendBrevoEmail({
      to: email,
      subject: 'Your Free Ocean Living Lesson is here ✦',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 48px 40px; background: #ffffff;">
          <div style="border-bottom: 1px solid #e8e4dc; padding-bottom: 24px; margin-bottom: 36px;">
            <p style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #4a7c76; margin: 0 0 6px;">Ocean Living</p>
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #aaa; margin: 0;">Your Free Lesson</p>
          </div>
          <h1 style="font-size: 28px; font-weight: 400; font-style: italic; color: #2d4a47; margin: 0 0 16px; line-height: 1.3;">
            Welcome. Your journey begins now.
          </h1>
          <p style="font-family: Arial, sans-serif; font-size: 15px; color: #555; line-height: 1.8; margin: 0 0 36px;">
            Thank you for verifying your email. Here is your free Ocean Living lesson and guide.
          </p>
          <div style="background: #f0ede8; padding: 28px; margin-bottom: 20px; border-left: 3px solid #4a7c76;">
            <p style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #4a7c76; margin: 0 0 10px;">Lesson 1 — Free Video</p>
            <p style="font-size: 18px; font-style: italic; color: #2d4a47; margin: 0 0 16px;">The Art of Slowing Down</p>
            <a href="https://drive.google.com/file/d/1h3FuJ2HOOpbtfck5TpPgik5MWjpnXpac/view"
              style="display: inline-block; background: #2d4a47; color: #eee9e2;
                font-family: Arial, sans-serif; font-size: 11px; font-weight: 700;
                letter-spacing: 2px; text-transform: uppercase; padding: 14px 28px; text-decoration: none;">
              Watch Free Lesson →
            </a>
          </div>
          <div style="background: #f0ede8; padding: 28px; margin-bottom: 36px; border-left: 3px solid #4a7c76;">
            <p style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #4a7c76; margin: 0 0 10px;">Free Downloadable Guide</p>
            <p style="font-size: 18px; font-style: italic; color: #2d4a47; margin: 0 0 16px;">Ocean Living — Introductory Guide</p>
            <a href="https://drive.google.com/uc?export=download&id=1F3LXJjYFQ97ZkSQMTRyG7S9VvYsK2oqI"
              style="display: inline-block; background: #2d4a47; color: #eee9e2;
                font-family: Arial, sans-serif; font-size: 11px; font-weight: 700;
                letter-spacing: 2px; text-transform: uppercase; padding: 14px 28px; text-decoration: none;">
              Download Free Guide →
            </a>
          </div>
          <div style="text-align: center; padding: 32px; background: #2d4a47; margin-bottom: 32px;">
            <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #4a7c76; margin: 0 0 12px;">Ready for more?</p>
            <p style="font-size: 22px; font-style: italic; color: #eee9e2; margin: 0 0 20px; line-height: 1.3;">
              Join the full 7-Day Ocean Reset Experience
            </p>
            <a href="${process.env.CLIENT_URL}/checkout-ocean-living"
              style="display: inline-block; background: #eee9e2; color: #2d4a47;
                font-family: Arial, sans-serif; font-size: 11px; font-weight: 700;
                letter-spacing: 2px; text-transform: uppercase; padding: 16px 36px; text-decoration: none;">
              Begin the Full Experience — $49 →
            </a>
          </div>
          <div style="border-top: 1px solid #e8e4dc; padding-top: 24px; text-align: center;">
            <p style="font-size: 12px; color: #bbb; font-style: italic; margin: 0;">You can unsubscribe at any time.</p>
          </div>
        </div>
      `,
    });

    // Redirect to thank you page
    return res.redirect(302, `${process.env.CLIENT_URL}/ocean-free-confirmed`);
  } catch (err) {
    console.error('ocean-verify-confirm error:', err.message);
    return res.status(500).send('Something went wrong. Please try again.');
  }
});

// ═══════════════════════════════════════════════════════════════
// HELPER — Brevo mein contact add karna
// ═══════════════════════════════════════════════════════════════
async function addToBrevo({ email, firstName = '', lastName = '', listId, attributes = {} }) {
  try {
    const createContact = new SibApiV3Sdk.CreateContact();
    createContact.email         = email;
    createContact.listIds       = [listId];
    createContact.updateEnabled = true;
    createContact.attributes    = { FIRSTNAME: firstName, LASTNAME: lastName, ...attributes };

    await brevoClient.createContact(createContact);
    console.log(`✓ Brevo: ${email} → list ${listId}`);
  } catch (err) {
    if (err?.response?.body?.code !== 'duplicate_parameter') {
      console.error('Brevo contact error:', err?.response?.body || err.message);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPER — Brevo se email bhejna
// ═══════════════════════════════════════════════════════════════
async function sendBrevoEmail({ to, subject, html }) {
  try {
    const sendEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendEmail.to          = [{ email: to }];
    sendEmail.subject     = subject;
    sendEmail.htmlContent = html;
    sendEmail.sender      = { name: 'Seagloré', email: 'info@seaglore.com' };

    await brevoTransEmail.sendTransacEmail(sendEmail);
    console.log(`✓ Email sent: ${to} — "${subject}"`);
  } catch (err) {
    console.error('Brevo email error:', err?.response?.body || err.message);
  }
}

// ── SERVER START ──────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🌊 Ocean Living server running on port ${PORT}`));

export default app;