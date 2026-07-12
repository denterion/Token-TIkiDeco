# GitHub Issue Status Audit

Audit date: 2026-07-12

Repository snapshot: `d437afd7e9f5e480afc776ce4b01e7f29942d060`

Machine-readable actions: [`../operations/github/issue-actions.json`](../operations/github/issue-actions.json)

An issue is marked `completed` only when every acceptance criterion has repository evidence and a passing verification command. A similarly named file is not completion evidence. No issue was closed by this audit.

## Status Summary

| Status | Count |
| --- | ---: |
| Completed | 9 |
| Partially implemented | 1 |
| Superseded | 1 |
| Blocked externally | 3 |
| Not started | 2 |
| Implemented but not verified | 0 |
| Duplicate | 0 |

## Issue Status Table

| Issue | Current status | Acceptance criteria and evidence | Verification | Missing work | Recommended action | Milestone / quarter | Dependency or blocker |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#55](https://github.com/denterion/Token-TIkiDeco/issues/55) Review read-only Sepolia balance checker | completed | Address validation: `test-eligibility-engine.cjs`; live/cached/stale/wrong-chain/unavailable states: `readOnlyBalance.ts`; no invented RPC values or transaction controls: Playwright. | `npm run eligibility`; `npm run site:browser` | None for recorded criteria. | Recommend close with evidence. | Public Preview Hardening / Q1 | None. |
| [#56](https://github.com/denterion/Token-TIkiDeco/issues/56) Review pilot campaign rules | completed | Manifest remains `draft-not-live`; reviewer states are explicit; request window, inventory and reports remain blocked. Evidence: campaign manifest, live gates, review packet. | `npm run pilot:campaign`; `npm run pilot:live` | Future approval is separate from this no-go confirmation. | Recommend close with evidence. | Community Review Intake / Q1 | Later live decision requires external approvals. |
| [#57](https://github.com/denterion/Token-TIkiDeco/issues/57) Review Sepolia testnet allocation policy | completed | Caps, anti-spam, manual review, invalid/duplicate rejection and no-broadcast behavior are present in policy, generator and dry run. | `npm run allocation` | No policy work; execution remains unapproved. | Recommend close with evidence. | Public Preview Hardening / Q1 | Separate Safe and campaign approvals for any execution. |
| [#58](https://github.com/denterion/Token-TIkiDeco/issues/58) Finalize allocation report template | completed | Campaign/totals/status/hash/privacy fields exist; request and outcome totals are separated; post-campaign hash flow is documented. | `npm run allocation` | A final report cannot exist before an approved campaign. | Recommend close template issue. | Public Preview Hardening / Q1 | Real campaign report is separately blocked. |
| [#59](https://github.com/denterion/Token-TIkiDeco/issues/59) Expand frontend eligibility tests | completed | All requested deterministic address, balance, chain, RPC fallback, stale cache and forbidden-copy cases exist. | `npm run eligibility`; `npm run site:browser` | None for listed cases. | Recommend close with evidence. | Public Preview Hardening / Q1 | None. |
| [#60](https://github.com/denterion/Token-TIkiDeco/issues/60) Keep mainnet gate blocked until approvals | blocked externally | Fail-closed script and CI behavior are verified. Current run reports 29 unapproved states. | `node scripts/check-mainnet-readiness.cjs --expect-blocked` | External legal, audit, entity, operator, governance, tax/accounting and production decisions. | Keep open as P0 no-go sentinel. | Future Production Decision / Q4 | External approvals; never a ready coding task. |
| [#61](https://github.com/denterion/Token-TIkiDeco/issues/61) Maintain value claim checker coverage | completed | Scanners cover README, docs, generated site, release and social surfaces and emit file/line conflicts. | `npm run value`; `npm run claims` | None for current surfaces. | Recommend close; CI retains the invariant. | Public Preview Hardening / Q1 | None. |
| [#62](https://github.com/denterion/Token-TIkiDeco/issues/62) Harden V2 audit package command | completed | Current-main reproduction contains V2 source, ABI, bytecode, tests, Slither baseline, known issues, freeze docs and checksums; optional omissions are listed. | `npm run audit:package`; `npm run review:candidate:check`; `npm run review:handoff:check` | Independent reviewer engagement is #121, not package hardening. | Recommend close with reproduction evidence. | External Validation / Q1 | Reviewer procurement tracked separately. |
| [#63](https://github.com/denterion/Token-TIkiDeco/issues/63) Improve accessibility for utility pilot pages | completed | Mocked-RPC Playwright coverage verifies Tab order, visible focus, Enter/Space activation, persistent focus, live status announcements, linked invalid-address errors, eligible/zero/unavailable/wrong-chain states, and mobile overflow. | `npm run eligibility`; `npm run site:typecheck`; `npm run site`; `npm run site:browser`; `npm run claims`; `npm run value` | None for recorded criteria. | Recommend close after merge; no automatic closure. | Public Preview Hardening / Q1 | None. |
| [#64](https://github.com/denterion/Token-TIkiDeco/issues/64) Review EN/ES/RU utility-pilot translations | superseded | Repository facts verify the current site is English-only; historical translation files do not satisfy current UI acceptance criteria. | `npm run site:browser`; `npm run claims`; `npm run value` | Maintainer must rescope future translation review or archive it after a documented decision. | Update scope; do not close as completed. | Community Review Intake / Q1 | Translation product-scope decision. |
| [#65](https://github.com/denterion/Token-TIkiDeco/issues/65) Prepare transparency update template for v0.2 RC | completed | Current/planned/conceptual/not-claimable separation, validation commands, blocked mainnet state and no-broadcast hash flow are documented. Monthly source-linked report generation and checksum verification now provide stronger executable evidence. | `npm run transparency:monthly:build`; `npm run transparency:monthly:check`; `npm run claims`; `npm run value` | None for template preparation. | Recommend close with evidence; do not close automatically. | Community Review Intake / Q1 | None. |
| [#66](https://github.com/denterion/Token-TIkiDeco/issues/66) Collect community preview feedback summary | blocked externally | Privacy-safe workflow exists, but the existing report counts maintainer-created intake issues; search found no external community-preview submissions. | `gh issue list --search "label:community-preview -author:denterion"` | Receive and aggregate real public feedback without private data. | Keep open; do not manufacture feedback. | Community Review Intake / Q1 | External reviewer participation. |
| [#119](https://github.com/denterion/Token-TIkiDeco/issues/119) Enforce generated sitemap and canonical route parity | not started | Current checker verifies selected URLs, not complete generated route parity or duplicate negative fixtures. | `npm run site`; `npm run site:browser` | Implement deterministic route-set parity and fixtures. | Keep open; good first issue. | Public Preview Hardening / Q1 | None. |
| [#120](https://github.com/denterion/Token-TIkiDeco/issues/120) Add deterministic operator sandbox lifecycle tests | partially implemented | Baseline campaign/inventory/decision/close/privacy flow passes. Duplicate-wallet, inventory-exhaustion, repeated-decision, post-close and audit-log invariants are not tested. | `npm run operator-pilot:sandbox`; `npm run operator-pilot:check`; `npm run site:typecheck` | Add the focused edge-state assertions using fake local data. | Keep open; contributor-ready. | Operator Sandbox / Q2 | None; fake local data only. |
| [#121](https://github.com/denterion/Token-TIkiDeco/issues/121) Select independent reviewer and initiate frozen V2 review | blocked externally | Selection, conflict and handoff documents exist; no real reviewer, contract, budget approval or handoff evidence exists. | `npm run review:candidate:check`; `npm run review:handoff:check`; `npm run findings:check` | Select a qualified independent reviewer and record real procurement/handoff evidence. | Keep open; maintainer/external task. | External Validation / Q1 | Reviewer, conflict review, budget and agreement. |
| [#127](https://github.com/denterion/Token-TIkiDeco/issues/127) Add deterministic landmark and heading hierarchy checks | not started | No route-wide landmark/heading-order assertions exist yet. | `npm run site`; `npm run site:browser`; `npm run claims`; `npm run value` | Add deterministic desktop/mobile semantic-structure checks. | Keep open; good first issue. | Public Preview Hardening / Q1 | None. |

## Proposed Close Set

Recommend closing only after a maintainer reviews the suggested evidence comments in the action file:

`#55`, `#56`, `#57`, `#58`, `#59`, `#61`, `#62`, `#63`, `#65`.

No automatic closure was performed. In particular, #60 is not a completed production decision, #64 is superseded rather than completed, and #66 has no real external feedback outcome.

## Milestone Board

| Milestone | Current issues | Purpose |
| --- | --- | --- |
| Community Review Intake | #56, #64, #65, #66 | Intake rules, public reporting, translation scope and real feedback. |
| Public Preview Hardening | #55, #57, #58, #59, #61, #63, #119, #127 | Deterministic read-only UI, claims, accessibility, reporting and route integrity. |
| External Validation | #62, #121 | Reproducible package and real independent-review procurement. |
| Operator Sandbox | #120 | Fake-data operator lifecycle verification. |
| Future Production Decision | #60 | Explicit external no-go gate; not a coding queue. |

## Label Taxonomy

- Priority: `priority:P0`, `priority:P1`, `priority:P2`.
- Work area: `security`, `review`, `frontend`, `accessibility`, `documentation`, `privacy`, `operations`.
- State and routing: `externally-blocked`, `ready-for-contributor`, `good-first-issue`.

These labels and all five milestones were created or normalized on GitHub during this audit. Existing domain labels remain available for compatibility.

## Top Five Next Issues

1. [#121](https://github.com/denterion/Token-TIkiDeco/issues/121): select a real independent reviewer and initiate the immutable V2 handoff. P0, externally blocked.
2. [#120](https://github.com/denterion/Token-TIkiDeco/issues/120): add operator-sandbox edge-state invariants. P1, intermediate.
3. [#66](https://github.com/denterion/Token-TIkiDeco/issues/66): collect the first real privacy-safe external feedback set. P1, externally blocked on participation.
4. [#119](https://github.com/denterion/Token-TIkiDeco/issues/119): enforce deterministic sitemap/canonical parity. P2, good first issue.
5. [#127](https://github.com/denterion/Token-TIkiDeco/issues/127): add route-wide landmark and heading hierarchy checks. P2, good first issue.

## Verification Snapshot

The accessibility run passed `eligibility`, typecheck, site, browser, claims, and value gates. Playwright reported 28 passed and 2 intentionally skipped across desktop and mobile. The broader audit-package and mainnet statuses remain unchanged from their separate evidence records.
