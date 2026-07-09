# Weekly Feedback Summary Workflow

Status: draft evidence for issue #66. This workflow does not collect private participant data, publish a live campaign, approve mainnet, create a sale, create a value statement, or claim independent audit completion.

## Purpose

Make community preview feedback reviewable without converting feedback into promises or unsupported public claims.

Feedback summaries should be aggregate-only and should preserve the separation between current, planned, conceptual, and not-claimable items.

## Weekly Cadence

| Step | Action | Output |
| --- | --- | --- |
| 1 | Review public GitHub issues and PR comments. | Count by category |
| 2 | Exclude private security reports from public details. | Security count only |
| 3 | Categorize feedback. | Site, docs, utility boundaries, accessibility, security questions, operations, translations |
| 4 | Identify risks. | Risk table with mitigation and follow-up issue |
| 5 | Record changed docs/site copy. | File, change, reason |
| 6 | Confirm claims boundaries. | `npm run claims` and `npm run value` |
| 7 | Publish aggregate report draft. | Repository report and SHA-256 hash |

## Feedback Categories

| Category | Examples | Public handling |
| --- | --- | --- |
| Site clarity | Confusing status, missing verify links, mobile readability | Aggregate theme and issue link |
| Docs clarity | Unclear current/planned/conceptual wording | Aggregate theme and file link |
| Utility boundaries | Questions about pilot status, eligibility, no active benefits | Answer with no-sale/no-value/no-mainnet boundaries |
| Accessibility | Keyboard, contrast, mobile overflow, localization length | Aggregate theme and test follow-up |
| Security questions | Contract, V2 candidate, read-only RPC, report hashes | Public summary or private SECURITY.md route |
| Operations | Manual review, dispute, inventory, reporting process | Aggregate theme and blocker gate |
| Translation | EN/ES/RU wording and claim consistency | Aggregate theme and changed copy |

## What To Exclude From Public Reports

- Full wallet-address lists.
- Emails.
- Guest names.
- Booking details.
- Identity documents.
- Wallet-to-person mappings.
- Private keys, seed phrases, passwords, recovery phrases.
- Sensitive personal data.
- Private security report details.

## Summary Template

```text
Period:
Channels reviewed:
Total public feedback items:
Private security reports received:
Top themes:
Risks raised:
Docs/site copy changed:
Follow-up issues:
Claims checks:
Hash:
Publication status:
```

## Response Rules

- Do not promise roadmap delivery dates.
- Do not imply a live campaign exists.
- Do not imply active guest benefits.
- Do not describe TIDE as sold, value-bearing, mainnet live, independently audited, or connected to guaranteed benefits.
- Reframe sale, price, listing, yield, ownership, or revenue questions into project-boundary explanations.
- Open a follow-up issue only when the change is within scope and does not require unsupported claims.

## Required Boundaries

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. Feedback summaries do not create booking rights, property rights, revenue rights, cash redemption, resale value, or guaranteed benefits.
