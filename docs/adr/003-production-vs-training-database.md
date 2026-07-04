# ADR 003: Production database vs training store

**Status:** Accepted

## Context

Law ERP will persist sensitive law firm data. We plan to train Law AI on **governed, consented** subsets. Training directly from the operational database creates legal, security, and operational risk.

## Decision

1. **Production:** PostgreSQL `public` schema — full ERP data with governance columns.
2. **Training store:** PostgreSQL `training` schema (dev) → **separate database or object warehouse** (production).
3. **Bridge:** Export batches copy anonymized rows into `training.snapshots`; ML pipelines read snapshots only.

## Data path

```text
User saves case in ERP
  → public.cases (ai_training_eligible=false by default)

Firm opts in via firm_ai_consents + row-level eligibility

Export job (authenticated, audited)
  → reads v_ai_export_eligible_*
  → anonymizes
  → writes training.snapshots
  → sets ai_exported_at on source rows

Training job
  → reads training.snapshots ONLY
```

## Enforcement layers

| Layer | Mechanism |
|-------|-----------|
| Database | CHECK constraints, RLS, separate schema |
| Application | `domain.ValidateTrainingEligibility` |
| Infrastructure | Separate DB credentials for training env |
| Legal | DPA + consent records |

## Consequences

- Slightly more storage and export latency — acceptable.
- Export service must be built before any training — intentional gate.
- Pseudonym maps stay in production or secure vault, not in ML notebooks.

## Future

- Move `training` to S3 Parquet + Databricks/SageMaker
- Add `training.embedding` table when RAG is needed
- Per-jurisdiction consent scopes
