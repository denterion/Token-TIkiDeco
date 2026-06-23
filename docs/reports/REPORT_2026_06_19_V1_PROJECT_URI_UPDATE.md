# V1 Project URI Update To Public Project-Status Page

Status: executed on Ethereum Sepolia. This is a transparency report, not a legal opinion, not an audit, and not a mainnet release notice.

## Summary

The TikiDeco Safe executed a Sepolia transaction updating the mutable V1 `projectURI` field from the historical placeholder URI to the public project-status page.

## Execution Details

| Field | Value |
| --- | --- |
| Network | Ethereum Sepolia |
| Chain ID | `11155111` |
| Token contract | `0xE4c1DE533440b411Be5C17883FF662e95a462097` |
| Owner Safe | `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3` |
| Function | `updateProjectURI(string)` |
| Transaction value | `0` |
| Transaction hash | `0xcb344831fbda491e31e373e1a184eb101710de91b679e3b1dedf2fafaf64d811` |
| Block | `11093006` |
| Executed at | `2026-06-19T08:20:24.000Z` |
| Status | Success |

## URI Change

| Field | Value |
| --- | --- |
| Previous `projectURI` | `https://tikideco.example/project` |
| New `projectURI` | `https://tikideco.xyz/legal/project-status/` |

## Verification Notes

Read-only Sepolia RPC checks after execution confirmed:

- `projectURI()` returns `https://tikideco.xyz/legal/project-status/`;
- `owner()` remains `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3`;
- `paused()` remains `false`;
- the transaction emitted `ProjectURIUpdated(previousURI, newURI)` from the token contract.

## What Changed

Only the mutable V1 `projectURI` field changed.

## What Did Not Change

The transaction did not transfer tokens, did not spend ETH from the token contract, did not change token supply, did not change the owner Safe, did not change the treasury, did not change pause state, and did not rewrite immutable V1 metadata.

## Historical V1 Metadata Note

The following V1 metadata remains historical deployed state and cannot be corrected through the deployed V1 interface:

- `projectName`: `TikiDeco Miami Beach Hotel`;
- `businessEntity`: `TikiDeco project company / SPV to be formed`;
- `projectJurisdiction`: `Florida, USA`.

This report does not disguise those historical values. It records only that the mutable URI now points to the public project-status page.

## Status Boundary

TikiDeco / TIDE remains an Ethereum Sepolia prototype. TIDE is not offered for sale, has no stated monetary value, is not deployed on mainnet, has not completed an independent audit, and does not provide equity, debt, revenue, property, or return rights. Hospitality functionality remains conceptual or planned unless separately verified.
