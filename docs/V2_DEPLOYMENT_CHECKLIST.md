# TikiDeco V2 Deployment Checklist

Status: candidate checklist. Do not deploy or broadcast transactions without explicit approval.

## Scope Gate

- Confirm Sepolia V1 remains the historical canonical deployment.
- Confirm V2 remains non-canonical unless a separate promotion decision updates `deployments/canonical.json`.
- Confirm public text says TIDE is not offered for sale, has no stated monetary value, is not on mainnet, and is not independently audited.

## Configuration Gate

- Set `CONFIRM_NON_CANONICAL_V2_DEPLOY=true` only for an approved candidate deployment.
- Set `V2_DEFAULT_ADMIN_ADDRESS`.
- Set `V2_PAUSER_ADDRESS`.
- Set `V2_REPORTER_ADDRESS`.
- Set `V2_VESTING_ADMIN_ADDRESS`.
- Set `V2_TREASURY_ADDRESS`.
- Set `V2_DEFAULT_ADMIN_DELAY_SECONDS`.
- Set neutral `PROJECT_NAME`.
- Set bounded `BUSINESS_ENTITY`.
- Set bounded `PROJECT_JURISDICTION`.
- Set bounded `PROJECT_URI`.
- Confirm no privileged address is accidentally the deployer.
- Confirm any intentional shared role address is documented before deployment.

## Local Verification Gate

```bash
npm ci
npm run compile
npm test
npm run lint
npm run audit
```

## Deployment Artifact Gate

- Save `deployments/<network>-v2.json`.
- Save `deployments/<network>-v2-roles.json`.
- Check role manifest schema `tikideco.v2.role-manifest/1`.
- Check token `DEFAULT_ADMIN_ROLE`, `PAUSER_ROLE`, and `REPORTER_ROLE`.
- Check vault `DEFAULT_ADMIN_ROLE` and `VESTING_ADMIN_ROLE`.
- Check deployer has no unintended privileged role.
- Check `MAX_SUPPLY` equals total supply and treasury balance.
- Check no post-constructor mint function exists in V2 token ABI.

## Communication Gate

- Do not call V2 canonical until promotion is explicitly approved.
- Do not imply sale, value, mainnet deployment, completed property, partnership, or independent audit.
- Publish a candidate transparency note only after source verification and role manifest review.

