# Current Evidence-Linked Roadmap

Generated from `config/roadmap/roadmap.json` at repository commit `99c609e43fc8faa70ae57ac1b79d938b8eaeee28` on 2026-07-12. This is a generated planning snapshot, not an immutable release and not a promise of completion.

Current canonical deployment remains V1 legacy on Ethereum Sepolia. V2 remains a non-canonical candidate. Community peer review does not establish independent validation.

## Quarter Compliance

Compliance means an item has repository evidence marked `internally-complete` or real external evidence marked `externally-verified`. A passing internal command never satisfies an external gate.

| Quarter | Verified | Tracked | Compliance |
| --- | ---: | ---: | ---: |
| Q1 | 6 | 10 | 60% |
| Q2 | 1 | 4 | 25% |
| Q3 | 0 | 2 | 0% |
| Q4 | 0 | 2 | 0% |

## Internal And External Progress

| Evidence class | Verified | Tracked | Compliance |
| --- | ---: | ---: | ---: |
| internal engineering | 7 | 9 | 77.8% |
| external reviewer | 0 | 2 | 0% |
| legal | 0 | 2 | 0% |
| operator | 0 | 1 | 0% |
| user | 0 | 2 | 0% |
| production approval | 0 | 2 | 0% |

## Roadmap Items

| ID | Quarter | Evidence class | Status | Source commit | Evidence | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| `Q1-ENG-ACCESSIBILITY` | Q1 | internal engineering | **internally complete** | `13de31d5480a` | [site-v2/tests/site-regression.spec.ts](../site-v2/tests/site-regression.spec.ts); [docs/ISSUE_STATUS_AUDIT.md](../docs/ISSUE_STATUS_AUDIT.md) | Keep the keyboard and screen-reader journey in the browser regression gate. |
| `Q1-ENG-ROUTE-PARITY` | Q1 | internal engineering | **internally complete** | `0fd3e550568e` | [scripts/check-site-route-parity.cjs](../scripts/check-site-route-parity.cjs); [test/fixtures/site-route-parity.json](../test/fixtures/site-route-parity.json) | Retain exact generated-route, sitemap and canonical parity in npm run site. |
| `Q1-GOV-SAFE-DRILL` | Q1 | internal engineering | **internally complete** | `ab1544f5ed3e` | [docs/governance/SAFE_RESILIENCE_DRILL_2026.md](../docs/governance/SAFE_RESILIENCE_DRILL_2026.md); [config/governance/safe-resilience.json](../config/governance/safe-resilience.json) | Keep the drill test-only; real signer readiness remains a separate governance gate. |
| `Q1-ENG-MONTHLY-TRANSPARENCY` | Q1 | internal engineering | **internally complete** | `3d5c207b133e` | [scripts/generate-monthly-transparency-report.cjs](../scripts/generate-monthly-transparency-report.cjs); [docs/reports/MONTHLY_REPORT_2026_07.md](../docs/reports/MONTHLY_REPORT_2026_07.md) | Regenerate the source-linked report after roadmap reconciliation. |
| `Q1-SEC-V2-CANDIDATE` | Q1 | internal engineering | **internally complete** | `f4db5508c596` | [config/audit/v2-review-candidate.json](../config/audit/v2-review-candidate.json); [docs/reviews/V2_REVIEW_CANDIDATE.md](../docs/reviews/V2_REVIEW_CANDIDATE.md) | Keep the frozen V2 identity unchanged while external review remains unstarted. |
| `Q1-ENG-REVIEWER-OUTREACH` | Q1 | internal engineering | **internally complete** | `99c609e43fc8` | [docs/community-review/REVIEWER_OUTREACH_KIT.md](../docs/community-review/REVIEWER_OUTREACH_KIT.md); [operations/community-review/outreach.json](../operations/community-review/outreach.json) | Use the kit for real outreach without representing interest or engagement before evidence exists. |
| `Q1-EXT-REVIEWER-ENGAGEMENT` | Q1 | external reviewer | **not started** | `99c609e43fc8` | [operations/community-review/outreach.json](../operations/community-review/outreach.json); [docs/REVIEWER_SELECTION_CHECKLIST.md](../docs/REVIEWER_SELECTION_CHECKLIST.md) | Contact qualified candidates and record only real privacy-safe evidence. |
| `Q1-LEGAL-COUNSEL-ENGAGEMENT` | Q1 | legal | **not started** | `99c609e43fc8` | [docs/COUNSEL_INTAKE_PACKAGE.md](../docs/COUNSEL_INTAKE_PACKAGE.md); [docs/LEGAL_READINESS.md](../docs/LEGAL_READINESS.md); [docs/utility-pilot/LEGAL_REVIEW_DECISION.md](../docs/utility-pilot/LEGAL_REVIEW_DECISION.md) | Select qualified counsel and obtain written scope and engagement evidence. |
| `Q1-ENG-SEMANTIC-STRUCTURE` | Q1 | internal engineering | **not started** | `99c609e43fc8` | [site-v2/tests/site-regression.spec.ts](../site-v2/tests/site-regression.spec.ts); [docs/CONTRIBUTOR_TASK_BOARD.md](../docs/CONTRIBUTOR_TASK_BOARD.md) | Complete GitHub issue #127 with deterministic desktop and mobile checks. |
| `Q1-ENG-RELEASE-EVIDENCE-FRESHNESS` | Q1 | internal engineering | **in progress** | `3d5c207b133e` | [config/release-evidence.json](../config/release-evidence.json); [docs/PUBLIC_EVIDENCE_DASHBOARD.md](../docs/PUBLIC_EVIDENCE_DASHBOARD.md); [docs/RELEASE_CONTROL_CENTER.md](../docs/RELEASE_CONTROL_CENTER.md) | Choose whether to preserve the draft snapshot or build a new immutable pre-release snapshot from a later exact commit. |
| `Q2-ENG-OPERATOR-INVARIANTS` | Q2 | internal engineering | **internally complete** | `2c17574736a8` | [scripts/test-operator-sandbox-invariants.cjs](../scripts/test-operator-sandbox-invariants.cjs); [docs/hospitality-operator/OPERATOR_SANDBOX_STATE_MATRIX.md](../docs/hospitality-operator/OPERATOR_SANDBOX_STATE_MATRIX.md) | Keep sandbox transitions and aggregate privacy invariants in the operator gate. |
| `Q2-EXT-INDEPENDENT-REVIEW` | Q2 | external reviewer | **not started** | `99c609e43fc8` | [config/community-review/status.json](../config/community-review/status.json); [config/community-review/findings.json](../config/community-review/findings.json) | Begin only after a real reviewer confirms candidate identity, scope and disclosure terms. |
| `Q2-OPERATOR-REAL-WORKFLOW` | Q2 | operator | **not started** | `2c17574736a8` | [config/hospitality-operator/readiness-gates.json](../config/hospitality-operator/readiness-gates.json); [docs/hospitality-operator/OPERATOR_PILOT_BLUEPRINT.md](../docs/hospitality-operator/OPERATOR_PILOT_BLUEPRINT.md) | Keep the workflow fake-data-only until real operator evidence and approvals exist. |
| `Q2-LEGAL-PRIVACY-OPERATIONS` | Q2 | legal | **not started** | `99c609e43fc8` | [docs/LEGAL_READINESS.md](../docs/LEGAL_READINESS.md); [docs/utility-pilot/PRIVACY_SAFE_REPORTING.md](../docs/utility-pilot/PRIVACY_SAFE_REPORTING.md) | Obtain written privacy and legal review before collecting participant data. |
| `Q3-USER-LIMITED-SEPOLIA-PREVIEW` | Q3 | user | **externally blocked** | `99c609e43fc8` | [config/utility-pilot/tide-community-preview-001.json](../config/utility-pilot/tide-community-preview-001.json); [config/utility-pilot/live-readiness-gates.json](../config/utility-pilot/live-readiness-gates.json) | Keep the campaign blocked and collect evidence for each live gate without publishing a request window. |
| `Q3-USER-PRIVACY-SAFE-FEEDBACK` | Q3 | user | **externally blocked** | `99c609e43fc8` | [docs/utility-pilot/WEEKLY_FEEDBACK_SUMMARY_WORKFLOW.md](../docs/utility-pilot/WEEKLY_FEEDBACK_SUMMARY_WORKFLOW.md); [docs/reports/REPORT_2026_06_27_COMMUNITY_PREVIEW_FEEDBACK.md](../docs/reports/REPORT_2026_06_27_COMMUNITY_PREVIEW_FEEDBACK.md) | Collect and aggregate only real public feedback without private participant data. |
| `Q4-PRODUCTION-GO-NO-GO` | Q4 | production approval | **no go** | `99c609e43fc8` | [docs/MAINNET_GO_NO_GO.md](../docs/MAINNET_GO_NO_GO.md); [docs/MAINNET_READINESS_GAP_ANALYSIS.md](../docs/MAINNET_READINESS_GAP_ANALYSIS.md) | Retain no-go until every production gate has accountable external evidence. |
| `Q4-PRODUCTION-MAINNET` | Q4 | production approval | **no go** | `99c609e43fc8` | [deployments/canonical.json](../deployments/canonical.json); [docs/MAINNET_GO_NO_GO.md](../docs/MAINNET_GO_NO_GO.md) | Do not create a deployment workflow; revisit only after a separate evidence-backed production decision. |

## Current Actions

1. **Q1-ENG-RELEASE-EVIDENCE-FRESHNESS - in progress.** Choose whether to preserve the draft snapshot or build a new immutable pre-release snapshot from a later exact commit. Blocker: The immutable v0.2.1 draft evidence snapshot predates current main and must not be described as current main.
2. **Q1-ENG-SEMANTIC-STRUCTURE - not started.** Complete GitHub issue #127 with deterministic desktop and mobile checks. Blocker: Route-wide landmark and heading hierarchy assertions are not implemented.
3. **Q1-EXT-REVIEWER-ENGAGEMENT - not started.** Contact qualified candidates and record only real privacy-safe evidence. Blocker: Outreach tracking contains no real reviewer record, reply, consent or engagement evidence.
4. **Q1-LEGAL-COUNSEL-ENGAGEMENT - not started.** Select qualified counsel and obtain written scope and engagement evidence. Blocker: No external counsel engagement, memo or approval evidence exists.
5. **Q2-EXT-INDEPENDENT-REVIEW - not started.** Begin only after a real reviewer confirms candidate identity, scope and disclosure terms. Blocker: No independent reviewer is recorded and no external finding or completion evidence exists.
6. **Q2-LEGAL-PRIVACY-OPERATIONS - not started.** Obtain written privacy and legal review before collecting participant data. Blocker: No external privacy or legal approval exists for participant or guest data collection.
7. **Q2-OPERATOR-REAL-WORKFLOW - not started.** Keep the workflow fake-data-only until real operator evidence and approvals exist. Blocker: No verified operator, property, real inventory, support owner or operating agreement exists.
8. **Q3-USER-LIMITED-SEPOLIA-PREVIEW - externally blocked.** Keep the campaign blocked and collect evidence for each live gate without publishing a request window. Blocker: Legal, privacy, security, operations and governance approvals remain not approved; campaign is draft-not-live.
9. **Q3-USER-PRIVACY-SAFE-FEEDBACK - externally blocked.** Collect and aggregate only real public feedback without private participant data. Blocker: No real external privacy-safe feedback set exists.
10. **Q4-PRODUCTION-GO-NO-GO - no go.** Retain no-go until every production gate has accountable external evidence. Blocker: External security, legal, entity, operator, governance, privacy and user evidence is incomplete.
11. **Q4-PRODUCTION-MAINNET - no go.** Do not create a deployment workflow; revisit only after a separate evidence-backed production decision. Blocker: Canonical deployment remains V1 legacy on Sepolia and mainnet approval does not exist.

## Snapshot Separation

- Repository commit at generation: `99c609e43fc8faa70ae57ac1b79d938b8eaeee28`.
- Latest immutable review/release evidence snapshot: `3d5c207b133e4b86459bdc173b78422315a0c744`.
- Published tags keep their own source commits: `v0.1.0-sepolia` -> `e07471936375ffbe13c68da2708b4436931392a2`; `v0.2.0-utility-pilot` -> `5ed20415b569779f8b00245af8b98b9599f77044`.
- An older immutable snapshot is historical evidence, not current main. Generate a new snapshot rather than rewriting it.

## Boundaries

This roadmap does not authorize deployment, transactions, V2 promotion, commercial operations, or any external approval. Reviewer, legal, operator, user, and production states remain unverified until real evidence exists.
