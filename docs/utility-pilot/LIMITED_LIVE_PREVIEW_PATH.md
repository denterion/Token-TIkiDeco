# Limited Sepolia Live Preview Path

Status: blocked planning path. This document does not publish a live campaign, approve real-world utility, approve mainnet, create a sale, create a value statement, or claim independent audit completion.

The goal is to turn the current `draft-not-live` utility pilot into a reviewable limited Sepolia-only preview proposal. The campaign must remain blocked until every required gate has evidence and explicit approval.

Machine-readable blocker source: [`../../config/utility-pilot/live-readiness-gates.json`](../../config/utility-pilot/live-readiness-gates.json)

Validation:

```bash
npm run pilot:live:blocked
```

## Current Live-Preview State

| Field | Current state |
| --- | --- |
| Campaign ID | `tide-community-preview-001` |
| Campaign status | `draft-not-live` |
| Live gate result | Blocked |
| Blocked gates | 14 |
| Approved gates | 0 |
| Mainnet | Not deployed |
| Sale | Not offered |
| Monetary value | No stated monetary value |
| Active guest benefits | Not live |
| Independent audit | Not started |

## Tracking Issues And Owners

| Issue | Owner role | Gate focus | Required evidence before status can improve |
| --- | --- | --- | --- |
| [#56](https://github.com/denterion/Token-TIkiDeco/issues/56) | pilot-operator, legal-reviewer, privacy-reviewer, operations-reviewer | Campaign rules, request window, snapshot/live-check window, staff process, dispute process, legal/privacy/operations review | `CAMPAIGN_RULES_REVIEW_PACKET.md`, `REQUEST_WINDOW_DRAFT.md`, `MANUAL_REVIEW_AND_DISPUTE_FLOW.md`, and later approval notes |
| [#58](https://github.com/denterion/Token-TIkiDeco/issues/58) | reporting-reviewer, operations-reviewer | Allocation report path and inventory limits | `INVENTORY_LIMITS_DRAFT.md`, `ALLOCATION_REPORT_REVIEW_PACKET.md`, aggregate-only report path, inventory cap, no private participant data rule |
| [#60](https://github.com/denterion/Token-TIkiDeco/issues/60) | governance-reviewer | Governance and mainnet/value blockers | `GOVERNANCE_REVIEW_DECISION.md`; explicit decision that Sepolia preview remains no-sale, no-value, no-mainnet, and draft until approvals exist |
| [#62](https://github.com/denterion/Token-TIkiDeco/issues/62) | security-reviewer | Security review and audit package readiness | Current checks, audit package evidence, and no independent-audit claim |
| [#65](https://github.com/denterion/Token-TIkiDeco/issues/65) | transparency-maintainer | Transparency update | `TRANSPARENCY_UPDATE_REVIEW_PACKET.md`, report hash workflow, validation commands, and publication status wording |
| [#66](https://github.com/denterion/Token-TIkiDeco/issues/66) | community-maintainer | Community feedback summary | `WEEKLY_FEEDBACK_SUMMARY_WORKFLOW.md`, aggregate-only feedback report with current/planned/conceptual/not-claimable separation |

## Phase A: Define The Preview Without Collecting Private Data

Owner thread: issue #56.

Required evidence:

- campaign rules review packet;
- allowed reader actions;
- prohibited actions;
- public request-window draft;
- snapshot block or approved live-check-window proposal;
- manual review owner;
- staff override rule;
- dispute process;
- termination rule;
- public disclaimers.

Required boundaries:

- no private keys or seed phrases;
- no wallet transaction signing;
- no approvals, transfers, or fees;
- no booking confirmation;
- no private guest data;
- no email collection by default;
- no live guest benefit claim.

Exit condition:

- `campaignSpecificRules`, `snapshotOrApprovedLiveCheckWindow`, `requestWindow`, `staffProcess`, and `disputeProcess` have evidence paths in `live-readiness-gates.json`.
- Their `approvalStatus` remains `not-approved` until reviewer approval exists.

## Phase B: Prove Privacy-Safe Reporting And Inventory

Owner threads: issues #58, #65, and #66.

Required evidence:

- aggregate-only pilot report template;
- allocation report path;
- inventory limits;
- privacy statement;
- duplicate-wallet handling;
- no private participant data rule;
- post-campaign report hash workflow;
- transparency update template.

Required boundaries:

- public reports should not include full wallet addresses unless explicitly approved;
- public reports should not include emails, names, booking details, or identity records;
- allocation outputs must be Safe Transaction Builder drafts only and must never broadcast automatically.

Exit condition:

- `inventoryLimits`, `allocationReportPath`, `communityFeedbackSummary`, and `transparencyUpdate` have approved or reviewable evidence paths.
- `inventoryLimits` and `allocationReportPath` keep `approvalStatus: not-approved` until issue #58 review is complete.
- `communityFeedbackSummary` and `transparencyUpdate` keep `approvalStatus: not-approved` until issues #65 and #66 are reviewed.

## Phase C: Review Legal, Security, Operations, And Governance

Owner threads: issues #56, #60, and #62.

Required evidence:

- legal review status;
- privacy review status;
- security review status;
- operations review status;
- governance review status and no-go decision evidence;
- owner decision on whether the preview can move from `draft-not-live` to a future `published-testnet` proposal;
- current `npm run claims`, `npm run value`, `npm run site`, `npm run pilot`, and `npm run pilot:report` outputs.

Exit condition:

- every gate in `live-readiness-gates.json` is changed only after evidence exists and reviewer approval is recorded.
- `governanceReview` can have no-go evidence while its `approvalStatus` remains `not-approved`; that is expected until every approval gate is resolved.
- `npm run pilot:live:check` passes.

## Minimal Preview Proposal Template

Use this template only after Phase A and Phase B evidence exists.

| Field | Required value |
| --- | --- |
| Campaign ID | `tide-community-preview-001` or a new reviewed campaign ID |
| Network | Ethereum Sepolia only |
| Campaign status | Proposed `published-testnet`, not active until approved |
| Request window | Start/end timestamps |
| Snapshot mode | Snapshot block or approved live-check window |
| Inventory | Explicit limited count or zero if no allocation occurs |
| Privacy | Aggregate-only public reporting |
| User action | Read-only balance check and optional off-chain message proof only |
| Disclaimers | No sale, no stated monetary value, no mainnet, no active guest benefit, not independently audited |

## Stop Conditions

Stop the preview planning process if:

- public copy implies a sale, monetary value, mainnet, active guest benefit, financial right, or independent audit completion;
- any workflow asks for private keys, seed phrases, approvals, transfers, or fees;
- any workflow collects guest data or sensitive personal data without privacy review;
- the Safe draft does not match the reviewed allocation file;
- a reviewer cannot reproduce the report hash or eligibility logic;
- a security issue affects the read-only balance checker, allocation script, or public reporting workflow.
