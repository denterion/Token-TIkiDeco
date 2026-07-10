# Mainnet Readiness Gap Analysis

Status: planning document. This is not legal advice, not legal approval, not a token sale, not a value statement, not a mainnet approval, and not a promise to deploy.

TikiDeco / TIDE remains an Ethereum Sepolia prototype. TIDE is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit.

## Current Verdict

Mainnet is **no-go**.

The project is technically organized enough for public review and v0.2 release evidence, but it is not ready for mainnet because the required legal, audit, governance, tax, privacy, AML/sanctions, hospitality operations, and communications approvals are not complete.

## What Is Already Strong

| Area | Current evidence |
| --- | --- |
| Canonical deployment tracking | `deployments/canonical.json` keeps V1 Sepolia as legacy canonical. |
| Release reproducibility | `npm run release -- --commit <sha> --release v0.2.0-utility-pilot` can rebuild the review package. |
| Claims controls | `npm run claims` and `npm run value` block unsupported sale, value, mainnet, active-benefit, and audit claims. |
| Mainnet block | `npm run mainnet:check` is expected to fail, while `node scripts/check-mainnet-readiness.cjs --expect-blocked` confirms the block is intentional. |
| Public evidence | `config/release-evidence.json`, `docs/PUBLIC_EVIDENCE_DASHBOARD.md`, and site pages expose the current evidence baseline. |
| V2 scope discipline | V2 remains candidate code only and is not canonical. |

## Mainnet Blockers

| Priority | Gate | Current gap | Required evidence |
| --- | --- | --- | --- |
| P0 | Legal classification | No counsel memo approving mainnet, value, utility, distribution, or public language. | Written counsel memo for exact launch design and exact public claims. |
| P0 | Independent audit | Independent audit has not started. | Final external smart-contract audit report plus remediation record. |
| P0 | V2 promotion decision | V2 is candidate only. | Explicit promotion plan, audit scope, role manifest review, and canonical manifest update proposal. |
| P0 | Governance and treasury | Production Safe/governance policy is not approved. | Signer policy, threshold rationale, emergency pause process, treasury policy, key-loss procedure. |
| P0 | Token distribution | No approved mainnet distribution or allocation policy. | Counsel-reviewed distribution policy, eligibility rules, reporting, anti-abuse controls. |
| P0 | Value claims | No value statement is approved. | Counsel-approved language, tax/accounting treatment, updated claims registry/checks. |
| P1 | Tax/accounting | Treatment for distributions, perks, or operational flows is not approved. | Tax/accounting memo and recordkeeping process. |
| P1 | AML/sanctions | Any transfer, redemption, sale, or real-world benefit flow may trigger review. | AML/sanctions review and operational policy if applicable. |
| P1 | Privacy | Public reports are privacy-safe, but production data collection is not approved. | Data map, privacy notice, retention policy, access control, incident process. |
| P1 | Hospitality operations | No active guest benefit or operator process is approved. | Operator, inventory, staff playbook, support, dispute, cancellation, local constraints. |
| P1 | Public communications | Public copy is controlled, but mainnet/value language is not approved. | Counsel-approved launch copy, translations, FAQ, and enforced claims checks. |

## Regulatory Review Topics

These topics require qualified counsel before mainnet or value-related claims:

- Securities analysis, including whether any offer, distribution, expectation, or utility framing creates investment-contract risk.
- Money transmission / AML / sanctions implications if TIDE becomes transferable with sale, redemption, benefit, or exchange flows.
- Tax and accounting treatment for token distributions, perks, campaigns, operational expenses, and reporting.
- Consumer protection, privacy, and hospitality rules for any real-world guest benefit.

Reference sources to review with counsel:

- SEC digital-asset securities-law framework and later SEC crypto-asset statements.
- FinCEN convertible virtual currency guidance and MSB analysis.
- IRS digital-asset reporting and tax guidance.

## Practical Path To Mainnet

1. Keep v0.2 as Sepolia-only public preview evidence.
2. Finish a tiny Sepolia utility pilot with no sale, no value statement, no mainnet claim, and privacy-safe aggregate reporting.
3. Freeze V2 candidate scope for external audit.
4. Complete external audit and publish remediation notes.
5. Produce counsel memo for exact token, utility, distribution, value, and communications model.
6. Approve production governance: Safe signers, threshold, admin roles, treasury, emergency response.
7. Approve hospitality operations only if a real operator, inventory, terms, support, dispute, cancellation, and privacy process exist.
8. Update claims registry, site, README, release docs, and CI checks to enforce the approved language.
9. Generate a new release package from final main SHA.
10. Only then prepare a separate mainnet deployment proposal for review.

## Mainnet Readiness Commands

Expected today:

```bash
node scripts/check-mainnet-readiness.cjs --expect-blocked
npm run claims
npm run value
npm run project:control:verify
```

Do not treat a normal `npm run mainnet:check` failure as a bug while this document and `docs/MAINNET_GO_NO_GO.md` remain blocked.

## Next PR Recommendation

Next PR should not deploy anything. It should convert the blockers above into owner-tracked review issues:

- legal classification memo;
- external audit procurement and scope;
- production governance policy;
- token distribution policy;
- privacy/data map;
- hospitality operations gate;
- mainnet communications approval.
