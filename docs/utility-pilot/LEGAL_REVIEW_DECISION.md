# Legal Review Decision

Status: legal no-go evidence. This document records the current legal-review boundary for the draft TIDE utility-pilot campaign. It is not legal advice, not a legal opinion, not a regulatory conclusion, not counsel approval, and not approval for a live campaign, mainnet deployment, token sale, monetary-value claim, active guest benefit, participant data collection, Safe transaction, or independent audit claim.

Last reviewed: 2026-07-03

Tracking issue: [#56](https://github.com/denterion/Token-TIkiDeco/issues/56)

Machine-readable gate: [`../../config/utility-pilot/live-readiness-gates.json`](../../config/utility-pilot/live-readiness-gates.json) -> `requiredBeforeLiveCampaign.legalReview`

## Decision

The legal review gate remains:

| Field | Required state |
| --- | --- |
| Campaign status | `draft-not-live` |
| Legal gate status | `evidence-only` |
| Legal approval status | `not-approved` |
| External counsel memo | Not complete |
| Token sale | Not approved |
| Monetary-value statement | Not approved |
| Mainnet deployment | Not approved |
| Active guest utility | Not live |
| Participant data collection | Not approved |

The project has enough legal-readiness documentation to review the future pilot boundary, but it does not have legal approval to run a live campaign or make broader utility, value, sale, or mainnet claims. This evidence is a no-go record, not counsel approval.

## Current Review Surface

Legal review evidence currently covers:

- the campaign remains `draft-not-live`;
- TIDE is a Sepolia testnet prototype;
- TIDE is not offered for sale;
- TIDE has no stated monetary value;
- TIDE is not deployed on mainnet;
- independent audit has not started;
- no active guest benefit is live;
- no hotel ownership, revenue rights, equity, debt, redemption, exchange, or return rights are provided;
- wallet eligibility work remains read-only and does not request transaction signing, approvals, transfers, fees, or booking confirmation;
- privacy, operations, security, and governance gates remain no-go or not approved.

Legal review evidence does not cover or approve:

- legal advice or a counsel memo;
- any token sale, paid access flow, redemption, exchange, liquidity, or mainnet plan;
- production guest terms;
- real-world loyalty, access, discount, membership, booking, or hospitality benefit;
- participant data collection;
- entity, IP, tax, accounting, AML/sanctions, or consumer-protection conclusions;
- no public statement may imply investment, value, price, profit, ownership, revenue share, active benefits, or independent audit completion.

## Required Evidence Before Any Future Approval

The legal reviewer or external counsel must verify all of the following before this gate can move away from `not-approved`:

- written counsel review for the exact Sepolia-only pilot proposal;
- approved user-facing pilot terms if any request flow is opened;
- approved privacy terms before collecting wallet-linked participant data, email, identity, booking, or guest data;
- reviewed eligibility, inventory, cancellation, blackout-date, dispute, and staff-override rules;
- reviewed public copy for website, README, release notes, social posts, issue templates, and reports;
- entity, IP, treasury, tax/accounting, AML/sanctions, consumer-protection, and hospitality-operations questions assigned to owners;
- confirmation that testnet allocation, if any, remains no-sale, no-value, no-mainnet, and no-guaranteed-benefit;
- confirmation that no live campaign is represented as active before all legal, privacy, security, operations, and governance approvals are complete.

## Current No-Go Rationale

- External counsel review is not complete.
- The first campaign manifest is still `draft-not-live`.
- No request window, inventory, user terms, or live report is published.
- Privacy, operations, security, and governance evidence remains no-go or not approved.
- Mainnet, sale, value claims, real-world utility, token distribution, and active benefits remain blocked by policy.
- Independent audit has not started.

## Required Validation

The following commands should pass while preserving the blocked legal state:

```bash
npm run claims
npm run value
npm run pilot
npm run pilot:live:blocked
npm run site
npm run release:check
```

The following commands are expected to fail until the relevant approvals exist:

```bash
npm run pilot:live:check
npm run mainnet:check
```

Expected failure here is a safety control, not a release failure.

## References

- [`../COUNSEL_INTAKE_PACKAGE.md`](../COUNSEL_INTAKE_PACKAGE.md)
- [`../LEGAL_READINESS.md`](../LEGAL_READINESS.md)
- [`../CLAIMS_MATRIX.md`](../CLAIMS_MATRIX.md)
- [`../VALUE_CLAIM_POLICY.md`](../VALUE_CLAIM_POLICY.md)
- [`../MAINNET_GO_NO_GO.md`](../MAINNET_GO_NO_GO.md)
- [`PILOT_LIVE_BLOCKER_REGISTER.md`](PILOT_LIVE_BLOCKER_REGISTER.md)
- [`PHASE2_LIVE_GATE_STATUS.md`](PHASE2_LIVE_GATE_STATUS.md)
