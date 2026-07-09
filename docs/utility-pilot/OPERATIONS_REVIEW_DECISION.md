# Operations Review Decision

Status: operations no-go evidence. This document records the current operations-review boundary for the draft TIDE utility-pilot campaign. It does not approve a live campaign, mainnet deployment, token sale, monetary-value claim, active guest benefit, Safe transaction, participant data collection, or independent audit claim.

Last reviewed: 2026-06-28

Tracking issue: [#56](https://github.com/denterion/Token-TIkiDeco/issues/56)

Machine-readable gate: [`../../config/utility-pilot/live-readiness-gates.json`](../../config/utility-pilot/live-readiness-gates.json) -> `requiredBeforeLiveCampaign.operationsReview`

## Decision

The operations review gate remains:

| Field | Required state |
| --- | --- |
| Campaign status | `draft-not-live` |
| Operations gate status | `evidence-only` |
| Operations approval status | `not-approved` |
| Active guest benefit | Not live |
| Request window | Not published |
| Inventory | Not published |
| Staff process | Draft only |
| Dispute process | Draft only |
| Stop condition | Draft only |

The project has enough operations documentation to review the future pilot shape, but it does not have operational approval to run a live campaign. The evidence is a no-go record, not a launch approval.

## Current Review Surface

Operations review evidence currently covers:

- campaign remains `draft-not-live`;
- no request window is open;
- no active hospitality benefit is live;
- no booking confirmation, fee collection, transfer, approval, or transaction-signing flow exists;
- manual review and dispute-flow drafts exist;
- inventory limits are draft-only and not published as real availability;
- pilot reports are aggregate-only and privacy-safe by default;
- stop conditions are documented for abuse, privacy, legal, security, or operations concerns.

Operations review evidence does not cover or approve:

- a staffed live support process;
- real venue, property, operator, or inventory commitment;
- guest terms for a live campaign;
- cancellation, blackout-date, or redemption operations for real guests;
- private participant data handling;
- Safe transaction execution;
- mainnet deployment or any value-related statement.

## Required Evidence Before Any Future Approval

The operations reviewer must verify all of the following before this gate can move away from `not-approved`:

- named responsible operator for the specific campaign;
- published request window with timezone and closure policy;
- published inventory limit and over-cap handling rule;
- staff review checklist and escalation path;
- dispute deadline, reviewer, evidence boundary, and finality rule;
- abuse/spam review process;
- stop/termination authority and public notice process;
- privacy-safe report process with no private participant data by default;
- legal and privacy approval for any real-world participant workflow;
- security review for the read-only eligibility flow and generated allocation drafts;
- confirmation that no active guest benefit is represented as live before the campaign status changes.

## Current No-Go Rationale

- The first campaign manifest is still `draft-not-live`.
- Legal approval evidence is still missing.
- The request window and inventory are not published.
- Staff, support, dispute handling, and stop conditions are still draft-only.
- No live campaign report or allocation report has been published.
- No real hospitality operator or venue commitment is approved in repository evidence.

## Required Validation

The following commands should pass while preserving the blocked operations state:

```bash
npm run claims
npm run value
npm run pilot
npm run pilot:live:blocked
npm run site
npm run release:check
```

The following command is expected to fail until every live-campaign gate is approved:

```bash
npm run pilot:live:check
```

Expected failure here is a safety control, not a release failure.

## References

- [`PILOT_OPERATIONS_PLAYBOOK.md`](PILOT_OPERATIONS_PLAYBOOK.md)
- [`MANUAL_REVIEW_AND_DISPUTE_FLOW.md`](MANUAL_REVIEW_AND_DISPUTE_FLOW.md)
- [`INVENTORY_LIMITS_DRAFT.md`](INVENTORY_LIMITS_DRAFT.md)
- [`PRIVACY_SAFE_REPORTING.md`](PRIVACY_SAFE_REPORTING.md)
- [`PILOT_REPORT_TEMPLATE.md`](PILOT_REPORT_TEMPLATE.md)
- [`PILOT_LIVE_BLOCKER_REGISTER.md`](PILOT_LIVE_BLOCKER_REGISTER.md)
