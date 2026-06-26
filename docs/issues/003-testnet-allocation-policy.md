# Issue 003: Review Sepolia testnet allocation policy

Labels: `v0.2-utility-pilot`, `documentation`, `testnet-only`

## Goal

Review the Sepolia-only allocation policy for clarity, abuse controls, and non-broadcast workflow.

## Current Boundary

Allocation is a draft testnet-only process. No allocation sale, private participant data collection, or Safe transaction broadcast is approved.

## Acceptance Criteria

- Per-wallet cap and campaign cap are documented.
- Duplicate and invalid addresses are rejected.
- Manual review and anti-spam rules are clear.
- Allocation report requirement and post-campaign report hash workflow are documented.

## Commands To Run

```bash
npm run allocation
npm run claims
npm run value
```

## Files Likely Affected

- `docs/utility-pilot/TESTNET_ALLOCATION_POLICY.md`
- `scripts/prepare-testnet-allocation.cjs`
- `scripts/check-allocation-report.cjs`

## Prohibited Claims

No sale, value, mainnet, guaranteed benefit, property-rights, or revenue-rights claims.
