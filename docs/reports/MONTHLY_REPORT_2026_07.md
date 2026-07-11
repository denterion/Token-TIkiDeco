# TikiDeco Monthly Transparency Report - 2026-07

Report period: 2026-07. Generated from repository and GitHub evidence on 2026-07-11. Every status below is a dated snapshot, not a promise of future completion. Evidence: [docs/PROJECT_FACTS.md](../../docs/PROJECT_FACTS.md) and [docs/CLAIMS_MATRIX.md](../../docs/CLAIMS_MATRIX.md).

## Current Main Commit

| Fact | Status | Evidence |
| --- | --- | --- |
| Current main at generation | `2efd62299cb18d7565c7ceb4e48619190062b3b3` | [Commit](https://github.com/denterion/Token-TIkiDeco/commit/2efd62299cb18d7565c7ceb4e48619190062b3b3) / `git rev-parse origin/main` |

## Canonical Deployment

| Fact | Status | Evidence |
| --- | --- | --- |
| Network | Ethereum Sepolia, chain ID 11155111 | [deployments/canonical.json](../../deployments/canonical.json) |
| Canonical version | v1-legacy; legacy testnet prototype | [deployments/canonical.json](../../deployments/canonical.json) |
| Token | `0xE4c1DE533440b411Be5C17883FF662e95a462097` | [Verified source](https://sepolia.etherscan.io/address/0xE4c1DE533440b411Be5C17883FF662e95a462097#code) / [deployments/canonical.json](../../deployments/canonical.json) |
| Vesting vault | `0xc480565482af6B08A3b65D0C9aba985d6240702E` | [Verified source](https://sepolia.etherscan.io/address/0xc480565482af6B08A3b65D0C9aba985d6240702E#code) / [deployments/canonical.json](../../deployments/canonical.json) |
| Owner Safe | `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3`; threshold 3-of-3 | [deployments/canonical.json](../../deployments/canonical.json) |

## Current Releases

| Release | Status | Source commit | Evidence |
| --- | --- | --- | --- |
| v0.1.0-sepolia | published-pre-release | `e07471936375ffbe13c68da2708b4436931392a2` | [Release](https://github.com/denterion/Token-TIkiDeco/releases/tag/v0.1.0-sepolia) / [config/public-versions.json](../../config/public-versions.json) |
| v0.2.0-utility-pilot | published-pre-release | `5ed20415b569779f8b00245af8b98b9599f77044` | [Release](https://github.com/denterion/Token-TIkiDeco/releases/tag/v0.2.0-utility-pilot) / [config/public-versions.json](../../config/public-versions.json) |
| Review evidence baseline | pre-release evidence baseline | `00e0ccbbf26397aadd5416816bba44e7cc2e373b` | [config/release-evidence.json](../../config/release-evidence.json) |

## V2 Candidate Status

| Fact | Status | Evidence |
| --- | --- | --- |
| Candidate | Frozen non-canonical review candidate | [config/audit/v2-review-candidate.json](../../config/audit/v2-review-candidate.json) / [deployments/canonical.json](../../deployments/canonical.json) |
| Candidate evidence commit | `cdc9e7e27e66f204c50d59e45ccf970ad20290d6` | [Commit](https://github.com/denterion/Token-TIkiDeco/commit/cdc9e7e27e66f204c50d59e45ccf970ad20290d6) / [config/audit/v2-review-candidate.json](../../config/audit/v2-review-candidate.json) |
| Package SHA-256 | `980555973d47cb5b21b900f3d463890d4faeeff1c45d351332906f5149bae1a2` | [config/audit/v2-review-candidate.json](../../config/audit/v2-review-candidate.json) |
| Independent review | not-started; formal independent smart-contract audit not-started | [config/audit/v2-review-candidate.json](../../config/audit/v2-review-candidate.json) |

## Community Review Status

| Fact | Status | Evidence |
| --- | --- | --- |
| Community peer review | open-for-community-peer-review | [config/community-review/status.json](../../config/community-review/status.json) |
| Candidate commit | `cdc9e7e27e66f204c50d59e45ccf970ad20290d6` | [Candidate](https://github.com/denterion/Token-TIkiDeco/tree/cdc9e7e27e66f204c50d59e45ccf970ad20290d6) / [config/community-review/status.json](../../config/community-review/status.json) |
| Acknowledged reviewers | 0 | [config/community-review/status.json](../../config/community-review/status.json) |
| Formal audit status | not-started; community review is not a formal audit | [config/community-review/status.json](../../config/community-review/status.json) |

## Findings Summary

| Fact | Count | Evidence |
| --- | ---: | --- |
| Total recorded | 0 | [config/community-review/findings.json](../../config/community-review/findings.json) |

Zero recorded findings is not evidence that vulnerabilities do not exist. Evidence: [docs/community-review/FINDING_LIFECYCLE.md](../../docs/community-review/FINDING_LIFECYCLE.md).

## Open Issue Summary

| Milestone | Open issues | Evidence |
| --- | ---: | --- |
| Community Review Intake | 4 | [Open issues](https://github.com/denterion/Token-TIkiDeco/issues?q=is%3Aissue+is%3Aopen) / `gh issue list --state open --limit 200 --json number,labels,milestone,updatedAt` |
| External Validation | 2 | [Open issues](https://github.com/denterion/Token-TIkiDeco/issues?q=is%3Aissue+is%3Aopen) / `gh issue list --state open --limit 200 --json number,labels,milestone,updatedAt` |
| Future Production Decision | 1 | [Open issues](https://github.com/denterion/Token-TIkiDeco/issues?q=is%3Aissue+is%3Aopen) / `gh issue list --state open --limit 200 --json number,labels,milestone,updatedAt` |
| Operator Sandbox | 1 | [Open issues](https://github.com/denterion/Token-TIkiDeco/issues?q=is%3Aissue+is%3Aopen) / `gh issue list --state open --limit 200 --json number,labels,milestone,updatedAt` |
| Public Preview Hardening | 7 | [Open issues](https://github.com/denterion/Token-TIkiDeco/issues?q=is%3Aissue+is%3Aopen) / `gh issue list --state open --limit 200 --json number,labels,milestone,updatedAt` |
| **Total** | **15** | [Open issues](https://github.com/denterion/Token-TIkiDeco/issues?q=is%3Aissue+is%3Aopen) / `gh issue list --state open --limit 200 --json number,labels,milestone,updatedAt` |

## Test And Security Checks

| Check | Result | Command | Evidence |
| --- | --- | --- | --- |
| Public claims | PASS | `npm run claims:check` | [docs/reports/automation/STATUS_2026_07_11.md](../../docs/reports/automation/STATUS_2026_07_11.md) |
| Release document | PASS | `npm run release:check` | [docs/reports/automation/STATUS_2026_07_11.md](../../docs/reports/automation/STATUS_2026_07_11.md) |
| Utility pilot campaign | PASS | `npm run pilot:campaign:check` | [docs/reports/automation/STATUS_2026_07_11.md](../../docs/reports/automation/STATUS_2026_07_11.md) |
| Public site | PASS | `npm run site:check` | [docs/reports/automation/STATUS_2026_07_11.md](../../docs/reports/automation/STATUS_2026_07_11.md) |
| Contract and repository tests | PASS | `npm test` | [docs/reports/automation/STATUS_2026_07_11.md](../../docs/reports/automation/STATUS_2026_07_11.md) |
| Mainnet/value gate remains blocked | PASS | `node scripts/check-mainnet-readiness.cjs --expect-blocked` | [docs/reports/automation/STATUS_2026_07_11.md](../../docs/reports/automation/STATUS_2026_07_11.md) |

These are repository checks recorded by the latest internal status run; they are not an independent security conclusion. Evidence: [docs/reports/automation/STATUS_2026_07_11.md](../../docs/reports/automation/STATUS_2026_07_11.md) and [SECURITY_CI.md](../../SECURITY_CI.md).

## Pilot Status

| Fact | Status | Evidence |
| --- | --- | --- |
| Campaign | draft-not-live; lifecycle stage draft | [config/utility-pilot/tide-community-preview-001.json](../../config/utility-pilot/tide-community-preview-001.json) |
| Request window | not-published | [config/utility-pilot/tide-community-preview-001.json](../../config/utility-pilot/tide-community-preview-001.json) |
| Published inventory | 0 | [config/utility-pilot/tide-community-preview-001.json](../../config/utility-pilot/tide-community-preview-001.json) |
| Required approvals | 5 not approved | [config/utility-pilot/tide-community-preview-001.json](../../config/utility-pilot/tide-community-preview-001.json) |

## Safe Drill Status

| Fact | Status | Evidence |
| --- | --- | --- |
| Threshold decision | retain-current-threshold-pending-governance-review; threshold unchanged | [config/governance/safe-resilience.json](../../config/governance/safe-resilience.json) |
| Tabletop drill | tabletop-test-only-completed-2026-07-11 | [config/governance/safe-resilience.json](../../config/governance/safe-resilience.json) / [docs/governance/SAFE_RESILIENCE_DRILL_2026.md](../../docs/governance/SAFE_RESILIENCE_DRILL_2026.md) |
| Governance readiness | blocked; 0/5 gates approved | [config/governance/readiness.json](../../config/governance/readiness.json) |

## Operator Sandbox Status

| Fact | Status | Evidence |
| --- | --- | --- |
| Operator pilot | blocked; operator not-established; property not-established | [config/hospitality-operator/readiness-gates.json](../../config/hospitality-operator/readiness-gates.json) |
| Real inventory | 0 | [config/hospitality-operator/readiness-gates.json](../../config/hospitality-operator/readiness-gates.json) |
| Local demonstration | local-fake-data-only; report state closed | [operations/hospitality-operator/operator-sandbox-report.json](../../operations/hospitality-operator/operator-sandbox-report.json) |
| Demonstration report SHA-256 | `d2e0e153c6d86c3d995e7e908115aa092889d5bc5a1723a75ec8f54c8d1547a1` | [operations/hospitality-operator/operator-sandbox-report.json](../../operations/hospitality-operator/operator-sandbox-report.json) |

## Legal And External-Review Blockers

| Blocker | Status | Evidence |
| --- | --- | --- |
| Independent reviewer engagement | Not started; selection and handoff remain externally blocked | [docs/PUBLIC_REVIEW_PROCUREMENT_BRIEF.md](../../docs/PUBLIC_REVIEW_PROCUREMENT_BRIEF.md) / [Issue #121](https://github.com/denterion/Token-TIkiDeco/issues/121) |
| Legal/entity review | Requires external counsel review; no approval is recorded | [docs/LEGAL_READINESS.md](../../docs/LEGAL_READINESS.md) / [docs/MAINNET_GO_NO_GO.md](../../docs/MAINNET_GO_NO_GO.md) |
| Operator readiness | blocked; all 8 operator gates remain not approved | [config/hospitality-operator/readiness-gates.json](../../config/hospitality-operator/readiness-gates.json) |
| Release evidence refresh | Recorded baseline `00e0ccbbf26397aadd5416816bba44e7cc2e373b` does not match current main at generation | [config/release-evidence.json](../../config/release-evidence.json) / [docs/RELEASE_CONTROL_CENTER.md](../../docs/RELEASE_CONTROL_CENTER.md) |

## Mainnet Status

| Fact | Status | Evidence |
| --- | --- | --- |
| Mainnet readiness | Blocked; 29 unapproved statuses | [docs/MAINNET_GO_NO_GO.md](../../docs/MAINNET_GO_NO_GO.md) / `node scripts/check-mainnet-readiness.cjs --expect-blocked` |
| Canonical network | Sepolia; no mainnet deployment recorded | [deployments/canonical.json](../../deployments/canonical.json) |

## Next-Month Goals

| Status | Goal | Evidence |
| --- | --- | --- |
| Planned | Invite qualified independent reviewers to assess the frozen V2 package and record real procurement evidence. | [docs/ONE_YEAR_DEVELOPMENT_PLAN.md](../../docs/ONE_YEAR_DEVELOPMENT_PLAN.md) / [Issue #121](https://github.com/denterion/Token-TIkiDeco/issues/121) |
| Planned | Run operator interviews against the fake-data sandbox without collecting guest or booking data. | [docs/hospitality-operator/OPERATOR_INTERVIEW_GUIDE.md](../../docs/hospitality-operator/OPERATOR_INTERVIEW_GUIDE.md) / [docs/ONE_YEAR_DEVELOPMENT_PLAN.md](../../docs/ONE_YEAR_DEVELOPMENT_PLAN.md) |
| In progress | Keep community peer review open and summarize only real, privacy-safe feedback. | [config/community-review/status.json](../../config/community-review/status.json) / [Issue #66](https://github.com/denterion/Token-TIkiDeco/issues/66) |
| Blocked | Keep the pilot and mainnet gates closed until accountable external evidence exists. | [config/utility-pilot/tide-community-preview-001.json](../../config/utility-pilot/tide-community-preview-001.json) / [docs/MAINNET_GO_NO_GO.md](../../docs/MAINNET_GO_NO_GO.md) |

## Public Boundaries

TIDE remains a Sepolia testnet prototype: no sale, no stated monetary value, no mainnet deployment, no active hospitality benefit, and no completed independent audit. V2 remains non-canonical. Evidence: [docs/PROJECT_FACTS.md](../../docs/PROJECT_FACTS.md) and [docs/VALUE_CLAIM_POLICY.md](../../docs/VALUE_CLAIM_POLICY.md).

## Report Integrity

| Fact | Value | Evidence |
| --- | --- | --- |
| Report body SHA-256 | `955f1af7a91b951d702e8f4c97ccabd00e7d7e3e65ea40ea69a9f5059a90a3de` | Recompute with `npm run transparency:monthly:check` |
| Machine summary | `docs/reports/MONTHLY_REPORT_2026_07.json` | [docs/reports/MONTHLY_REPORT_2026_07.json](../../docs/reports/MONTHLY_REPORT_2026_07.json) |
