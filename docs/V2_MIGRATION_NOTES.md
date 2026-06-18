# TikiDeco V2 Migration Notes

Status: candidate migration notes. V2 is not canonical and is not independently audited.

## What Changed

- `TikiDecoTokenV2` no longer hardcodes a project name.
- V2 token constructor accepts a neutral `projectName`.
- V2 token validates `projectName`, `businessEntity`, `projectJurisdiction`, and `projectURI` as bounded non-empty strings.
- `updateProjectURI` now validates non-empty bounded input.
- V2 token still has fixed `MAX_SUPPLY` and no post-constructor mint path.
- V2 token and vault now use OpenZeppelin `AccessControlDefaultAdminRules`.
- Default admin transfer is two-step and delayed by `V2_DEFAULT_ADMIN_DELAY_SECONDS`.
- Deployment configuration separates:
  - default admin;
  - pauser;
  - reporter;
  - vesting admin;
  - treasury.
- Public-network V2 deployment fails closed unless every privileged address is explicit.
- V2 deployment generates a role manifest and asserts roles on-chain.
- V2 deployment checks that the deployer has no unexpected privileged role.

## Constructor Compatibility

These are V2 candidate ABI changes only. They do not change deployed V1 contract semantics.

`TikiDecoTokenV2` constructor now expects:

```text
defaultAdmin,
pauser,
reporter,
treasury,
initialProjectName,
initialBusinessEntity,
initialProjectJurisdiction,
initialProjectURI,
defaultAdminDelay
```

`TikiDecoVestingVaultV2` constructor now expects:

```text
tokenAddress,
defaultAdmin,
vestingAdmin,
initialTreasury,
defaultAdminDelay
```

## Operational Notes

- Existing Sepolia V1 remains the historical canonical deployment.
- V2 candidate deployments should be treated as experimental unless explicitly promoted later.
- Role manifests should be reviewed together with deployment artifacts.
- A Safe or equivalent governance process should hold default admin in any serious candidate deployment.
- Pauser, reporter, and vesting admin can be delegated, but each delegation should be documented.

