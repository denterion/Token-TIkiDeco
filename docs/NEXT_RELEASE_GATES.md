# TikiDeco Next Release Gates

Status: operational roadmap for the next public-preparation cycle. This document does not approve mainnet, sale, active utility, or independent audit claims.

## Current Position

| Area | Current state | Gap |
| --- | --- | --- |
| Public Sepolia release | `v0.1.0-sepolia` exists as a prototype pre-release. | Keep release package evidence current after each merge. |
| Utility pilot release | `v0.2.0-utility-pilot` exists as a public pre-release for read-only pilot preparation; `v0.2.0-utility-pilot-rc.1` is prepared as a release-candidate draft. | Campaign remains `draft-not-live`; approvals, snapshot/window, inventory, and report path are not complete. |
| Public site | Read-only EN/ES/RU site exists. | Continue simplifying, but keep all disclaimers and verification links. |
| V1 | Historical canonical Sepolia deployment. | Do not present as upgraded. |
| V2 | Candidate code with freeze baseline. | External audit not started. |
| Legal/governance | Draft policies and counsel brief exist. | Entity/SPV and counsel review are not complete. |
| Community preview | Materials, issue templates, and the Official Public Preview packet exist. | Continue structured feedback collection and publish privacy-safe summaries. |
| Operator/auditor/community entry path | Full documentation exists. | Short start paths are required so important facts are not buried. |
| Browser-level site QA | Static and Playwright browser checks exist. | Keep desktop/mobile, RPC unavailable, mocked balance, and localized overflow checks green. |
| Release control | `npm run project:control` summarizes current branch, release evidence, canonical deployment, pilot gates, and next actions. | Keep it green after release-doc, site, audit, or gate changes. |

## Gate 1: Public Preview Stabilization

Goal: make the project easy for a non-technical reader to understand without creating sale/value/utility claims.

Exit criteria:

- [ ] Minimal public site merged and deployed by GitHub Pages.
- [ ] Official Public Preview packet is current and linked from README / Start Here.
- [ ] Public transparency report exists for the preview packet.
- [ ] `docs/PROJECT_FACTS.md` current after merge.
- [ ] `docs/START_HERE.md` current after merge.
- [ ] `npm run project:control` points to the correct next release action.
- [ ] `npm run claims` passes.
- [ ] `npm run site` passes.
- [ ] `npm run site:browser` passes after `npm run site:browser:install`.
- [ ] README and site agree on V1 canonical / V2 candidate status.
- [ ] No wallet connection, purchase flow, price chart, staking, or exchange-listing language.

## Gate 2: Governance And Counsel Intake

Goal: prepare a narrow external counsel review package before broader promotion or real-world utility discussion.

Exit criteria:

- [ ] `docs/GOVERNANCE_DECISION_REGISTER.md` is current.
- [ ] `docs/COUNSEL_BRIEF.md` points to the latest public facts and release docs.
- [ ] `docs/COUNSEL_INTAKE_PACKAGE.md` is current and ready to send for external counsel intake.
- [ ] Entity/SPV questions are listed as unresolved.
- [ ] Treasury policy is marked draft/review-needed where appropriate.
- [ ] Privacy/data collection position is explicit before collecting emails, wallet addresses, or guest data.
- [ ] Any public-preview announcement uses only approved claims.

## Gate 3: V2 Audit Package Readiness

Goal: package V2 candidate code for external security review without presenting it as deployed or audited.

Exit criteria:

- [ ] V2 freeze baseline still matches the intended source.
- [ ] Current evidence/package commit points to final `main`.
- [ ] `npm test` passes.
- [ ] `npm run foundry:test` passes.
- [ ] `npm run foundry:coverage` passes.
- [ ] `npm run slither:baseline` shows zero new untriaged V2 findings.
- [ ] `KNOWN_ISSUES.md` classifies open questions as accepted risk, needs audit, or blocked.
- [ ] `docs/V2_AUDIT_OWNER_DECISIONS.md` is current.
- [ ] `docs/V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md` is used for any V2 candidate deployment review.
- [x] Current baseline review bundle generated for `218d35f381e40487a77503a27076e0907d0bfaf4`.
- [ ] `npm run release -- --commit <final-main-sha> --release v0.2.0-utility-pilot` succeeds from a clean tree.
- [ ] Regenerate `npm run release -- --commit <final-main-sha> --release v0.2.0-utility-pilot` after this evidence PR merges.
- [ ] `npm run v02:rc` passes after `npm run site`.
- [ ] `npm run pilot:live:blocked` passes, confirming the live campaign is still intentionally blocked.

## Gate 4: Community Preview

Goal: collect useful feedback while preventing price, sale, listing, or active-benefit framing.

Exit criteria:

- [ ] Feedback channels point to `docs/FEEDBACK_GUIDE.md`.
- [ ] GitHub labels/templates route security, docs, claims, and community-preview feedback separately.
- [ ] Public response templates use `docs/COMMUNICATION_PLAYBOOK.md`.
- [ ] Monthly transparency report format is ready.
- [ ] Feedback summary separates current, planned, conceptual, and not-claimable items.
- [ ] `npm run pilot` passes for the `draft-not-live` pilot campaign state.
- [ ] `docs/utility-pilot/PILOT_LIVE_BLOCKER_REGISTER.md` maps remaining live-campaign blockers to tracking issues and evidence.
- [ ] `docs/utility-pilot/LIMITED_LIVE_PREVIEW_PATH.md` maps the first limited Sepolia preview path without marking the campaign live.
- [ ] `docs/utility-pilot/PHASE2_LIVE_GATE_STATUS.md` stays current after each evidence PR.

## Gate 5: Mainnet Discussion

Status: not approved.

Do not enter this gate until:

- [ ] External legal review is complete.
- [ ] Independent smart-contract audit is complete and public findings are triaged.
- [ ] Treasury governance and signer model are reviewed.
- [ ] Utility model and terms are final.
- [ ] Public docs and risk disclosures are final.
- [ ] No unresolved blocker remains in `KNOWN_ISSUES.md`.
