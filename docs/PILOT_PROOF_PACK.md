# TikiDeco Pilot Proof Pack

Checked: 2026-07-09

Status: public-review proof pack for the v0.2 utility-pilot track. This is not a live campaign, not a token sale, not a mainnet launch, not a value statement, not an active hospitality-benefit announcement, not a V2 promotion, and not an independent audit report.

## Purpose

This proof pack gives community reviewers, operators, and security reviewers one short path for checking the planned Sepolia-only TIDE Loyalty Pilot.

The goal is to show what is already verifiable, what is still blocked, what evidence exists, and what must happen before any limited preview can be considered.

## Current State

| Area | Current status | Proof |
| --- | --- | --- |
| Network | Ethereum Sepolia only | [`deployments/canonical.json`](../deployments/canonical.json) |
| Canonical version | `v1-legacy` | [`deployments/canonical.json`](../deployments/canonical.json) |
| Utility pilot | Planned / not live | [`config/utility-pilot/tide-community-preview-001.json`](../config/utility-pilot/tide-community-preview-001.json) |
| Campaign status | `draft-not-live` | [`docs/utility-pilot/LIMITED_LIVE_PREVIEW_PATH.md`](utility-pilot/LIMITED_LIVE_PREVIEW_PATH.md) |
| Read-only balance check | Implemented for v0.2 pre-release review | [`docs/utility-pilot/READ_ONLY_BALANCE_CHECK.md`](utility-pilot/READ_ONLY_BALANCE_CHECK.md) |
| Testnet allocation | Dry-run only; not approved and not broadcast | [`operations/utility-pilot/dry-runs/limited-preview-allocation-report-draft.json`](../operations/utility-pilot/dry-runs/limited-preview-allocation-report-draft.json) |
| V2 | Candidate only, not canonical | [`docs/V2_AUDIT_TARGET_FREEZE.md`](V2_AUDIT_TARGET_FREEZE.md) |
| Independent audit | Not started | [`deployments/canonical.json`](../deployments/canonical.json) |
| Mainnet | Not approved | [`docs/MAINNET_GO_NO_GO.md`](MAINNET_GO_NO_GO.md) |

## What Works Now

- Public Sepolia V1 contract links and canonical deployment manifest.
- Read-only public site and public status pages.
- Read-only Sepolia `balanceOf(wallet)` eligibility checker for planning and manual-review design.
- Campaign manifest that fails closed as `draft-not-live`.
- Live-campaign blocker matrix with legal, privacy, security, operations, and governance gates.
- Aggregate-only dry-run allocation report using fake/test addresses.
- Claims, value, site, pilot, and mainnet-blocker checks.

## What Is Not Live

- No request window is open.
- No snapshot block or approved live-check window is published.
- No inventory is published.
- No active guest benefit exists.
- No allocation is approved.
- No Safe transaction is broadcast by this pilot workflow.
- No private participant data collection is approved.
- No independent audit has started.

## How To Verify

Run:

```bash
npm run claims
npm run value
npm run site
npm run pilot
npm run pilot:live:blocked
node scripts/check-mainnet-readiness.cjs --expect-blocked
```

Expected results:

- `claims`, `value`, `site`, and `pilot` should pass.
- `pilot:live:blocked` should pass because the campaign is intentionally blocked.
- `check-mainnet-readiness.cjs --expect-blocked` should pass because mainnet, sale, value, V2 promotion, independent audit, and real-world guest utility remain blocked.

## Live Gate Snapshot

Source: [`docs/utility-pilot/PILOT_LIVE_BLOCKER_REGISTER.md`](utility-pilot/PILOT_LIVE_BLOCKER_REGISTER.md)

| Gate group | Status |
| --- | --- |
| Legal review | evidence-only / not-approved |
| Privacy review | not-approved |
| Security review | not-approved |
| Operations review | evidence-only / not-approved |
| Governance review | not-approved |
| Campaign rules | draft / not-approved |
| Snapshot or approved live-check mode | not-published / not-approved |
| Request window | not-published / not-approved |
| Inventory limits | not-published / not-approved |
| Allocation report path | draft / not-approved |
| Staff and dispute process | draft / not-approved |
| Feedback and transparency reporting | not-started or draft / not-approved |

## Dry-Run Evidence

The current dry run uses fake/test addresses only and does not broadcast a transaction.

| Artifact | Path |
| --- | --- |
| Input | [`operations/utility-pilot/dry-runs/limited-preview-allocation-input.json`](../operations/utility-pilot/dry-runs/limited-preview-allocation-input.json) |
| Safe Transaction Builder draft | [`operations/utility-pilot/dry-runs/limited-preview-safe-transaction-builder-draft.json`](../operations/utility-pilot/dry-runs/limited-preview-safe-transaction-builder-draft.json) |
| Aggregate report draft | [`operations/utility-pilot/dry-runs/limited-preview-allocation-report-draft.json`](../operations/utility-pilot/dry-runs/limited-preview-allocation-report-draft.json) |

Dry-run summary:

- total input rows: 3;
- valid test wallets: 3;
- duplicate wallets rejected: 0;
- invalid rows rejected: 0;
- total testnet TIDE allocated in draft: 150 TIDE;
- Safe Transaction Builder draft SHA-256: `38bd27fdd7ed42bd95aec498034eb52ee996308748d8ee4f317be5f1ecc2f61d`;
- aggregate report draft SHA-256: `3115833dcd768a433239068e34e04d231f3e7d30cdcb079ae4dcb228257639c9`.

## Feedback Path

Use GitHub issues for public feedback:

- site clarity and mobile UX;
- pilot boundary clarity;
- read-only eligibility flow;
- translation review;
- audit-readiness review;
- documentation gaps.

Do not submit private keys, seed phrases, passwords, emails, private guest data, sensitive personal data, or non-public vulnerability details through public issues.

## Required Boundaries

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. Pilot eligibility does not provide active guest benefits, hotel ownership, equity, debt, revenue rights, cash redemption, resale value, or guaranteed benefits.
