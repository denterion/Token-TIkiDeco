# TikiDeco Counsel Intake Package

Status: preparation packet for external counsel intake. This document is not legal advice, a regulatory conclusion, an offering document, or approval for sale, mainnet, real-world utility, or broader promotion.

## Purpose

This package gives counsel a narrow, fact-based view of TikiDeco / TIDE before any broader public preview, utility planning, token distribution, or mainnet discussion.

TikiDeco / TIDE is currently an open-source Ethereum Sepolia prototype. TIDE is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit.

## Review Objective

Counsel should review whether current public materials are appropriate for a Sepolia-only prototype and identify required changes before any of the following:

- public promotion beyond repository/site visibility;
- collection of emails, wallet addresses, guest data, or eligibility data;
- real-world loyalty, access, discount, membership, booking, or hospitality benefit;
- token distribution beyond testnet/prototype use;
- exchange, redemption, treasury, fundraising, or mainnet planning.

## Current Facts

| Fact | Current position | Source |
| --- | --- | --- |
| Network | Ethereum Sepolia | [`deployments/canonical.json`](../deployments/canonical.json) |
| Chain ID | `11155111` | [`deployments/canonical.json`](../deployments/canonical.json) |
| Canonical deployment | V1 legacy Sepolia deployment | [`deployments/canonical.json`](../deployments/canonical.json) |
| V2 status | Candidate review code only | [`V2_AUDIT_TARGET_FREEZE.md`](V2_AUDIT_TARGET_FREEZE.md) |
| Sale status | No sale | [`PROJECT_FACTS.md`](PROJECT_FACTS.md) |
| Monetary value | No stated monetary value | [`PROJECT_FACTS.md`](PROJECT_FACTS.md) |
| Mainnet status | Not deployed | [`PROJECT_FACTS.md`](PROJECT_FACTS.md) |
| Audit status | Internal review only; independent audit not started | [`PROJECT_FACTS.md`](PROJECT_FACTS.md) |
| Safe control | Sepolia V1 owner is a `3-of-3` Safe | [`GOVERNANCE.md`](GOVERNANCE.md) |
| Public claims policy | Restricted by claims matrix | [`CLAIMS_MATRIX.md`](CLAIMS_MATRIX.md) |

## Materials To Review

| Area | File |
| --- | --- |
| Public overview | [`../README.md`](../README.md) |
| Project facts | [`PROJECT_FACTS.md`](PROJECT_FACTS.md) |
| Claims policy | [`CLAIMS_MATRIX.md`](CLAIMS_MATRIX.md) |
| Communication rules | [`COMMUNICATION_PLAYBOOK.md`](COMMUNICATION_PLAYBOOK.md) |
| Public materials | [`PUBLIC_MATERIALS.md`](PUBLIC_MATERIALS.md) |
| Public communication review | [`../PUBLIC_COMMUNICATION_REVIEW.md`](../PUBLIC_COMMUNICATION_REVIEW.md) |
| Legal readiness | [`LEGAL_READINESS.md`](LEGAL_READINESS.md) |
| Risk disclosure | [`RISK_DISCLOSURE.md`](RISK_DISCLOSURE.md) |
| Governance decisions | [`GOVERNANCE_DECISION_REGISTER.md`](GOVERNANCE_DECISION_REGISTER.md) |
| Release draft | [`releases/v0.1.0-sepolia.md`](releases/v0.1.0-sepolia.md) |
| Website legal pages | [`../site-v2/src/pages`](../site-v2/src/pages) |

## Counsel Questions

| Topic | Question | Current project position |
| --- | --- | --- |
| Public preview | Can the project publicly describe the Sepolia prototype using the approved no-sale/no-value/no-mainnet language? | Needs counsel before broader promotion. |
| Entity | What entity should own IP, website operations, treasury policy, Safe administration, and future hospitality operations? | Undefined. |
| Token classification | Does publishing a fixed-supply testnet token and source code create any offering concern by itself? | Unknown; avoid sale/value language. |
| Future utility | What documents are required before loyalty, access, discount, membership, booking, or guest benefit programs? | Conceptual/planned only. |
| Data collection | What privacy, consent, retention, and jurisdiction terms are needed before collecting emails, wallet addresses, or guest data? | Do not collect yet. |
| Distribution | What review is needed before any transfer campaign, redemption, exchange, fundraising, or paid access flow? | Blocked without counsel. |
| Jurisdiction | What U.S., Florida, and international limitations should be added before broader public visibility? | Needs counsel. |
| Marketing | Which claims should be removed, qualified, or reviewed before social/community preview? | Use claims matrix until counsel updates it. |

## Go / No-Go Matrix

| Action | Current status | Required before action |
| --- | --- | --- |
| Keep repository public | Go, if claims matrix remains enforced. | Continue `npm run claims:check`. |
| Keep read-only website public | Go, if disclaimers and no-offer language remain visible. | Continue `npm run site:check`. |
| Publish Sepolia pre-release materials | Conditional go. | Current facts, release package, and no-sale/no-value/no-mainnet disclaimer must match. |
| Broader community preview | Review needed. | Counsel or explicit governance risk acceptance. |
| Collect user emails, wallet addresses, guest data, or eligibility info | No-go for now. | Privacy review, terms, data flow, retention policy, and security controls. |
| Offer real-world loyalty, access, discount, membership, booking, or hospitality benefit | No-go for now. | Counsel review, operating terms, utility terms, risk disclosure, and governance approval. |
| Token sale, presale, paid access, redemption, exchange campaign, or value flow | No-go. | Separate legal, tax, compliance, treasury, and security process. |
| Mainnet deployment | No-go. | Counsel review, independent audit, final treasury governance, final utility terms, and final public docs. |

## Outputs Requested From Counsel

- Required edits to README, website, release notes, social copy, and legal pages.
- Allowed, counsel-required, and prohibited claims list.
- Required disclaimers for site, repository, releases, and social posts.
- Entity, IP, treasury, and Safe governance recommendations.
- Privacy/data-collection requirements.
- Jurisdiction and visibility limitations.
- Required steps before any real-world utility, distribution, redemption, sale, or mainnet work.

## Update Triggers

Refresh this package when:

- `deployments/canonical.json` changes;
- V2 audit scope or freeze baseline changes;
- release package evidence changes;
- public site copy changes materially;
- counsel provides feedback;
- the project considers data collection, real-world utility, token distribution, or mainnet.
