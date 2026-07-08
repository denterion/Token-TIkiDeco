# Start Here

TikiDeco / TIDE is an open-source Ethereum Sepolia prototype for transparent hospitality-linked token infrastructure.

TIDE is not offered for sale, has no stated monetary value, is not deployed on mainnet, has no live guest benefits, and has not completed an independent audit.

## Pick Your Path

| Reader | Start with | Then read | Goal |
| --- | --- | --- | --- |
| Public preview reviewer | [`OFFICIAL_PUBLIC_PREVIEW.md`](OFFICIAL_PUBLIC_PREVIEW.md) | [`COMMUNITY_PREVIEW.md`](COMMUNITY_PREVIEW.md), [`PROJECT_FACTS.md`](PROJECT_FACTS.md), [`reports/REPORT_2026_07_04_OFFICIAL_PUBLIC_PREVIEW.md`](reports/REPORT_2026_07_04_OFFICIAL_PUBLIC_PREVIEW.md) | Understand the current public preview package and its boundaries. |
| Community reviewer | [`COMMUNITY_PREVIEW.md`](COMMUNITY_PREVIEW.md) | [`FEEDBACK_GUIDE.md`](FEEDBACK_GUIDE.md), [`PROJECT_FACTS.md`](PROJECT_FACTS.md) | Give public feedback without creating unsupported claims. |
| Utility-pilot operator | [`utility-pilot/LIMITED_LIVE_PREVIEW_PATH.md`](utility-pilot/LIMITED_LIVE_PREVIEW_PATH.md) | [`utility-pilot/PILOT_OPERATIONS_PLAYBOOK.md`](utility-pilot/PILOT_OPERATIONS_PLAYBOOK.md), [`utility-pilot/PRIVACY_SAFE_REPORTING.md`](utility-pilot/PRIVACY_SAFE_REPORTING.md) | Understand what evidence is needed before any limited Sepolia preview. |
| Security reviewer | [`EXTERNAL_AUDIT_READINESS.md`](EXTERNAL_AUDIT_READINESS.md) | [`V2_AUDIT_OWNER_DECISIONS.md`](V2_AUDIT_OWNER_DECISIONS.md), [`KNOWN_ISSUES.md`](../KNOWN_ISSUES.md), [`AUDIT_SCOPE.md`](../AUDIT_SCOPE.md) | Review V2 candidate scope and open decisions. |
| Release manager | [`RELEASE_CONTROL_CENTER.md`](RELEASE_CONTROL_CENTER.md) | [`NEXT_RELEASE_GATES.md`](NEXT_RELEASE_GATES.md), [`THREE_PHASE_ROADMAP.md`](THREE_PHASE_ROADMAP.md), [`RELEASE_CHECKLIST.md`](../RELEASE_CHECKLIST.md) | Keep release evidence reproducible and aligned with current facts. |
| Governance reviewer | [`GOVERNANCE_DECISION_REGISTER.md`](GOVERNANCE_DECISION_REGISTER.md) | [`TREASURY_POLICY.md`](TREASURY_POLICY.md), [`V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md`](V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md) | Review privileged roles, Safe discipline, and unresolved governance choices. |
| Legal/privacy reviewer | [`COUNSEL_INTAKE_PACKAGE.md`](COUNSEL_INTAKE_PACKAGE.md) | [`VALUE_CLAIM_POLICY.md`](VALUE_CLAIM_POLICY.md), [`MAINNET_GO_NO_GO.md`](MAINNET_GO_NO_GO.md), [`utility-pilot/PRIVACY_SAFE_REPORTING.md`](utility-pilot/PRIVACY_SAFE_REPORTING.md) | Review boundaries before data collection, utility, distribution, sale, or mainnet discussion. |

## Current State In 30 Seconds

- Canonical deployment: V1 legacy contracts on Ethereum Sepolia.
- V2: candidate code only, not canonical.
- Utility pilot: read-only eligibility flow exists; first campaign is `draft-not-live`.
- Community preview: public issues are open for feedback.
- Official public preview: central packet exists in [`OFFICIAL_PUBLIC_PREVIEW.md`](OFFICIAL_PUBLIC_PREVIEW.md).
- Mainnet: not approved.
- Independent audit: not started.
- Value/sale status: no sale and no stated monetary value.

## Commands For Review

```bash
npm run claims
npm run value
npm run project:control
npm run site
npm run pilot
npm run pilot:live:blocked
npm run audit
npm run audit:handoff
node scripts/check-mainnet-readiness.cjs --expect-blocked
```

Expected blocked state:

- `npm run mainnet:check` fails until mainnet/value/real-utility gates are approved.
- `npm run pilot:live:check` fails until live-campaign gates are approved.

## What Not To Infer

Do not infer from this repository that TIDE is for sale, has a price, is on mainnet, has live guest benefits, grants hotel ownership, grants financial rights, or has completed an independent audit.
