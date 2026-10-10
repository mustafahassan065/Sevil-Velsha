import jwt from 'jsonwebtoken';
import { config } from './config.js';
import db from './db.js';

export const COOKIE_NAME = 'sg_token';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.isProd,
  path: '/',
};

export function setAuthCookie(res, user) {
  const token = jwt.sign(
    { sub: String(user.id), tv: user.token_version },
    config.jwtSecret,
    { expiresIn: '30d' }
  );
  res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: THIRTY_DAYS_MS });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions);
}

const getUserById = db.prepare('SELECT * FROM users WHERE id = ?');

export function loadUser(req, _res, next) {
  req.user = null;
  const token = req.cookies?.[COOKIE_NAME];
  if (token) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = getUserById.get(Number(payload.sub));
      if (user && user.token_version === payload.tv) req.user = user;
    } catch {
      // invalid/expired token -> logged out
    }
  }
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Please log in.' });
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Please log in.' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access only.' });
  next();
}
// Premium access: paid users + admins
export const hasPremium = (u) => !!u && (u.plan === 'premium' || u.role === 'admin');
export function publicUser(u) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    plan: u.plan,
    timezone: u.timezone,
    emailVerified: !!u.email_verified,
    marketingConsent: !!u.marketing_consent,
    dailyEmailOptIn: !!u.daily_email_opt_in,
    preferredTime: u.preferred_time,
  };
}