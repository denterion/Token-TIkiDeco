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
| Evidence commit | `10cbd5a7555de7f8696955e9877db1687da5b285` |
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
npm run release -- --commit 10cbd5a7555de7f8696955e9877db1687da5b285 --release v0.2.0-utility-pilot
```

## Bundle Hashes

| Item | SHA-256 |
| --- | --- |
| Source archive | `4083e0bdcbc61627c57a98de8724483214c6b0caeb29017bc18b24e771873f2a` |
| Release manifest | `9110d49250636515e2aae4969200fc3d54a2d2bad57e047e769ddd96cef76e0c` |
| `SHA256SUMS.txt` | `8333863053288b74cd3013ba373298a71532adbabb06d9a8d03b50fafef2985b` |
| Evidence report | `5442652c772a88ed6430da2679b3669d1ae9b070b4e95c245b3e7a9094cbc88c` |

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
