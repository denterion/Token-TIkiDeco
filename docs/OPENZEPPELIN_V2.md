# OpenZeppelin V2 Track

This document describes the OpenZeppelin-based V2 candidate implementation for TikiDeco / TIDE.

V2 is non-canonical. It is not a replacement for the currently deployed Sepolia contracts until it is reviewed, deployed, verified, and explicitly published as the active version in `deployments/canonical.json`.

## What Changed

| Area | V1 | V2 |
| --- | --- | --- |
| ERC-20 base | Local implementation | OpenZeppelin `ERC20` |
| Access control | Local owner model | OpenZeppelin `AccessControlDefaultAdminRules` plus separated operational roles |
| Pause logic | Local pause flag | OpenZeppelin `Pausable` |
| Vesting token calls | Local safe wrapper | OpenZeppelin `SafeERC20` |
| Reentrancy guard | Local guard | OpenZeppelin `ReentrancyGuard` |

## V2 Contracts

| Contract | Purpose |
| --- | --- |
| `contracts/TikiDecoTokenV2.sol` | Fixed-supply TIDE token with OpenZeppelin ERC-20 primitives, role-based pause controls, and bounded transparency report publishing. |
| `contracts/TikiDecoVestingVaultV2.sol` | Vesting vault using OpenZeppelin AccessControlDefaultAdminRules, SafeERC20, ReentrancyGuard, and explicit `cliffDuration` plus `vestingDuration`. |

## Preserved Behavior

V2 keeps the important project-level behavior:

- fixed `100,000,000 TIDE` supply
- no public mint function
- separated admin and treasury at deployment
- separated V2 default admin, pauser, reporter, vesting admin, and treasury configuration
- delayed two-step default admin transfer through OpenZeppelin rules
- role-based access control for admin, pauser, reporter, and vesting admin
- two-step treasury transfer
- pause/unpause role controls
- standard OpenZeppelin ERC-20 allowance behavior
- bounded report hash publishing with period, version, and supersede metadata
- explicit cliff duration and post-cliff linear vesting duration
- revocable schedules with beneficiary/refund split
- prefunded vault accounting
- treasury-only refund on revoke
- native ETH rejection

## Known Differences

OpenZeppelin v5 uses standardized custom errors, so some revert names differ from V1. Examples:

- paused transfers revert with `EnforcedPause`
- unauthorized role calls revert with `AccessControlUnauthorizedAccount`
- insufficient allowance in V2 uses `ERC20InsufficientAllowance`

This is expected and improves compatibility with OpenZeppelin tooling and audits.

V2 intentionally removes the earlier zero-first direct `approve()` restriction. The candidate now follows standard OpenZeppelin ERC-20 behavior:

- non-zero to non-zero `approve(...)` updates are allowed
- `type(uint256).max` allowance is treated as infinite allowance by `transferFrom(...)`
- zero-value transfers and self-transfers follow standard ERC-20 behavior
- paused token transfers block direct transfers, `transferFrom(...)`, and vesting vault releases that call `safeTransfer(...)`

The allowance race condition remains a known ERC-20 user-interface risk. Wallets and frontends should recommend setting allowances to zero before increasing spender limits when that matters.

V2 also changes vesting semantics to remove ambiguity:

- before `start + cliffDuration`, vested amount is `0`
- after the cliff, vesting is linear over `vestingDuration`
- full vesting occurs at `start + cliffDuration + vestingDuration`

V2 also changes the vesting funding model:

- treasury prefunds the vault
- `createSchedule(...)` reserves existing vault balance
- `totalReserved()`, `totalReleased()`, `outstandingLiabilities()`, and `unreservedBalance()` expose accounting state
- revocation refunds unvested tokens only to the configured treasury

Role details are documented in [`ACCESS_CONTROL.md`](ACCESS_CONTROL.md).

## Report Integrity

V2 reports store only bounded metadata on-chain:

- non-zero document hash
- non-empty category, max 64 bytes
- non-empty URI, max 256 bytes
- non-empty version, max 32 bytes
- period start and end, with `periodStart <= periodEnd`
- optional `supersedesReportId` for corrections

Large reports should remain off-chain on IPFS, GitHub, or another durable public location.

## Verify Locally

```bash
npm run compile
npm test
```

Expected current result:

```text
69 passing
```

## Local V2 Deploy

```bash
npm run deploy:v2:localhost
```

This writes:

```text
deployments/local-v2.json
deployments/local-v2-roles.json
```

## Sepolia V2 Deploy

Only deploy V2 to Sepolia after reviewing the diff and confirming every V2 role and treasury address.

```bash
npm run sepolia:check
CONFIRM_NON_CANONICAL_V2_DEPLOY=true npm run deploy:v2:sepolia
```

This writes:

```text
deployments/sepolia-v2.json
deployments/sepolia-v2-roles.json
```

## Mainnet Gate

Do not treat V2 as approved for mainnet use until:

- Safe ownership is active
- treasury policy is finalized
- V2 receives a focused security review
- V2 source is verified on Etherscan
- public docs clearly distinguish V1 testnet from V2 testnet
- legal review approves the exact utility and communications plan
