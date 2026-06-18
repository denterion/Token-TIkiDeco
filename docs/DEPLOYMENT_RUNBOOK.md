# TikiDeco Deployment Runbook

Status: candidate deployment runbook. Do not deploy or broadcast transactions from this document without explicit approval and release sign-off.

## Pre-Deployment Gate

1. Confirm target version is V2 candidate, not Sepolia V1.
2. Confirm Sepolia V1 canonical addresses remain unchanged.
3. Confirm legal/public communications still state:
   - TIDE is not offered for sale;
   - TIDE has no stated monetary value;
   - TIDE is not deployed on mainnet;
   - independent audit has not started unless an external report exists.
4. Confirm `OWNER_ADDRESS` is the intended Safe/admin.
5. Confirm `TREASURY_ADDRESS` is the intended treasury.
6. Confirm `OWNER_ADDRESS != TREASURY_ADDRESS` unless a reviewed exception is documented.
7. Confirm constructor metadata is reviewed and neutral.
8. Confirm no private keys are committed or pasted into docs.

## Local Dry Run

```bash
npm ci
npm run compile
npm test
npm run coverage
npm run lint
npm run audit
npm run manifest
npm run bytecode
npm run gas
npm run site
npm run release
```

Optional local V2 deployment:

```bash
npm run deploy:v2:localhost
```

## Public Network Candidate Deployment Gate

Do not run public network deployment without explicit go/no-go.

If a future public candidate deployment is approved:

1. Prepare `.env` locally only.
2. Set explicit `OWNER_ADDRESS`.
3. Set explicit `TREASURY_ADDRESS`.
4. Set `CONFIRM_NON_CANONICAL_V2_DEPLOY=true`.
5. Run readiness checks.
6. Save deployment artifact.
7. Verify source code.
8. Publish candidate manifest only after review.
9. Do not modify `deployments/canonical.json` unless promotion is explicitly approved.

## Post-Deployment Candidate Checklist

- Verify token address and vault address.
- Verify compiler settings.
- Verify source links.
- Verify owner roles.
- Verify treasury balance.
- Verify vault starts with zero or expected prefunded balance.
- Verify no sale/value/mainnet/audit claims changed.
- Prepare transparency report before any public announcement.

