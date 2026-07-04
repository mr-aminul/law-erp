# Law ERP

Law firm ERP monorepo — Next.js frontend + Go API.

## Stack

- **Frontend:** Next.js 14 (`apps/web`)
- **Backend:** Go + [chi router](https://github.com/go-chi/chi) (`services/api`)
- **Design:** Shared tokens in `design/`

## Quick start

```bash
npm install
cd services/api && go mod tidy
cp apps/web/.env.example apps/web/.env.local
make dev
```

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:8080/graphql |
| GraphiQL (dev) | http://localhost:8080/ |
| Health | http://localhost:8080/health |

## Repo layout

```text
apps/web/           Next.js UI
services/api/       Go REST API (chi)
design/             Shared CSS/Tailwind tokens
docs/               Architecture & handoffs
```

## Commands

```bash
make dev          # API + web together
make dev-api      # Go only
make dev-web      # Next.js only
make test-api     # go test ./...
```

## Docs

- Agent workflow: [AGENTS.md](AGENTS.md)
- Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- API service: [services/api/README.md](services/api/README.md)
