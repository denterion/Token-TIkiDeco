# TikiDeco V2 Access Control

This document describes role separation in the non-canonical OpenZeppelin V2 candidate contracts.

The current Sepolia deployment remains `v1-legacy`. V2 is candidate code and is not the active Sepolia deployment unless a future `deployments/canonical.json` update explicitly promotes it.

## OpenZeppelin Base

V2 uses official OpenZeppelin Contracts primitives:

- `AccessControlDefaultAdminRules`
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
| Default admin | `DEFAULT_ADMIN_ROLE` | Grants and revokes token roles; updates project URI. Managed by OpenZeppelin delayed default-admin transfer rules. |
| Pauser | `PAUSER_ROLE` | Calls `pause()` and `unpause()`. |
| Reporter | `REPORTER_ROLE` | Calls `publishReport(...)`. |

The token has no mint role and no public mint function. Supply remains fixed at `100,000,000 TIDE`.

V2 constructor configuration now separates `defaultAdmin`, `pauser`, `reporter`, and `treasury`. `projectName`, `businessEntity`, `projectJurisdiction`, and `projectURI` are constructor metadata fields and must be non-empty and bounded. `projectName` should remain neutral; it must not imply a completed property, sale, partnership, or financial right.

The token admin transfer delay is configured by `V2_DEFAULT_ADMIN_DELAY_SECONDS` during deployment. The default example is `86400` seconds. A default-admin transfer must be started with `beginDefaultAdminTransfer(newAdmin)` and accepted by the pending admin after the delay with `acceptDefaultAdminTransfer()`.

## Pause Policy

V2 uses token-level emergency pause as a global transfer stop.

When the token is paused:

- direct `transfer(...)` reverts
- `transferFrom(...)` reverts
- vesting vault `release(...)` reverts because release performs a token transfer from the vault to the beneficiary
- vesting accounting views remain readable

This model favors incident containment over uninterrupted vesting claims. A pause can temporarily delay beneficiary releases, so pauser authority should sit behind a documented Safe process and every pause/unpause should be explained in a transparency report.

## Vesting Vault Roles

Contract:

`contracts/TikiDecoVestingVaultV2.sol`

| Role | Identifier | Powers |
| --- | --- | --- |
| Default admin | `DEFAULT_ADMIN_ROLE` | Grants and revokes vault roles; starts or cancels two-step treasury transfer. Managed by OpenZeppelin delayed default-admin transfer rules. |
| Vesting admin | `VESTING_ADMIN_ROLE` | Creates vesting schedules; releases on behalf of beneficiaries; revokes revocable schedules. |

V2 vault constructor configuration separates `defaultAdmin`, `vestingAdmin`, and `treasury`. The default admin should not be assumed to be the vesting admin unless an explicit reviewed configuration intentionally uses the same address.

## V2 Deployment Role Configuration

The non-canonical V2 deployment script uses these variables:

| Variable | Purpose |
| --- | --- |
| `V2_DEFAULT_ADMIN_ADDRESS` | Default admin for both V2 token and V2 vault. |
| `V2_PAUSER_ADDRESS` | Token pause/unpause operator. |
| `V2_REPORTER_ADDRESS` | Report publication operator. |
| `V2_VESTING_ADMIN_ADDRESS` | Vesting schedule and revoke operator. |
| `V2_TREASURY_ADDRESS` | Initial fixed-supply receiver and vault refund treasury. |
| `V2_DEFAULT_ADMIN_DELAY_SECONDS` | Delay for OpenZeppelin default-admin transfer acceptance. |

On `hardhat` and `localhost`, the script uses separate local signer defaults for dry-runs. On any non-local network, it fails closed unless every V2 role address is supplied and `CONFIRM_NON_CANONICAL_V2_DEPLOY=true`.

After deployment, the script asserts on-chain role ownership and fails if the deployer retains an unexpected privileged role. It also writes a role manifest next to the deployment artifact.

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
- pause/unpause operations should include a written incident note or transparency report
- treasury changes should be documented before execution
- role grants and revocations should be included in transparency reports
