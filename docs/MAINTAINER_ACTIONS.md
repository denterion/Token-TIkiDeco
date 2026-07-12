# Maintainer Action List

Generated from `config/roadmap/roadmap.json` at commit `99c609e43fc8faa70ae57ac1b79d938b8eaeee28`. Actions are ordered by roadmap quarter; blocked external work is not represented as an engineering completion.

## 1. Q1-ENG-RELEASE-EVIDENCE-FRESHNESS

- Quarter: Q1
- Status: `in-progress`
- Owner type: `release-maintainer`
- Evidence class: `internal-engineering`
- Blocker: The immutable v0.2.1 draft evidence snapshot predates current main and must not be described as current main.
- Next action: Choose whether to preserve the draft snapshot or build a new immutable pre-release snapshot from a later exact commit.
- Verification: `npm run release:v021:check`
- Evidence: [config/release-evidence.json](../config/release-evidence.json), [docs/PUBLIC_EVIDENCE_DASHBOARD.md](../docs/PUBLIC_EVIDENCE_DASHBOARD.md), [docs/RELEASE_CONTROL_CENTER.md](../docs/RELEASE_CONTROL_CENTER.md)

## 2. Q1-ENG-SEMANTIC-STRUCTURE

- Quarter: Q1
- Status: `not-started`
- Owner type: `contributor`
- Evidence class: `internal-engineering`
- Blocker: Route-wide landmark and heading hierarchy assertions are not implemented.
- Next action: Complete GitHub issue #127 with deterministic desktop and mobile checks.
- Verification: `npm run site:browser`
- Evidence: [site-v2/tests/site-regression.spec.ts](../site-v2/tests/site-regression.spec.ts), [docs/CONTRIBUTOR_TASK_BOARD.md](../docs/CONTRIBUTOR_TASK_BOARD.md)

## 3. Q1-EXT-REVIEWER-ENGAGEMENT

- Quarter: Q1
- Status: `not-started`
- Owner type: `external-reviewer`
- Evidence class: `external-reviewer`
- Blocker: Outreach tracking contains no real reviewer record, reply, consent or engagement evidence.
- Next action: Contact qualified candidates and record only real privacy-safe evidence.
- Verification: `npm run reviewer-intake:check`
- Evidence: [operations/community-review/outreach.json](../operations/community-review/outreach.json), [docs/REVIEWER_SELECTION_CHECKLIST.md](../docs/REVIEWER_SELECTION_CHECKLIST.md)

## 4. Q1-LEGAL-COUNSEL-ENGAGEMENT

- Quarter: Q1
- Status: `not-started`
- Owner type: `external-counsel`
- Evidence class: `legal`
- Blocker: No external counsel engagement, memo or approval evidence exists.
- Next action: Select qualified counsel and obtain written scope and engagement evidence.
- Verification: `node scripts/check-mainnet-readiness.cjs --expect-blocked`
- Evidence: [docs/COUNSEL_INTAKE_PACKAGE.md](../docs/COUNSEL_INTAKE_PACKAGE.md), [docs/LEGAL_READINESS.md](../docs/LEGAL_READINESS.md), [docs/utility-pilot/LEGAL_REVIEW_DECISION.md](../docs/utility-pilot/LEGAL_REVIEW_DECISION.md)

## 5. Q2-EXT-INDEPENDENT-REVIEW

- Quarter: Q2
- Status: `not-started`
- Owner type: `external-reviewer`
- Evidence class: `external-reviewer`
- Blocker: No independent reviewer is recorded and no external finding or completion evidence exists.
- Next action: Begin only after a real reviewer confirms candidate identity, scope and disclosure terms.
- Verification: `npm run findings:check`, `npm run reviewer-intake:check`
- Evidence: [config/community-review/status.json](../config/community-review/status.json), [config/community-review/findings.json](../config/community-review/findings.json)

## 6. Q2-LEGAL-PRIVACY-OPERATIONS

- Quarter: Q2
- Status: `not-started`
- Owner type: `external-counsel`
- Evidence class: `legal`
- Blocker: No external privacy or legal approval exists for participant or guest data collection.
- Next action: Obtain written privacy and legal review before collecting participant data.
- Verification: `npm run privacy:preview:check`
- Evidence: [docs/LEGAL_READINESS.md](../docs/LEGAL_READINESS.md), [docs/utility-pilot/PRIVACY_SAFE_REPORTING.md](../docs/utility-pilot/PRIVACY_SAFE_REPORTING.md)

## 7. Q2-OPERATOR-REAL-WORKFLOW

- Quarter: Q2
- Status: `not-started`
- Owner type: `hospitality-operator`
- Evidence class: `operator`
- Blocker: No verified operator, property, real inventory, support owner or operating agreement exists.
- Next action: Keep the workflow fake-data-only until real operator evidence and approvals exist.
- Verification: `npm run operator-pilot:check`
- Evidence: [config/hospitality-operator/readiness-gates.json](../config/hospitality-operator/readiness-gates.json), [docs/hospitality-operator/OPERATOR_PILOT_BLUEPRINT.md](../docs/hospitality-operator/OPERATOR_PILOT_BLUEPRINT.md)

## 8. Q3-USER-LIMITED-SEPOLIA-PREVIEW

- Quarter: Q3
- Status: `externally-blocked`
- Owner type: `pilot-governance`
- Evidence class: `user`
- Blocker: Legal, privacy, security, operations and governance approvals remain not approved; campaign is draft-not-live.
- Next action: Keep the campaign blocked and collect evidence for each live gate without publishing a request window.
- Verification: `npm run pilot:live`
- Evidence: [config/utility-pilot/tide-community-preview-001.json](../config/utility-pilot/tide-community-preview-001.json), [config/utility-pilot/live-readiness-gates.json](../config/utility-pilot/live-readiness-gates.json)

## 9. Q3-USER-PRIVACY-SAFE-FEEDBACK

- Quarter: Q3
- Status: `externally-blocked`
- Owner type: `community-maintainer`
- Evidence class: `user`
- Blocker: No real external privacy-safe feedback set exists.
- Next action: Collect and aggregate only real public feedback without private participant data.
- Verification: `npm run claims`
- Evidence: [docs/utility-pilot/WEEKLY_FEEDBACK_SUMMARY_WORKFLOW.md](../docs/utility-pilot/WEEKLY_FEEDBACK_SUMMARY_WORKFLOW.md), [docs/reports/REPORT_2026_06_27_COMMUNITY_PREVIEW_FEEDBACK.md](../docs/reports/REPORT_2026_06_27_COMMUNITY_PREVIEW_FEEDBACK.md)

## 10. Q4-PRODUCTION-GO-NO-GO

- Quarter: Q4
- Status: `no-go`
- Owner type: `governance`
- Evidence class: `production-approval`
- Blocker: External security, legal, entity, operator, governance, privacy and user evidence is incomplete.
- Next action: Retain no-go until every production gate has accountable external evidence.
- Verification: `node scripts/check-mainnet-readiness.cjs --expect-blocked`
- Evidence: [docs/MAINNET_GO_NO_GO.md](../docs/MAINNET_GO_NO_GO.md), [docs/MAINNET_READINESS_GAP_ANALYSIS.md](../docs/MAINNET_READINESS_GAP_ANALYSIS.md)

## 11. Q4-PRODUCTION-MAINNET

- Quarter: Q4
- Status: `no-go`
- Owner type: `governance`
- Evidence class: `production-approval`
- Blocker: Canonical deployment remains V1 legacy on Sepolia and mainnet approval does not exist.
- Next action: Do not create a deployment workflow; revisit only after a separate evidence-backed production decision.
- Verification: `node scripts/check-mainnet-readiness.cjs --expect-blocked`
- Evidence: [deployments/canonical.json](../deployments/canonical.json), [docs/MAINNET_GO_NO_GO.md](../docs/MAINNET_GO_NO_GO.md)


## Control Rule

Do not change an external item to `externally-verified` because an internal script passes. Record real reviewer, counsel, operator, user, or production evidence first.
