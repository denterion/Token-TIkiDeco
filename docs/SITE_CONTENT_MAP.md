# TikiDeco Site Content Map

This map defines the public site's information architecture and the source of truth for each block.

## Hero

- Purpose: explain TikiDeco in 5-10 seconds.
- Required signals: TIDE, Sepolia prototype, future hospitality research, no sale, no stated monetary value, verification links.
- Source of truth: `site/index.html` plus `deployments/canonical.json` via the generated public manifest.

## Hospitality Concept

- Purpose: position the brand as premium hospitality infrastructure research.
- Must not imply a completed property or active hotel services.
- Visuals must be labeled as concept visualization.

## Possible Loyalty and Access Use Cases

- Purpose: show realistic hospitality-linked directions.
- Must frame all use cases as possible future workflows, not active benefits.
- Source docs: `docs/UTILITY.md`.

## Current Testnet Implementation

- Purpose: separate what is live on Sepolia from future candidate code.
- Source of truth: `deployments/canonical.json`, `deployments/sepolia.json`, verified Etherscan links.
- V2 must remain described as non-canonical candidate code until promotion.

## Read-Only Trust Dashboard

- Purpose: show public data without wallet connection or transactions.
- Runtime source: `site/deployment-manifest.json`, generated from `deployments/canonical.json`.
- RPC-derived fields: total supply, paused status, owner, treasury balance, vault balance, reports count, Safe threshold when available.
- Manifest-derived fields: network, addresses, audit status, latest report metadata.
- Error state: `Data temporarily unavailable`.

## Token Allocation

- Purpose: explain documented planning categories.
- Source doc: `docs/TOKENOMICS.md`.
- Must not imply ownership rights, revenue rights, sale terms, or economic upside.

## Security and Governance

- Purpose: summarize control posture and review boundaries.
- Source docs: `SECURITY.md`, `SECURITY_REVIEW.md`, `docs/GOVERNANCE.md`, `docs/SAFE_MULTISIG.md`, `docs/HARDHAT3_MIGRATION.md`.
- Must not call the project audited.

## Roadmap

- Purpose: show sequence and current limitations.
- Source doc: `docs/ROADMAP.md`.
- Must not promise launches or future benefits.

## Reports

- Purpose: give readers a public trail of project milestones.
- Source docs: `docs/reports/*`, `docs/REPORTING_CADENCE.md`, and the latest report transaction in the canonical manifest.

## Documentation

- Four centers only:
  - Overview
  - Security
  - Governance
  - Reports
- The section must separately show current version, current network, known limitations, audit status, latest report date, and verified source code.

## Risks and Disclaimers

- Purpose: state boundaries plainly.
- Required language: Sepolia testnet prototype, no stated monetary value, no token sale, no completed hospitality services.
- Source docs: `docs/RISK_DISCLOSURE.md`, `docs/COMMUNICATION_POLICY.md`.
