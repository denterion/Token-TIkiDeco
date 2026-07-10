# TikiDeco v0.2 Final Evidence Refresh Report

Date: 2026-07-10

Status: final release-evidence refresh for the current `main` merge commit. This report is not a token sale, mainnet launch, live utility announcement, independent audit report, legal opinion, value statement, or hospitality launch.

## Summary

The v0.2 utility-pilot release-candidate documentation was refreshed after the Pilot Proof Pack merge.

Current evidence commit:

```text
10cbd5a7555de7f8696955e9877db1687da5b285
```

Current review bundle:

```text
release-artifacts/v0.2.0-utility-pilot/10cbd5a7555de7f8696955e9877db1687da5b285
```

The review bundle was generated locally with:

```bash
npm run release -- --commit 10cbd5a7555de7f8696955e9877db1687da5b285 --release v0.2.0-utility-pilot
```

No tag was created. No deployment was performed. No transaction was broadcast.

## Bundle Hashes

| Item | SHA-256 |
| --- | --- |
| Source archive | `4083e0bdcbc61627c57a98de8724483214c6b0caeb29017bc18b24e771873f2a` |
| Release manifest | `9110d49250636515e2aae4969200fc3d54a2d2bad57e047e769ddd96cef76e0c` |
| `SHA256SUMS.txt` | `8333863053288b74cd3013ba373298a71532adbabb06d9a8d03b50fafef2985b` |

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

The release reproducibility proof completed successfully from a clean tree at the current merge commit.

The proof command ran:

- `npm ci`;
- `npm run compile`;
- `npm test`;
- `npm run foundry:test`;
- `npm run foundry:coverage`;
- `npm run slither`;
- `npm run site`;
- `npm run site:browser`;
- `npm run claims`;
- `npm run value`;
- `npm run audit`;
- `npm run audit:handoff`;
- `npm run release:package -- --commit 10cbd5a7555de7f8696955e9877db1687da5b285 --release v0.2.0-utility-pilot`.

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

Expected command after a later merge:

```bash
npm run release -- --commit <final-merge-sha> --release v0.2.0-utility-pilot
```

## Privacy Statement

This report contains no private participant data, no emails, no guest records, no private wallet-to-person mapping, and no sensitive personal data.

## Disclaimer

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. Nothing in this report is financial, investment, legal, tax, hospitality, or operational advice.

SHA-256: see `REPORT_2026_07_10_V02_FINAL_EVIDENCE_HASH.md`.
