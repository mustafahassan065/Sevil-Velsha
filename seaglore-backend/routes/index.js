import express, { Router } from 'express';
import { config } from '../config.js';
import { loadUser } from '../middleware.js';
import authRoutes from './auth.js';
import quizRoutes from './quiz.js';
import unsubscribeRoutes from './unsubscribe.js';
import ritualRoutes from './rituals.js';
import adminRoutes from './admin.js';
import adminExtraRoutes from './adminExtra.js';
import billingRoutes from './billing.js';
import dashboardRoutes from './dashboard.js';
import certificateRoutes from './certificate.js';
import analyticsRoutes from './analytics.js';

const router = Router();

// Uploaded images/audio
router.use(
  '/files',
  express.static(config.uploadsDir, {
    index: false,
    maxAge: '7d',
    setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff'),
  })
);

router.use(['/auth', '/admin', '/rituals', '/billing', '/dashboard', '/certificate', '/analytics'], loadUser);

router.use('/auth', authRoutes);
router.use('/quiz', quizRoutes);
router.use('/unsubscribe', unsubscribeRoutes);
router.use('/rituals', ritualRoutes);
router.use('/billing', billingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/certificate', certificateRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
router.use('/admin', adminExtraRoutes);

export default router;