# Public Evidence Dashboard

Status: public-review navigation document. This is not a token sale, value statement, mainnet approval, live utility approval, V2 promotion, independent audit report, or legal opinion.

## What This Page Is

This page gives reviewers one short path to the current evidence baseline for TikiDeco v0.2 utility-pilot preparation.

Current evidence baseline:

| Field | Value |
| --- | --- |
| Release track | `v0.2.0-utility-pilot` |
| Candidate document | `v0.2.0-utility-pilot-rc.1` |
| Evidence date | 2026-07-10 |
| Evidence commit | `e7c52e65f6a56c4a728ca81e3cb3080a25c344e7` |
| Evidence report | `docs/reports/REPORT_2026_07_10_V02_FINAL_EVIDENCE.md` |
| Pilot campaign | `draft-not-live` |
| Mainnet | not approved |
| Sale | not offered |
| Monetary value | no stated value |
| Independent audit | not started |

## What To Check First

1. Project facts: `docs/PROJECT_FACTS.md`
2. v0.2 release candidate: `docs/releases/v0.2.0-utility-pilot-rc.1.md`
3. Final evidence report: `docs/reports/REPORT_2026_07_10_V02_FINAL_EVIDENCE.md`
4. Pilot proof pack: `docs/PILOT_PROOF_PACK.md`
5. Release Control Center: `docs/RELEASE_CONTROL_CENTER.md`

## Reproduce The Evidence Check

```bash
npm run evidence:check
npm run project:control:verify
npm run site
```

The release bundle itself was reproduced with:

```bash
npm run release -- --commit e7c52e65f6a56c4a728ca81e3cb3080a25c344e7 --release v0.2.0-utility-pilot
```

## Bundle Hashes

| Item | SHA-256 |
| --- | --- |
| Source archive | `58f20d6f171a4a171cabd419d26b8f6d8325a187729b5d709a4c73e5f8aa8437` |
| Release manifest | `a7c38b66bbad489cc1e00a8edd97efe0f3719159e94a9b4d02b9a52b2b930934` |
| `SHA256SUMS.txt` | `5758685b0a9587cbe708819f97ee4d5eeafba570c1e28c29857f30bbbb902742` |
| Evidence report | `e2970b4677e476785eabaf2aa8a37d29dcc505452ec9a7dd3992cc4027e30605` |

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
