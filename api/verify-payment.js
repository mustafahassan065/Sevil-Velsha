// api/verify-payment.js
// Same format as send-contact.js — drop in api/ folder
// Verifies Stripe payment after redirect to thank-you page

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'session_id required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    return res.status(200).json({
      paid:  session.payment_status === 'paid',
      email: session.customer_email || '',
      name:  session.metadata?.customerName || '',
    });

  } catch (err) {
    console.error('Verify payment error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}