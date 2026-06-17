# TikiDeco Security Review

Review date: 2026-06-17

Branch: `codex/security-hardening`

Reviewed commit: `9da9b09334031276fbd2bb9d61738a15bfe08c1e`

Scope:

- Solidity contracts in `contracts/`
- OpenZeppelin V2 track
- deployment and operations scripts
- tests
- GitHub Actions
- README and public site
- `SECURITY.md`, white papers, tokenomics, governance docs
- current Sepolia deployment records
- ownership, treasury, and Safe configuration

Out of scope:

- mainnet deployment
- private key handling beyond local script review
- independent legal analysis
- formal audit certification

## Executive Summary

No Critical or High issues were found in the currently deployed Sepolia V1 prototype that would imply immediate loss of funds under the present testnet-only assumptions.

The main architectural issue is that the repository now contains both deployed V1 contracts and OpenZeppelin V2 contracts without a single canonical deployment manifest and with vesting semantics that can be misunderstood. The strongest hardening path is to preserve Sepolia V1 as historical/legacy, mark V2 as non-canonical candidate code, and make vesting schedules explicitly separate `cliffDuration` from `vestingDuration`.

## Critical Findings

None.

## High Findings

None.

## Medium Findings

### M-01: Vesting duration semantics combine cliff and linear vesting into one ambiguous field

Files:

- `contracts/TikiDecoVestingVault.sol:39`
- `contracts/TikiDecoVestingVault.sol:136`
- `contracts/TikiDecoVestingVault.sol:220`
- `contracts/TikiDecoVestingVaultV2.sol:16`
- `contracts/TikiDecoVestingVaultV2.sol:78`
- `contracts/TikiDecoVestingVaultV2.sol:162`
- `test/TikiDecoVestingVault.js`
- `test/TikiDecoVestingVaultV2.js`

Risk scenario:

The code stores `cliff` and `duration`, but `duration` is used as the full period from `start` to full vesting. Public tokenomics describes schedules as "12-month cliff, then 36-month linear vesting", which implies full vesting at `start + cliff + vestingDuration`. A caller may pass `cliff = 12 months` and `duration = 36 months` expecting 48 total months, but the current contract fully vests after 36 total months.

Likelihood: Medium.

Impact: Medium. Vesting can release earlier than intended if operators interpret `duration` as the post-cliff vesting duration.

Recommended fix:

Use explicit `cliffDuration` and `vestingDuration` fields. Return `0` before `start + cliffDuration`; vest linearly only over `vestingDuration`; fully unlock at `start + cliffDuration + vestingDuration`.

Status:

Fixed for the OpenZeppelin V2 candidate in this branch. Existing Sepolia V1 remains historical and unchanged on-chain as `v1-legacy`.

### M-02: Repository lacks a single canonical deployment manifest

Files:

- `deployments/sepolia.json`
- `README.md:51`
- `README.md:54`
- `README.md:55`
- `docs/OPENZEPPELIN_V2.md`
- `scripts/deploy.js`
- `scripts/deploy-v2.js`

Risk scenario:

The repository contains Sepolia V1 deployment data plus V2 contract code and V2 deploy scripts. Without one canonical manifest, integrators or readers may confuse the deployed, verified V1 prototype with the non-deployed V2 candidate track.

Likelihood: Medium.

Impact: Medium. Operational confusion can lead to publishing wrong addresses, running wrong scripts, or presenting a candidate contract as production-like.

Recommended fix:

Create `deployments/canonical.json` that defines the canonical historical deployment and explicitly marks V2 as non-canonical/candidate. Update README, docs, and site language to avoid implying multiple production versions.

Status:

Fixed in this branch via `deployments/canonical.json` plus README/docs updates.

### M-03: V2 vesting vault pulled schedule funding from the admin caller instead of reserving prefunded treasury balance

Files:

- `contracts/TikiDecoVestingVaultV2.sol`
- `test/TikiDecoVestingVaultV2.js`

Risk scenario:

In a Safe-administered setup, `createSchedule(...)` was called by the owner/admin and attempted to transfer tokens from that caller. This conflicts with the project model where treasury custody is a separate address. It also makes liabilities harder to inspect because the vault did not expose reserved versus unreserved balance.

Likelihood: Medium.

Impact: Medium. Operators could fail schedule creation or accidentally require token approvals from an admin Safe that should not custody allocation tokens.

Recommended fix:

Use a prefunded vault model: treasury transfers tokens into the vault first, schedule creation reserves existing vault balance, and the contract tracks reserved liabilities.

Status:

Fixed in this branch. V2 now exposes `totalReserved()`, `totalReleased()`, `outstandingLiabilities()`, and `unreservedBalance()`.

### M-04: Revoke accepted an arbitrary refund address

Files:

- `contracts/TikiDecoVestingVaultV2.sol`
- `test/TikiDecoVestingVaultV2.js`

Risk scenario:

Allowing a caller-provided refund address during revoke creates unnecessary operational risk. A vesting admin could accidentally or maliciously route unvested tokens away from the intended treasury.

Likelihood: Medium.

Impact: Medium. Unvested allocation tokens could be sent to the wrong address.

Recommended fix:

Store a treasury address in the vault and send all unvested revoked tokens only to treasury. Treasury changes should be two-step or timelocked.

Status:

Fixed in this branch. V2 revoke now refunds only to `treasury`, and treasury changes use `transferTreasury(...)` plus `acceptTreasury()`.

## Low Findings

### L-01: V2 Sepolia deployment script is easy to run without an explicit candidate acknowledgement

Files:

- `package.json:24`
- `scripts/deploy-v2.js`
- `docs/DEPLOYMENT.md:42`
- `docs/OPENZEPPELIN_V2.md:78`

Risk scenario:

An operator can run `npm run deploy:v2:sepolia` and create another public testnet deployment before completing the focused V2 review and canonical update process.

Likelihood: Medium.

Impact: Low to Medium. This does not affect deployed V1 but can create public confusion.

Recommended fix:

Require an explicit environment variable such as `CONFIRM_NON_CANONICAL_V2_DEPLOY=true` before V2 deploy scripts run on non-local networks.

Status:

Fixed in this branch. Public-network V2 deployment now requires `CONFIRM_NON_CANONICAL_V2_DEPLOY=true`.

### L-02: Safe threshold is 3-of-3, which is operationally brittle

Files:

- `deployments/sepolia.json`
- `docs/GOVERNANCE.md`
- `docs/SAFE_MULTISIG.md`
- `docs/TREASURY_POLICY.md`

Risk scenario:

All three Safe owners are required for every owner action. If one owner key is lost or unavailable, reporting, pausing, project URI updates, and vesting administration may be blocked.

Likelihood: Medium.

Impact: Low for Sepolia prototype; potentially High for production if carried forward.

Recommended fix:

Keep the current Sepolia Safe as historical state. Before mainnet, use a signer policy such as `3-of-5` or another reviewed threshold that balances security and availability.

Status:

Documented; no on-chain changes in this branch.

### L-03: Report publication script is incompatible with Safe-owned deployment

Files:

- `scripts/publish-report.js`
- `package.json:11`
- `docs/GOVERNANCE.md:103`

Risk scenario:

`report:publish:sepolia` expects the local signer to be the token owner. Since token owner is now Safe, the script will fail for the current canonical deployment. The Safe workflow exists, but the legacy script remains prominent.

Likelihood: High.

Impact: Low. The failure is safe, but it can waste operator time or cause confusion.

Recommended fix:

Rename or document the direct publish script as legacy/direct-owner only and prefer `report:safe:sepolia`.

Status:

Fixed in this branch by renaming the npm script to `report:publish:direct-owner:sepolia` and documenting `report:safe:sepolia` as the preferred workflow.

### L-04: V2 used coarse owner-style privileges instead of separated operational roles

Files:

- `contracts/TikiDecoTokenV2.sol`
- `contracts/TikiDecoVestingVaultV2.sol`
- `docs/ACCESS_CONTROL.md`

Risk scenario:

Using one owner/admin for all functions makes least-privilege operation harder. A key or Safe module that only needs report publishing or pausing would also have broader administrative powers.

Likelihood: Medium.

Impact: Low to Medium for a prototype; higher for production.

Recommended fix:

Use OpenZeppelin `AccessControl` with separate admin, pauser, reporter, and vesting admin roles.

Status:

Fixed in this branch for V2 candidate contracts and documented in `docs/ACCESS_CONTROL.md`.

### L-05: V2 direct `approve` behavior diverged from standard OpenZeppelin ERC-20 integrations

Files:

- `contracts/TikiDecoTokenV2.sol`
- `test/TikiDecoTokenV2.js`
- `docs/OPENZEPPELIN_V2.md`

Risk scenario:

The V2 candidate previously preserved a zero-first direct `approve(...)` restriction. This can reduce one allowance race pattern, but it diverges from common OpenZeppelin ERC-20 behavior and can break wallets, dapps, routers, and allowance-management tools that expect non-zero to non-zero approvals to work.

Likelihood: Medium.

Impact: Low to Medium. Integrations could fail even though the token otherwise looks like a standard ERC-20.

Recommended fix:

Use the official OpenZeppelin ERC-20 allowance behavior unless a strong integration-reviewed reason exists to diverge. Document the allowance race as a UI/operator risk instead of changing token semantics.

Status:

Fixed in this branch. V2 now uses standard OpenZeppelin `approve(...)`, `transferFrom(...)`, max-uint allowance, zero-value transfer, and self-transfer behavior. The allowance race is documented as an integration/UI consideration.

### L-06: Report publication metadata lacked integrity bounds and correction semantics

Files:

- `contracts/TikiDecoTokenV2.sol`
- `test/TikiDecoTokenV2.js`
- `docs/OPENZEPPELIN_V2.md`

Risk scenario:

Report publication accepted a document hash, category, and URI without checking empty strings, string lengths, reporting period, report version, or superseded report references. This could allow low-quality metadata, oversized on-chain strings, or unclear correction history.

Likelihood: Medium.

Impact: Low. The issue affects transparency quality and gas predictability rather than token balances.

Recommended fix:

Require a non-zero document hash, bounded non-empty category/URI/version fields, valid period start/end, and an event that links corrected reports to the previous report ID.

Status:

Fixed in this branch for V2. Reports now validate bounded metadata, include `periodStart`, `periodEnd`, `version`, and `supersedesReportId`, and emit `ProjectReportSuperseded(...)` for corrections.

### L-07: Pause policy for vesting releases needed an explicit operational decision

Files:

- `contracts/TikiDecoTokenV2.sol`
- `contracts/TikiDecoVestingVaultV2.sol`
- `test/TikiDecoVestingVaultV2.js`
- `docs/ACCESS_CONTROL.md`

Risk scenario:

If pause behavior is not documented, users and operators may disagree on whether emergency pause should block vesting claims. Allowing releases during pause preserves beneficiary access but leaves a transfer path open during an incident. Blocking releases improves containment but can delay legitimate claims.

Likelihood: Medium.

Impact: Low to Medium, depending on the incident and allocation size.

Recommended fix:

Choose and document one model. If pause blocks releases, test both beneficiary and vesting-admin release attempts while paused.

Status:

Fixed in this branch. The chosen V2 model is a global token transfer stop: `pause()` blocks direct transfers, `transferFrom(...)`, and vesting vault `release(...)` because releases call token `safeTransfer(...)`. Consequence: beneficiaries can be temporarily delayed during an emergency pause, and every pause/unpause should be explained through governance/reporting.

## Informational Findings

### I-01: CI covered compile/tests/tokenomics but not static analysis or coverage

Files:

- `.github/workflows/ci.yml`
- `.github/workflows/security.yml`
- `.github/dependabot.yml`
- `.gitleaks.toml`
- `slither.config.json`
- `scripts/check-bytecode-size.js`
- `scripts/check-deployment-manifest.js`

Risk scenario:

Regressions in coverage quality, formatting, or common Solidity warning patterns may not be detected.

Likelihood: Medium.

Impact: Informational for the prototype.

Recommended fix:

Add coverage and static analysis later, for example Solidity coverage and Slither, once the project is ready for a heavier CI toolchain.

Status:

Fixed in this branch as CI configuration. The repository now includes Solidity coverage, Slither workflow, npm audit script, pinned direct dependencies, Dependabot, Gitleaks secret scanning workflow, bytecode size check, gas snapshot script, and deployment manifest consistency check.

Local status from this branch:

- `npm run compile`: passed
- `npm test`: passed, 56 tests
- `npm run lint`: passed
- `npm run manifest:check`: passed
- `npm run bytecode:size`: passed

`npm audit` still reports dependency vulnerabilities in the Hardhat/tooling dependency tree; see remaining risks before production use.

### I-04: Slither static analysis findings require triage before any production promotion

Files:

- `contracts/TikiDecoToken.sol`
- `contracts/TikiDecoTokenV2.sol`
- `contracts/TikiDecoVestingVault.sol`
- `contracts/TikiDecoVestingVaultV2.sol`
- `slither.config.json`
- `.github/workflows/security.yml`

Risk scenario:

Local Slither analysis reported 15 results across legacy V1 and V2 candidate contracts:

- `incorrect-equality` on `amount == 0` release checks
- `locked-ether` on reverting `receive()` and `fallback()` functions without ETH withdrawal
- `timestamp` on vesting-time comparisons
- `low-level-calls` in the legacy V1 local safe token wrapper

Likelihood: Low to Medium.

Impact: Informational to Low for the current Sepolia prototype. The timestamp findings are expected for vesting math; the strict equality checks are zero-amount guards; the locked-ether findings are false positives for ordinary ETH sends because the functions revert; the low-level call is legacy V1 code that is already deployed and preserved as historical source.

Recommended fix:

Do not suppress Slither output silently. For V2, keep these findings visible until a focused review decides whether to refactor reverting ETH handlers, tune detector configuration with documented justification, or accept the findings in an audit note. Do not change deployed V1 source semantics merely to silence static analysis.

Status:

Documented. Slither is wired into CI and was run locally. It exits non-zero because findings remain visible.

### I-05: npm audit flags Hardhat/tooling dependency vulnerabilities

Files:

- `package.json`
- `package-lock.json`
- `.github/workflows/security.yml`

Risk scenario:

`npm audit --audit-level=moderate` reports vulnerabilities in development dependencies and transitive Hardhat/tooling packages including `bn.js`, `cookie`, `elliptic`, `js-yaml`, `lodash`, `serialize-javascript`, `tmp`, `undici`, `uuid`, and `ws`. The available automated fixes require breaking changes such as Hardhat 3/toolbox 7 migration or coverage downgrades.

Likelihood: Medium.

Impact: Informational to Medium for developer machines and CI. These are not Solidity runtime dependencies, but they affect the build/test toolchain.

Recommended fix:

Keep dependency versions pinned, use Dependabot PRs, and plan a separate Hardhat 3/toolbox 7 migration branch. Do not apply `npm audit fix --force` inside this hardening branch without reviewing breaking changes.

Status:

Open. `npm audit fix` without `--force` made no changes. `npm audit` still exits non-zero with 45 reported vulnerabilities.

### I-02: V1 custom ERC-20 implementation is historical; V2 uses OpenZeppelin primitives

Files:

- `contracts/TikiDecoToken.sol`
- `contracts/TikiDecoTokenV2.sol`

Risk scenario:

Custom ERC-20 code increases maintenance burden compared with OpenZeppelin. The deployed V1 is verified and test-covered, but future work should prefer the OpenZeppelin track.

Likelihood: Medium.

Impact: Informational.

Recommended fix:

Keep V1 as legacy Sepolia history and treat OpenZeppelin V2 as the candidate implementation for future review and deployment.

Status:

Documented more clearly in this branch via the canonical manifest and README/docs updates.

### I-03: Legal and utility boundaries are well represented but remain non-final

Files:

- `docs/WHITEPAPER_EN.md`
- `docs/TOKENOMICS.md`
- `docs/COMMUNICATION_POLICY.md`
- `docs/RISK_DISCLOSURE.md`

Risk scenario:

The repository properly avoids profit/equity/revenue-share language, but legal review is still mandatory before any sale, fundraising, or mainnet decision.

Likelihood: High.

Impact: Informational.

Recommended fix:

Keep legal review as a mainnet gate and do not loosen public communications language.

Status:

Documented.
