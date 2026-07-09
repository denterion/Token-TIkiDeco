# Request Window And Snapshot Draft

Status: draft evidence for issue #56. This document does not open a request window, publish a snapshot block, approve a live-check window, or publish a live campaign.

Campaign ID: `tide-community-preview-001`

## Current State

| Field | Current value |
| --- | --- |
| Campaign status | `draft-not-live` |
| Request window | Not published |
| Snapshot block | Not published |
| Live-check window | Not approved |
| Timezone | UTC |
| Participant intake | Not open |

## Draft Window Model

A future limited Sepolia-only preview proposal should define:

- request opens at an exact UTC timestamp;
- request closes at an exact UTC timestamp;
- late requests are rejected or marked out of window;
- the campaign can be paused before opening if any approval is missing;
- the campaign can be closed early if a stop condition is triggered.

This draft intentionally leaves timestamps blank until legal, privacy, security, operations, and governance review are complete.

## Snapshot Or Live-Check Options

One of these modes must be selected before a future `published-testnet` proposal:

| Mode | Description | Evidence required |
| --- | --- | --- |
| Snapshot block | Eligibility reads balances at a published Sepolia block. | Block number, source, publication timestamp, and report path |
| Approved live-check window | Eligibility reads balances during an approved UTC window. | Window timestamps, RPC fallback process, and reviewer approval |

No mode is approved in the current draft state.

## Draft Publication Criteria

Before the request window or snapshot mode can move out of draft:

- campaign manifest remains Sepolia-only;
- all public copy keeps no-sale, no-value, no-mainnet, and independent-audit-not-started boundaries;
- request window timestamps are published in UTC;
- inventory limits are published or explicitly zero;
- manual review and dispute process are published;
- privacy review confirms no private participant data collection by default;
- security review confirms no transaction signing, approvals, transfers, fees, or private-key prompts;
- governance review confirms no Safe transaction is broadcast automatically.

## Stop Conditions

Do not publish a request window if:

- any required approval remains missing;
- public copy implies a sale, value, mainnet, active guest benefit, or independent audit completion;
- eligibility flow asks for transaction signing or token approval;
- request flow collects emails, guest records, identity data, or private participant data without privacy review;
- RPC reliability or reporting evidence cannot be reproduced.

## Required Boundaries

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. A future request window would be a testnet review process only and would not create cash value, resale value, property rights, revenue rights, or guaranteed benefits.
