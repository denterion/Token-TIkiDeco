# Trust Center Source Map

Last verified: 2026-07-10.

This map defines every fact displayed on `/trust/`. When a source is unavailable or stale, the Trust Center must show that state instead of substituting a guessed value.

| Displayed fact | Source of truth | Verification command | Allowed public wording | Stale-data behavior |
| --- | --- | --- | --- | --- |
| Current network | [`deployments/canonical.json`](../deployments/canonical.json) | `npm run manifest:check` | Ethereum Sepolia. | Show `Unavailable`; never infer from site copy. |
| Canonical deployment | [`deployments/canonical.json`](../deployments/canonical.json) | `npm run manifest:check` | V1 legacy is canonical. | Fail closed if the manifest is missing. |
| Current main commit | Git ref `origin/main`, or `GITHUB_SHA` during a main-branch Pages build | `git rev-parse origin/main` | Current public main commit at build time. | Label as `last built from` when a newer main exists. |
| Current evidence commit | [`config/release-evidence.json`](../config/release-evidence.json) | `npm run evidence:check` | Review-bundle source commit. | Do not replace it with current main. |
| Evidence freshness | Current main compared with [`config/release-evidence.json`](../config/release-evidence.json) | `npm run trust:check` | Current or stale relative to main. | Show `Stale`; do not hide the mismatch. |
| Pilot status | [`config/utility-pilot/tide-community-preview-001.json`](../config/utility-pilot/tide-community-preview-001.json) | `npm run pilot:campaign` | `draft-not-live`. | Show `Unavailable`; never default to live. |
| Mainnet | [`deployments/canonical.json`](../deployments/canonical.json) and [`MAINNET_GO_NO_GO.md`](MAINNET_GO_NO_GO.md) | `node scripts/check-mainnet-readiness.cjs --expect-blocked` | Not deployed; not approved. | Fail the trust gate on a live claim. |
| Independent smart-contract audit | [`deployments/canonical.json`](../deployments/canonical.json) | `npm run trust:check` | Not started. | Show `Unavailable`; never substitute dependency-audit output. |
| v0.1.0-sepolia | [`config/public-versions.json`](../config/public-versions.json), Git tag, and [release](https://github.com/denterion/Token-TIkiDeco/releases/tag/v0.1.0-sepolia) | `git rev-list -n 1 v0.1.0-sepolia` | Published pre-release at its exact source commit. | Preserve immutable tag data. |
| v0.2.0-utility-pilot | [`config/public-versions.json`](../config/public-versions.json), Git tag, and [release](https://github.com/denterion/Token-TIkiDeco/releases/tag/v0.2.0-utility-pilot) | `git rev-list -n 1 v0.2.0-utility-pilot` | Published pre-release at its exact source commit. | Preserve immutable tag data. |
| Current main | Git ref `origin/main` or main-branch Pages `GITHUB_SHA` | `git rev-parse origin/main` | Mutable development line. | Keep separate from immutable tags. |
| Current review bundle | [`config/release-evidence.json`](../config/release-evidence.json) | `npm run evidence:check` | Evidence baseline for its source commit. | Show stale when commits differ. |
| Next release candidate | [`config/public-versions.json`](../config/public-versions.json) | `npm run trust:check` | Planned and not published. | Source commit remains unassigned until freeze. |
| Token | [`deployments/canonical.json`](../deployments/canonical.json) | `npm run manifest:check` | Canonical V1 legacy Sepolia token address. | Show `Unavailable`; never copy from marketing text. |
| Vesting vault | [`deployments/canonical.json`](../deployments/canonical.json) | `npm run manifest:check` | Canonical V1 legacy Sepolia vault address. | Show `Unavailable`. |
| Owner Safe | [`deployments/canonical.json`](../deployments/canonical.json) | `npm run manifest:check` | Sepolia V1 owner Safe. | Show `Unavailable`. |
| Safe threshold | [`deployments/canonical.json`](../deployments/canonical.json) | `npm run manifest:check` | `3-of-3`. | Show `Unavailable`; never estimate signer configuration. |
| Treasury | [`deployments/canonical.json`](../deployments/canonical.json) | `npm run manifest:check` | Sepolia treasury address. | Show `Unavailable`. |
| V2 | [`deployments/canonical.json`](../deployments/canonical.json) and [`V2_AUDIT_TARGET_FREEZE.md`](V2_AUDIT_TARGET_FREEZE.md) | `npm run manifest:check` | Candidate code only; not canonical. | Fail closed on unsupported promotion. |
| V2 community review | [`config/community-review/status.json`](../config/community-review/status.json), [`config/audit/v2-review-candidate.json`](../config/audit/v2-review-candidate.json), and [`community-review/COMMUNITY_REVIEW_GUIDE.md`](community-review/COMMUNITY_REVIEW_GUIDE.md) | `npm run community-review:check` | Open community peer review of the exact frozen non-canonical candidate; not a formal independent smart-contract audit. | Show `Unavailable` or `Stale` when the candidate commit, package checksum, or evidence refresh cannot be verified; never infer completion. |
| Operator | [`OPERATOR_AND_ENTITY_STATUS.md`](OPERATOR_AND_ENTITY_STATUS.md) | `npm run trust:check` | Public individual GitHub maintainer account; legal identity not verified. | Show `Not publicly verified`. |
| Legal entity | [`OPERATOR_AND_ENTITY_STATUS.md`](OPERATOR_AND_ENTITY_STATUS.md) | `npm run trust:check` | Not publicly verified. | Do not infer from historical constructor text. |
| Hospitality business | [`OPERATOR_AND_ENTITY_STATUS.md`](OPERATOR_AND_ENTITY_STATUS.md) | `npm run trust:check` | No commercial hospitality service operating. | Show `Not established`. |
| Hospitality partner | [`OPERATOR_AND_ENTITY_STATUS.md`](OPERATOR_AND_ENTITY_STATUS.md) | `npm run trust:check` | Not publicly verified. | Do not infer from concept copy. |
| Active guest benefit | [`PROJECT_FACTS.md`](PROJECT_FACTS.md) | `npm run claims` | Not live. | Fail the trust gate on an active-benefit claim. |
| Latest repository evidence report | [`config/release-evidence.json`](../config/release-evidence.json) | `npm run evidence:check` | Latest report referenced by the evidence config. | Show stale with its evidence commit. |
| Public preview proof baseline | [`reports/REPORT_2026_07_10_PUBLIC_PREVIEW_PROOF.md`](reports/REPORT_2026_07_10_PUBLIC_PREVIEW_PROOF.md) | `npm run preview:check` | Zero public sample; campaign remains draft-not-live. | Never infer participation from a zero-sample baseline. |
| Evidence report SHA-256 | [`config/release-evidence.json`](../config/release-evidence.json) and its report hash file | `npm run trust:check` | Published SHA-256 metadata. | Fail when absent, malformed, or mismatched. |
| Latest on-chain report | [`deployments/canonical.json`](../deployments/canonical.json) | `npm run manifest:check` | Latest report listed in the canonical manifest. | Keep separate from repository-only reports. |
| Known limitations | [`README.md`](../README.md), [`KNOWN_ISSUES.md`](../KNOWN_ISSUES.md), and [`MAINNET_READINESS_GAP_ANALYSIS.md`](MAINNET_READINESS_GAP_ANALYSIS.md) | `npm run claims` | Current limitations are published. | Do not summarize missing sources as resolved. |
| Dependency audit | [`package.json`](../package.json) | `npm run deps:audit` | npm advisory scan only; not an independent smart-contract audit. | Report separately from contract-audit status. |
| Security reporting | [`SECURITY.md`](../SECURITY.md) and GitHub private vulnerability reporting | `gh api repos/denterion/Token-TIkiDeco/private-vulnerability-reporting` | Private vulnerability reporting is available. | Show unavailable and avoid public disclosure if disabled. |
| Public feedback | [`PUBLIC_PARTICIPATION.md`](PUBLIC_PARTICIPATION.md) and GitHub Issues | `gh repo view denterion/Token-TIkiDeco --json hasIssuesEnabled` | Public issue forms for non-sensitive feedback. | Show unavailable if Issues are disabled. |
| Participation status | [`PUBLIC_PARTICIPATION.md`](PUBLIC_PARTICIPATION.md) | `gh repo view denterion/Token-TIkiDeco --json hasIssuesEnabled,hasDiscussionsEnabled` | Issues enabled; Discussions disabled. | Display the actual channel state. |
| Fact-source map | This file | `npm run trust:check` | Every Trust Center fact has a source and stale-data rule. | Fail when a displayed fact has no map entry. |

## Build Rule

`npm run trust:build` regenerates the static Trust Center from repository sources. GitHub Pages rebuilds the site on `main`, allowing the deployed page to display the exact Pages source commit without changing an immutable release tag.
