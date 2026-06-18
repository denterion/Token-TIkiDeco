# TikiDeco V2 Candidate Invariants

Status: internal review invariant list. V2 is a candidate and is not independently audited.

## Token Invariants

| Invariant | Current test reference |
| --- | --- |
| Total supply is fixed after construction. | `test/TikiDecoInvariants.js` supply test. |
| No public mint path exists after constructor. | Contract structure and fixed supply tests. |
| Standard OpenZeppelin allowance semantics are preserved. | `test/TikiDecoTokenV2.js`. |
| Maximum allowance is preserved during `transferFrom`. | `test/TikiDecoTokenV2.js`. |
| Zero-value and self-transfers work. | `test/TikiDecoTokenV2.js`. |
| Paused token blocks transfer and transferFrom. | `test/TikiDecoTokenV2.js`. |
| Only pauser can pause/unpause. | `test/TikiDecoInvariants.js`. |
| Only reporter can publish reports. | `test/TikiDecoInvariants.js`. |

## Vault Invariants

| Invariant | Current test reference |
| --- | --- |
| Vault liabilities do not exceed held balance after representative operations. | `test/TikiDecoInvariants.js`. |
| Schedules cannot reserve more than unreserved prefunded balance. | `test/TikiDecoVestingVaultV2.js`. |
| Released amount never exceeds vested amount after representative release. | `test/TikiDecoInvariants.js`. |
| Revoked schedule cannot release again. | `test/TikiDecoInvariants.js`. |
| Unvested revocation refund goes only to treasury. | `test/TikiDecoVestingVaultV2.js`. |
| Release during token pause reverts. | `test/TikiDecoVestingVaultV2.js`. |
| Treasury transfer is two-step and cancellable. | `test/TikiDecoVestingVaultV2.js`. |
| Only vesting admin can create and revoke schedules. | `test/TikiDecoInvariants.js`. |

## Additional Recommended Invariants

- Fuzz schedule creation/revocation/release sequences over multiple beneficiaries.
- Assert `token.balanceOf(vault) + externally transferred out amount` is consistent with liability accounting assumptions.
- Assert all report supersede ids form an acyclic reference chain by policy, even if not enforced on-chain.
- Assert role admin changes are exercised only by expected Safe in deployment rehearsals.

