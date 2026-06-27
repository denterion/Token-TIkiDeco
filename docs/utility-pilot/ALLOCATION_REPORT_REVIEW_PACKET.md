# Allocation Report Review Packet

Status: draft evidence for issue #58. This packet does not publish an allocation report, approve allocation, broadcast a Safe transaction, open a live campaign, or create active guest benefits.

Campaign ID: `tide-community-preview-001`

Template source: [`ALLOCATION_REPORT_TEMPLATE.md`](ALLOCATION_REPORT_TEMPLATE.md)

Policy source: [`TESTNET_ALLOCATION_POLICY.md`](TESTNET_ALLOCATION_POLICY.md)

## Review Objective

Make the post-campaign allocation report easy to complete without private participant data and without implying sale, monetary value, mainnet deployment, active guest benefits, or independent audit completion.

## Required Report Sections

| Section | Required content |
| --- | --- |
| Campaign | Campaign ID, report date, chain ID, canonical token, snapshot or live-check mode |
| Published rules | Rules URI, request window, dispute window, inventory limit, allocation method |
| Request totals | Total requests, total wallets, duplicate-wallet rejections, below-threshold rejections |
| Allocation outcome | Total testnet TIDE allocated, allocated pilot slots if any, cancellations, corrections |
| Privacy notes | No private participant data statement |
| Safety notes | No private keys, transaction signing, approvals, transfers, fees, booking confirmation, sale, or mainnet flow |
| Hashes | Document SHA-256, optional on-chain report hash, Safe Transaction Builder draft SHA-256 if applicable |

## Request Totals Versus Allocation Outcomes

Request totals describe what was received or reviewed. Allocation outcomes describe what, if anything, was included in a testnet allocation draft.

Keep these separate:

| Metric type | Examples | Public format |
| --- | --- | --- |
| Request totals | total requests, total wallets, duplicates, below-threshold requests | Aggregate counts only |
| Manual review outcomes | eligible for review, manual-review holds, rejected categories | Aggregate counts only |
| Allocation outcomes | total testnet TIDE allocated, allocated pilot slots if any | Aggregate totals only |
| Corrections | corrected counts, corrected hash, reason category | Aggregate correction note |

Do not publish full wallet-address lists unless privacy and governance review explicitly approve a specific report.

## Post-Campaign Report Hash Workflow

1. Complete the report from `ALLOCATION_REPORT_TEMPLATE.md`.
2. Remove private participant data.
3. Confirm required disclaimers are present.
4. Compute SHA-256 of the report file.
5. Save the hash in a companion hash document.
6. If a Safe Transaction Builder draft exists, compute its SHA-256 separately.
7. Do not broadcast a transaction automatically.
8. If on-chain report publication is later approved, prepare a separate Safe proposal with human-readable signer notes.

## Review Checklist For Issue #58

- [ ] Campaign ID is present.
- [ ] Report status is clear.
- [ ] Request totals are separate from allocation outcomes.
- [ ] Report includes no private participant data.
- [ ] Report includes no full wallet-address list unless separately approved.
- [ ] Report includes no sale, monetary-value, mainnet, active-benefit, or independent-audit claim.
- [ ] Report includes SHA-256 placeholder or final hash.
- [ ] Safe Transaction Builder draft, if any, is described as draft only and not broadcast.

## Required Boundaries

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. A report does not create booking rights, property rights, revenue rights, cash redemption, resale value, or guaranteed benefits.
