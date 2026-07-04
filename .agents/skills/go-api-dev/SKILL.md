---
name: go-api-dev
description: >-
  Develop the Law ERP Go REST API using chi router, internal handlers, and JSON
  conventions. Use when adding API routes, handlers, middleware, config, or Go
  tests in services/api/.
---

# Go API Development (chi + gqlgen)

## Stack

- **HTTP router:** [chi v5](https://github.com/go-chi/chi)
- **GraphQL:** [gqlgen](https://github.com/99designs/gqlgen) at `POST /graphql`
- **Playground:** `GET /` when `GRAPHQL_PLAYGROUND=true` (default in dev)

REST `GET /health` remains for load balancers.

## Add a GraphQL field

1. Edit schema in `graph/schema/*.graphqls`
2. Run `make gqlgen` from repo root
3. Implement resolver stubs in `graph/*.resolvers.go`
4. Add data access in `internal/store/` or future repository layer
5. Add query + types in `apps/web/lib/graphql/queries/`

## Conventions

- Version domain types in GraphQL schema; paginate list fields (`first`/`after` later)
- All firm-scoped data must filter by `firm_id` once auth lands (see `docs/DATA_GOVERNANCE.md`)
- `ai_training_eligible` defaults false on all persisted rows

## Run & test

```bash
make dev-api
make gqlgen
go test ./...
curl -X POST localhost:8080/graphql -H 'Content-Type: application/json' -d '{"query":"{ health { status } }"}'
```
