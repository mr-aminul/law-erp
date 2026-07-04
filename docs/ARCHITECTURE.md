# Architecture

## Overview

```text
┌─────────────────┐     GraphQL POST     ┌─────────────────┐
│   apps/web      │ ◄──────────────────► │  services/api   │
│   Next.js 14    │   /graphql           │  chi + gqlgen   │
└────────┬────────┘                      └────────┬────────┘
         │                                        │
         └────────── design/ (shared CSS) ────────┘
```

## Boundaries

- **apps/web** owns UI, client state, and calling the API. No business persistence in the browser long-term.
- **services/api** owns auth, validation, persistence, and domain rules.
- **design/** owns brand tokens only — no app logic.

## Data flow (target state)

1. React component → `lib/graphql/` query
2. gqlgen resolver → store/repository → database (future)
3. JSON response → component (server or client)

Mock data in `apps/web/lib/mock/` is replaced module-by-module.

## AI / training data

All persisted data must follow `docs/DATA_GOVERNANCE.md` — tenant isolation, classification, opt-in consent. Never train from production DB directly.

## Adding a feature (vertical slice)

1. Define API types + handler in Go
2. Add route in `internal/server/server.go`
3. Add client types + fetch in `apps/web/lib/api/`
4. Wire UI page to API; delete corresponding mock usage
5. Tests: Go handler test + optional UI test

## What not to do

- No second frontend or backend app without an ADR in `docs/adr/`
- No Ruby/Rails — removed from repo
- No duplicate design tokens outside `design/`
- No `fetch()` in random components — use `lib/api/`
