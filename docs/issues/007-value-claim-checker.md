# Issue 007: Maintain value claim checker coverage

Labels: `claims-check`, `community-preview`, `documentation`

## Goal

Keep unsupported value, sale, mainnet, active-benefit, and audit-completion claims out of public surfaces.

## Current Boundary

Policy and prohibition contexts may mention restricted wording only to prohibit or explain limitations.

## Acceptance Criteria

- `npm run value` passes on policy/prohibition contexts.
- Unsupported public claims fail with file and line output.
- Release docs, site pages, social copy, README, and package metadata remain in scope.

## Commands To Run

```bash
npm run claims
npm run value
npm run site
```

## Files Likely Affected

- `scripts/check-value-claims.cjs`
- `scripts/check-public-claims.cjs`
- `docs/VALUE_CLAIM_POLICY.md`

## Prohibited Claims

No sale, price, listing, yield, APY, financial-return, property-rights, revenue-rights, mainnet-live, or audit-complete claim.
