# Law ERP — Web App

Next.js frontend for the law firm ERP. This is the **active UI** — migrated from the original prototype.

## Run

From repo root:

```bash
make dev-web
# or
npm run dev:web
```

Copy env:

```bash
cp .env.example .env.local
```

Open http://localhost:3000 (requires Go API on :8080 for the status badge).

## Shared design

Imports brand tokens from `../../design/` at the repo root.

## Stack

- Next.js 14 (App Router)
- React 18 + Tailwind CSS v3
- shadcn/ui, Zustand, Recharts
- API client in `lib/api/`

Mock data in `lib/mock/` is being replaced by Go API endpoints incrementally.
