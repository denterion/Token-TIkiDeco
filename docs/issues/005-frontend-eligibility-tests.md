# Issue 005: Expand frontend eligibility tests

Labels: `v0.2-utility-pilot`, `site`, `testnet-only`

## Goal

Expand deterministic tests for the eligibility card and read-only balance reader.

## Current Boundary

Tests must use fixtures or mocks and must not depend on live RPC availability.

## Acceptance Criteria

- Invalid address, zero balance, sufficient mocked balance, wrong chain, unavailable RPC, stale cache, and one-endpoint-fails/one-succeeds are covered.
- Production UI contains no transaction button.
- Production UI contains no sale-oriented or price-oriented copy.

## Commands To Run

```bash
npm run eligibility
npm run site
```

## Files Likely Affected

- `scripts/test-eligibility-engine.cjs`
- `scripts/fixtures/read-only-rpc-fixture.cjs`
- `site-v2/src/components/PilotEligibilityCard.tsx`
- `site-v2/src/lib/eligibility/readOnlyBalance.ts`

## Prohibited Claims

No transaction, approval, transfer, fee, booking, sale, price, mainnet, or active-benefit UI.
