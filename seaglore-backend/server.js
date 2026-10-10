import { config } from './config.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/index.js';
import { webhookHandler } from './routes/billing.js';
import { resendWebhookHandler } from './routes/resendWebhook.js';
import { startScheduler } from './scheduler.js';

const app = express();
app.set('trust proxy', 1);
app.use(cors({ origin: config.clientUrl, credentials: true }));

// Webhooks ko RAW body chahiye, isliye express.json() se PEHLE
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), webhookHandler);
app.post('/api/webhooks/resend', express.raw({ type: 'application/json' }), resendWebhookHandler);

app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRouter);

// Koi bhi unexpected error JSON me jaye
app.use((err, _req, res, _next) => {
  console.error('unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong.' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`seaglore-backend running on ${PORT}`);
  startScheduler();
});