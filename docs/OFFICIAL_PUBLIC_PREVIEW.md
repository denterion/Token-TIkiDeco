# TikiDeco Official Public Preview

Status: public preview packet. This document does not approve a token sale, mainnet deployment, active guest benefits, value statement, V2 promotion, or independent audit claim.

TikiDeco / TIDE is an open-source Ethereum Sepolia prototype for transparent hospitality-linked token infrastructure. TIDE is not offered for sale, has no stated monetary value, is not deployed on mainnet, has no active guest benefits, and has not completed an independent audit.

## Preview Objective

The Official Public Preview makes the project understandable and reviewable by community members, auditors, operators, and governance reviewers without requiring private context.

The preview should answer five questions quickly:

| Question | Source |
| --- | --- |
| What exists now? | [`PROJECT_FACTS.md`](PROJECT_FACTS.md), [`START_HERE.md`](START_HERE.md), [`README.md`](../README.md) |
| What does not exist yet? | [`CLAIMS_MATRIX.md`](CLAIMS_MATRIX.md), [`VALUE_CLAIM_POLICY.md`](VALUE_CLAIM_POLICY.md), [`MAINNET_GO_NO_GO.md`](MAINNET_GO_NO_GO.md) |
| How can contracts be verified? | [`deployments/canonical.json`](../deployments/canonical.json), [`docs/PROJECT_FACTS.md`](PROJECT_FACTS.md), public Sepolia Etherscan links in the README |
| How can people give feedback? | [`COMMUNITY_PREVIEW.md`](COMMUNITY_PREVIEW.md), [`FEEDBACK_GUIDE.md`](FEEDBACK_GUIDE.md), GitHub issue templates |
| What is the next release candidate? | [`releases/v0.2.0-utility-pilot-rc.1.md`](releases/v0.2.0-utility-pilot-rc.1.md) |

## Current Preview Scope

| Area | Status | Public boundary |
| --- | --- | --- |
| Public website | GitHub Pages static site at `https://tikideco.xyz/` | Read-only; no wallet connection required for browsing; no purchase or transaction flow. |
| Canonical deployment | V1 legacy Sepolia contracts | Historical canonical testnet deployment; not upgraded by V2 candidate code. |
| v0.2 RC | Read-only utility-pilot release candidate documentation | Candidate review packet only; first campaign remains `draft-not-live`. |
| Feedback issues | Public GitHub issue templates and prepared issue topics | Feedback only; do not submit private keys, seed phrases, private guest data, or sensitive personal data. |
| Transparency reports | Repository reports and hash files under `docs/reports/` | Reports are project-maintained transparency records, not independent audit reports. |
| Start Here path | [`START_HERE.md`](START_HERE.md) | Short paths for community, operator, security, release, governance, and legal/privacy reviewers. |

## What Is Current

- Ethereum Sepolia V1 token and vesting vault are the canonical historical testnet deployment.
- The owner is the Sepolia Safe recorded in the canonical manifest.
- The public site is read-only and includes EN/ES/RU user-facing copy.
- A read-only eligibility flow exists for the planned utility-pilot UI.
- Public claims checks, value checks, site checks, browser regression checks, and Solidity tests are configured.
- The v0.2 utility-pilot RC is documented, but not published as a live campaign.

## What Is Planned

- Publish a v0.2 release candidate only after release gates pass on the final `main` commit.
- Continue community preview feedback through GitHub issues.
- Publish privacy-safe feedback summaries and transparency reports.
- Prepare V2 audit handoff materials for external review.
- Keep the limited Sepolia pilot blocked until legal, privacy, security, operations, and governance evidence is approved.

## What Is Not Claimable

- No token sale, presale, purchase flow, or allocation sale.
- No stated monetary value.
- No mainnet deployment.
- No active hotel or guest benefit.
- No hotel ownership, equity, debt, revenue rights, or return rights.
- No exchange listing or liquidity activity.
- No independent audit completion.
- No V2 canonical promotion.

## Preview Launch Checklist

| Gate | Command or evidence | Expected result |
| --- | --- | --- |
| Public claims | `npm run claims` | Pass |
| Value boundaries | `npm run value` | Pass |
| Site build and content | `npm run site` | Pass |
| Browser regression | `npm run site:browser` | Pass |
| Solidity tests | `npm test` | Pass |
| Release draft | `npm run release:check` | Pass |
| v0.2 RC guard | `npm run v02:rc` | Pass |
| Pilot draft guard | `npm run pilot` | Pass |
| Pilot live blocker | `npm run pilot:live:blocked` | Pass, confirming no live campaign is approved |
| Mainnet blocker | `npm run mainnet:check` | Expected to fail until mainnet/value/real-utility gates are approved |

## Manual Review Checklist

- Confirm GitHub Pages points to the current static site.
- Confirm repository About text and topics do not imply sale, mainnet, value, active utility, or audit completion.
- Confirm feedback issue templates are visible on GitHub.
- Confirm `docs/PROJECT_FACTS.md` is current after the latest merge.
- Confirm release package evidence is regenerated after the final merge commit.
- Confirm no public announcement uses investment, price, listing, or guaranteed-benefit language.

## Reader Paths

| Reader | First document | Goal |
| --- | --- | --- |
| Community reviewer | [`COMMUNITY_PREVIEW.md`](COMMUNITY_PREVIEW.md) | Give useful public feedback. |
| Auditor | [`EXTERNAL_AUDIT_READINESS.md`](EXTERNAL_AUDIT_READINESS.md) | Understand V2 candidate scope and evidence. |
| Operator | [`utility-pilot/LIMITED_LIVE_PREVIEW_PATH.md`](utility-pilot/LIMITED_LIVE_PREVIEW_PATH.md) | Understand why the pilot is not live. |
| Governance reviewer | [`GOVERNANCE_DECISION_REGISTER.md`](GOVERNANCE_DECISION_REGISTER.md) | Review Safe, treasury, and role decisions. |
| Legal/privacy reviewer | [`COUNSEL_INTAKE_PACKAGE.md`](COUNSEL_INTAKE_PACKAGE.md) | Review counsel questions before any real utility, data collection, sale, or mainnet discussion. |

## Publication Standard

Every public preview post, README update, site change, or report should preserve the same boundary:

> TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit.

Any future wording that mentions value, live utility, distribution, exchange listing, liquidity, sale, or real-world guest benefits requires legal, governance, security, and operations review before publication.
