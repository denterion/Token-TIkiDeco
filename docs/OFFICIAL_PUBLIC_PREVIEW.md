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
| Public entry points | [`PUBLIC_ENTRYPOINTS.md`](PUBLIC_ENTRYPOINTS.md), [`START_HERE.md`](START_HERE.md) | Four short paths: Overview, Status, Pilot, and Audit; Feedback is the action path. |

## What Is Current

- Ethereum Sepolia V1 token and vesting vault are the canonical historical testnet deployment.
- The owner is the Sepolia Safe recorded in the canonical manifest.
- The current public site is read-only and uses English user-facing copy only.
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
| Community reviewer | [`PUBLIC_ENTRYPOINTS.md`](PUBLIC_ENTRYPOINTS.md), [`FEEDBACK_GUIDE.md`](FEEDBACK_GUIDE.md) | Understand the public overview and give useful feedback. |
| Operator / release manager | [`RELEASE_CONTROL_CENTER.md`](RELEASE_CONTROL_CENTER.md), [`NEXT_RELEASE_GATES.md`](NEXT_RELEASE_GATES.md) | Keep release evidence and pilot blockers current. |
| Auditor / security reviewer | [`EXTERNAL_AUDIT_READINESS.md`](EXTERNAL_AUDIT_READINESS.md), [`V2_AUDIT_OWNER_DECISIONS.md`](V2_AUDIT_OWNER_DECISIONS.md) | Understand V2 candidate scope and evidence. |
| Legal / governance reviewer | [`COUNSEL_INTAKE_PACKAGE.md`](COUNSEL_INTAKE_PACKAGE.md), [`GOVERNANCE_DECISION_REGISTER.md`](GOVERNANCE_DECISION_REGISTER.md) | Review counsel questions, Safe, treasury, and role decisions. |

## Publication Standard

Every public preview post, README update, site change, or report should preserve the same boundary:

> TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit.

Any future wording that mentions value, live utility, distribution, exchange listing, liquidity, sale, or real-world guest benefits requires legal, governance, security, and operations review before publication.
