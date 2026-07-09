# Limited Sepolia Preview Evidence

Status: evidence checklist for a future limited Sepolia-only preview. This document does not publish a live campaign, approve guest benefits, approve mainnet, create a sale, create a value statement, or claim independent audit completion.

Campaign: `tide-community-preview-001`  
Current status: `draft-not-live`  
Validation commands:

```bash
npm run pilot:live:blocked
npm run pilot:evidence
npm run pilot
```

## Required Evidence Items

| Evidence item | Current evidence file | Current status | Required before any limited preview |
| --- | --- | --- | --- |
| Campaign rules | [`CAMPAIGN_RULES_REVIEW_PACKET.md`](CAMPAIGN_RULES_REVIEW_PACKET.md) | Draft, not approved | Final rule packet, reviewer sign-off, and no-sale/no-value/no-mainnet/not-audited disclaimers. |
| Snapshot block or approved live-check mode | [`REQUEST_WINDOW_DRAFT.md`](REQUEST_WINDOW_DRAFT.md) | Not published | Snapshot block or approved live-check window, published only after approvals. |
| Request window | [`REQUEST_WINDOW_DRAFT.md`](REQUEST_WINDOW_DRAFT.md) | Not published | Open/close timestamps, timezone, dispute window, and approval evidence. |
| Inventory limit | [`INVENTORY_LIMITS_DRAFT.md`](INVENTORY_LIMITS_DRAFT.md) | Not published | Explicit zero or limited capacity, local restrictions, and operations approval. |
| Eligibility threshold | [`tide-community-preview-001.json`](../../config/utility-pilot/tide-community-preview-001.json) | Draft threshold | Confirmed Sepolia-only threshold and manual review rules. |
| Manual review process | [`MANUAL_REVIEW_AND_DISPUTE_FLOW.md`](MANUAL_REVIEW_AND_DISPUTE_FLOW.md) | Draft | Reviewer role, allowed records, privacy boundary, and override process. |
| Duplicate wallet handling | [`MANUAL_REVIEW_AND_DISPUTE_FLOW.md`](MANUAL_REVIEW_AND_DISPUTE_FLOW.md) | Draft | One-review-per-wallet rule and aggregate-only duplicate reporting. |
| Dispute handling | [`MANUAL_REVIEW_AND_DISPUTE_FLOW.md`](MANUAL_REVIEW_AND_DISPUTE_FLOW.md) | Draft | Public dispute categories, response cadence, and no private data collection. |
| Privacy review | [`PRIVACY_REVIEW_DECISION.md`](PRIVACY_REVIEW_DECISION.md) | Not approved | Explicit privacy reviewer approval before any participant data collection. |
| Legal review | [`LEGAL_REVIEW_DECISION.md`](LEGAL_REVIEW_DECISION.md) | Evidence only, not approved | Explicit legal reviewer approval before any live preview. |
| Security review | [`SECURITY_REVIEW_DECISION.md`](SECURITY_REVIEW_DECISION.md) | Not approved | Review of read-only balance flow, allocation drafts, report checks, and no transaction flow. |
| Operations review | [`OPERATIONS_REVIEW_DECISION.md`](OPERATIONS_REVIEW_DECISION.md) | Evidence only, not approved | Staffing, stop condition, support path, and inventory review. |
| Governance review | [`GOVERNANCE_REVIEW_DECISION.md`](GOVERNANCE_REVIEW_DECISION.md) | Not approved | Maintainer/Safe/governance approval format and publication decision. |
| Allocation report path | [`ALLOCATION_REPORT_REVIEW_PACKET.md`](ALLOCATION_REPORT_REVIEW_PACKET.md) | Draft, not approved | Aggregate-only report path and reviewer approval before any final report. |
| Transparency update path | [`TRANSPARENCY_UPDATE_REVIEW_PACKET.md`](TRANSPARENCY_UPDATE_REVIEW_PACKET.md) | Draft, not approved | Public update template and hash workflow with no live-benefit claim. |
| Stop condition | [`PILOT_OPERATIONS_PLAYBOOK.md`](PILOT_OPERATIONS_PLAYBOOK.md) | Draft | Stop rule for legal, privacy, security, operations, governance, public-claims, data, RPC, or Safe-review failures. |

## Required Blocked State

The campaign must remain blocked while any of the following are true:

- legal, privacy, security, operations, or governance approval is missing;
- the request window is not approved and published through a reviewed process;
- inventory is not approved or remains zero;
- the allocation report is not reviewed;
- public copy could be read as a sale, value statement, mainnet approval, active guest benefit, or independent audit claim;
- any workflow requests private keys, seed phrases, transaction signatures, approvals, transfers, fees, emails, guest data, or private participant data.

## Evidence Update Rule

Each gate update should be made in a reviewable PR. A gate may move to `approved` only when the gate entry contains:

- `status: "approved"`;
- `approvalStatus: "approved"`;
- an evidence file path;
- `approvedBy`;
- `approvedAt` in ISO-8601 format;
- reviewer-readable approval notes in the evidence file.

Until those fields exist, `npm run pilot:evidence` and `npm run pilot:live:blocked` must keep the campaign blocked.
