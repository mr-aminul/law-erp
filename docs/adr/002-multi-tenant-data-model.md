# ADR 002: Multi-tenant data model for firms & AI eligibility

**Status:** Accepted (foundational — implement with first Postgres migration)

## Context

Law ERP serves many law firms. Each firm's data must be isolated. Some firms may opt in to contributing **governed, anonymized** data for Law AI training.

## Decision

Every business entity is scoped to `firm_id`. AI training eligibility is **opt-in per firm**, **off by default per row**, and exports never read production directly.

## Schema conventions

All tenant tables include:

```sql
firm_id UUID NOT NULL REFERENCES firms(id),
data_classification TEXT NOT NULL DEFAULT 'confidential'
  CHECK (data_classification IN ('public','internal','confidential','privileged')),
ai_training_eligible BOOLEAN NOT NULL DEFAULT false,
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
deleted_at TIMESTAMPTZ
```

Row Level Security (Postgres RLS) enforces `firm_id = current_setting('app.firm_id')`.

## AI export rules

1. Middleware checks `firm_ai_consents` before any export job.
2. Export selects only rows where `ai_training_eligible = true` AND `data_classification != 'privileged'`.
3. Anonymization runs in export service; output goes to training store only.
4. `ai_exported_at` updated on source rows for audit.

## Consequences

- Slightly wider tables from day one — acceptable for compliance.
- Application layer must always set `firm_id` from JWT/session — never from client input alone.
- See [DATA_GOVERNANCE.md](../DATA_GOVERNANCE.md) for legal/product requirements.
