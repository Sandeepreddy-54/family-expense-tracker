CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  slot          TEXT PRIMARY KEY CHECK (slot IN ('you','priya')),
  display_name  TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date        DATE NOT NULL,
  merchant    TEXT NOT NULL,
  category    TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL,
  person      TEXT NOT NULL REFERENCES users(slot),
  account     TEXT NOT NULL,
  source      TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','auto')),
  type        TEXT NOT NULL DEFAULT 'expense' CHECK (type IN ('expense','income')),
  created_by  TEXT NOT NULL REFERENCES users(slot),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);
CREATE INDEX idx_transactions_updated_at ON transactions (updated_at);

CREATE TABLE sms_queue (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw         TEXT NOT NULL,
  merchant    TEXT,
  amount      NUMERIC(12,2),
  account     TEXT,
  category    TEXT,
  type        TEXT DEFAULT 'expense' CHECK (type IN ('expense','income')),
  date        DATE,
  person      TEXT NOT NULL REFERENCES users(slot),
  origin      TEXT NOT NULL DEFAULT 'paste' CHECK (origin IN ('paste','ingest')),
  dedupe_key  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);
CREATE UNIQUE INDEX idx_sms_queue_dedupe ON sms_queue (dedupe_key) WHERE dedupe_key IS NOT NULL;
CREATE INDEX idx_sms_queue_updated_at ON sms_queue (updated_at);

CREATE TABLE bills (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  amount        NUMERIC(12,2) NOT NULL,
  due_date      DATE NOT NULL,
  category      TEXT NOT NULL DEFAULT 'Other',
  auto_detected BOOLEAN NOT NULL DEFAULT false,
  paid          BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);
CREATE INDEX idx_bills_updated_at ON bills (updated_at);

CREATE TABLE ious (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  direction   TEXT NOT NULL CHECK (direction IN ('lent','borrowed')),
  person      TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL,
  note        TEXT,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','repaid')),
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by  TEXT NOT NULL REFERENCES users(slot),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);
CREATE INDEX idx_ious_updated_at ON ious (updated_at);

CREATE TABLE card_emis (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id       TEXT NOT NULL,
  item          TEXT NOT NULL,
  amount        NUMERIC(12,2) NOT NULL,
  tenure_months INTEGER NOT NULL,
  paid_months   INTEGER NOT NULL DEFAULT 0,
  start_date    DATE NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);
CREATE INDEX idx_card_emis_updated_at ON card_emis (updated_at);

CREATE TABLE budget_overrides (
  category    TEXT PRIMARY KEY,
  amount      NUMERIC(12,2) NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE household_settings (
  id              SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  overall_budget  NUMERIC(12,2) NOT NULL DEFAULT 80000,
  sms_android     BOOLEAN NOT NULL DEFAULT true,
  iphone_forward  BOOLEAN NOT NULL DEFAULT true,
  notif_new_tx    BOOLEAN NOT NULL DEFAULT true,
  notif_budget    BOOLEAN NOT NULL DEFAULT true,
  notif_bills     BOOLEAN NOT NULL DEFAULT true,
  notif_weekly    BOOLEAN NOT NULL DEFAULT false,
  shared          BOOLEAN NOT NULL DEFAULT true,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO household_settings (id) VALUES (1);
