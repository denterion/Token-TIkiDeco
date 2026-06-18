# TikiDeco V2 Candidate Invariants

Status: internal review invariant list. V2 is a candidate and is not independently audited.

## Token Invariants

| Invariant | Current test reference |
| --- | --- |
| Total supply is fixed after construction. | `test/TikiDecoInvariants.js` supply test. |
| Total supply always equals `MAX_SUPPLY` under arbitrary token handler sequences. | `foundry/TikiDecoTokenV2Invariant.t.sol`. |
| No public mint path exists after constructor. | `foundry/TikiDecoTokenV2Invariant.t.sol`; contract structure and fixed supply tests. |
| Standard OpenZeppelin allowance semantics are preserved. | `test/TikiDecoTokenV2.js`. |
| Maximum allowance is preserved during `transferFrom`. | `test/TikiDecoTokenV2.js`. |
| Zero-value and self-transfers work. | `test/TikiDecoTokenV2.js`. |
| Paused token blocks transfer and transferFrom. | `test/TikiDecoTokenV2.js`. |
| Unpause restores transfer and transferFrom. | `foundry/TikiDecoTokenV2Invariant.t.sol`. |
| Only pauser can pause/unpause. | `test/TikiDecoInvariants.js`; `foundry/TikiDecoTokenV2Invariant.t.sol`. |
| Only reporter can publish reports. | `test/TikiDecoInvariants.js`; `foundry/TikiDecoTokenV2Invariant.t.sol`. |
| Only default admin can update project metadata. | `foundry/TikiDecoTokenV2Invariant.t.sol`. |
| Unauthorized accounts cannot change roles. | `foundry/TikiDecoTokenV2Invariant.t.sol`. |

## Vault Invariants

| Invariant | Current test reference |
| --- | --- |
| Vault liabilities do not exceed held balance after representative operations. | `test/TikiDecoInvariants.js`. |
| Vault liabilities do not exceed held balance after arbitrary valid operations. | `foundry/TikiDecoVestingVaultV2Invariant.t.sol`. |
| Schedules cannot reserve more than unreserved prefunded balance. | `test/TikiDecoVestingVaultV2.js`; `foundry/TikiDecoVestingVaultV2Invariant.t.sol`. |
| Released amount never exceeds total schedule amount. | `foundry/TikiDecoVestingVaultV2Invariant.t.sol`. |
| Releasable never exceeds remaining schedule balance. | `foundry/TikiDecoVestingVaultV2Invariant.t.sol`. |
| Beneficiary never receives more than the schedule total in invariant schedules. | `foundry/TikiDecoVestingVaultV2Invariant.t.sol`. |
| Revoked schedule cannot release again or be revoked again. | `test/TikiDecoInvariants.js`; `foundry/TikiDecoVestingVaultV2Invariant.t.sol`. |
| Non-revocable schedules cannot be revoked. | `foundry/TikiDecoVestingVaultV2Invariant.t.sol`. |
| Unvested revocation refund goes only to treasury. | `test/TikiDecoVestingVaultV2.js`; `foundry/TikiDecoVestingVaultV2Invariant.t.sol`. |
| Release transfers only to beneficiary. | `foundry/TikiDecoVestingVaultV2Invariant.t.sol`. |
| Release during token pause reverts. | `test/TikiDecoVestingVaultV2.js`. |
| Treasury transfer is two-step and cancellable. | `test/TikiDecoVestingVaultV2.js`. |
| Only vesting admin can create and revoke schedules. | `test/TikiDecoInvariants.js`. |
| Accounting remains consistent after create, release, revoke, and treasury-transfer sequences. | `foundry/TikiDecoVestingVaultV2Invariant.t.sol`. |

## Boundary Tests

Foundry deterministic boundary coverage is in `foundry/TikiDecoVestingVaultV2Invariant.t.sol` and covers:

- `start - 1`
- `start`
- `cliffEnd - 1`
- `cliffEnd`
- `cliffEnd + 1`
- `vestingEnd - 1`
- `vestingEnd`
- `vestingEnd + 1`
- zero cliff
- maximum supported timestamps
- partial releases
- revoke before cliff
- revoke during vesting
- revoke after vesting
- pause during an active schedule

## Remaining Recommended Invariants

- Assert `token.balanceOf(vault) + externally transferred out amount` is consistent with liability accounting assumptions.
- Assert all report supersede ids form an acyclic reference chain by policy, even if not enforced on-chain.
- Assert role admin changes are exercised only by expected Safe in deployment rehearsals.
