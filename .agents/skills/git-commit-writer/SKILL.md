---
name: git-commit-writer
description: Prepare clear commit messages and safe commit plans from the current diff. Use only when the user asks to commit, draft a commit, or summarize staged changes.
---

# Git Commit Writer

Create commits that tell the truth and are easy to review.

## Safety

- Never commit unless the user explicitly asks.
- Never include unrelated files without calling them out first.
- Never discard or rewrite user changes.

## Workflow

1. Check `git status --short`.
2. Review staged and unstaged diffs separately.
3. Group related files into the smallest coherent commit plan.
4. Draft a concise subject and body using imperative mood.
5. Mention tests/checks run, if any.

## Message format

Use this shape unless the repo already has a stricter convention:

```text
<area>: <imperative summary>

- <why/change detail when helpful>
- <tests/checks when helpful>
```

Examples:

- `agents: add CI triage skill routing`
- `web: fix dashboard build regression`
