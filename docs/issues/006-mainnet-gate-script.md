# Issue 006: Keep mainnet gate blocked until approvals

Labels: `release-blocker`, `operations-gate`, `claims-check`

## Goal

Keep `npm run mainnet:check` failing until all mainnet, value, utility, legal, security, treasury, privacy, and operations gates are explicitly approved.

## Current Boundary

Mainnet is not approved. The expected successful check for the current state is `node scripts/check-mainnet-readiness.cjs --expect-blocked`.

## Acceptance Criteria

- `npm run mainnet:check` fails while blockers remain.
- `node scripts/check-mainnet-readiness.cjs --expect-blocked` passes.
- Docs explain that the failure is intentional.

## Commands To Run

```bash
npm run mainnet:check
node scripts/check-mainnet-readiness.cjs --expect-blocked
npm run claims
npm run value
```

## Files Likely Affected

- `scripts/check-mainnet-readiness.cjs`
- `docs/MAINNET_GO_NO_GO.md`
- `docs/NEXT_RELEASE_GATES.md`

## Prohibited Claims

No mainnet readiness, value statement, sale, active utility, or independent-audit-complete claim.
