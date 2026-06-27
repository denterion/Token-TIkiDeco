# Transparency Update Review Packet

Status: draft evidence for issue #65. This packet does not publish a live campaign, broadcast a transaction, approve mainnet, create a sale, create a value statement, or claim independent audit completion.

Campaign ID: `tide-community-preview-001`

## Purpose

Define the minimum transparency update evidence for v0.2 release-candidate and utility-pilot planning updates.

The current campaign remains `draft-not-live`. Any transparency update must separate what is current, planned, conceptual, and not claimable.

## Required Transparency Update Sections

| Section | Required content |
| --- | --- |
| Status | Report date, source commit, campaign status, network, chain ID |
| Current | V1 canonical status, read-only site, read-only eligibility flow, public issue workflow |
| Planned | Review packets, allocation/reporting workflow, V2 audit package readiness |
| Conceptual | Future hospitality-linked workflows that are not live |
| Not claimable | No sale, no stated monetary value, no mainnet, no active guest benefits, no independent audit completion |
| Validation | Commands run, pass/fail status, expected blocked gates |
| Hashes | Report SHA-256 and optional Safe Transaction Builder draft SHA-256 |
| Publication | Repository-only, on-chain proposal prepared, or on-chain published |

## Validation Commands

Before publishing a repository transparency update, run and record:

```bash
npm run claims
npm run value
npm run site
npm run pilot
npm run pilot:report
npm run pilot:live:blocked
npm run release
```

`npm run pilot:live:check` is expected to fail while the campaign is not approved to go live.

`npm run mainnet:check` is expected to fail while mainnet, value, sale, real-world utility, audit, legal, privacy, operations, and governance gates remain blocked.

## Report Hash Workflow

1. Draft the report in `docs/reports/`.
2. Remove private participant data.
3. Confirm required disclaimers are present.
4. Compute the report SHA-256.
5. Save the hash in a companion `*_HASH.md` file.
6. Record publication status clearly.
7. Do not broadcast a transaction automatically.
8. If on-chain publication is later approved, prepare a separate Safe proposal with encoded calldata and signer notes.

## Safe Publication Boundary

A repository transparency report is not an on-chain report. On-chain report publication requires a separate governance/Safe review.

No Safe signer should execute a report publication unless:

- the report hash matches the reviewed document;
- category, URI, and content hash are correct;
- the report does not contain unsupported public claims;
- the report does not include private participant data;
- signer notes explain that the action does not approve sale, mainnet, active benefits, or independent audit status.

## Required Boundaries

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. A transparency update does not create booking rights, property rights, revenue rights, cash redemption, resale value, or guaranteed benefits.
