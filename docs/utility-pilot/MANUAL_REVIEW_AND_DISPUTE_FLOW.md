# Manual Review And Dispute Flow

Status: draft evidence for issue #56. This document does not approve a live campaign, active guest benefit, mainnet deployment, sale, value statement, or independent audit claim.

Campaign ID: `tide-community-preview-001`

## Purpose

Define a reviewable manual process for a future limited Sepolia-only preview proposal while keeping the current campaign `draft-not-live`.

The process is intentionally conservative: no private participant data is collected by default, no wallet transaction is requested, and public reporting remains aggregate-only.

## Roles

| Role | Draft responsibility | Boundary |
| --- | --- | --- |
| Pilot operator | Runs checklist and records aggregate outcomes. | Cannot approve legal, privacy, security, or governance gates alone. |
| Operations reviewer | Reviews staff process, inventory, stop conditions, and disputes. | Cannot create an active guest benefit without full gate approval. |
| Privacy reviewer | Reviews any proposed data collection. | Required before email, guest, booking, identity, or wallet-to-person data collection. |
| Security reviewer | Reviews read-only checks and no-transaction flow. | Internal review is not an independent audit. |
| Governance reviewer | Confirms status changes and Safe process boundaries. | No Safe transaction broadcast through this document. |

## Manual Review Inputs

Allowed in the current draft planning model:

- campaign ID;
- wallet address format validation;
- read-only Sepolia balance result category;
- duplicate-wallet count;
- request timestamp category if a future request window is approved;
- aggregate reason category for accepted, rejected, duplicate, out-of-window, or disputed outcomes.

Not collected by default:

- private keys;
- seed phrases;
- passwords;
- emails;
- guest names;
- booking details;
- identity documents;
- wallet-to-person mappings;
- sensitive personal data.

## Draft Manual Review Steps

1. Confirm the campaign status allows review. In the current state, it does not; only dry-run review is allowed.
2. Confirm no request includes private keys, seed phrases, passwords, or sensitive personal data.
3. Confirm the wallet address format.
4. Confirm the read-only Sepolia balance result or record an RPC unavailable category.
5. Apply duplicate-wallet policy.
6. Apply request-window status if a future request window is approved.
7. Apply campaign threshold and inventory limits only after those rules are published.
8. Record only aggregate outcome categories for public reporting.
9. Route sensitive security reports to `SECURITY.md`.
10. Keep unresolved items blocked until reviewer approval exists.

## Staff Override Draft

Staff override is not active in the current draft state.

If a future preview is approved, overrides may be allowed only for:

- safety or abuse prevention;
- accessibility;
- operational error correction;
- local-law restriction;
- privacy or security incident handling.

Override records should use reason categories and aggregate counts. Do not publish private participant data.

## Dispute Flow Draft

A future dispute process should publish:

- dispute window start and end in UTC;
- public issue or privacy-approved intake channel;
- allowed dispute categories;
- expected review timeline;
- final decision authority;
- correction-report process;
- privacy-safe public summary format.

Draft dispute categories:

- eligibility calculation question;
- duplicate-wallet classification;
- out-of-window classification;
- RPC unavailable or stale data;
- suspected abuse/spam classification;
- report correction request.

Disputes do not create cash rights, compensation rights, property rights, revenue rights, resale value, or guaranteed access.

## Stop Conditions

Stop or keep blocked if:

- legal, privacy, security, operations, or governance approval is missing;
- public copy implies sale, value, mainnet, active guest benefit, or independent audit completion;
- participant flow requests transaction signing, token approval, transfer, fee, or private key material;
- private participant data appears in a public issue or report;
- reviewer cannot reproduce eligibility logic or report hashes;
- abuse or spam cannot be handled without collecting more data than approved.

## Required Boundaries

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. The draft review flow does not provide equity, debt, revenue, property, hotel ownership, return rights, cash redemption, resale value, or guaranteed benefits.
