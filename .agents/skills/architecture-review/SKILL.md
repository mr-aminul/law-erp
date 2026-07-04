---
name: architecture-review
description: Evaluate or improve feature architecture, module boundaries, dependencies, and data flow before larger changes. Use for design, refactors, or confusing code paths.
---

# Architecture Review

Keep the system boring, composable, and easy to change.

## Workflow

1. Map the current flow from entry point to persistence/UI output.
2. Identify existing patterns before proposing new abstractions.
3. Prefer deletion, reuse, or smaller seams before adding layers.
4. Separate domain decisions from framework plumbing.
5. Recommend an incremental migration path with safe checkpoints.

## Heuristics

- Use Go chi + `internal/` layout and Next.js App Router conventions before custom frameworks.
- Extract only when the name clarifies intent or duplication is already present.
- Keep public interfaces small and stable.
- Avoid shared utilities that hide domain meaning.
- Document durable decisions in `docs/` only when the decision will matter later.

## Output

Provide:

- Current shape in 3-5 bullets.
- Main risks or smells.
- Smallest recommended next change.
- Tests or checks that prove the change is safe.
