# TikiDeco v0.2 RC Evidence Sync Report

Date: 2026-07-05

Status: release-evidence report. This report is not a token sale, mainnet launch, live utility announcement, independent audit report, legal opinion, value statement, or hospitality launch.

## Summary

The v0.2 utility-pilot release-candidate documentation was synchronized with the current Official Public Preview merge commit.

Current evidence commit:

```text
218d35f381e40487a77503a27076e0907d0bfaf4
```

Current review bundle:

```text
release-artifacts/v0.2.0-utility-pilot/218d35f381e40487a77503a27076e0907d0bfaf4
```

The review bundle was generated locally with:

```bash
npm run release:package -- --commit 218d35f381e40487a77503a27076e0907d0bfaf4 --release v0.2.0-utility-pilot
```

No tag was created. No deployment was performed. No transaction was broadcast.

## Bundle Hashes

| Item | SHA-256 |
| --- | --- |
| Source archive | `4e1e5e62f93cd8da775275d388593d13a014615ceef5e0dadd0373723c39e453` |
| Release manifest | `f27620ad7f6505908cef664c6775611a3dd7d238ed37af57976e26e3ce9f552f` |
| `SHA256SUMS.txt` | `7c87fa16f898a40e46391b52310afa85602164277b3a1bf11fb5f7b7f1f7c359` |

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

The package generation completed successfully from a clean tree.

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

This report records the current evidence baseline. After this PR is merged, the release manager must regenerate the package on the final merge commit before attaching or announcing the v0.2 release candidate.

Expected command after merge:

```bash
npm run release:package -- --commit <final-merge-sha> --release v0.2.0-utility-pilot
```

## Privacy Statement

This report contains no private participant data, no emails, no guest records, no private wallet-to-person mapping, and no sensitive personal data.

## Disclaimer

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. Nothing in this report is financial, investment, legal, tax, hospitality, or operational advice.

SHA-256: see `REPORT_2026_07_05_V02_RC_EVIDENCE_HASH.md`.
