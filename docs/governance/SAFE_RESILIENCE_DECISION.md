# Safe Resilience Decision

Status: governance review record for the canonical Sepolia V1 Safe. No threshold or signer change is authorized or executed here.

## Current State

| Item | State |
| --- | --- |
| Safe | `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3` |
| Network | Ethereum Sepolia |
| Threshold | `3-of-3` |
| Signer identities | Not publicly verified |
| Hardware-wallet evidence | Not recorded publicly |
| Device/geographic separation | Not recorded publicly |
| Local tabletop drill | Completed with fake data on 2026-07-11; no Safe access or transaction |
| Signer recovery drill | Not completed |

## Decision

Keep the current Sepolia `3-of-3` threshold unchanged. It provides unanimity and prevents one signer from acting alone, but loss or unavailability of one signer can halt all Safe actions. That availability risk is accepted for the present legacy testnet state and must be resolved before higher-impact operations.

## Signer Expectations

- Each signer should be controlled independently; shared seed material or shared devices defeat the threshold model.
- Hardware wallets are expected for future higher-impact governance.
- Devices, backups and routine access should be separated to reduce correlated compromise.
- Signer identities and recovery data should not be published merely to satisfy this document.
- A lost or suspected-compromised signer triggers the incident procedure before any routine proposal.

## Threshold Options

| Model | Strength | Primary weakness | Current recommendation |
| --- | --- | --- | --- |
| `3-of-3` | Unanimous control | One unavailable signer halts execution | Retain for current Sepolia legacy state. |
| `2-of-3` | Tolerates one unavailable signer | Two compromised signers can act | Consider for a limited future operator pilot only after signer independence, hardware and recovery evidence. |
| `3-of-5` | Better availability with a higher collusion threshold | Requires five genuinely independent qualified signers | Preferred direction for future higher-impact operations if the operator and governance structure exist. |

No model is approved for mainnet by this comparison.

## Emergency Pause

For V1, owner-controlled emergency actions remain subject to the current Safe threshold. For V2 candidate design, `PAUSER_ROLE` is separate from default admin. Before any V2 deployment proposal, the emergency pause holder, escalation path and unpause authority must be explicitly reviewed in the role manifest.

## Recovery Decision Gate

Before changing the threshold or signers:

1. verify independent control of every proposed signer;
2. record hardware-wallet and backup expectations privately;
3. execute a test-only signer-loss drill;
4. review emergency pause continuity;
5. simulate the Safe configuration change;
6. obtain governance approval in a dated decision record;
7. publish only non-sensitive configuration facts after execution.

This document does not prepare or broadcast a Safe transaction.

Detailed evidence: [`SAFE_RESILIENCE_DRILL_2026.md`](SAFE_RESILIENCE_DRILL_2026.md). The tabletop result does not satisfy the signer recovery gate.
