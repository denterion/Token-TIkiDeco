# Phase 2 Live Gate Status

Status: operational status report. This document does not approve a live campaign, mainnet deployment, token sale, value statement, active guest benefit, or independent audit claim.

Last reviewed: 2026-06-28

Machine-readable source: [`../../config/utility-pilot/live-readiness-gates.json`](../../config/utility-pilot/live-readiness-gates.json)

Validation:

```bash
npm run pilot:live:blocked
```

## Snapshot

| Metric | Count |
| --- | ---: |
| Total live-campaign gates | 14 |
| Gates blocked or draft | 12 |
| Gates with evidence-only no-go status | 2 |
| Gates approved | 0 |
| Gates missing approval evidence | 0 |

The campaign remains `draft-not-live`. `npm run pilot:live:blocked` is expected to pass, and `npm run pilot:live:check` is expected to fail until every gate is approved.

## Gates With Draft Evidence

| Gate | Owner | Issue | Status | Approval | Evidence |
| --- | --- | --- | --- | --- | --- |
| Legal review | legal-reviewer | #56 | evidence-only | not-approved | `docs/utility-pilot/LEGAL_REVIEW_DECISION.md` |
| Governance review | governance-reviewer | #60 | not-approved | not-approved | `docs/utility-pilot/GOVERNANCE_REVIEW_DECISION.md` |
| Privacy review | privacy-reviewer | #56 | not-approved | not-approved | `docs/utility-pilot/PRIVACY_REVIEW_DECISION.md` |
| Security review | security-reviewer | #62 | not-approved | not-approved | `docs/utility-pilot/SECURITY_REVIEW_DECISION.md` |
| Operations review | operations-reviewer | #56 | evidence-only | not-approved | `docs/utility-pilot/OPERATIONS_REVIEW_DECISION.md` |
| Campaign-specific rules | pilot-operator | #56 | draft | not-approved | `docs/utility-pilot/CAMPAIGN_RULES_REVIEW_PACKET.md` |
| Snapshot or approved live-check window | pilot-operator | #56 | not-published | not-approved | `docs/utility-pilot/REQUEST_WINDOW_DRAFT.md` |
| Request window | pilot-operator | #56 | not-published | not-approved | `docs/utility-pilot/REQUEST_WINDOW_DRAFT.md` |
| Inventory limits | operations-reviewer | #58 | not-published | not-approved | `docs/utility-pilot/INVENTORY_LIMITS_DRAFT.md` |
| Allocation report path | reporting-reviewer | #58 | draft | not-approved | `docs/utility-pilot/ALLOCATION_REPORT_REVIEW_PACKET.md` |
| Staff process | operations-reviewer | #56 | draft | not-approved | `docs/utility-pilot/MANUAL_REVIEW_AND_DISPUTE_FLOW.md` |
| Dispute process | operations-reviewer | #56 | draft | not-approved | `docs/utility-pilot/MANUAL_REVIEW_AND_DISPUTE_FLOW.md` |
| Community feedback summary | community-maintainer | #66 | not-started | not-approved | `docs/utility-pilot/WEEKLY_FEEDBACK_SUMMARY_WORKFLOW.md` |
| Transparency update | transparency-maintainer | #65 | draft | not-approved | `docs/utility-pilot/TRANSPARENCY_UPDATE_REVIEW_PACKET.md` |

Draft evidence means the project has a reviewable file. It does not mean the gate is approved.

## Gates Still Missing Approval Evidence

No live-campaign gate is missing a reviewable evidence document. Legal and operations review now have no-go evidence, but both remain not approved. No gate should be marked approved until reviewer evidence and explicit approval exist.

## Next Owner Actions

1. Issue #56: review campaign rules, request-window draft, manual review, dispute flow, privacy no-go boundaries, legal no-go evidence, and operations no-go evidence.
2. Issue #58: review inventory limits and aggregate allocation-report workflow.
3. Issue #60: keep the governance no-go decision current while mainnet, sale, value-claim, V2-promotion, audit, and active-utility gates remain blocked.
4. Issue #62: keep security no-go evidence current while V2 remains candidate-only and independent audit has not started.
5. Issue #65: review transparency update workflow and report hash process.
6. Issue #66: run the first weekly aggregate feedback summary cycle.

## Non-Negotiable Boundaries

- TIDE remains a Sepolia testnet prototype.
- TIDE is not offered for sale.
- TIDE has no stated monetary value.
- TIDE is not deployed on mainnet.
- No active guest benefit is live.
- Independent audit has not started.
- No private guest data is collected by default.
- No Safe transaction is broadcast by this status report.
