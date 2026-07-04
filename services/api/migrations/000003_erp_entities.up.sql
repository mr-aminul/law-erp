-- Core ERP entities with governance columns on every row.
-- Rule: ai_training_eligible defaults FALSE; never TRUE for privileged classification.

CREATE TABLE clients (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id               UUID NOT NULL REFERENCES firms(id),
  client_code           TEXT NOT NULL,
  name                  TEXT NOT NULL,
  client_type           TEXT NOT NULL DEFAULT 'individual',
  email                 CITEXT,
  phone                 TEXT,
  data_classification   data_classification NOT NULL DEFAULT 'confidential',
  ai_training_eligible  BOOLEAN NOT NULL DEFAULT false,
  ai_exported_at        TIMESTAMPTZ,
  retention_until       TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at            TIMESTAMPTZ,
  UNIQUE (firm_id, client_code),
  CONSTRAINT clients_ai_privileged_block CHECK (
    NOT (data_classification = 'privileged' AND ai_training_eligible = true)
  )
);

CREATE TABLE cases (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id               UUID NOT NULL REFERENCES firms(id),
  client_id             UUID NOT NULL REFERENCES clients(id),
  case_code             TEXT NOT NULL,
  matter                TEXT NOT NULL,
  case_type             TEXT NOT NULL,
  status                TEXT NOT NULL,
  court_name            TEXT,
  data_classification   data_classification NOT NULL DEFAULT 'confidential',
  ai_training_eligible  BOOLEAN NOT NULL DEFAULT false,
  ai_exported_at        TIMESTAMPTZ,
  retention_until       TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at            TIMESTAMPTZ,
  UNIQUE (firm_id, case_code),
  CONSTRAINT cases_ai_privileged_block CHECK (
    NOT (data_classification = 'privileged' AND ai_training_eligible = true)
  )
);

-- Free-text lives in child tables (easier to exclude/redact for ML).
CREATE TABLE case_notes (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id               UUID NOT NULL REFERENCES firms(id),
  case_id               UUID NOT NULL REFERENCES cases(id),
  author_user_id        UUID NOT NULL REFERENCES users(id),
  body                  TEXT NOT NULL,
  is_privileged_memo    BOOLEAN NOT NULL DEFAULT false,
  data_classification   data_classification NOT NULL DEFAULT 'privileged',
  ai_training_eligible  BOOLEAN NOT NULL DEFAULT false,
  ai_exported_at        TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at            TIMESTAMPTZ,
  CONSTRAINT case_notes_ai_privileged_block CHECK (
    NOT (data_classification = 'privileged' AND ai_training_eligible = true)
  ),
  CONSTRAINT case_notes_memo_classification CHECK (
    NOT (is_privileged_memo = true AND data_classification <> 'privileged')
  )
);

CREATE TABLE documents (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id               UUID NOT NULL REFERENCES firms(id),
  case_id               UUID REFERENCES cases(id),
  title                 TEXT NOT NULL,
  mime_type             TEXT,
  storage_key           TEXT NOT NULL,        -- object storage path, not inline blob
  data_classification   data_classification NOT NULL DEFAULT 'confidential',
  ai_training_eligible  BOOLEAN NOT NULL DEFAULT false,
  ai_exported_at        TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at            TIMESTAMPTZ,
  CONSTRAINT documents_ai_privileged_block CHECK (
    NOT (data_classification = 'privileged' AND ai_training_eligible = true)
  )
);

-- Extracted text for search/ML pipelines (optional populate); kept separate from metadata.
CREATE TABLE document_texts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id               UUID NOT NULL REFERENCES firms(id),
  document_id           UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  extracted_text        TEXT NOT NULL,
  data_classification   data_classification NOT NULL DEFAULT 'confidential',
  ai_training_eligible  BOOLEAN NOT NULL DEFAULT false,
  ai_exported_at        TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at            TIMESTAMPTZ,
  CONSTRAINT document_texts_ai_privileged_block CHECK (
    NOT (data_classification = 'privileged' AND ai_training_eligible = true)
  )
);

CREATE INDEX clients_firm_active ON clients (firm_id) WHERE deleted_at IS NULL;
CREATE INDEX cases_firm_active ON cases (firm_id) WHERE deleted_at IS NULL;
CREATE INDEX cases_ai_export ON cases (firm_id, ai_training_eligible)
  WHERE deleted_at IS NULL AND ai_training_eligible = true AND ai_exported_at IS NULL;

COMMENT ON COLUMN clients.ai_training_eligible IS
  'Application may set true only when firm has active consent AND row is not privileged.';
COMMENT ON TABLE document_texts IS
  'Never export raw extracted_text without redaction pipeline; prefer structured case metadata first.';
