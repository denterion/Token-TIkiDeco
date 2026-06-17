# OpenZeppelin V2 Track

This document describes the OpenZeppelin-based V2 candidate implementation for TikiDeco / TIDE.

V2 is non-canonical. It is not a replacement for the currently deployed Sepolia contracts until it is reviewed, deployed, verified, and explicitly published as the active version in `deployments/canonical.json`.

## What Changed

| Area | V1 | V2 |
| --- | --- | --- |
| ERC-20 base | Local implementation | OpenZeppelin `ERC20` |
| Ownership | Local two-step owner | OpenZeppelin `Ownable2Step` |
| Pause logic | Local pause flag | OpenZeppelin `Pausable` |
| Vesting token calls | Local safe wrapper | OpenZeppelin `SafeERC20` |
| Reentrancy guard | Local guard | OpenZeppelin `ReentrancyGuard` |

## V2 Contracts

| Contract | Purpose |
| --- | --- |
| `contracts/TikiDecoTokenV2.sol` | Fixed-supply TIDE token with OpenZeppelin ERC-20 primitives, two-step ownership, pause controls, zero-first approve hardening, and transparency report publishing. |
| `contracts/TikiDecoVestingVaultV2.sol` | Vesting vault using OpenZeppelin SafeERC20, Ownable2Step, ReentrancyGuard, and explicit `cliffDuration` plus `vestingDuration`. |

## Preserved Behavior

V2 keeps the important project-level behavior:

- fixed `100,000,000 TIDE` supply
- no public mint function
- separated owner and treasury at deployment
- two-step ownership transfer
- explicit cancel path for pending ownership
- pause/unpause owner controls
- zero-first direct `approve()` hardening
- `increaseAllowance()` and `decreaseAllowance()` helpers
- report hash publishing
- explicit cliff duration and post-cliff linear vesting duration
- revocable schedules with beneficiary/refund split
- native ETH rejection

## Known Differences

OpenZeppelin v5 uses standardized custom errors, so some revert names differ from V1. Examples:

- paused transfers revert with `EnforcedPause`
- non-owner calls revert with `OwnableUnauthorizedAccount`
- insufficient allowance in V2 uses `ERC20InsufficientAllowance`

This is expected and improves compatibility with OpenZeppelin tooling and audits.

V2 also changes vesting semantics to remove ambiguity:

- before `start + cliffDuration`, vested amount is `0`
- after the cliff, vesting is linear over `vestingDuration`
- full vesting occurs at `start + cliffDuration + vestingDuration`

## Verify Locally

```bash
npm run compile
npm test
```

Expected current result:

```text
36 passing
```

## Local V2 Deploy

```bash
npm run deploy:v2:localhost
```

This writes:

```text
deployments/local-v2.json
```

## Sepolia V2 Deploy

Only deploy V2 to Sepolia after reviewing the diff and confirming owner/treasury addresses.

```bash
npm run sepolia:check
CONFIRM_NON_CANONICAL_V2_DEPLOY=true npm run deploy:v2:sepolia
```

This writes:

```text
deployments/sepolia-v2.json
```

## Mainnet Gate

Do not treat V2 as mainnet-ready until:

- Safe ownership is active
- treasury policy is finalized
- V2 receives a focused security review
- V2 source is verified on Etherscan
- public docs clearly distinguish V1 testnet from V2 testnet
- legal review approves the exact utility and communications plan
