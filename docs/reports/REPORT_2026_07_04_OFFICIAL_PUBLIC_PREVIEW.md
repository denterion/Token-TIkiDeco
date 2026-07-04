# TikiDeco Official Public Preview Report

Date: 2026-07-04

Status: public preview transparency report. This report is not a token sale, mainnet launch, live utility announcement, independent audit report, legal opinion, value statement, or hospitality launch.

## Summary

TikiDeco prepared an Official Public Preview packet to make the Sepolia prototype easier to review publicly.

The preview focuses on:

- a single start-here path for community, auditor, operator, governance, release, and legal/privacy reviewers;
- a v0.2 utility-pilot release-candidate path;
- GitHub Pages as the public read-only website;
- GitHub issues as the public feedback workflow;
- privacy-safe transparency reports;
- claims boundaries that avoid sale, value, mainnet, active-benefit, and independent-audit claims.

## Current

- Canonical deployment remains `v1-legacy` on Ethereum Sepolia.
- V2 remains candidate code only and is not canonical.
- The public website remains read-only.
- The first utility-pilot campaign remains `draft-not-live`.
- The live-pilot gate remains intentionally blocked.
- The mainnet gate remains not approved.
- Independent audit has not started.

## Planned

- Publish a v0.2 release candidate only after final release checks pass on the relevant `main` commit.
- Continue collecting public feedback through GitHub issue templates.
- Continue preparing V2 external audit handoff evidence without claiming audit completion.
- Continue preparing limited Sepolia utility-pilot evidence without publishing a live campaign.

## Conceptual

Future hospitality-linked utility remains conceptual or planned until legal, privacy, security, operations, and governance gates are approved.

Conceptual examples may include:

- eligibility review for limited community preview access;
- early RSVP window testing;
- non-cash welcome eligibility where legally allowed;
- public report-hash verification.

These are not active guest benefits and do not create cash value, resale value, hotel ownership, equity, debt, revenue rights, or guaranteed benefits.

## Not Claimable

The project does not currently claim:

- token sale, presale, or purchase availability;
- stated monetary value;
- mainnet deployment;
- active hotel or guest benefits;
- exchange listing or liquidity support;
- hotel ownership, equity, debt, revenue rights, or investment return rights;
- independent audit completion;
- V2 canonical deployment.

## Public Surfaces Reviewed

| Surface | Status |
| --- | --- |
| `README.md` | Includes current deployment, limitations, community preview, and mainnet/value gate. |
| `docs/START_HERE.md` | Provides role-specific review paths. |
| `docs/OFFICIAL_PUBLIC_PREVIEW.md` | Added as the central public preview packet. |
| `docs/COMMUNITY_PREVIEW.md` | Defines feedback scope and out-of-scope requests. |
| `docs/releases/v0.2.0-utility-pilot-rc.1.md` | Defines v0.2 RC scope without publishing a live campaign. |
| `docs/PROJECT_FACTS.md` | Remains the source of truth for verified, planned, experimental, and unknown facts. |

## Validation Commands

These commands should be run before promoting the public preview packet:

```bash
npm run claims
npm run value
npm run site
npm run site:browser
npm test
npm run release:check
npm run v02:rc
npm run pilot
npm run pilot:live:blocked
```

`npm run mainnet:check` is expected to fail while mainnet, sale, value statements, V2 promotion, independent audit, and real-world guest utility remain blocked.

## Privacy Statement

This report contains no private participant data, no emails, no guest records, no private wallet-to-person mapping, and no sensitive personal data.

## Disclaimer

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. Nothing in this report is financial, investment, legal, tax, hospitality, or operational advice.

SHA-256: see `REPORT_2026_07_04_OFFICIAL_PUBLIC_PREVIEW_HASH.md`.
