# Public Evidence Dashboard

Status: public-review navigation document. This is not a token sale, value statement, mainnet approval, live utility approval, V2 promotion, independent audit report, or legal opinion.

## What This Page Is

This page gives reviewers one short path to the current evidence baseline for TikiDeco v0.2 utility-pilot preparation.

Current evidence baseline:

| Field | Value |
| --- | --- |
| Release track | `v0.2.0-utility-pilot` |
| Candidate document | `v0.2.0-utility-pilot-rc.1` |
| Evidence date | 2026-07-11 |
| Evidence commit | `00e0ccbbf26397aadd5416816bba44e7cc2e373b` |
| Evidence report | `docs/reports/REPORT_2026_07_11_V02_FINAL_EVIDENCE.md` |
| Pilot campaign | `draft-not-live` |
| Mainnet | not approved |
| Sale | not offered |
| Monetary value | no stated value |
| Independent audit | not started |

## What To Check First

1. Project facts: `docs/PROJECT_FACTS.md`
2. v0.2 release candidate: `docs/releases/v0.2.0-utility-pilot-rc.1.md`
3. Final evidence report: `docs/reports/REPORT_2026_07_11_V02_FINAL_EVIDENCE.md`
4. Pilot proof pack: `docs/PILOT_PROOF_PACK.md`
5. Release Control Center: `docs/RELEASE_CONTROL_CENTER.md`
6. V2 Community Review: `https://tikideco.xyz/community-review/`

## Community Review Evidence

| Field | Value |
| --- | --- |
| Candidate source commit | `cdc9e7e27e66f204c50d59e45ccf970ad20290d6` |
| Frozen V2 commit | `9099fdb87a6be715b1d7fd4fafa6fade0b12b61c` |
| Package SHA-256 | `980555973d47cb5b21b900f3d463890d4faeeff1c45d351332906f5149bae1a2` |
| Community review status | open peer review; not a formal audit |
| Formal independent audit | not started |

Public-safe findings and questions use the forms linked from the Community Review page. Sensitive vulnerabilities must follow `SECURITY.md` and private vulnerability reporting.

## Reproduce The Evidence Check

```bash
npm run evidence:check
npm run project:control:verify
npm run site
```

The release bundle itself was reproduced with:

```bash
npm run release -- --commit 00e0ccbbf26397aadd5416816bba44e7cc2e373b --release v0.2.0-utility-pilot
```

## Bundle Hashes

| Item | SHA-256 |
| --- | --- |
| Source archive | `1e40af6a91f6fd00528db599bc4b24cb235817d3fdb1e56485330ba4417e64b2` |
| Release manifest | `a9cd502f5a6ecf2322576964fbcf71405e8f0b96d924f9ad071cc2de763ae288` |
| `SHA256SUMS.txt` | `69b2c1d3c5ee226e8fc2505a6921a8553a692e4d37a469f92aba9b0961a49dfa` |
| Evidence report | `2cad58b3ba6ca343acacf326e6efa1c588ee87882c2d9285c1218c13e5a642d6` |

## What This Does Not Mean

- It does not make the pilot live.
- It does not approve mainnet.
- It does not promote V2.
- It does not create a token sale.
- It does not state monetary value.
- It does not complete an independent audit.
- It does not create active guest benefits.

## Maintenance Rule

After any later release-documentation, site, audit, or gate PR merges, regenerate the release evidence on the final merge commit and update:

- `config/release-evidence.json`;
- `docs/releases/v0.2.0-utility-pilot-rc.1.md`;
- `docs/PROJECT_FACTS.md`;
- `docs/NEXT_RELEASE_GATES.md`;
- the dated report under `docs/reports/`.
