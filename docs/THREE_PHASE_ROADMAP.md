# TikiDeco Three-Phase Roadmap

Status: operational roadmap. This is not a token sale, not a mainnet plan, not a value statement, not a live hospitality-benefit announcement, and not an independent audit claim.

This roadmap converts the current project gaps into three release-management phases. Each phase must preserve the public boundaries: Ethereum Sepolia only, no sale, no stated monetary value, no mainnet deployment, no active guest benefits, and independent audit not started unless a future verified audit report exists.

## Current Gap Summary

| Area | Current state | Primary gap |
| --- | --- | --- |
| Utility pilot | Read-only eligibility flow and campaign docs exist. | No executable path to a limited live preview; `npm run pilot:live:blocked` reports blocked gates. |
| External audit | V2 package and handoff docs exist. | Independent audit has not started; V2 remains candidate only. |
| V2 trust decisions | Known issues are documented. | Some owner decisions need clearer evidence before auditor handoff. |
| Role configuration | Deployment guardrails and role manifests exist. | Role-manifest review should become a tight release checklist. |
| Product utility | Site explains eligibility and status. | No measured user workflow or feedback outcomes yet. |
| Pilot operations | Inventory, disputes, staffing, and privacy docs exist. | Operational evidence is not proven. |
| UX | Site checks pass. | First-time reader path is still too document-heavy. |
| Docs | Public docs are thorough. | Need shorter operator/auditor/community start paths. |
| QA | Contract and content checks are strong. | Add browser-level regression coverage for mobile, RPC unavailable, and long localized strings. |
| Release evidence | Packages can be generated. | Next release should prove reproducibility from a fresh checkout and final `main` SHA. |

## Phase 1: Make The Project Easy To Verify

Goal: a new reader, reviewer, or maintainer can understand the current state in under 30 seconds and then follow the correct path.

Exit criteria:

- [ ] Add and maintain [`START_HERE.md`](START_HERE.md).
- [ ] README links to the operator, auditor, community, and contributor start paths.
- [ ] Site copy stays minimal while preserving no-sale/no-value/no-mainnet/independent-audit-not-started boundaries.
- [ ] `docs/PROJECT_FACTS.md` remains current after each merge.
- [ ] `npm run claims`, `npm run value`, `npm run site`, and `npm run pilot:report` pass.
- [ ] Community feedback summaries stay aggregate-only and privacy-safe.

Primary work:

- Reduce public entry points to four: overview, status, pilot, audit.
- Keep deep documents available, but do not force first-time readers through them.
- Keep all utility language separated into current, planned, conceptual, and not claimable.

## Phase 2: Prepare A Limited Sepolia Preview Without Going Live

Goal: create an executable review path for the first limited Sepolia-only utility preview while keeping the campaign blocked until every required gate is approved.

Exit criteria:

- [ ] [`utility-pilot/LIMITED_LIVE_PREVIEW_PATH.md`](utility-pilot/LIMITED_LIVE_PREVIEW_PATH.md) is current.
- [ ] `npm run pilot:live:blocked` passes until every live gate has evidence.
- [ ] Campaign rules, request window, snapshot or approved live-check window, inventory limits, manual review, staff process, dispute process, privacy review, allocation report path, and transparency update path are linked from the gate file.
- [ ] No private participant data, guest data, emails, private keys, seed phrases, or sensitive personal data are collected by default.
- [ ] A dry-run allocation report can be generated and reviewed without broadcasting a transaction.
- [ ] Browser-level regression tests exist for mobile layout, RPC unavailable state, and long localized strings.

Primary work:

- Turn issue #56 into the owner thread for campaign rules, staffing, disputes, and operations.
- Turn issue #58 into the owner thread for inventory and aggregate reporting.
- Turn issue #66 into the owner thread for feedback summaries.
- Keep `draft-not-live` until legal, privacy, security, operations, and governance reviewers explicitly approve evidence.

## Phase 3: Freeze V2 Audit Handoff And Reproducible Release Evidence

Goal: make V2 review-ready for an external auditor without promoting V2, claiming audit completion, or changing canonical V1.

Exit criteria:

- [ ] [`V2_AUDIT_OWNER_DECISIONS.md`](V2_AUDIT_OWNER_DECISIONS.md) has an owner decision or explicit auditor question for every unresolved V2 known issue.
- [ ] [`V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md`](V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md) is used before any public V2 candidate deployment proposal.
- [ ] `KNOWN_ISSUES.md` remains aligned with owner decisions.
- [ ] `npm run audit`, `npm run audit:handoff`, `npm run slither`, `npm test`, `npm run foundry:test`, and `npm run foundry:coverage` pass.
- [ ] Release package generation is proven from a fresh checkout and final `main` SHA.
- [ ] No public document describes V2 as canonical, mainnet-ready, live, or independently audited.

Primary work:

- Keep V2 as candidate code only.
- Keep external-audit package output tied to exact commits.
- Keep release evidence reproducible and reviewable by a third party.

## Next Recommended PRs

| Priority | PR | Purpose |
| --- | --- | --- |
| P0 | Limited live preview path | Convert 14 blocked live gates into owner-review evidence tasks. |
| P0 | V2 owner decisions | Clarify known-issue decisions before auditor handoff. |
| P1 | Start-here simplification | Give operator/auditor/community readers a short path. |
| P1 | Browser regression QA | Add Playwright or equivalent site checks for mobile, RPC failure, and localized text. |
| P1 | Fresh-checkout release proof | Document and automate release-package reproduction from a clean clone. |

## Standing Non-Goals

- No token sale.
- No purchase or presale workflow.
- No stated monetary value.
- No mainnet deployment.
- No live guest benefit claim.
- No wallet transaction signing in the site.
- No independent audit claim until an external report exists.
