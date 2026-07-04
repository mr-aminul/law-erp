---
name: readme-generator
description: Create or refresh README and onboarding docs from the actual codebase, scripts, and configuration. Use when docs are stale or the user asks for setup/documentation.
---

# README Generator

Write docs from repository truth, not assumptions.

## Workflow

1. Inspect root files, app workspaces, Makefile targets, env examples, and existing docs.
2. Preserve useful existing prose; update only stale or missing sections.
3. Document commands that actually exist.
4. Include setup, development, test/build, project structure, and troubleshooting only as relevant.
5. Keep docs concise and easy to scan.

## Rules

- Do not invent deployment, auth, database, or CI details.
- Prefer links to existing docs over duplicating long content.
- Mark unknowns as TODO only when the repo truly lacks the answer.
- Keep examples copy-pasteable.
