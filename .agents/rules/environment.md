# Environment Rules

Use `/env-doctor` for local setup, dependency, port, workspace, or command-not-found failures.

## Diagnosis order

1. Read existing setup docs and manifests.
2. Check tool versions and package-manager state.
3. Reproduce the failing command narrowly.
4. Fix local configuration before changing application code.
5. Escalate when a missing secret, account, or external service is required.

## Safety

- Do not delete lockfiles as a first fix.
- Do not upgrade dependencies unless the user asks or the failing gate requires it.
- Do not write real credentials; update examples or instructions instead.
