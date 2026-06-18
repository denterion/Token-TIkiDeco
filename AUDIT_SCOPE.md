# TikiDeco Internal Review Scope

Review target commit: `355b751111112d551eda735c3fdb63b43220fc11`

Branch reviewed: `main`

Review status: internal review preparation. TikiDeco V2 remains a candidate and is not independently audited.

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

- `DEFAULT_ADMIN_ROLE`: initial owner passed to constructor.
- `PAUSER_ROLE`: initial owner.
- `REPORTER_ROLE`: initial owner.
- Treasury receives `100,000,000 TIDE` at construction.

`TikiDecoVestingVaultV2`:

- `DEFAULT_ADMIN_ROLE`: initial admin.
- `VESTING_ADMIN_ROLE`: initial admin.
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
- `chai` `5.3.3`
- `dotenv` `16.6.1`
- `mocha` `11.7.5`

Additional CI tooling:

- Slither via `pipx install slither-analyzer`.
- Gitleaks GitHub Action.
- npm audit.

