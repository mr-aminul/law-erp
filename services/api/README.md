# Law ERP API

Go GraphQL API for the law firm ERP.

## Stack

| Piece | Library |
|-------|---------|
| HTTP router | [chi v5](https://github.com/go-chi/chi) |
| GraphQL | [gqlgen](https://github.com/99designs/gqlgen) |
| CORS | `github.com/go-chi/cors` |

chi serves HTTP; gqlgen generates types and resolvers from `graph/schema/`.

## Layout

```text
cmd/server/main.go          Entrypoint
graph/schema/               GraphQL schema (.graphqls)
graph/*.resolvers.go        Resolver implementations
graph/generated/            gqlgen output (do not edit)
internal/store/             Seed data (→ Postgres later)
internal/server/server.go   chi + /graphql mount
```

## Run

```bash
go run ./cmd/server
# GraphiQL: http://localhost:8080/  (dev)
# GraphQL: POST http://localhost:8080/graphql
```

## Regenerate after schema changes

```bash
make gqlgen
```

## Example query

```graphql
query Dashboard {
  dashboard {
    stats {
      hearings { today thisMonth }
      cases { new pending completed }
    }
    recentCases(first: 5) {
      caseId
      matter
      clientName
    }
  }
}
```

## Environment

| Variable | Default |
|----------|---------|
| `PORT` | `8080` |
| `CORS_ORIGINS` | `http://localhost:3000,...` |
| `GRAPHQL_PLAYGROUND` | `true` in dev |

## Data governance

See [docs/DATA_GOVERNANCE.md](../../docs/DATA_GOVERNANCE.md) for multi-tenant and future AI training rules.
