# TikiDeco Governance Decision Register

Status: working governance register for the Sepolia prototype. This is not a legal opinion, investment document, production governance charter, or promise of future utility.

Purpose: keep governance-sensitive decisions explicit before any broader public preview, V2 audit request, real-world utility, or mainnet discussion.

## Decision Status Key

| Status | Meaning |
| --- | --- |
| Decided | Current project position is documented and can be referenced publicly if consistent with the claims matrix. |
| Accepted risk | The project knowingly accepts a limitation for the Sepolia prototype; revisit before production or mainnet. |
| Needs counsel | Requires external legal/tax/regulatory review before public commitment or operational use. |
| Needs audit | Requires external smart-contract/security review before promotion. |
| Blocked | Must not proceed until a dependency, review, or external condition changes. |

## Current Decisions

| ID | Area | Decision | Status | Evidence | Next review trigger |
| --- | --- | --- | --- | --- | --- |
| GDR-01 | Network | Keep V1 as the historical canonical Ethereum Sepolia deployment. | Decided | `deployments/canonical.json`; `docs/PROJECT_FACTS.md` | Any new deployment manifest or V2 promotion proposal. |
| GDR-02 | V2 status | Treat V2 contracts as candidate review code only. | Decided | `docs/V2_AUDIT_TARGET_FREEZE.md`; `AUDIT_SCOPE.md` | Before external audit package delivery or any V2 deployment. |
| GDR-03 | Mainnet | Mainnet is not approved. | Decided | `docs/ROADMAP.md`; `deployments/canonical.json` | After legal review, independent audit, treasury review, final utility, and final public docs. |
| GDR-04 | Sale status | TIDE is not offered for sale and has no stated monetary value. | Decided | `docs/CLAIMS_MATRIX.md`; `docs/PROJECT_FACTS.md`; public site footer | Before any distribution, redemption, exchange, fundraising, or paid access flow. |
| GDR-05 | Financial rights | TIDE does not provide equity, debt, revenue, property, hotel ownership, dividend, profit, or return rights. | Decided | `docs/LEGAL_READINESS.md`; `docs/RISK_DISCLOSURE.md` | Any discussion of real-world utility, rewards, membership, or property-linked features. |
| GDR-06 | Safe ownership | Sepolia privileged V1 ownership is held by a `3-of-3` Safe. | Decided | `docs/GOVERNANCE.md`; `deployments/canonical.json` | Before any production deployment or if signer availability changes. |
| GDR-07 | Safe threshold | Keep current Sepolia Safe threshold as historical/testnet posture, but reassess production threshold. | Accepted risk | `docs/GOVERNANCE.md`; `docs/SAFE_MULTISIG.md` | Before production/mainnet, consider `3-of-5` or comparable availability model. |
| GDR-08 | V2 vault pause | Use token-level pause as the current V2 release circuit breaker; no vault-local pause in freeze baseline. | Accepted risk / Needs audit | `KNOWN_ISSUES.md` KI-03; `docs/V2_AUDIT_TARGET_FREEZE.md` FD-02 | External audit feedback or production incident-model review. |
| GDR-09 | Report corrections | Keep report supersede correction policy off-chain for the V2 freeze baseline. | Accepted risk / Needs audit | `KNOWN_ISSUES.md` KI-04; `docs/V2_AUDIT_TARGET_FREEZE.md` FD-03 | External audit feedback or first correction/supersede event after V2. |
| GDR-10 | Public site | Keep website read-only with no wallet connection, signing, purchase, staking, price chart, or exchange-listing flow. | Decided | `site-v2/src`; `scripts/check-site-v2.cjs`; `docs/CLAIMS_MATRIX.md` | Any UX change touching wallet, data collection, or real-world benefit eligibility. |
| GDR-11 | Legal entity | Project company/SPV remains undefined. | Needs counsel | `docs/LEGAL_READINESS.md`; `docs/COUNSEL_BRIEF.md` | Before broader promotion, production treasury policy, real-world utility, or mainnet. |
| GDR-12 | Utility | Hospitality use cases remain conceptual/planned, not active benefits. | Needs counsel | `docs/UTILITY.md`; `docs/PROJECT_FACTS.md` | Before discounts, memberships, booking access, partner campaigns, or guest data collection. |
| GDR-13 | Audit | Independent smart-contract audit has not started. | Needs audit | `deployments/canonical.json`; `docs/ROADMAP.md` | Before describing V2 as reviewed for production or promoting V2 beyond candidate status. |
| GDR-14 | Dependency majors | Keep Vite 8 and React Three Fiber 9 migrations separate from V2 audit-target preparation. | Blocked | `docs/DEPENDENCY_TRIAGE_2026_06_24.md`; open Dependabot PRs | When peer dependencies support the migration and visual regression checks are scoped. |

## Required Approval Records

Record these before the relevant action:

| Action | Required record |
| --- | --- |
| Broader public preview | Current counsel intake package, counsel/public-communications review note, or explicit risk acceptance. |
| Any real-world utility | Counsel review, operating terms, privacy review, and updated risk disclosure. |
| Any token distribution beyond testnet/prototype use | Counsel review and distribution policy. |
| V2 external audit package | Current final `main` SHA, release package hash, scope document, known-issues register, and dependency state. |
| V2 candidate deployment | Explicit non-canonical deployment approval, role manifest review, and source verification plan. |
| Mainnet consideration | Legal review, independent audit, treasury governance review, finalized utility, final docs, and material risk disclosure. |

## Maintenance

Update this file when:

- a roadmap phase changes status;
- a new Safe/admin/treasury decision is made;
- a public claim boundary changes;
- external counsel or auditors provide feedback;
- a V2 deployment or promotion proposal is drafted;
- an incident or correction report changes governance assumptions.
