# Database design — production vs AI training

Law ERP uses **one Postgres database for the ERP** with a **separate `training` schema** for anonymized ML snapshots. In production, move `training` to its **own database or warehouse** — the schema boundary stays the same.

## Golden rules

1. **ERP saves to `public.*`** — normal app tables with governance columns.
2. **Training reads `training.snapshots` only** — never production tables.
3. **`ai_training_eligible` defaults `false`** — opt-in per row + firm consent.
4. **Privileged data never trainable** — enforced by CHECK constraints + app code.
5. **Free text separated** — `case_notes`, `document_texts` isolated for redaction.

## Every tenant table includes

| Column | Default | Purpose |
|--------|---------|---------|
| `firm_id` | required | Multi-tenant isolation |
| `data_classification` | `confidential` | Sensitivity level |
| `ai_training_eligible` | `false` | Explicit ML opt-in |
| `ai_exported_at` | null | Audit: copied to training store |
| `retention_until` | null | Legal hold / retention |
| `deleted_at` | null | Soft delete; excluded from export |

## Entity layout

```text
public.firms
public.users
public.firm_ai_consents      ← required before any export
public.audit_events
public.ai_export_batches     ← governed export jobs
public.clients
public.cases
public.case_notes          ← text; default privileged
public.documents           ← metadata + storage_key
public.document_texts      ← extracted text (high risk)

training.pseudonym_maps      ← maps real IDs → pseudonyms (keep out of ML env)
training.snapshots           ← anonymized JSON + optional redacted text
```

## Export pipeline (future service)

```text
1. Verify firm_ai_consents (active, matching scope)
2. SELECT FROM v_ai_export_eligible_* (not raw tables)
3. Anonymize / pseudonymize
4. INSERT INTO training.snapshots
5. UPDATE source.ai_exported_at
6. INSERT audit_events
```

Go helpers: `internal/domain/export.go` mirrors these rules.

## Migrations

```bash
docker compose up -d postgres
export DATABASE_URL=postgres://law_erp:law_erp@localhost:5432/law_erp?sslmode=disable
make migrate-up
```

Files: `services/api/migrations/000001_*.sql` … `000005_*.sql`

## Row Level Security

API sets tenant per request:

```sql
SET app.firm_id = '<uuid-from-jwt>';
```

All tenant policies use `app_current_firm_id()`.

## What makes data "easy to train" later

| Design choice | Why |
|---------------|-----|
| `training.snapshots.feature_json` | Structured features without schema churn |
| Separate text tables | Redact or drop text per export policy |
| `case_type`, `status` as enums/text | Good categorical ML features |
| Pseudonym maps per batch | Link patterns without leaking identities in ML env |
| Consent scoped by `ai_consent_scope` | Export only what the firm agreed to |

## What NOT to do

- Store document binaries in Postgres rows
- Train against `public.cases` directly
- Set `ai_training_eligible = true` globally or by default
- Mix firms in one export batch without explicit multi-tenant review

## Related

- [DATA_GOVERNANCE.md](DATA_GOVERNANCE.md) — legal/product requirements
- [adr/002-multi-tenant-data-model.md](adr/002-multi-tenant-data-model.md)
- [adr/003-production-vs-training-database.md](adr/003-production-vs-training-database.md)
