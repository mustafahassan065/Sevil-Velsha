import { Router } from 'express';
import Stripe from 'stripe';
import db from '../db.js';
import { config } from '../config.js';
import { requireAuth, hasPremium } from '../middleware.js';
import { sendEmail } from '../email.js';
import { premiumWelcomeTemplate } from '../templates.js';

const stripe = config.stripe.secret ? new Stripe(config.stripe.secret) : null;
const router = Router();

const getSub = db.prepare('SELECT * FROM subscriptions WHERE user_id = ?');
const getUser = db.prepare('SELECT * FROM users WHERE id = ?');

// Premium tab tak jab tak Stripe payment active/trial/retry mein hai
const PREMIUM_STATUSES = ['active', 'trialing', 'past_due'];

async function getOrCreateCustomer(user) {
  const row = getSub.get(user.id);
  if (row) return row.customer_id;
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || undefined,
    metadata: { userId: String(user.id) },
  });
  db.prepare('INSERT INTO subscriptions (user_id, customer_id) VALUES (?, ?)').run(user.id, customer.id);
  return customer.id;
}

// POST /api/billing/checkout  { interval: 'monthly' | 'yearly' }  -> { url }
router.post('/checkout', requireAuth, async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ error: 'Payments are not configured yet.' });
    const price = req.body.interval === 'yearly' ? config.stripe.priceYearly : config.stripe.priceMonthly;
    if (!price) return res.status(503).json({ error: 'Payments are not configured yet.' });
    if (req.user.plan === 'premium') return res.status(400).json({ error: 'You are already Premium.' });

    const customer = await getOrCreateCustomer(req.user);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer,
      client_reference_id: String(req.user.id),
      line_items: [{ price, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: { metadata: { userId: String(req.user.id) } },
      success_url: `${config.clientUrl}/dashboard?upgraded=1`,
      cancel_url: `${config.clientUrl}/ocean-reset`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('checkout error:', err.message);
    res.status(500).json({ error: 'Could not start checkout.' });
  }
});

// POST /api/billing/portal -> { url }  (cancel / card change / invoices)
router.post('/portal', requireAuth, async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ error: 'Payments are not configured yet.' });
    const row = getSub.get(req.user.id);
    if (!row) return res.status(400).json({ error: 'No subscription found.' });
    const session = await stripe.billingPortal.sessions.create({
      customer: row.customer_id,
      return_url: `${config.clientUrl}/dashboard`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('portal error:', err.message);
    res.status(500).json({ error: 'Could not open billing portal.' });
  }
});

// GET /api/billing/status
router.get('/status', requireAuth, (req, res) => {
  const row = getSub.get(req.user.id);
  res.json({
    plan: req.user.plan,
    premiumAccess: hasPremium(req.user),
    status: row?.status ?? 'none',
    interval: row?.interval ?? null,
    renewsAt: row?.current_period_end ?? null,
  });
});

export default router;

// ---------------- webhook ----------------
async function applySubscription(userId, sub) {
  const user = getUser.get(userId);
  if (!user) return;

  const item = sub.items?.data?.[0];
  const periodEnd = item?.current_period_end ?? sub.current_period_end ?? null;
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;

  db.prepare(
    `INSERT INTO subscriptions (user_id, customer_id, subscription_id, status, price_id, interval, current_period_end, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET
       customer_id = excluded.customer_id, subscription_id = excluded.subscription_id,
       status = excluded.status, price_id = excluded.price_id, interval = excluded.interval,
       current_period_end = excluded.current_period_end, updated_at = datetime('now')`
  ).run(
    userId,
    customerId,
    sub.id,
    sub.status,
    item?.price?.id ?? null,
    item?.price?.recurring?.interval ?? null,
    periodEnd ? new Date(periodEnd * 1000).toISOString() : null
  );

  const plan = PREMIUM_STATUSES.includes(sub.status) ? 'premium' : 'free';
  db.prepare('UPDATE users SET plan = ? WHERE id = ?').run(plan, userId);

  if (plan === 'premium' && user.plan !== 'premium') {
    await sendEmail({
      userId,
      to: user.email,
      template: 'premium_welcome',
      subject: 'Welcome to Premium – Seagloré',
      html: premiumWelcomeTemplate({ name: user.name }),
    });
  }
}

function userIdForSubscription(sub) {
  if (sub.metadata?.userId) return Number(sub.metadata.userId);
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
  return db.prepare('SELECT user_id FROM subscriptions WHERE customer_id = ?').get(customerId)?.user_id;
}

// server.js me express.json() se PEHLE, express.raw() ke saath lagta hai
export async function webhookHandler(req, res) {
  if (!stripe || !config.stripe.webhookSecret) return res.status(503).send('Not configured');

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      config.stripe.webhookSecret
    );
  } catch (err) {
    console.error('webhook signature error:', err.message);
    return res.status(400).send('Invalid signature');
  }

  // Duplicate events ignore (Stripe retries bhejta hai)
  const fresh = db.prepare('INSERT OR IGNORE INTO stripe_events (id) VALUES (?)').run(event.id);
  if (fresh.changes === 0) return res.json({ received: true, duplicate: true });

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object;
        if (s.mode === 'subscription' && s.subscription) {
          const sub = await stripe.subscriptions.retrieve(s.subscription);
          const userId = Number(s.client_reference_id) || userIdForSubscription(sub);
          if (userId) await applySubscription(userId, sub);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const userId = userIdForSubscription(sub);
        if (userId) await applySubscription(userId, sub);
        break;
      }
      default:
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error('webhook processing error:', err);
    // Event dobara process ho sake, is liye record hata do; Stripe retry karega
    db.prepare('DELETE FROM stripe_events WHERE id = ?').run(event.id);
    res.status(500).send('Webhook error');
  }
}