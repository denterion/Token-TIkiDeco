# TikiDeco V2 Access Control

This document describes role separation in the non-canonical OpenZeppelin V2 candidate contracts.

The current Sepolia deployment remains `v1-legacy`. V2 is candidate code and is not the active Sepolia deployment unless a future `deployments/canonical.json` update explicitly promotes it.

## OpenZeppelin Base

V2 uses official OpenZeppelin Contracts primitives:

- `AccessControl`
- `ERC20`
- `Pausable`
- `SafeERC20`
- `ReentrancyGuard`

Do not copy OpenZeppelin library code into this repository unless there is a clear audit-reviewed reason.

## Token Roles

Contract:

`contracts/TikiDecoTokenV2.sol`

| Role | Identifier | Powers |
| --- | --- | --- |
| Admin | `DEFAULT_ADMIN_ROLE` | Grants and revokes token roles; updates project URI. |
| Pauser | `PAUSER_ROLE` | Calls `pause()` and `unpause()`. |
| Reporter | `REPORTER_ROLE` | Calls `publishReport(...)`. |

The token has no mint role and no public mint function. Supply remains fixed at `100,000,000 TIDE`.

## Vesting Vault Roles

Contract:

`contracts/TikiDecoVestingVaultV2.sol`

| Role | Identifier | Powers |
| --- | --- | --- |
| Admin | `DEFAULT_ADMIN_ROLE` | Grants and revokes vault roles; starts or cancels two-step treasury transfer. |
| Vesting admin | `VESTING_ADMIN_ROLE` | Creates vesting schedules; releases on behalf of beneficiaries; revokes revocable schedules. |

## Treasury Policy

V2 uses a prefunded vault model:

1. Treasury transfers tokens to the vesting vault.
2. Vesting admin creates schedules that reserve tokens already in the vault.
3. The vault tracks reserved liabilities.
4. A schedule cannot be created if it exceeds `unreservedBalance()`.
5. Releases reduce outstanding liabilities.
6. Revocation refunds only to the configured treasury.

The ordinary revoke flow does not accept an arbitrary refund address.

## Treasury Transfer

Treasury changes are two-step:

1. Admin calls `transferTreasury(newTreasury)`.
2. `newTreasury` calls `acceptTreasury()`.

Admin can cancel an in-flight treasury transfer with `cancelTreasuryTransfer()`.

## Public Accounting Views

The V2 vesting vault exposes:

- `totalReserved()`
- `totalReleased()`
- `outstandingLiabilities()`
- `unreservedBalance()`

These views are intended to make vault solvency easier to inspect.

## Recommended Production Direction

For any serious deployment:

- admin roles should be held by Safe or a timelock-controlled Safe
- pauser and reporter roles may be delegated, but should remain revocable by admin
- vesting admin should be operationally separate from treasury custody where possible
- treasury changes should be documented before execution
- role grants and revocations should be included in transparency reports
