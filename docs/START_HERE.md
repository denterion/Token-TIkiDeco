# Start Here

TikiDeco / TIDE is an open-source Ethereum Sepolia prototype for transparent hospitality-linked token infrastructure.

TIDE is not offered for sale, has no stated monetary value, is not deployed on mainnet, has no live guest benefits, and has not completed an independent audit.

The shortest public path is the [Trust Center](https://tikideco.xyz/trust/). It separates current `main`, immutable release tags, the current evidence bundle, canonical V1, candidate V2, operator/entity status, and participation paths.

## Current State In 30 Seconds

- Canonical deployment: V1 legacy contracts on Ethereum Sepolia.
- V2: candidate code only, not canonical.
- v0.2: public pre-release for a read-only utility-pilot flow; campaign is `draft-not-live`.
- Website: read-only, no wallet connection required for browsing, no transaction flow.
- Public boundaries: no sale, no stated monetary value, no mainnet, no active guest benefits, independent audit not started.

## Short Reader Paths

### Community Reviewer

Start with:

- [`PUBLIC_ENTRYPOINTS.md`](PUBLIC_ENTRYPOINTS.md)
- [`TRUST_CENTER_SOURCE_MAP.md`](TRUST_CENTER_SOURCE_MAP.md)
- [`OFFICIAL_PUBLIC_PREVIEW.md`](OFFICIAL_PUBLIC_PREVIEW.md)
- [`PILOT_PROOF_PACK.md`](PILOT_PROOF_PACK.md)
- [`PUBLIC_EVIDENCE_DASHBOARD.md`](PUBLIC_EVIDENCE_DASHBOARD.md)
- [`FEEDBACK_GUIDE.md`](FEEDBACK_GUIDE.md)
- [`COMPETITIVE_LANDSCAPE.md`](COMPETITIVE_LANDSCAPE.md)
- [`MAINNET_READINESS_GAP_ANALYSIS.md`](MAINNET_READINESS_GAP_ANALYSIS.md)

Goal: understand what is current, give feedback through GitHub issues, and avoid unsupported claims.

### Operator / Release Manager

Start with:

- [`RELEASE_CONTROL_CENTER.md`](RELEASE_CONTROL_CENTER.md)
- [`NEXT_RELEASE_GATES.md`](NEXT_RELEASE_GATES.md)
- [`PILOT_PROOF_PACK.md`](PILOT_PROOF_PACK.md)
- [`PUBLIC_EVIDENCE_DASHBOARD.md`](PUBLIC_EVIDENCE_DASHBOARD.md)
- [`MAINNET_READINESS_GAP_ANALYSIS.md`](MAINNET_READINESS_GAP_ANALYSIS.md)
- [`PROJECT_FACTS.md`](PROJECT_FACTS.md)

Goal: keep release evidence reproducible, verify stale package blockers, and keep the pilot blocked until approvals exist.

### Product / Market Reviewer

Start with:

- [`COMPETITIVE_LANDSCAPE.md`](COMPETITIVE_LANDSCAPE.md)
- [`BUSINESS_MODEL.md`](BUSINESS_MODEL.md)
- [`THREE_PHASE_ROADMAP.md`](THREE_PHASE_ROADMAP.md)

Goal: compare TikiDeco against hospitality loyalty, web3 travel, and loyalty-infrastructure projects without turning planned utility into a public promise.

### Auditor / Security Reviewer

Start with:

- [Community Review page](https://tikideco.xyz/community-review/)
- [`community-review/COMMUNITY_REVIEW_GUIDE.md`](community-review/COMMUNITY_REVIEW_GUIDE.md)
- [`EXTERNAL_AUDIT_READINESS.md`](EXTERNAL_AUDIT_READINESS.md)
- [`V2_AUDIT_OWNER_DECISIONS.md`](V2_AUDIT_OWNER_DECISIONS.md)
- [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md)

Goal: review the exact V2 candidate, package checksum, known issues, role decisions, Slither baseline, and test evidence without treating V2 as canonical or community review as a formal audit.

### Legal / Governance Reviewer

Start with:

- [`COUNSEL_INTAKE_PACKAGE.md`](COUNSEL_INTAKE_PACKAGE.md)
- [`GOVERNANCE_DECISION_REGISTER.md`](GOVERNANCE_DECISION_REGISTER.md)
- [`VALUE_CLAIM_POLICY.md`](VALUE_CLAIM_POLICY.md)

Goal: review public boundaries, governance decisions, value/sale restrictions, privacy requirements, and mainnet blockers.

## Commands For Review

```bash
npm run project:control
npm run trust:check
npm run community-review:check
npm run claims
npm run value
npm run site
npm run pilot:live:blocked
node scripts/check-mainnet-readiness.cjs --expect-blocked
```

Expected blocked state:

- `npm run mainnet:check` fails until mainnet/value/real-utility gates are approved.
- `npm run pilot:live:check` fails until live-campaign gates are approved.
- `npm run project:control` may report stale v0.2 RC evidence after a merge; regenerate the release package on the final `main` SHA before announcing a release candidate.

## What Not To Infer

Do not infer from this repository that TIDE is for sale, has a price, is on mainnet, has live guest benefits, grants hotel ownership, grants financial rights, or has completed an independent audit.
