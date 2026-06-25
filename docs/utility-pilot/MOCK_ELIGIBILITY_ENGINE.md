# Mock Eligibility Engine

Status: planned mock implementation for the Sepolia-only TIDE Loyalty Pilot. This is not a production booking system, not a token sale, not a mainnet deployment, and not a live hospitality benefit.

## What It Is

The mock eligibility engine is a local TypeScript rules engine for explaining how a future TIDE Loyalty Pilot eligibility review could work.

It evaluates:

- Ethereum Sepolia chain ID;
- wallet address format;
- off-chain message placeholder status;
- read-only mock balance at a configured snapshot block;
- minimum TIDE threshold;
- campaign active window;
- duplicate wallet policy.

The mock returns an explanation for the user and always reports that no active benefits are live and no transaction flow is required.

## Mock-Only Status

The implementation is intentionally local and static-site friendly. It does not:

- connect a wallet;
- submit blockchain transactions;
- request token approvals;
- collect private keys or seed phrases;
- store personal guest data;
- call a production backend;
- integrate with a booking system;
- confirm access, reservations, rooms, services, or other live benefits.

## No Production Booking Integration

There is no booking integration in this mock. Any future booking, venue, access, or guest workflow would require a separate product specification, security review, privacy review, counsel review, staff operating process, and incident plan.

## No Real Benefits

Passing the mock check does not create a live benefit. It only means that the local mock rules returned an eligible-for-review state.

Any real pilot would still need:

- published campaign rules;
- inventory limits;
- blackout dates;
- manual review;
- staff override;
- dispute process;
- cancellation rules;
- privacy-safe reporting.

## No Value Claim

TIDE is not offered for sale, has no stated monetary value, and is not deployed on mainnet. The mock does not create cash value, resale value, transfer rights, revenue rights, hotel ownership, or financial rights.

## Privacy Boundaries

The static mock should collect only an optional wallet address typed by the user in the browser.

It must not collect:

- private keys;
- seed phrases;
- names;
- emails;
- phone numbers;
- government IDs;
- guest records;
- travel plans;
- booking details;
- wallet-to-person mappings.

If future pilot work needs participant data, the project must pause and complete privacy review, counsel review, retention rules, access controls, and incident-response updates first.

## What Is Needed Before Production

Before production use, the project needs:

- external counsel review;
- final pilot terms;
- privacy notice and data retention policy;
- abuse and duplicate-wallet controls;
- reviewed backend design if any server-side review is needed;
- accessibility review;
- independent security review of the production flow;
- operational staff playbook;
- dispute and correction procedure;
- public pilot report format;
- governance approval.

The mock engine should not be treated as production readiness.
