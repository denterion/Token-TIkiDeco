# Read-Only Eligibility Engine

Status: read-only implementation notes for the Sepolia-only TIDE Loyalty Pilot. This is not a production booking system, not a token sale, not a mainnet deployment, and not a live hospitality benefit.

## What It Is

The eligibility engine is a TypeScript rules engine for explaining how a future TIDE Loyalty Pilot eligibility review could work. The production UI reads the canonical Sepolia TIDE `balanceOf(wallet)` through allowlisted RPC endpoints. Deterministic mock/test fixtures are kept only for automated tests.

It evaluates:

- Ethereum Sepolia chain ID;
- wallet address format;
- canonical TIDE `balanceOf(wallet)` through allowlisted read-only Sepolia RPC endpoints;
- optional off-chain message proof status;
- minimum TIDE threshold;
- campaign active window;
- duplicate wallet policy.

See [`READ_ONLY_BALANCE_CHECK.md`](READ_ONLY_BALANCE_CHECK.md) for the live read-only RPC flow.

The flow returns an explanation for the user and always reports that no active benefits are live and no transaction flow is required.

## Planned Testnet-Only Status

The implementation is intentionally static-site friendly. It does not:

- require wallet connection for browsing;
- submit blockchain transactions;
- request token approvals;
- collect private keys or seed phrases;
- store personal guest data;
- call a production booking backend;
- confirm access, reservations, rooms, services, or other live benefits.

## No Production Booking Integration

There is no booking integration in this flow. Any future booking, venue, access, or guest workflow would require a separate product specification, security review, privacy review, counsel review, staff operating process, and incident plan.

## No Real Benefits

Passing the read-only check does not create a live benefit. It only means that the rules returned an eligible-for-manual-review state.

Any real campaign would still need:

- published campaign rules;
- testnet allocation policy;
- inventory limits;
- blackout dates;
- manual review;
- staff override;
- dispute process;
- cancellation rules;
- privacy-safe reporting.

## No Value Claim

TIDE is not offered for sale, has no stated monetary value, and is not deployed on mainnet. The flow does not create cash value, resale value, transfer rights, revenue rights, hotel ownership, or financial rights.

## Privacy Boundaries

The static checker should collect only an optional wallet address typed by the user in the browser.

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

The read-only engine should not be treated as production readiness.
