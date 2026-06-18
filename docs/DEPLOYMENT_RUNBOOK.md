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
4. For V1-only scripts, confirm `OWNER_ADDRESS` is the intended historical admin/Safe.
5. For V1-only scripts, confirm `TREASURY_ADDRESS` is the intended historical treasury.
6. For V2 candidate scripts, confirm `V2_DEFAULT_ADMIN_ADDRESS`, `V2_PAUSER_ADDRESS`, `V2_REPORTER_ADDRESS`, `V2_VESTING_ADMIN_ADDRESS`, and `V2_TREASURY_ADDRESS` are explicit and reviewed.
7. Confirm V2 role addresses are separated unless a reviewed exception is documented.
8. Confirm `V2_DEFAULT_ADMIN_DELAY_SECONDS` is reviewed.
9. Confirm constructor metadata is reviewed, neutral, non-empty, and bounded.
10. Confirm no private keys are committed or pasted into docs.

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
2. Set explicit `V2_DEFAULT_ADMIN_ADDRESS`.
3. Set explicit `V2_PAUSER_ADDRESS`.
4. Set explicit `V2_REPORTER_ADDRESS`.
5. Set explicit `V2_VESTING_ADMIN_ADDRESS`.
6. Set explicit `V2_TREASURY_ADDRESS`.
7. Set explicit `V2_DEFAULT_ADMIN_DELAY_SECONDS`.
8. Set neutral `PROJECT_NAME`, `BUSINESS_ENTITY`, `PROJECT_JURISDICTION`, and `PROJECT_URI`.
9. Set `CONFIRM_NON_CANONICAL_V2_DEPLOY=true`.
10. Run readiness checks.
11. Save deployment artifact and generated role manifest.
12. Verify source code.
13. Publish candidate manifest only after review.
14. Do not modify `deployments/canonical.json` unless promotion is explicitly approved.

## Post-Deployment Candidate Checklist

- Verify token address and vault address.
- Verify compiler settings.
- Verify source links.
- Verify role manifest schema `tikideco.v2.role-manifest/1`.
- Verify default admin, pauser, reporter, vesting admin, and treasury on-chain.
- Verify deployer does not retain unintended privileged roles.
- Verify treasury balance.
- Verify vault starts with zero or expected prefunded balance.
- Verify no sale/value/mainnet/audit claims changed.
- Prepare transparency report before any public announcement.
