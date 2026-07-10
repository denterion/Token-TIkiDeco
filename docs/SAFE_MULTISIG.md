# Safe Multisig Handover Runbook

This runbook records how TikiDeco / TIDE Sepolia owner powers were moved from a single wallet to a Safe multisig.

Current threshold tradeoffs and recovery blockers are recorded in [`governance/SAFE_RESILIENCE_DECISION.md`](governance/SAFE_RESILIENCE_DECISION.md). The accompanying incident exercise uses test-only data and does not change the Safe.

It is an operational security document, not legal advice and not a production governance charter.

## Current Sepolia Target

| Item | Address |
| --- | --- |
| Safe multisig | `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3` |
| Current owner Safe | `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3` |
| Previous owner wallet | `0xA9a4f99D5902850D3a6Afcd59838110D26B101E4` |
| TikiDecoToken | `0xE4c1DE533440b411Be5C17883FF662e95a462097` |
| TikiDecoVestingVault | `0xc480565482af6B08A3b65D0C9aba985d6240702E` |
| Safe threshold | `3-of-3` |

## Why This Matters

Moving owner powers to Safe makes admin control more disciplined:

- no single deployer wallet should be the long-term controller
- ownership changes are explicit and auditable
- owner actions can require multiple approvals
- Safe transactions produce a public operational trail

## Recommended Safe Policy

For Sepolia testing:

- `1 of 2` is acceptable for quick testing
- `2 of 3` is a stronger public signal

For serious pre-mainnet or mainnet planning:

- use at least `3 of 5`
- separate owner Safe and treasury Safe if possible
- document all signers and emergency procedures privately

## Completed Two-Step Ownership Flow

The contracts use `Ownable2Step`, so ownership is moved in two phases:

1. Current owner calls `transferOwnership(SAFE_ADDRESS)` on both contracts.
2. Safe calls `acceptOwnership()` on both contracts.

Ownership is not transferred until phase 2 is complete.

Sepolia completion record:

| Step | Transaction |
| --- | --- |
| Token `transferOwnership(Safe)` | `0xb573c39c9b510e8694164609587d586dabe73f30149f366aeadcfb6f9fb802ed` |
| Vault `transferOwnership(Safe)` | `0xf7478537ba264dd7c145e3619cc4c2cc7751084216c64a6b7337a06b613401ca` |
| Safe activation | `0x8015cb2e0ea0a871c3b4a606ba2ba435714f70a6ae20529277504fe7b3e8d96d` |
| Safe `acceptOwnership()` batch | `0x1ddab2941e8d5fc1a550e1a67db05e1d4f57d6705e5bf3f3e1dbfcd9534c145e` |

## Generate Handover Files

Generate exact transaction data:

```bash
SAFE_ADDRESS=0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3 npm run safe:handover:sepolia
```

On Windows PowerShell:

```powershell
$env:SAFE_ADDRESS='0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3'
npm run safe:handover:sepolia
```

This creates:

| File | Purpose |
| --- | --- |
| `operations/sepolia-owner-propose-safe-ownership.json` | Transaction data for the current owner wallet. |
| `operations/sepolia-safe-accept-ownership.json` | Safe Transaction Builder batch for `acceptOwnership()`. |

## Phase 1: Current Owner Proposes Safe

Completed on Sepolia. For future deployments, the current owner wallet must call `transferOwnership(SAFE_ADDRESS)` on:

1. `TikiDecoToken`
2. `TikiDecoVestingVault`

Preferred path:

```powershell
$env:NEW_OWNER_ADDRESS='0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3'
npm run ownership:propose:sepolia
```

This only works when the local signer is the current owner wallet.

If the local signer is not the current owner, use the calldata from `operations/sepolia-owner-propose-safe-ownership.json` in Etherscan or another wallet tool connected to the current owner.

## Phase 2: Safe Accepts Ownership

Completed on Sepolia. For future deployments, open [Safe](https://app.safe.global/) on Sepolia, then use Transaction Builder to import:

```text
operations/sepolia-safe-accept-ownership.json
```

Review that the batch calls `acceptOwnership()` on both contracts:

```text
0xE4c1DE533440b411Be5C17883FF662e95a462097
0xc480565482af6B08A3b65D0C9aba985d6240702E
```

Submit, collect required confirmations, and execute the Safe transaction.

## Final Verification

After phase 2, or anytime the public owner state needs verification:

```bash
npm run owner:check:sepolia
```

Expected result:

```text
Token owner: 0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3
Vault owner: 0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3
Token pending owner: 0x0000000000000000000000000000000000000000
Vault pending owner: 0x0000000000000000000000000000000000000000
```

## Do Not

- Do not paste private keys into chat.
- Do not move ownership to a Safe on the wrong network.
- Do not call `acceptOwnership()` before both contracts show the Safe as pending owner on future deployments.
- Do not use the deployer wallet as a long-term admin wallet.
