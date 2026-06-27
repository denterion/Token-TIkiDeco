# Campaign Rules Review Packet

Status: draft evidence for issue #56. This packet does not publish a live campaign, approve real-world utility, approve mainnet, create a sale, create a value statement, or claim independent audit completion.

Campaign ID: `tide-community-preview-001`

Machine-readable campaign source: [`../../config/utility-pilot/tide-community-preview-001.json`](../../config/utility-pilot/tide-community-preview-001.json)

Live gate source: [`../../config/utility-pilot/live-readiness-gates.json`](../../config/utility-pilot/live-readiness-gates.json)

## Review Objective

Prepare campaign-rule evidence for a future limited Sepolia-only preview proposal while keeping the current campaign `draft-not-live`.

This packet is useful only for review. It is not a participant intake form, not a booking flow, not a token distribution approval, and not an instruction to broadcast a Safe transaction.

## Current Campaign State

| Field | Current value |
| --- | --- |
| Network | Ethereum Sepolia |
| Chain ID | `11155111` |
| Canonical version | `v1-legacy` |
| Campaign status | `draft-not-live` |
| Request window | Not published |
| Snapshot mode | Planned only |
| Inventory | Not published; capacity `0` |
| Manual review | Required before any future pilot decision |
| Sale status | Not offered for sale |
| Monetary value | No stated monetary value |
| Mainnet | Not deployed |
| Independent audit | Not started |

## Allowed Reader Actions In Draft State

- Read the public site and documentation.
- Verify the canonical Sepolia addresses.
- Enter a wallet address into the read-only eligibility card.
- View a read-only Sepolia `balanceOf` result if RPC data is available.
- Review GitHub issues and submit public feedback.

## Prohibited Actions In Draft State

- No request window is open.
- No message-signature intake is active.
- No wallet transaction signing is requested.
- No token approval, transfer, fee, booking confirmation, or Safe execution is requested.
- No private keys, seed phrases, passwords, emails, guest records, identity documents, or booking records are collected.
- No active guest benefit is live.

## Campaign Rules That Must Be Final Before Publication

| Rule area | Current state | Required evidence before improvement |
| --- | --- | --- |
| Campaign status | `draft-not-live` | Reviewer approval to propose `published-testnet` |
| Request window | Not published | UTC open and close timestamps |
| Snapshot or live-check mode | Planned only | Snapshot block or approved live-check window |
| Minimum balance threshold | Draft threshold in manifest | Approved threshold and explanation |
| Duplicate wallet policy | One review per wallet per campaign | Final duplicate handling rule |
| Inventory | Not published | Explicit capacity or zero-allocation statement |
| Manual review | Required | Staff process and reviewer role |
| Dispute process | Draft | Public dispute window and decision authority |
| Privacy process | No private participant data by default | Privacy review before any data collection |
| Reporting | Template exists | Aggregate report path and hash workflow |

## Review Checklist For Issue #56

- [ ] Confirm campaign status remains `draft-not-live`.
- [ ] Confirm all required disclaimers remain present in the manifest.
- [ ] Confirm all forbidden flows remain disabled.
- [ ] Confirm request window is not published until approvals exist.
- [ ] Confirm snapshot block or approved live-check window is not published until approvals exist.
- [ ] Confirm staff process and dispute process are reviewable.
- [ ] Confirm no private participant data is collected by default.
- [ ] Confirm public copy separates current, planned, conceptual, and not-claimable items.

## Required Boundaries

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. The draft campaign does not provide equity, debt, revenue, property, hotel ownership, return rights, cash redemption, resale value, or guaranteed benefits.
