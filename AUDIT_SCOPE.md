# TikiDeco Internal Review Scope

V2 code freeze baseline: `58806906a273a95c58944d892eb368fc1b758620`

Current package/source commit: `e74c85612e745f14aa92260bf8b3633f9fd9fa4a`

Branch reviewed: `main`

Review status: internal review preparation. TikiDeco V2 remains a candidate and is not independently audited.

Published Sepolia prototype release: `v0.1.0-sepolia` at `e07471936375ffbe13c68da2708b4436931392a2`.

Scope note: the post-release commits through `58806906a273a95c58944d892eb368fc1b758620` add public-site localization, community preview materials, issue triage, and the V2 audit-target freeze documentation. Later merge/package commits through `e74c85612e745f14aa92260bf8b3633f9fd9fa4a` do not modify V1 deployed semantics, V2 candidate contract semantics, canonical deployment addresses, or release-package contract artifacts. Those later commits update release-process documentation, dependency triage, Foundry local-runtime handling, and CI-maintenance evidence.

For an external review package, use the exact package/source commit supplied to `npm run release:package -- --commit <sha>`. Treat the V2 code freeze baseline as the candidate contract baseline and the package/source commit as the reproducibility anchor for documentation, CI evidence, and generated review artifacts.

V2 audit-target freeze notes: [`docs/V2_AUDIT_TARGET_FREEZE.md`](docs/V2_AUDIT_TARGET_FREEZE.md).

## Primary V2 Contracts In Scope

| Contract | Scope |
| --- | --- |
| `contracts/TikiDecoTokenV2.sol` | OpenZeppelin ERC-20 candidate, role-gated pause/report functions, report metadata, fixed supply mint to treasury. |
| `contracts/TikiDecoVestingVaultV2.sol` | Candidate prefunded vesting vault, cliff/linear vesting, release, revoke, treasury transfer, liabilities accounting. |

## Deployment Scripts In Scope

| File | Scope |
| --- | --- |
| `scripts/deploy-v2.cjs` | Candidate V2 deployment guard, constructor args, deployment record writing. |
| `scripts/check-deployment-manifest.cjs` | Canonical V1 manifest consistency guard. |
| `scripts/build-site-manifest.cjs` | Public website manifest generation from canonical manifest. |
| `scripts/check-site-content.cjs` | Public website content and custom-domain checks. |
| `scripts/check-bytecode-size.cjs` | Bytecode size gate for V1 and V2 contracts. |

## Role And Treasury Configuration

`TikiDecoTokenV2`:

- `DEFAULT_ADMIN_ROLE`: explicit `defaultAdmin` constructor argument, managed by `AccessControlDefaultAdminRules`.
- `PAUSER_ROLE`: explicit `pauser` constructor argument.
- `REPORTER_ROLE`: explicit `reporter` constructor argument.
- Treasury receives `100,000,000 TIDE` at construction.

`TikiDecoVestingVaultV2`:

- `DEFAULT_ADMIN_ROLE`: explicit `defaultAdmin` constructor argument, managed by `AccessControlDefaultAdminRules`.
- `VESTING_ADMIN_ROLE`: explicit `vestingAdmin` constructor argument.
- Treasury is constructor-defined and can be transferred through a two-step pending treasury flow.
- Vault uses a prefunded model: treasury or another holder must transfer TIDE to the vault before schedules are created.

## Legacy V1 Compatibility Scope

The deployed Sepolia V1 contracts are historical canonical contracts. This review does not modify V1 deployed bytecode, V1 source semantics, canonical V1 addresses, or V1 deployment history.

Compatibility scope is limited to:

- ensuring public docs do not present V1 as upgraded;
- preserving `deployments/canonical.json` as the V1 historical source of truth;
- ensuring V2 remains marked as non-canonical candidate code.

## Explicit Exclusions

- Mainnet deployment.
- Sepolia transactions or contract broadcasts.
- Private keys, RPC secrets, or signer collection.
- Legal opinion or regulatory determination.
- Independent smart-contract audit.
- Hotel ownership, revenue rights, investment returns, partnerships, exchange listings, active benefits, or completed property claims.
- Modifying canonical Sepolia V1 addresses.

## Compiler And Optimizer Configuration

Source: `hardhat.config.js`

| Setting | Value |
| --- | --- |
| Solidity | `0.8.28` |
| EVM target | `paris` |
| Optimizer | enabled |
| Optimizer runs | `200` |
| Test timeout | `60_000` ms |

## External Dependencies

Runtime dependency:

- `@openzeppelin/contracts` `5.6.1`

Development dependencies:

- `hardhat` `3.9.0`
- `@nomicfoundation/hardhat-ethers` `4.0.13`
- `@nomicfoundation/hardhat-ethers-chai-matchers` `3.0.10`
- `@nomicfoundation/hardhat-mocha` `3.0.21`
- `chai` `6.2.2`
- `dotenv` `17.4.2`
- `mocha` `11.7.6`
- `typescript` `6.0.3`
- `vite` `7.3.5`

Additional CI tooling:

- Slither via `pipx install slither-analyzer`.
- Gitleaks GitHub Action.
- npm audit.
