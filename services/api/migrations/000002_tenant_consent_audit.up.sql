-- Tenants, consent, and audit — required before any ERP business data.

CREATE TABLE firms (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            CITEXT NOT NULL UNIQUE,
  country_code    CHAR(2) NOT NULL DEFAULT 'BD',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ
);

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id         UUID NOT NULL REFERENCES firms(id),
  email           CITEXT NOT NULL,
  full_name       TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'staff',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  UNIQUE (firm_id, email)
);

-- Opt-in AI training consent per firm (required before any export job).
CREATE TABLE firm_ai_consents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id           UUID NOT NULL REFERENCES firms(id),
  scope             ai_consent_scope NOT NULL,
  document_version  TEXT NOT NULL,           -- hash or version of DPA / ToS accepted
  consented_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  consented_by      UUID NOT NULL REFERENCES users(id),
  revoked_at        TIMESTAMPTZ,
  revoked_by        UUID REFERENCES users(id),
  CONSTRAINT firm_ai_consents_active CHECK (revoked_at IS NULL OR revoked_at > consented_at)
);

CREATE UNIQUE INDEX firm_ai_consents_one_active_per_scope
  ON firm_ai_consents (firm_id, scope)
  WHERE revoked_at IS NULL;

-- Immutable audit trail for exports, admin actions, consent changes.
CREATE TABLE audit_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id         UUID REFERENCES firms(id),
  actor_user_id   UUID REFERENCES users(id),
  action          TEXT NOT NULL,              -- e.g. ai.export.started, consent.granted
  resource_type   TEXT,
  resource_id     UUID,
  metadata        JSONB NOT NULL DEFAULT '{}',
  ip_address      INET,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX audit_events_firm_created ON audit_events (firm_id, created_at DESC);

-- Tracks each governed export from production → training store.
CREATE TABLE ai_export_batches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id         UUID NOT NULL REFERENCES firms(id),
  consent_id      UUID NOT NULL REFERENCES firm_ai_consents(id),
  status          ai_export_batch_status NOT NULL DEFAULT 'pending',
  row_count       INTEGER NOT NULL DEFAULT 0,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  error_message   TEXT,
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ai_export_batches_firm ON ai_export_batches (firm_id, created_at DESC);

COMMENT ON TABLE firm_ai_consents IS
  'No export or training job may run without a non-revoked consent row for that firm and scope.';
COMMENT ON TABLE ai_export_batches IS
  'Production rows are never read by training jobs directly — only via completed export batches.';
