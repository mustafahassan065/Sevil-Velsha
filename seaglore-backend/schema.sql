CREATE TABLE IF NOT EXISTS users (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  email              TEXT    NOT NULL UNIQUE,
  password_hash      TEXT    NOT NULL,
  name               TEXT    NOT NULL DEFAULT '',
  role               TEXT    NOT NULL DEFAULT 'user',
  plan               TEXT    NOT NULL DEFAULT 'free',
  timezone           TEXT    NOT NULL DEFAULT 'UTC',
  email_verified     INTEGER NOT NULL DEFAULT 0,
  marketing_consent  INTEGER NOT NULL DEFAULT 0,
  unsubscribed       INTEGER NOT NULL DEFAULT 0,
  daily_email_opt_in INTEGER NOT NULL DEFAULT 0,
  preferred_time     TEXT    NOT NULL DEFAULT 'morning',
  unsubscribe_token  TEXT    NOT NULL UNIQUE,
  token_version      INTEGER NOT NULL DEFAULT 0,
  created_at         TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS auth_tokens (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT    NOT NULL,
  token_hash TEXT    NOT NULL UNIQUE,
  expires_at TEXT    NOT NULL,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS email_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER,
  to_email    TEXT NOT NULL,
  template    TEXT NOT NULL,
  subject     TEXT NOT NULL,
  status      TEXT NOT NULL,
  provider_id TEXT,
  error       TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_auth_tokens_user ON auth_tokens(user_id, type);
CREATE INDEX IF NOT EXISTS idx_email_log_user   ON email_log(user_id);
-- ===== Phase 2: quiz + leads + email schedule =====
CREATE TABLE IF NOT EXISTS leads (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  email             TEXT    NOT NULL UNIQUE,
  name              TEXT    NOT NULL DEFAULT '',
  answers           TEXT    NOT NULL DEFAULT '[]',
  result            TEXT    NOT NULL DEFAULT '',
  marketing_consent INTEGER NOT NULL DEFAULT 0,
  unsubscribed      INTEGER NOT NULL DEFAULT 0,
  unsubscribe_token TEXT    NOT NULL UNIQUE,
  created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS email_schedule (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id    INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  template   TEXT    NOT NULL,
  send_at    TEXT    NOT NULL,
  status     TEXT    NOT NULL DEFAULT 'pending',
  sent_at    TEXT
);
CREATE INDEX IF NOT EXISTS idx_schedule_due ON email_schedule(status, send_at);

-- ===== Phase 3: rituals =====
CREATE TABLE IF NOT EXISTS rituals (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT    NOT NULL,
  description  TEXT    NOT NULL DEFAULT '',
  category     TEXT    NOT NULL DEFAULT '',
  duration_min INTEGER NOT NULL DEFAULT 3,
  access       TEXT    NOT NULL DEFAULT 'free',
  image_file   TEXT,
  audio_file   TEXT,
  is_active    INTEGER NOT NULL DEFAULT 1,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ===== Phase 4: Stripe =====
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id            INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  customer_id        TEXT    NOT NULL,
  subscription_id    TEXT,
  status             TEXT    NOT NULL DEFAULT 'none',
  price_id           TEXT,
  interval           TEXT,
  current_period_end TEXT,
  updated_at         TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_subs_customer ON subscriptions(customer_id);

CREATE TABLE IF NOT EXISTS stripe_events (
  id         TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
-- ===== Phase 5: dashboard + daily recommendation =====
CREATE TABLE IF NOT EXISTS ritual_completions (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ritual_id      INTEGER NOT NULL REFERENCES rituals(id) ON DELETE CASCADE,
  completed_date TEXT    NOT NULL,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, ritual_id, completed_date)
);
CREATE INDEX IF NOT EXISTS idx_completions_user ON ritual_completions(user_id, completed_date);

CREATE TABLE IF NOT EXISTS daily_recs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  local_date TEXT    NOT NULL,
  ritual_id  INTEGER NOT NULL REFERENCES rituals(id) ON DELETE CASCADE,
  reason     TEXT    NOT NULL DEFAULT '',
  source     TEXT    NOT NULL DEFAULT 'rule',
  emailed_at TEXT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, local_date)
);

-- ===== Phase 6: certificate =====
CREATE TABLE IF NOT EXISTS cert_questions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  question      TEXT    NOT NULL,
  options       TEXT    NOT NULL,
  correct_index INTEGER NOT NULL,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_active     INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS certificates (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  code          TEXT    NOT NULL UNIQUE,
  user_id       INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT    NOT NULL,
  score_percent INTEGER NOT NULL,
  issued_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ===== Phase 7: analytics + Resend webhooks =====
CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  user_id    INTEGER,
  path       TEXT    NOT NULL DEFAULT '',
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_events_name ON events(name, created_at);

CREATE TABLE IF NOT EXISTS email_events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  svix_id     TEXT    NOT NULL UNIQUE,
  provider_id TEXT,
  type        TEXT    NOT NULL,
  to_email    TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);