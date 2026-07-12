# Public Evidence Dashboard

Status: public-review navigation document. This is not a token sale, value statement, mainnet approval, live utility approval, V2 promotion, independent audit report, or legal opinion.

## What This Page Is

This page gives reviewers one short path to the current `v0.2.1-public-review` draft evidence snapshot. Published v0.1 and v0.2 tags remain immutable historical pre-releases.

Current evidence baseline:

| Field | Value |
| --- | --- |
| Release track | `v0.2.1-public-review` draft; not published |
| Candidate document | `docs/releases/v0.2.1-public-review.md` |
| Evidence date | 2026-07-12 |
| Current main snapshot | `3d5c207b133e4b86459bdc173b78422315a0c744` |
| Evidence tooling commit | `d1cb1157a771beff3087e490034ec074203c7c66` |
| Evidence report | `docs/reports/MONTHLY_REPORT_2026_07.md` |
| Pilot campaign | `draft-not-live` |
| Mainnet | not approved |
| Sale | not offered |
| Monetary value | no stated value |
| Independent audit | not started |

## What To Check First

1. Project facts: `docs/PROJECT_FACTS.md`
2. v0.2.1 draft pre-release: `docs/releases/v0.2.1-public-review.md`
3. Current monthly evidence report: `docs/reports/MONTHLY_REPORT_2026_07.md`
4. Pilot proof pack: `docs/PILOT_PROOF_PACK.md`
5. Release Control Center: `docs/RELEASE_CONTROL_CENTER.md`
6. V2 Community Review: `https://tikideco.xyz/community-review/`
7. Latest monthly transparency report: [`reports/MONTHLY_REPORT_LATEST.md`](reports/MONTHLY_REPORT_LATEST.md)

## Community Review Evidence

| Field | Value |
| --- | --- |
| Candidate source commit | `cdc9e7e27e66f204c50d59e45ccf970ad20290d6` |
| Frozen V2 commit | `9099fdb87a6be715b1d7fd4fafa6fade0b12b61c` |
| Package SHA-256 | `980555973d47cb5b21b900f3d463890d4faeeff1c45d351332906f5149bae1a2` |
| Community review status | open peer review; not a formal audit |
| Formal independent audit | not started |

Public-safe findings and questions use the forms linked from the Community Review page. Sensitive vulnerabilities must follow `SECURITY.md` and private vulnerability reporting.

Aggregate finding state is published at [`/community-review/findings/`](https://tikideco.xyz/community-review/findings/) and validated with `npm run findings:check`. Zero means no findings are currently recorded in the registry; it is not a conclusion that vulnerabilities do not exist.

## Reproduce The Evidence Check

```bash
npm run evidence:check
npm run project:control:verify
npm run site
```

The v0.2.1 draft bundle is reproduced with:

```bash
npm run release:v021:build -- --commit 3d5c207b133e4b86459bdc173b78422315a0c744 --evidence-commit d1cb1157a771beff3087e490034ec074203c7c66
npm run release:v021:check
```

## Bundle Hashes

| Item | SHA-256 |
| --- | --- |
| Source archive | `edd2e3c69982e98db9654c906640fd745e8197d57e0fcd44175a945f766cbad9` |
| Package manifest | `3c62dfaf24047b0cbbce87257990a9431a8edf1a234c102b4db98735c7019343` |
| `SHA256SUMS.txt` | `89b2e09260d9ac99fb0c1881b1ce6bf83b0f426905733364aa5dc308314fb034` |
| Monthly report body | `b5bccd3e7571e657673e415680ac1d6035e6cf870431be0330be134eb539618f` |
| Monthly report file | `380a806fba2189cefdd6160b6e5f485cf304e46856155af9ae4d3239abd8ca3c` |

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
- `docs/releases/v0.2.1-public-review.md`;
- `docs/PROJECT_FACTS.md`;
- `docs/NEXT_RELEASE_GATES.md`;
- the dated report under `docs/reports/`.
