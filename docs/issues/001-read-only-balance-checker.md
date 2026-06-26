# Issue 001: Review read-only Sepolia balance checker

Labels: `v0.2-utility-pilot`, `community-preview`, `site`, `testnet-only`

## Goal

Review the v0.2 read-only `balanceOf(wallet)` checker across desktop and mobile.

## Current Boundary

Sepolia prototype only. No sale, no stated monetary value, no mainnet deployment, no active guest benefits, and independent audit not started.

## Acceptance Criteria

- Manual wallet input validates Ethereum addresses.
- RPC unavailable state does not display invented values.
- Live, Cached, Stale, Wrong Chain, and Unavailable states are understandable.
- No wallet connection, transaction signing, approval, transfer, fee, sale, price, or booking UI exists.

## Commands To Run

```bash
npm run eligibility
npm run site
npm run claims
npm run value
```

## Files Likely Affected

- `site-v2/src/components/PilotEligibilityCard.tsx`
- `site-v2/src/lib/eligibility/readOnlyBalance.ts`
- `scripts/test-eligibility-engine.cjs`

## Prohibited Claims

No sale, price, mainnet, active-benefit, independent-audit-complete, property-rights, or financial-return claims.
