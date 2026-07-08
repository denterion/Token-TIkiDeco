# Live Gate Owner Matrix

Status: blocked owner matrix for a future limited Sepolia-only preview. This matrix does not approve a live campaign, active guest benefits, mainnet, token sale, value statement, or independent audit claim.

Source of truth: [`../../config/utility-pilot/live-readiness-gates.json`](../../config/utility-pilot/live-readiness-gates.json)

## Gate Matrix

| Gate | Owner | Status | Evidence file | Blocking reason | Reviewer required | Approval format | Command that checks it |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Legal review | legal-reviewer | evidence-only / not-approved | [`LEGAL_REVIEW_DECISION.md`](LEGAL_REVIEW_DECISION.md) | Counsel-style review is not approved. | Legal reviewer | `approvedBy`, `approvedAt`, approved evidence PR | `npm run pilot:evidence` |
| Privacy review | privacy-reviewer | not-approved | [`PRIVACY_REVIEW_DECISION.md`](PRIVACY_REVIEW_DECISION.md) | Participant data collection is not approved. | Privacy reviewer | `approvedBy`, `approvedAt`, approved evidence PR | `npm run pilot:evidence` |
| Security review | security-reviewer | not-approved | [`SECURITY_REVIEW_DECISION.md`](SECURITY_REVIEW_DECISION.md) | Read-only flow, allocation drafts, and report workflow need final review. | Security reviewer | `approvedBy`, `approvedAt`, approved evidence PR | `npm run pilot:evidence` |
| Operations review | operations-reviewer | evidence-only / not-approved | [`OPERATIONS_REVIEW_DECISION.md`](OPERATIONS_REVIEW_DECISION.md) | Staffing, support, stop condition, and inventory are not approved. | Operations reviewer | `approvedBy`, `approvedAt`, approved evidence PR | `npm run pilot:evidence` |
| Governance review | governance-reviewer | not-approved | [`GOVERNANCE_REVIEW_DECISION.md`](GOVERNANCE_REVIEW_DECISION.md) | Governance has not approved publication or Safe workflow. | Governance reviewer | `approvedBy`, `approvedAt`, approved evidence PR | `npm run pilot:evidence` |
| Campaign rules | pilot-operator | draft / not-approved | [`CAMPAIGN_RULES_REVIEW_PACKET.md`](CAMPAIGN_RULES_REVIEW_PACKET.md) | Rules are reviewable but not final. | Pilot operator and legal/privacy reviewers | Final rules plus approval fields | `npm run pilot:evidence` |
| Snapshot or live-check mode | pilot-operator | not-published / not-approved | [`REQUEST_WINDOW_DRAFT.md`](REQUEST_WINDOW_DRAFT.md) | Snapshot block or live-check window is not published. | Pilot operator and security reviewer | Approved snapshot/live-check section | `npm run pilot:live:blocked` |
| Request window | pilot-operator | not-published / not-approved | [`REQUEST_WINDOW_DRAFT.md`](REQUEST_WINDOW_DRAFT.md) | No request window is approved. | Pilot operator and operations reviewer | Approved start/end timestamps | `npm run pilot:live:blocked` |
| Inventory limits | operations-reviewer | not-published / not-approved | [`INVENTORY_LIMITS_DRAFT.md`](INVENTORY_LIMITS_DRAFT.md) | Capacity is zero and no benefit inventory is approved. | Operations reviewer | Approved capacity or zero-allocation decision | `npm run pilot:live:blocked` |
| Allocation report path | reporting-reviewer | draft / not-approved | [`ALLOCATION_REPORT_REVIEW_PACKET.md`](ALLOCATION_REPORT_REVIEW_PACKET.md) | Final aggregate report path is not approved. | Reporting reviewer and privacy reviewer | Approved report path and template | `npm run allocation` |
| Staff process | operations-reviewer | draft / not-approved | [`MANUAL_REVIEW_AND_DISPUTE_FLOW.md`](MANUAL_REVIEW_AND_DISPUTE_FLOW.md) | Manual reviewer process is not approved. | Operations reviewer | Approved staff process section | `npm run pilot:evidence` |
| Dispute process | operations-reviewer | draft / not-approved | [`MANUAL_REVIEW_AND_DISPUTE_FLOW.md`](MANUAL_REVIEW_AND_DISPUTE_FLOW.md) | Dispute handling is not approved. | Operations reviewer | Approved dispute process section | `npm run pilot:evidence` |
| Community feedback summary | community-maintainer | not-started / not-approved | [`WEEKLY_FEEDBACK_SUMMARY_WORKFLOW.md`](WEEKLY_FEEDBACK_SUMMARY_WORKFLOW.md) | Aggregate feedback workflow has not been completed for the preview. | Community maintainer | Published aggregate summary after review | `npm run pilot:evidence` |
| Transparency update | transparency-maintainer | draft / not-approved | [`TRANSPARENCY_UPDATE_REVIEW_PACKET.md`](TRANSPARENCY_UPDATE_REVIEW_PACKET.md) | Public update and hash workflow are not approved. | Transparency maintainer | Approved transparency report and hash | `npm run pilot:evidence` |

## Approval Rule

No gate should be marked approved until the reviewer has left an explicit approval record. A JSON gate approval must include:

- `status: "approved"`;
- `approvalStatus: "approved"`;
- `approvedBy`;
- `approvedAt`;
- a matching evidence file.

## Blocking Policy

`npm run pilot:live:blocked` is expected to pass while this matrix contains blocked, draft, evidence-only, not-published, not-started, or not-approved gates.

`npm run pilot:live:check` is expected to fail until every gate is approved through the format above.
