# Issue 004: Finalize allocation report template

Labels: `v0.2-utility-pilot`, `documentation`, `community-preview`

## Goal

Make the allocation report template easy to complete without private participant data.

## Current Boundary

Reports are drafts until a future campaign is approved and closed. No private guest data should appear in public reports.

## Acceptance Criteria

- Includes campaign ID, network, chain ID, token address, status, totals, and SHA-256 hash.
- Confirms Sepolia-only, no sale, no stated monetary value, no mainnet deployment, no guaranteed benefit, and no private data.
- Separates request totals from final allocation outcome.

## Commands To Run

```bash
npm run allocation
npm run claims
```

## Files Likely Affected

- `docs/utility-pilot/ALLOCATION_REPORT_TEMPLATE.md`
- `operations/utility-pilot/testnet-allocation-draft.json`
- `scripts/check-allocation-report.cjs`

## Prohibited Claims

No active benefit, sale, value, mainnet, independent-audit-complete, or private participant detail.
