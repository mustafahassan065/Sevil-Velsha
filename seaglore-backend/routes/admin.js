import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import db from '../db.js';
import { config } from '../config.js';
import { requireAdmin } from '../middleware.js';
import { sendEmail } from '../email.js';
import { ritualTemplate } from '../templates.js';
import { adminRitual } from '../ritualUtil.js';

const router = Router();
router.use(requireAdmin);

// ---------- upload setup ----------
fs.mkdirSync(config.uploadsDir, { recursive: true });

const IMAGE_TYPES = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
const AUDIO_TYPES = {
  'audio/mpeg': '.mp3',
  'audio/mp4': '.m4a',
  'audio/x-m4a': '.m4a',
  'audio/wav': '.wav',
  'audio/x-wav': '.wav',
  'audio/ogg': '.ogg',
};

const upload = multer({
  storage: multer.diskStorage({
    destination: config.uploadsDir,
    filename: (_req, file, cb) => {
      const ext = IMAGE_TYPES[file.mimetype] || AUDIO_TYPES[file.mimetype] || '';
      cb(null, crypto.randomBytes(16).toString('hex') + ext);
    },
  }),
  limits: { fileSize: 40 * 1024 * 1024, files: 2 },
  fileFilter: (_req, file, cb) => {
    const ok =
      (file.fieldname === 'image' && IMAGE_TYPES[file.mimetype]) ||
      (file.fieldname === 'audio' && AUDIO_TYPES[file.mimetype]);
    cb(ok ? null : new Error(`Invalid file type for ${file.fieldname}.`), !!ok);
  },
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
]);

const runUpload = (req, res, next) =>
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });

const removeFile = (name) => {
  if (!name) return;
  fs.promises.unlink(path.join(config.uploadsDir, path.basename(name))).catch(() => {});
};

// Form fields (multipart me sab strings) ko validate karta hai
function parseFields(b, { partial }) {
  const out = {};
  const err = (m) => ({ error: m });

  if (b.title !== undefined || !partial) {
    const t = String(b.title || '').trim();
    if (!t || t.length > 120) return err('Title is required (max 120 characters).');
    out.title = t;
  }
  if (b.description !== undefined) out.description = String(b.description).trim().slice(0, 2000);
  if (b.category !== undefined) out.category = String(b.category).trim().slice(0, 60);
  if (b.durationMin !== undefined) {
    const n = Number(b.durationMin);
    if (!Number.isInteger(n) || n < 0 || n > 600) return err('Invalid duration.');
    out.duration_min = n;
  }
  if (b.access !== undefined) {
    if (!['free', 'premium'].includes(b.access)) return err('Access must be free or premium.');
    out.access = b.access;
  }
  if (b.isActive !== undefined) out.is_active = b.isActive === '1' || b.isActive === 'true' || b.isActive === true ? 1 : 0;
  if (b.sortOrder !== undefined) {
    const n = Number(b.sortOrder);
    if (!Number.isInteger(n)) return err('Invalid sort order.');
    out.sort_order = n;
  }
  return { out };
}

const tooBigImage = (files) => files?.image?.[0] && files.image[0].size > 5 * 1024 * 1024;
const cleanup = (files) =>
  Object.values(files || {}).flat().forEach((f) => removeFile(f.filename));

const getRitual = db.prepare('SELECT * FROM rituals WHERE id = ?');

// ---------- rituals ----------
router.get('/rituals', (_req, res) => {
  const rows = db.prepare('SELECT * FROM rituals ORDER BY sort_order, id').all();
  res.json({ rituals: rows.map(adminRitual) });
});

router.post('/rituals', runUpload, (req, res) => {
  const { out, error } = parseFields(req.body, { partial: false });
  if (error || tooBigImage(req.files)) {
    cleanup(req.files);
    return res.status(400).json({ error: error || 'Image must be under 5MB.' });
  }
  const info = db
    .prepare(
      `INSERT INTO rituals (title, description, category, duration_min, access, is_active, sort_order, image_file, audio_file)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      out.title,
      out.description ?? '',
      out.category ?? '',
      out.duration_min ?? 3,
      out.access ?? 'free',
      out.is_active ?? 1,
      out.sort_order ?? 0,
      req.files?.image?.[0]?.filename ?? null,
      req.files?.audio?.[0]?.filename ?? null
    );
  res.status(201).json({ ritual: adminRitual(getRitual.get(info.lastInsertRowid)) });
});

router.put('/rituals/:id', runUpload, (req, res) => {
  const existing = getRitual.get(Number(req.params.id));
  if (!existing) {
    cleanup(req.files);
    return res.status(404).json({ error: 'Ritual not found.' });
  }
  const { out, error } = parseFields(req.body, { partial: true });
  if (error || tooBigImage(req.files)) {
    cleanup(req.files);
    return res.status(400).json({ error: error || 'Image must be under 5MB.' });
  }

  // Media: nayi file -> replace, removeImage/removeAudio=1 -> hata do
  const oldFiles = [];
  if (req.files?.image?.[0]) {
    out.image_file = req.files.image[0].filename;
    oldFiles.push(existing.image_file);
  } else if (req.body.removeImage === '1') {
    out.image_file = null;
    oldFiles.push(existing.image_file);
  }
  if (req.files?.audio?.[0]) {
    out.audio_file = req.files.audio[0].filename;
    oldFiles.push(existing.audio_file);
  } else if (req.body.removeAudio === '1') {
    out.audio_file = null;
    oldFiles.push(existing.audio_file);
  }

  const keys = Object.keys(out);
  if (keys.length) {
    db.prepare(`UPDATE rituals SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`).run(
      ...keys.map((k) => out[k]),
      existing.id
    );
  }
  oldFiles.forEach(removeFile);
  res.json({ ritual: adminRitual(getRitual.get(existing.id)) });
});

router.delete('/rituals/:id', (req, res) => {
  const r = getRitual.get(Number(req.params.id));
  if (!r) return res.status(404).json({ error: 'Ritual not found.' });
  db.prepare('DELETE FROM rituals WHERE id = ?').run(r.id);
  removeFile(r.image_file);
  removeFile(r.audio_file);
  res.json({ ok: true });
});

// Admin ko khud ko ritual email bhej kar dikhata hai ("No Image Still" wagera kaisa lagta hai)
router.post('/rituals/:id/test-email', async (req, res) => {
  const r = getRitual.get(Number(req.params.id));
  if (!r) return res.status(404).json({ error: 'Ritual not found.' });
  const result = await sendEmail({
    userId: req.user.id,
    to: req.user.email,
    template: 'ritual_test',
    subject: `${r.title} – Seagloré`,
    html: ritualTemplate({ name: req.user.name, ritual: adminRitual(r) }),
  });
  res.json({ ok: true, sent: !!result.ok, skipped: !!result.skipped });
});

// ---------- basic lists / stats ----------
router.get('/stats', (_req, res) => {
  const n = (sql) => db.prepare(sql).get().n;
  res.json({
    users: n('SELECT COUNT(*) AS n FROM users'),
    premiumUsers: n("SELECT COUNT(*) AS n FROM users WHERE plan = 'premium'"),
    leads: n('SELECT COUNT(*) AS n FROM leads'),
    rituals: n('SELECT COUNT(*) AS n FROM rituals'),
    emailsSent: n("SELECT COUNT(*) AS n FROM email_log WHERE status = 'sent'"),
  });
});

router.get('/users', (_req, res) => {
  const users = db
    .prepare(
      `SELECT id, email, name, role, plan, email_verified AS emailVerified, created_at AS createdAt
       FROM users ORDER BY id DESC LIMIT 500`
    )
    .all();
  res.json({ users });
});

router.get('/leads', (_req, res) => {
  const leads = db
    .prepare(
      `SELECT id, email, name, result, marketing_consent AS marketingConsent,
              unsubscribed, created_at AS createdAt
       FROM leads ORDER BY id DESC LIMIT 500`
    )
    .all();
  res.json({ leads });
});

router.get('/emails', (_req, res) => {
  const emails = db
    .prepare(
      `SELECT id, to_email AS toEmail, template, subject, status, error, created_at AS createdAt
       FROM email_log ORDER BY id DESC LIMIT 200`
    )
    .all();
  res.json({ emails });
});

export default router;