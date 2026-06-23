# Safe Proposal: V1 Project URI Update

Status: executed on Ethereum Sepolia. This document records a Safe transaction that was manually reviewed and executed by Safe signer flow; it does not use private keys and does not modify V1 source code.

## Purpose

Update the mutable V1 `projectURI` value from the historical placeholder URI to the approved public project-status page:

`https://tikideco.xyz/legal/project-status/`

This does not disguise historical metadata. Immutable V1 metadata remains historical V1 state and should be presented as such.

## Exact Transaction

| Field | Value |
| --- | --- |
| Chain ID | `11155111` |
| Network | Ethereum Sepolia |
| Safe | `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3` |
| Target contract | `TikiDecoToken` |
| Target address | `0xE4c1DE533440b411Be5C17883FF662e95a462097` |
| Function signature | `updateProjectURI(string)` |
| Function selector | `0x2b313ab8` |
| Value | `0` |
| Expected current value | `https://tikideco.example/project` |
| Proposed new value | `https://tikideco.xyz/legal/project-status/` |
| Execution transaction | `0xcb344831fbda491e31e373e1a184eb101710de91b679e3b1dedf2fafaf64d811` |
| Execution block | `11093006` |
| Executed at | `2026-06-19T08:20:24.000Z` |
| Transaction Builder JSON | [`ops/safe/sepolia-update-project-uri-project-status.json`](../ops/safe/sepolia-update-project-uri-project-status.json) |

Encoded calldata:

```text
0x2b313ab80000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002a68747470733a2f2f74696b696465636f2e78797a2f6c6567616c2f70726f6a6563742d7374617475732f00000000000000000000000000000000000000000000
```

## Related Public Document Hash

Public page source: [`site/legal/project-status/index.html`](../site/legal/project-status/index.html)

SHA-256:

```text
e1783c53f1cdd9060cd7db3bf9191eab5ebdf2680d5ea846f2c2548aceee12aa
```

Repository facts source: [`docs/PROJECT_FACTS.md`](PROJECT_FACTS.md)

SHA-256:

```text
121ebe163e0b7f29610ba04e8eba8c9dfb713d67c3b2dc1243b85b1e2370b752
```

## Simulation Instructions

Use Safe on Sepolia only:

1. Open the TikiDeco Safe: `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3`.
2. Confirm the selected network is Ethereum Sepolia, chain ID `11155111`.
3. Use Transaction Builder and import [`ops/safe/sepolia-update-project-uri-project-status.json`](../ops/safe/sepolia-update-project-uri-project-status.json).
4. Confirm the transaction target is exactly `0xE4c1DE533440b411Be5C17883FF662e95a462097`.
5. Confirm the decoded method is `updateProjectURI(string)` and the new URI is exactly `https://tikideco.xyz/legal/project-status/`.
6. Confirm `value` is `0`.
7. Run Safe simulation. Do not sign if simulation reports a different target, different calldata, non-zero value, wrong network, or unexpected ownership state.

Read-only local simulation alternative:

```bash
npm run sepolia:state
```

Use this only for read-only checks. Do not provide private keys.

## State Checks Before Execution

Perform all checks before signing:

| Check | Expected |
| --- | --- |
| `chainId` | `11155111` |
| `TikiDecoToken.owner()` | `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3` |
| Safe threshold | `3-of-3` |
| Transaction target | `0xE4c1DE533440b411Be5C17883FF662e95a462097` |
| Transaction value | `0` |
| Decoded function | `updateProjectURI(string)` |
| `projectURI()` | `https://tikideco.example/project` |
| `projectName()` | Historical V1 value: `TikiDeco Miami Beach Hotel` |
| `businessEntity()` | Historical V1 value: `TikiDeco project company / SPV to be formed` |
| `projectJurisdiction()` | Historical V1 value: `Florida, USA` |

## State Checks After Execution

After the Safe transaction was executed:

| Check | Expected |
| --- | --- |
| Transaction status | Success on Sepolia |
| Emitted event | `ProjectURIUpdated(previousURI, newURI)` |
| `projectURI()` | `https://tikideco.xyz/legal/project-status/` |
| `owner()` | Still `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3` |
| `paused()` | `false` in the post-execution read-only check |
| `totalSupply()` | Unchanged |
| `reportsCount()` | Unchanged by this URI update |

Post-execution transaction hash:

```text
0xcb344831fbda491e31e373e1a184eb101710de91b679e3b1dedf2fafaf64d811
```

## Rollback Or Correction Procedure

V1 has no historical metadata rewrite mechanism. If the URI update is incorrect:

1. Do not attempt to conceal the incorrect value.
2. Prepare a new Safe proposal calling `updateProjectURI(string)` with the corrected URI.
3. Publish a transparency report explaining the incorrect URI, corrected URI, transaction hash, and reason for correction.
4. Keep both transactions visible in public records.

## Human-Readable Safe Signer Explanation

This transaction updates only the mutable V1 `projectURI` field on the Sepolia `TikiDecoToken` contract. It does not transfer tokens, does not spend ETH, does not change ownership, does not change supply, does not change the treasury, and does not modify immutable historical V1 metadata. The new URI points to the public project-status page on `tikideco.xyz`, which states the Sepolia prototype, no-sale, no-mainnet, no-value, no-independent-audit, and no-financial-rights boundaries.

## Immutable V1 Metadata Fields

These V1 metadata fields cannot be corrected on-chain through the deployed V1 interface:

| Field | Historical V1 value | Why immutable for V1 operations |
| --- | --- | --- |
| `name` | `TikiDeco` | Solidity `public constant`; no setter. |
| `symbol` | `TIDE` | Solidity `public constant`; no setter. |
| `decimals` | `18` | Solidity `public constant`; no setter. |
| `MAX_SUPPLY` | `100,000,000 TIDE` | Solidity `public constant`; no mint path after constructor. |
| `projectName` | `TikiDeco Miami Beach Hotel` | Storage value set in constructor; no external setter in V1. |
| `businessEntity` | `TikiDeco project company / SPV to be formed` | Constructor metadata; no external setter in V1. |
| `projectJurisdiction` | `Florida, USA` | Constructor metadata; no external setter in V1. |

Mutable V1 metadata:

| Field | Current expected value | Mutable function |
| --- | --- | --- |
| `projectURI` | `https://tikideco.example/project` | `updateProjectURI(string)` |

## Transparency Report Draft

Title: V1 Project URI Correction To Public Project-Status Page

Summary:

The TikiDeco Safe prepared a Sepolia transaction to update the mutable V1 `projectURI` field from the historical placeholder `https://tikideco.example/project` to `https://tikideco.xyz/legal/project-status/`.

Scope:

- Chain: Ethereum Sepolia, chain ID `11155111`
- Contract: `TikiDecoToken` at `0xE4c1DE533440b411Be5C17883FF662e95a462097`
- Function: `updateProjectURI(string)`
- Value: `0`
- New URI: `https://tikideco.xyz/legal/project-status/`

What changed:

Only the mutable `projectURI` field changed.

What did not change:

Token supply, token balances, owner Safe, treasury, pause state, report count, and immutable V1 metadata did not change.

Historical metadata note:

The V1 `projectName`, `businessEntity`, and `projectJurisdiction` values remain historical V1 facts. They are not disguised or rewritten by this URI update.

Status boundary:

TikiDeco / TIDE remains an Ethereum Sepolia prototype. TIDE is not offered for sale, has no stated monetary value, is not deployed on mainnet, has not completed an independent audit, and does not provide equity, debt, revenue, property, or return rights. Hospitality functionality remains conceptual or planned unless separately verified.
