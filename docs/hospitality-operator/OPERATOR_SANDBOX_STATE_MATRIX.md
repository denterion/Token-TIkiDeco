# Operator Sandbox State Matrix

Status: deterministic local simulation evidence for GitHub issue #120. All campaigns, wallets and outcomes are fake. This document does not activate a hospitality service, token distribution, transaction broadcast or mainnet workflow.

## Transition Matrix

| Operation | Allowed state | Result | Rejected elsewhere |
| --- | --- | --- | --- |
| Create campaign | no campaign | `draft` | Yes |
| Set mock inventory | `draft` | state unchanged | Yes |
| Submit for review | `draft` | `review` | Yes |
| Approve simulation | `review` with all simulation gates | `approved-for-simulation` | Yes |
| Activate simulation | `approved-for-simulation` | `active-simulation` | Yes |
| Review fake eligibility | `active-simulation` | state unchanged | Yes |
| Approve or reject request | `active-simulation` | state unchanged | Yes |
| Record dispute | `active-simulation`, `paused` or `closed` | state unchanged | Yes |
| Pause simulation | `active-simulation` | `paused` | Yes |
| Close campaign | `active-simulation` or `paused` | `closed` | Yes |
| Archive campaign | `closed` | `archived` | Yes |

There is no resume transition from `paused`. A paused simulation may only close. Rejected operations increment the aggregate error count but cannot change request, eligibility, decision or inventory outcomes.

## Decision Reasons

| Decision | Allowed reason codes |
| --- | --- |
| Approve | `fake-eligible` |
| Reject | `fake-threshold-not-met`, `fake-not-selected` |

## Enforced Invariants

- A normalized wallet can appear in only one request, even when request IDs differ.
- Invalid and duplicate requests do not alter outcome counters.
- Approvals cannot exceed inventory; inventory usage equals approved decisions and never becomes negative.
- A request receives at most one decision. No rejected request can later be approved.
- Paused and closed states reject unsupported mutations.
- Audit sequence numbers are strictly monotonic and each decision has a compatible reason code.
- Request, eligibility, decision, rejected-operation, dispute and stop-event totals reconcile with the audit log.
- Malformed evidence is rejected for missing campaign IDs, invalid inventory, unsupported states, duplicate sequence numbers, inconsistent counters and unsupported reason codes.
- Aggregate reports contain no raw wallet address, guest name, email, booking detail, private key or seed phrase.

## Issue #120 Evidence

| Acceptance criterion | Evidence | Verification |
| --- | --- | --- |
| Duplicate wallet and invalid-request isolation | `scripts/test-operator-sandbox-invariants.cjs` | `npm run operator-sandbox:invariants` |
| Inventory exhaustion and decision immutability | `scripts/test-operator-sandbox-invariants.cjs` | `npm run operator-sandbox:invariants` |
| Paused and closed transition rules | this matrix and invariant runner | `npm run operator-sandbox:invariants` |
| Corrupted state rejection | `test/fixtures/operator-sandbox-states.json` | `npm run operator-sandbox:fixtures` |
| Audit-log and aggregate reconciliation | `validateOperatorSandboxEvidence` | `npm run operator-pilot:check` |
| Privacy-safe report | `operations/hospitality-operator/operator-sandbox-report.json` | `npm run operator-sandbox:report` |
