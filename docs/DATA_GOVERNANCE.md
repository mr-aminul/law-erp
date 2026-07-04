# Data governance & future Law AI training

This document defines how we structure data **from day one** so future AI training is legally defensible and technically safe.

> **Important:** Training on law firm data without clear legal basis and consent creates serious risk — breach of contract, privacy law (GDPR/CCPA), attorney-client privilege, and professional ethics. **Do not collect or use firm data for training "in silence."** Build for **explicit, documented consent** instead.

## Principles

1. **Consent before training** — AI training is opt-in per firm, recorded in writing (DPA / addendum).
2. **Purpose limitation** — Production ERP data serves the firm; training data is a separate, governed export.
3. **Tenant isolation** — Firm A never sees Firm B's data; training exports are scoped per consenting tenant.
4. **Privilege by default** — Mark privileged/sensitive content; exclude from training unless explicitly allowed.
5. **Audit everything** — Who accessed, exported, or included data in a training batch.

## What to build now

Schema is in **`services/api/migrations/`** — run with `make migrate-up` after `docker compose up -d postgres`.

See **[DATABASE.md](DATABASE.md)** for table layout and export pipeline.

**Rules:**
- No training job runs without an active, non-revoked consent row.
- Revocation stops **future** exports; does not automatically delete prior batches (define policy).

## Data classification guide

| Class | Examples | Training default |
|-------|----------|------------------|
| `public` | Court listings, published statutes | May include if consented |
| `internal` | Staff schedules, internal templates | Exclude unless scoped |
| `confidential` | Client names, billing, case strategy | Exclude by default |
| `privileged` | Attorney-client communications, work product | **Never** without explicit legal review |

## Architecture: production ≠ training

```text
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  ERP (prod)  │     │  Export service │     │  Training store  │
│  Postgres    │ ──► │  anonymize      │ ──► │  (separate bucket│
│  firm scoped │     │  filter         │     │   / warehouse)   │
└──────────────┘     └─────────────────┘     └──────────────────┘
        │                      │                       │
        └──────── audit log ───┴───────────────────────┘
```

- **Never** train directly against the production database.
- Export jobs: filter `ai_training_eligible = true`, strip/anonymize PII, write to isolated storage.
- Training team / jobs only read from the training store.

## Anonymization (minimum before any export)

- Replace client/party names with stable pseudonyms (per export batch).
- Remove direct identifiers: email, phone, national IDs, account numbers.
- Truncate or generalize dates where precision isn't needed.
- Never export raw document binaries without redaction pipeline.

## Legal & product (non-technical)

- **Terms of Service / DPA** — Clear clause: what may be used for model improvement, opt-in/out, subprocessors.
- **Sales/onboarding** — Disclose AI training during contract, not buried in settings.
- **Counsel review** — Before first export batch in each jurisdiction you serve.
- **Ethics** — Law firms may be **prohibited** from sharing client data with you; their consent may not be enough if it violates their duties.

## GraphQL / API implications

- All queries scoped by `firm_id` from auth token (when auth lands).
- Admin/export endpoints require elevated role + audit log entry.
- No bulk export GraphQL field without rate limits and consent check middleware.

## Checklist before first training run

- [ ] Legal review completed for target jurisdiction(s)
- [ ] DPA / consent flow live and versioned
- [ ] `firm_ai_consents` populated for participating firms only
- [ ] Classification columns on all relevant tables
- [ ] Export pipeline with anonymization tested
- [ ] Training store isolated from production
- [ ] Incident response plan if privileged data leaks into a batch

## Related

- [docs/DATABASE.md](DATABASE.md) — schema, migrations, export pipeline
- [docs/ARCHITECTURE.md](ARCHITECTURE.md) — system boundaries
- [docs/adr/002-multi-tenant-data-model.md](adr/002-multi-tenant-data-model.md)
- [docs/adr/003-production-vs-training-database.md](adr/003-production-vs-training-database.md)
