# Issue 008: Harden V2 audit package command

Labels: `audit-readiness`, `release-blocker`

## Goal

Keep the V2 audit package reproducible without presenting V2 as canonical or audited.

## Current Boundary

V2 is candidate code only. Independent audit has not started.

## Acceptance Criteria

- Package includes V2 contracts, ABI, bytecode, tests, Slither baseline, known issues, freeze doc, and checksums.
- Package fails if V2 is described as canonical.
- Package fails if independent audit completion is claimed.
- Missing optional artifacts are documented before external review.

## Commands To Run

```bash
npm run audit
npm run claims
npm run value
```

## Files Likely Affected

- `scripts/generate-v2-audit-package.cjs`
- `docs/EXTERNAL_AUDIT_READINESS.md`
- `KNOWN_ISSUES.md`

## Prohibited Claims

No production-ready, mainnet-ready, secure-by-claim, or independent-audit-complete language.
