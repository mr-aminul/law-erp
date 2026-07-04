# Review And CI Rules

Use agent skills to keep changes safe before handoff.

## Code review

Run `/code-reviewer` when:

- A change touches multiple files or layers
- The user asks whether the diff is safe
- Preparing for PR or merge
- Security, auth, billing, permissions, or data migration code changes

Review the diff, not the whole world. Report only actionable findings.

## CI triage

Run `/ci-triage` when:

- Build, lint, test, typecheck, or deploy commands fail
- GitHub Actions failures need diagnosis
- The error source is unclear after the first command output

Always identify the narrowest failing command before patching.
