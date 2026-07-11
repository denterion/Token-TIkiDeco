# TikiDeco v0.2 Evidence Refresh Report

Date: 2026-07-11

Status: release-evidence refresh for the merged English-only public-site baseline. This report is not a token sale, mainnet launch, live utility announcement, independent audit report, legal opinion, value statement, or hospitality launch.

## Summary

The v0.2 utility-pilot review bundle was reproduced after merge of the one-minute public-site and 3D hero update.

Evidence source commit:

```text
00e0ccbbf26397aadd5416816bba44e7cc2e373b
```

Review bundle:

```text
release-artifacts/v0.2.0-utility-pilot/00e0ccbbf26397aadd5416816bba44e7cc2e373b
```

Proof command:

```bash
npm run release -- --commit 00e0ccbbf26397aadd5416816bba44e7cc2e373b --release v0.2.0-utility-pilot
```

No tag was created. No deployment was performed. No transaction was broadcast.

## Bundle Hashes

| Item | SHA-256 |
| --- | --- |
| Source archive | `1e40af6a91f6fd00528db599bc4b24cb235817d3fdb1e56485330ba4417e64b2` |
| Release manifest | `a9cd502f5a6ecf2322576964fbcf71405e8f0b96d924f9ad071cc2de763ae288` |
| `SHA256SUMS.txt` | `69b2c1d3c5ee226e8fc2505a6921a8553a692e4d37a469f92aba9b0961a49dfa` |

## Evidence Captured

The generated bundle includes:

- exact source commit and source archive;
- Solidity compiler, EVM target, and optimizer settings;
- dependency lockfile and SPDX SBOM;
- ABI, creation bytecode, runtime bytecode, and hashes;
- canonical V1 deployment, Safe configuration, and role template;
- Hardhat and Foundry test evidence;
- coverage, gas, Slither output, and accepted baseline;
- known issues, review scope, checksums, and reproduction instructions.

## Validation Result

The release reproducibility proof passed from a clean tree at the evidence source commit. It ran:

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
- `npm run release:package -- --commit 00e0ccbbf26397aadd5416816bba44e7cc2e373b --release v0.2.0-utility-pilot`.

The npm advisory scan reported zero vulnerabilities. Slither reported zero new untriaged V2 findings. These are internal automated checks, not an independent smart-contract audit.

## Current Boundaries

- TIDE is an Ethereum Sepolia testnet prototype.
- TIDE is not offered for sale.
- TIDE has no stated monetary value.
- TIDE is not deployed on mainnet.
- No active guest benefit is live.
- Independent audit has not started.
- V1 remains the canonical legacy Sepolia deployment.
- V2 remains candidate code only and is not canonical.

## Evidence Lifecycle

The evidence source commit and the later commit that records this report are intentionally different. The source commit identifies the exact tree reproduced by the package; this report records its hashes without pretending to be inside its own source archive.

A new bundle is required before another immutable release candidate or whenever contracts, deployment scripts, security assumptions, dependency lockfile, or release-critical site behavior changes. Documentation-only commits do not invalidate this recorded package, but must not be represented as included in its source archive.

## Privacy Statement

This report contains no participant addresses, emails, guest records, private wallet-to-person mappings, private keys, seed phrases, or sensitive personal data.

## Disclaimer

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. Nothing in this report is financial, investment, legal, tax, hospitality, or operational advice.

SHA-256: see `REPORT_2026_07_11_V02_FINAL_EVIDENCE_HASH.md`.
