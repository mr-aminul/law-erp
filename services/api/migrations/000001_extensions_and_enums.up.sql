-- Law ERP: extensions and shared enums for governance-aware schema.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- How sensitive a row is (drives default AI eligibility).
CREATE TYPE data_classification AS ENUM (
  'public',
  'internal',
  'confidential',
  'privileged'
);

-- What kind of AI export consent covers.
CREATE TYPE ai_consent_scope AS ENUM (
  'anonymized_case_metadata',
  'anonymized_document_summaries',
  'anonymized_workflow_patterns'
);

CREATE TYPE ai_export_batch_status AS ENUM (
  'pending',
  'running',
  'completed',
  'failed',
  'cancelled'
);

-- Reusable columns for every tenant-owned business table (document in DATABASE.md).
COMMENT ON TYPE data_classification IS
  'Default training rule: privileged never exported; confidential excluded unless ai_training_eligible=true and firm consented.';
