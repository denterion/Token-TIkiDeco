# TikiDeco Roadmap

This roadmap describes the path from public testnet prototype to a credible production decision. It is not a promise of timing, financial return, token value, or hotel completion.

## Phase 1: Public Testnet Prototype

Status: complete

- Deploy `TikiDecoToken` on Sepolia.
- Deploy `TikiDecoVestingVault` on Sepolia.
- Publish tokenomics and multilingual white paper drafts.
- Publish smart-contract tests and CI.
- Record deployment state in `deployments/sepolia.json`.

## Phase 2: Public Presentation Layer

Status: in progress

- Launch a static landing page.
- Add a short project pitch deck.
- Add a public showcase document with links to contracts, docs, and testnet state.
- Verify source code on Sepolia Etherscan.

## Phase 3: Legal and Governance Structure

Status: in progress

- Define project company or SPV.
- Confirm whether TIDE remains utility/community-only or requires regulated offering treatment.
- Define treasury policy. See [`TREASURY_POLICY.md`](TREASURY_POLICY.md).
- Define report publishing cadence. See [`REPORTING_CADENCE.md`](REPORTING_CADENCE.md).
- Define public communication rules for community, partners, and potential contributors. See [`COMMUNICATION_POLICY.md`](COMMUNICATION_POLICY.md).

## Phase 4: Security Review

Status: planned

- Independent Solidity audit.
- Deployment script review.
- Owner and treasury wallet review.
- Vesting schedule review.
- Incident response plan.

## Phase 5: Community Preview

Status: planned

- Share the landing page and Sepolia contract links.
- Collect feedback on token utility and hospitality perks.
- Refine white paper language.
- Prepare FAQ and public risk disclosures.

## Phase 6: Mainnet Gate

Status: not approved

Mainnet should be considered only after:

- legal review is complete
- security audit is complete
- treasury wallet is a Safe or comparable multisig
- token utility is final
- public docs are final
- all material risks are disclosed
