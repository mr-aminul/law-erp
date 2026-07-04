-- Training store (separate schema).
-- In production use a separate Postgres cluster or warehouse; schema keeps dev/simple deploy clear.

CREATE SCHEMA IF NOT EXISTS training;

COMMENT ON SCHEMA training IS
  'Anonymized ML snapshots only. Training jobs read from here — never from public.* production tables.';

-- Pseudonym map per export batch (reversible only inside secure export service, not in training env).
CREATE TABLE training.pseudonym_maps (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  export_batch_id UUID NOT NULL REFERENCES ai_export_batches(id),
  entity_type     TEXT NOT NULL,           -- client, party, etc.
  source_id       UUID NOT NULL,
  pseudonym       TEXT NOT NULL,           -- e.g. CLIENT_a1b2c3
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (export_batch_id, entity_type, source_id)
);

-- Denormalized, redacted feature rows ready for ML pipelines (JSON for flexibility).
CREATE TABLE training.snapshots (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  export_batch_id   UUID NOT NULL REFERENCES ai_export_batches(id),
  firm_id             UUID NOT NULL REFERENCES firms(id),
  source_schema       TEXT NOT NULL DEFAULT 'public',
  source_table        TEXT NOT NULL,
  source_id           UUID NOT NULL,
  consent_scope       ai_consent_scope NOT NULL,
  feature_json        JSONB NOT NULL,      -- structured, anonymized fields
  text_chunk          TEXT,                -- optional redacted text; NULL if metadata-only export
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (export_batch_id, source_table, source_id)
);

CREATE INDEX training_snapshots_batch ON training.snapshots (export_batch_id);
CREATE INDEX training_snapshots_firm ON training.snapshots (firm_id);

-- Production-side view: rows that MAY enter an export (app still runs anonymization).
CREATE OR REPLACE VIEW v_ai_export_eligible_cases AS
SELECT
  c.id,
  c.firm_id,
  c.case_code,
  c.case_type,
  c.status,
  c.data_classification,
  c.ai_training_eligible,
  c.ai_exported_at
FROM cases c
WHERE c.deleted_at IS NULL
  AND c.ai_training_eligible = true
  AND c.data_classification <> 'privileged'
  AND EXISTS (
    SELECT 1 FROM firm_ai_consents fac
    WHERE fac.firm_id = c.firm_id
      AND fac.revoked_at IS NULL
      AND fac.scope = 'anonymized_case_metadata'
  );

COMMENT ON VIEW v_ai_export_eligible_cases IS
  'Necessary but not sufficient for training — export service must still anonymize and write to training.snapshots.';
