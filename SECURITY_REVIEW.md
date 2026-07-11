# TikiDeco Security Review

## Current V2 Candidate Refresh

Refresh date: 2026-07-10

Status: internal security review evidence for a frozen, non-canonical and non-deployed V2 candidate. This document is not an independent technical review or a formal independent smart-contract audit.

- **V1:** observations below are historical. V1 remains the canonical Ethereum Sepolia legacy deployment and its deployed semantics are unchanged.
- **V2 freeze:** the exact freeze commit is defined by `config/audit/v2-independent-review.json`.
- **Current evidence commit:** `cdc9e7e27e66f204c50d59e45ccf970ad20290d6`, recorded with package checksum in `config/audit/v2-review-candidate.json`.
- **Role model:** `config/audit/v2-role-manifest.json` is a non-deployed template. Addresses are not assigned and on-chain role assertions are incomplete. Review covers the role model and deployment guardrails, not deployment readiness.
- **Internal checks:** Hardhat tests, Foundry tests/coverage, Slither baseline, bytecode, dependency advisory scan, claims checks and release reproducibility are maintainer-generated evidence.
- **Independent reproduction:** none has been received from an independent reviewer as of this refresh.
- **Formal independent smart-contract audit:** not started.

No current check changes V2 to canonical status or approves deployment, mainnet, sale, liquidity, listing, value claims or active hospitality benefits.

## Historical Internal Review Record

Review date: 2026-06-17

Review track: `security-hardening`

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
- `scripts/deploy.cjs`
- `scripts/deploy-v2.cjs`

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
- `scripts/deploy-v2.cjs`
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

- `scripts/publish-report.cjs`
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
- `scripts/check-bytecode-size.cjs`
- `scripts/check-deployment-manifest.cjs`

Risk scenario:

Regressions in coverage quality, formatting, or common Solidity warning patterns may not be detected.

Likelihood: Medium.

Impact: Informational for the prototype.

Recommended fix:

Add coverage and static analysis later, for example Solidity coverage and Slither, once the project is ready for a heavier CI toolchain.

Status:

Fixed in this branch as CI configuration. The repository now includes Hardhat 3 built-in coverage, Slither workflow, npm audit script, pinned direct dependencies, npm overrides for audited transitive packages, Dependabot, Gitleaks secret scanning workflow, bytecode size check, gas snapshot script, and deployment manifest consistency check.

Local status from this branch:

- `npm run compile`: passed on Hardhat 3
- `npm test`: passed, 56 tests
- `npm run coverage`: passed, total line coverage 84.83% under Hardhat 3 built-in coverage
- `npm run gas:snapshot`: passed using Hardhat 3 `--gas-stats`
- `npm run audit`: passed with 0 vulnerabilities
- `npm run lint`: passed
- `npm run manifest:check`: passed
- `npm run bytecode:size`: passed

The previous Hardhat 2-only `solidity-coverage` and `hardhat-gas-reporter` plugins were removed. Coverage and gas statistics now use Hardhat 3 built-in flags.

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

Review decision:

- `incorrect-equality` on `amount == 0`: accepted for V1 legacy and V2 candidate. This is an intentional zero-releasable guard, not an equality-based authorization or balance invariant.
- `locked-ether` on reverting `receive()` and `fallback()`: accepted. The contracts intentionally reject native ETH and do not include an ETH withdrawal function because they are not meant to custody ETH.
- `timestamp` on vesting math: accepted. Vesting is intentionally time-based. Production schedules should use periods where miner/validator timestamp variance is immaterial.
- `low-level-calls` in legacy V1 local safe token wrapper: accepted as legacy-only. V2 uses OpenZeppelin `SafeERC20`.

Status:

Triaged and documented. These findings are not treated as blockers for the V2 candidate branch, but they must remain in the promotion notes for any future V2 deployment review. Do not modify already deployed V1 source semantics merely to silence static analysis.

Hardhat 3 note:

Slither currently fails when routed through `crytic-compile`'s Hardhat project parser because Hardhat 3 emits a different build shape. The project therefore runs Slither directly against the `contracts/` directory with solc 0.8.28 and the OpenZeppelin remapping. The CI Slither step is non-blocking because the 15 findings above have explicit review decisions and should remain visible.

### I-05: npm audit flagged Hardhat/tooling dependency vulnerabilities

Files:

- `package.json`
- `package-lock.json`
- `.github/workflows/security.yml`
- `hardhat.config.js`

Risk scenario:

The earlier Hardhat 2 toolchain reported vulnerabilities in development dependencies and transitive packages including `bn.js`, `cookie`, `elliptic`, `js-yaml`, `lodash`, `serialize-javascript`, `tmp`, `undici`, `uuid`, and `ws`. The available automated fixes required a breaking Hardhat 3 migration.

Likelihood: Medium.

Impact: Informational to Medium for developer machines and CI. These are not Solidity runtime dependencies, but they affect the build/test toolchain.

Recommended fix:

Migrate to Hardhat 3, remove Hardhat 2-only plugins, pin direct dependencies, add npm overrides for fixed transitive packages, and keep Dependabot active.

Status:

Fixed in this branch. The project now uses Hardhat 3 with `@nomicfoundation/hardhat-ethers`, `@nomicfoundation/hardhat-ethers-chai-matchers`, and `@nomicfoundation/hardhat-mocha`. The deprecated `@nomicfoundation/hardhat-toolbox` package is not used. `npm run audit` passes with `0 vulnerabilities`.

Verification note:

`@nomicfoundation/hardhat-verify` is intentionally not installed because its current dependency tree reintroduced a no-fix ethers v5 `elliptic` advisory through `@ethersproject/abi`. Canonical Sepolia V1 is already verified. Future V2 verification should be done manually on Etherscan or re-enabled when the Hardhat 3 verify dependency tree is audit-clean.

### I-06: V2 remains non-canonical candidate code

Files:

- `deployments/canonical.json`
- `contracts/TikiDecoTokenV2.sol`
- `contracts/TikiDecoVestingVaultV2.sol`
- `README.md`

Risk scenario:

Security-hardening work can make V2 look production-ready before governance, verification, legal review, and a deployment promotion decision are complete.

Likelihood: Medium.

Impact: Medium. Public confusion could lead users to treat candidate code as the active Sepolia deployment.

Recommended fix:

Keep Sepolia V1 as `v1-legacy` canonical deployment. Treat V2 as candidate code until a future promotion manifest explicitly changes the canonical version.

Status:

Open by design. V2 is not production, not audited, and not deployed by this branch.

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
