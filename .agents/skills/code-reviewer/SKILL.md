---
name: code-reviewer
description: Review local changes for correctness, regressions, security, maintainability, and project-rule compliance. Use before PRs, after sizeable edits, or when the user asks for review.
---

# Code Reviewer

Review the current diff like a senior teammate protecting production.

## Workflow

1. Read `AGENTS.md`, `.agents/rules/`, and any touched-file context.
2. Inspect `git status --short` and the relevant `git diff`.
3. Prioritize findings by risk: correctness, data loss, security, tests, maintainability.
4. Verify claims against code paths; do not guess.
5. Suggest the smallest safe fix for each real issue.

## Review focus

- Behavior changes match the user request and project conventions.
- Handlers stay thin; domain logic moves to services (when added).
- Frontend uses `lib/api/` and `design/` tokens — no ad-hoc fetch or duplicated CSS.
- Tests cover new behavior or document why no test is practical yet.
- No secrets, debug logs, dead code, or unrelated churn enter the diff.

## Output

Group findings by severity:

- **Blocker** — likely broken behavior, data loss, security issue, or failing gate.
- **Should fix** — maintainability, missing coverage, unclear edge case.
- **Nit** — optional polish only when useful.

If the diff looks good, say so and list the checks performed.
