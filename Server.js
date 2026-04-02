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