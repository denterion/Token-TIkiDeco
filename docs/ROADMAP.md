# TikiDeco Roadmap

This roadmap describes the path from public testnet prototype to a credible production decision. It is not a promise of timing, financial return, token value, or hotel completion.

For the current operational focus, see [`THREE_PHASE_ROADMAP.md`](THREE_PHASE_ROADMAP.md). For a short reader-specific entry point, see [`START_HERE.md`](START_HERE.md).

For the July 2026-June 2027 execution sequence, quarterly gates, operating cadence, and stop conditions, see [`ONE_YEAR_DEVELOPMENT_PLAN.md`](ONE_YEAR_DEVELOPMENT_PLAN.md).

For competitive positioning and near-term product opportunities, see [`COMPETITIVE_LANDSCAPE.md`](COMPETITIVE_LANDSCAPE.md).

For the short proof path for the planned Sepolia utility pilot, see [`PILOT_PROOF_PACK.md`](PILOT_PROOF_PACK.md).

## Phase 1: Public Testnet Prototype

Status: complete

- Deploy `TikiDecoToken` on Sepolia.
- Deploy `TikiDecoVestingVault` on Sepolia.
- Publish tokenomics and multilingual white paper drafts.
- Publish smart-contract tests and CI.
- Record deployment state in `deployments/sepolia.json`.

## Phase 2: Public Presentation Layer

Status: substantially complete; continuing polish

- Launch a static landing page.
- Add a short project pitch deck.
- Add a public showcase document with links to contracts, docs, and testnet state.
- Verify source code on Sepolia Etherscan.
- Publish `v0.1.0-sepolia` as a GitHub pre-release.
- Publish `v0.2.0-utility-pilot` as a GitHub pre-release for read-only utility-pilot preparation.
- Historical milestone: EN/ES/RU localization was published; the current public interface is English-only pending separate translation review.
- Keep the public site read-only with no wallet connection, sale flow, price chart, or transaction signing.

## Phase 3: Legal and Governance Structure

Status: in progress

- Define project company or SPV.
- Confirm whether TIDE remains utility/community-only or requires regulated offering treatment.
- Define treasury policy. See [`TREASURY_POLICY.md`](TREASURY_POLICY.md).
- Define report publishing cadence. See [`REPORTING_CADENCE.md`](REPORTING_CADENCE.md).
- Define public communication rules for community, partners, and potential contributors. See [`COMMUNICATION_POLICY.md`](COMMUNICATION_POLICY.md).
- Keep governance-sensitive decisions explicit in [`GOVERNANCE_DECISION_REGISTER.md`](GOVERNANCE_DECISION_REGISTER.md).
- Track the next release gates in [`NEXT_RELEASE_GATES.md`](NEXT_RELEASE_GATES.md).
- Prepare external counsel intake through [`COUNSEL_INTAKE_PACKAGE.md`](COUNSEL_INTAKE_PACKAGE.md).

## Phase 4: Security Review

Status: internal preparation in progress; independent audit not started

- Independent Solidity audit.
- Deployment script review.
- Owner and treasury wallet review.
- Vesting schedule review.
- Incident response plan.
- Freeze a V2 audit-target commit before sending code to external reviewers.
- Resolve or explicitly defer known V2 review questions in [`KNOWN_ISSUES.md`](../KNOWN_ISSUES.md).
- Keep Slither baseline, Hardhat tests, Foundry invariants, coverage, gas, and release-package evidence reproducible.
- Track the proposed freeze baseline in [`V2_AUDIT_TARGET_FREEZE.md`](V2_AUDIT_TARGET_FREEZE.md).
- Prepare external audit intake through [`EXTERNAL_AUDIT_READINESS.md`](EXTERNAL_AUDIT_READINESS.md).
- Keep owner decisions explicit in [`V2_AUDIT_OWNER_DECISIONS.md`](V2_AUDIT_OWNER_DECISIONS.md).
- Review any V2 role manifest with [`V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md`](V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md).

## Phase 5: Community Preview

Status: preparing

- Share the landing page and Sepolia contract links.
- Collect feedback on token utility and hospitality perks.
- Refine white paper language.
- Prepare FAQ and public risk disclosures.
- Collect feedback through [`COMMUNITY_PREVIEW.md`](COMMUNITY_PREVIEW.md) and [`FEEDBACK_GUIDE.md`](FEEDBACK_GUIDE.md).
- Prepare the conditional Sepolia-only utility pilot package through [`utility-pilot/README.md`](utility-pilot/README.md), [`VALUE_AND_UTILITY_BOUNDARY.md`](VALUE_AND_UTILITY_BOUNDARY.md), and [`BUSINESS_MODEL.md`](BUSINESS_MODEL.md).
- Keep the utility pilot campaign manifest as `draft-not-live` until legal, privacy, security, operations, and governance gates are approved.
- Use [`utility-pilot/LIMITED_LIVE_PREVIEW_PATH.md`](utility-pilot/LIMITED_LIVE_PREVIEW_PATH.md) to convert blocked live-campaign gates into evidence tasks.
- Keep feedback focused on clarity, verification, translations, utility boundaries, and review readiness.
- Avoid sale, listing, price, mainnet, or active-benefit messaging.

## Phase 6: Mainnet Gate

Status: not approved

Mainnet should be considered only after:

- legal review is complete
- security audit is complete
- treasury wallet is a Safe or comparable multisig
- token utility is final
- public docs are final
- all material risks are disclosed
