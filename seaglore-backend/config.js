import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

if (isProd && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing in .env');
}

const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');

export const config = {
  isProd,
  clientUrl,
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-change-me',
  resendKey: process.env.RESEND_API_KEY || '',
  resendWebhookSecret: process.env.RESEND_WEBHOOK_SECRET || '',
  emailFrom: process.env.EMAIL_FROM || 'Seagloré <info@seaglore.com>',
  adminEmails: (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
  afterVerifyUrl: process.env.AFTER_VERIFY_URL || `${clientUrl}/dashboard?verified=1`,
  invalidLinkUrl: process.env.INVALID_LINK_URL || `${clientUrl}/login?error=invalid_link`,
  uploadsDir: process.env.UPLOADS_DIR || path.join(__dirname, 'uploads'),
  stripe: {
    secret: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    priceMonthly: process.env.STRIPE_PRICE_MONTHLY || '',
    priceYearly: process.env.STRIPE_PRICE_YEARLY || '',
  },
  openai: {
    key: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    baseUrl: (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, ''),
  },
  certPassPercent: Number(process.env.CERT_PASS_PERCENT) || 80,
};