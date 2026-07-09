# Public Entry Points

Status: public-information architecture. This document does not approve a token sale, value statement, mainnet deployment, active guest benefit, V2 promotion, or independent audit claim.

TikiDeco public materials should route first-time readers through exactly four primary entry points: Overview, Status, Pilot, and Audit. Feedback is the action path attached to those entry points.

## Overview

Purpose: explain what TikiDeco is in plain language.

Target reader: first-time community reviewer, journalist, contributor, or technical observer.

Required disclaimers:

- TIDE is an Ethereum Sepolia prototype.
- TIDE is not offered for sale.
- TIDE has no stated monetary value.
- TIDE is not deployed on mainnet.
- TikiDeco has not completed an independent audit.

Source-of-truth files:

- [`README.md`](../README.md)
- [`START_HERE.md`](START_HERE.md)
- [`PROJECT_FACTS.md`](PROJECT_FACTS.md)
- [`OFFICIAL_PUBLIC_PREVIEW.md`](OFFICIAL_PUBLIC_PREVIEW.md)

Allowed claims:

- open-source Sepolia prototype;
- read-only public website;
- canonical V1 legacy deployment;
- V2 candidate code only;
- public facts and report hashes are available for review.

Prohibited claims:

- sale, presale, buy flow, price, or exchange listing;
- no mainnet live claim;
- no active hospitality utility claim;
- no hotel ownership or revenue rights claim;
- no completed independent audit claim.

## Status

Purpose: show what exists now, what is planned, and what is explicitly not live.

Target reader: user checking current deployment, release manager, governance reviewer.

Required disclaimers:

- canonical deployment is V1 legacy on Ethereum Sepolia;
- v0.2 utility pilot is a pre-release / release-candidate track, not a live campaign;
- V2 is not canonical;
- no active guest benefits are live;
- independent audit not started.

Source-of-truth files:

- [`PROJECT_FACTS.md`](PROJECT_FACTS.md)
- [`NEXT_RELEASE_GATES.md`](NEXT_RELEASE_GATES.md)
- [`RELEASE_CONTROL_CENTER.md`](RELEASE_CONTROL_CENTER.md)
- [`../deployments/canonical.json`](../deployments/canonical.json)

Allowed claims:

- V1 Sepolia token and vault addresses from the canonical manifest;
- Safe owner and treasury from the canonical manifest;
- v0.1 and v0.2 pre-release status;
- stale release evidence if the Control Center reports it.

Prohibited claims:

- production-ready;
- mainnet-ready;
- live campaign;
- active guest benefits;
- no independently audited claim.

## Pilot

Purpose: explain the planned read-only Sepolia utility-pilot flow and why it is not live.

Target reader: potential community tester, pilot operator, privacy reviewer.

Required disclaimers:

- campaign is `draft-not-live`;
- no wallet transaction signing;
- no token purchase or payment flow;
- no guaranteed benefit;
- no private keys, seed phrases, emails, guest data, or sensitive personal data by default.

Source-of-truth files:

- [`utility-pilot/README.md`](utility-pilot/README.md)
- [`utility-pilot/LIMITED_LIVE_PREVIEW_PATH.md`](utility-pilot/LIMITED_LIVE_PREVIEW_PATH.md)
- [`utility-pilot/PILOT_LIVE_BLOCKER_REGISTER.md`](utility-pilot/PILOT_LIVE_BLOCKER_REGISTER.md)
- [`../config/utility-pilot/tide-community-preview-001.json`](../config/utility-pilot/tide-community-preview-001.json)

Allowed claims:

- read-only Sepolia `balanceOf(wallet)` check is prepared;
- eligibility flow is planned and not live;
- pilot gates require legal, privacy, security, operations, and governance approval;
- reports should be privacy-safe and aggregate-only.

Prohibited claims:

- active hotel benefit;
- confirmed RSVP access;
- guaranteed eligibility;
- paid allocation;
- wallet transaction requirement.

## Audit

Purpose: separate internal review, V1 legacy deployment, and V2 candidate audit-preparation scope.

Target reader: smart-contract reviewer, security researcher, external auditor.

Required disclaimers:

- internal review is not an independent audit;
- independent audit has not started;
- V2 is candidate code only;
- V1 remains the historical canonical Sepolia deployment.

Source-of-truth files:

- [`EXTERNAL_AUDIT_READINESS.md`](EXTERNAL_AUDIT_READINESS.md)
- [`V2_AUDIT_TARGET_FREEZE.md`](V2_AUDIT_TARGET_FREEZE.md)
- [`V2_AUDIT_OWNER_DECISIONS.md`](V2_AUDIT_OWNER_DECISIONS.md)
- [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md)
- [`../AUDIT_SCOPE.md`](../AUDIT_SCOPE.md)

Allowed claims:

- tests, Slither baseline, Foundry invariants, coverage, gas, SBOM, and audit package commands exist;
- V2 audit package preparation exists;
- known issues and owner decisions are documented.

Prohibited claims:

- audited;
- secure;
- no vulnerabilities;
- V2 canonical;
- mainnet-ready.

## Feedback Action

Feedback should point to GitHub issues and the feedback guide, not to a purchase, waitlist, or transaction flow.

Required links:

- [`FEEDBACK_GUIDE.md`](FEEDBACK_GUIDE.md)
- [GitHub Issues](https://github.com/denterion/Token-TIkiDeco/issues)
- [`COMMUNITY_PREVIEW.md`](COMMUNITY_PREVIEW.md)

Feedback boundaries:

- do not submit private keys, seed phrases, passwords, private guest data, sensitive personal data, or non-public vulnerability details;
- use `SECURITY.md` for sensitive security reports;
- separate current, planned, conceptual, and not-claimable feedback.
