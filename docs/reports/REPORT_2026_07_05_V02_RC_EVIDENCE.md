# TikiDeco v0.2 RC Evidence Sync Report

Date: 2026-07-09

Status: release-evidence report. This report is not a token sale, mainnet launch, live utility announcement, independent audit report, legal opinion, value statement, or hospitality launch.

## Summary

The v0.2 utility-pilot release-candidate documentation was synchronized with the current `main` merge commit after the generated-site line-ending fix.

Current evidence commit:

```text
1ec905aba369f4908936f942508de35ba92a49ae
```

Current review bundle:

```text
release-artifacts/v0.2.0-utility-pilot/1ec905aba369f4908936f942508de35ba92a49ae
```

The review bundle was generated locally with:

```bash
npm run release -- --commit 1ec905aba369f4908936f942508de35ba92a49ae --release v0.2.0-utility-pilot
```

No tag was created. No deployment was performed. No transaction was broadcast.

## Bundle Hashes

| Item | SHA-256 |
| --- | --- |
| Source archive | `2f4e7f590565a3f6e05fc9fbbbb20bc292ce3e994e05a4b9c9d1fdb8fd49effb` |
| Release manifest | `09d799a71933191760298cee21c0cddba7284f3942462a0bbef64940e833968e` |
| `SHA256SUMS.txt` | `ef4360c303219ae7fdd66e9d18ba329fc594c802f301afeffcb604778cbde892` |

## Evidence Captured

The generated review bundle includes:

- exact source commit;
- source archive;
- compiler and optimizer settings;
- dependency lockfile;
- ABI, creation bytecode, runtime bytecode, and bytecode hashes;
- canonical deployment manifest;
- role manifest;
- Safe configuration;
- test report;
- coverage report;
- gas report;
- Slither output and baseline;
- SBOM;
- SHA-256 checksums;
- known issues;
- audit scope;
- reproduction instructions.

## Validation Result

The release reproducibility proof completed successfully from a clean tree.

The bundle captured `69 passing` in the Hardhat test report.

The project still preserves these boundaries:

- TIDE is a Sepolia testnet prototype;
- TIDE is not offered for sale;
- TIDE has no stated monetary value;
- TIDE is not deployed on mainnet;
- no active guest benefit is live;
- independent audit has not started;
- V2 remains candidate code only and is not canonical.

## Required Follow-Up

This report records the current evidence baseline. After any later release-documentation, site, audit, or gate PR is merged, the release manager must regenerate the package on that final merge commit before attaching or announcing a newer v0.2 release candidate.

Expected command after merge:

```bash
npm run release -- --commit <final-merge-sha> --release v0.2.0-utility-pilot
```

## Privacy Statement

This report contains no private participant data, no emails, no guest records, no private wallet-to-person mapping, and no sensitive personal data.

## Disclaimer

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. Nothing in this report is financial, investment, legal, tax, hospitality, or operational advice.

SHA-256: see `REPORT_2026_07_05_V02_RC_EVIDENCE_HASH.md`.
