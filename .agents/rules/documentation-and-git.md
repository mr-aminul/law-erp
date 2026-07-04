# Documentation And Git Rules

## Documentation

Use `/readme-generator` when setup docs, workspace maps, or onboarding commands are stale.

Docs must be based on files in the repo:

- Root `package.json`, workspace manifests, `Makefile`, `README.md`
- `.env.example` files
- Existing `docs/` decisions and handoffs

Do not invent unsupported commands or product claims.

## Git

Use `/git-commit-writer` only when the user asks for a commit, commit message, or PR-ready summary.

- Check staged and unstaged changes separately.
- Keep commit plans scoped to related files.
- Never commit, stage, reset, rebase, or push without explicit user instruction.
