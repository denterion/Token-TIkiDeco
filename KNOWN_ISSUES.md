# TikiDeco Known Issues And Review Findings

Status: internal review findings for V2 candidate and release process. These are not independent audit findings.

## Finding KI-01: V2 Token Metadata Remains A Public Claims Surface

Severity: Medium

Affected file and line: `contracts/TikiDecoTokenV2.sol:60-88`

Attack or failure scenario: `projectName`, `businessEntity`, `projectJurisdiction`, or `projectURI` can be deployed with wording that implies an entity, location, property, or operational status that is not verified. Once deployed, some fields are immutable or only partially updateable, which can create durable public confusion.

Current mitigation: constructor inputs are explicit, bounded, and non-empty; the hardcoded property-style project name was removed from V2; public communications documents restrict sale/value/property claims.

Recommended change: require release-manager review of exact metadata strings before any public V2 candidate deployment and record them in the deployment artifact and role manifest.

Test that should prove the mitigation: constructor metadata tests should reject empty/oversized values and assert the deployed V2 candidate project name and URI exactly match release-approved neutral strings.

## Finding KI-02: V2 Public Deploy Script Role Configuration Is Safety-Critical

Severity: Medium

Affected file and line: `scripts/deploy-v2.cjs:40-81`

Attack or failure scenario: if any privileged role address is omitted or incorrect, a public candidate deployment could assign operational authority or treasury custody to the wrong account.

Current mitigation: public-network V2 deployment requires `CONFIRM_NON_CANONICAL_V2_DEPLOY=true`; all V2 privileged addresses are explicit; deployment asserts roles on-chain and writes a role manifest.

Recommended change: keep the role manifest under release review and document any intentionally shared role addresses before running a public candidate deployment.

Test that should prove the mitigation: script-level tests should fail when any V2 role address is missing on a Sepolia-like network, fail on wrong role assignments, and fail when the deployer retains unexpected privileged roles.

## Finding KI-03: V2 Vault Has No On-Chain Pause Role

Severity: Low

Affected file and line: `contracts/TikiDecoVestingVaultV2.sol:173-188`

Attack or failure scenario: if an accounting or beneficiary issue is found in the vault, there is no vault-local pause switch. Token pause indirectly blocks token transfers, but it also blocks all token transfers globally and is controlled by token pauser, not vesting admin.

Current mitigation: token pause blocks `release` transfers because `TikiDecoTokenV2._update` is `whenNotPaused`; tests cover release while token is paused.

Recommended change: decide whether V2 audit target should include a vault-local pause role or explicitly document token-pause-only as the intended incident model.

Test that should prove the mitigation: if local pause is added, test beneficiary release and admin revoke under vault pause; if not added, test and document token pause as the only release circuit breaker.

Freeze decision: token-pause-only is the current V2 audit-target model. A vault-local pause is not added before the freeze baseline. External auditors should review whether this should change before any production or mainnet decision.

## Finding KI-04: Report Supersede Graph Is Not Policy-Enforced Beyond Existing Id Check

Severity: Low

Affected file and line: `contracts/TikiDecoTokenV2.sol:119-139`

Attack or failure scenario: reporter can publish many superseding reports or supersede a report with a semantically unrelated category. This is not a fund-loss path, but can confuse public report history.

Current mitigation: superseded report id must exist, and `ProjectReportSuperseded` event is emitted.

Recommended change: define off-chain report policy requiring same category or explicit correction reason in the report content; consider adding optional `correctionReasonHash` in a later candidate if needed.

Test that should prove the mitigation: report workflow test that publishes original and corrected report, verifies event linkage, and checks release documentation requires correction reason.

Freeze decision: keep correction semantics off-chain for this V2 audit-target baseline. V2 validates that the superseded report exists and emits `ProjectReportSuperseded`; maintainers must require correction context in repository reports.

## Finding KI-05: Public Site Depends On Third-Party RPC Availability

Severity: Informational

Affected file and line: `site/app.js:5-9`, `site/app.js:211-220`

Attack or failure scenario: public RPC outage or spoofing causes dashboard data to be unavailable or misleading to readers.

Current mitigation: dashboard shows `Data temporarily unavailable` on RPC failures and links to Etherscan/source docs.

Recommended change: continue treating dashboard as read-only informational UI; add an optional timestamp/source label and keep Etherscan links prominent.

Test that should prove the mitigation: mock RPC failure in a site test and assert every on-chain dashboard field shows unavailable state rather than zero values.

## Finding KI-06: Slither Is Advisory In CI

Severity: Informational

Affected file and line: `.github/workflows/security.yml:66-68`

Attack or failure scenario: Slither can report findings while CI remains green due to `continue-on-error: true`, causing reviewers to miss static-analysis output.

Current mitigation: Slither job still runs and prints output for review.

Recommended change: before V2 audit target freeze, triage Slither output into accepted/false-positive/action-needed categories and decide whether to make the job blocking.

Test that should prove the mitigation: CI policy check or PR checklist requiring Slither triage file update when Slither output changes.

Freeze decision: `npm run slither:baseline` is the blocking V2 gate. Accepted V2 findings are versioned in `security/slither-baseline-v2.json`, and every new untriaged V2 finding must fail the gate.

## Finding KI-07: Bytecode Size Check Can Read Coverage-Influenced Artifacts If Run Immediately After Coverage

Severity: Informational

Affected file and line: `package.json:38-44`, `scripts/check-bytecode-size.cjs:1`

Attack or failure scenario: the requested command order runs coverage before bytecode. In the local review run, `npm run bytecode` reported larger sizes after coverage than the clean compile/gas bytecode table. This can confuse release evidence if artifact state is not reset.

Current mitigation: `npm run lint` performs compile and bytecode check together; gas stats also print clean bytecode sizes after compilation.

Recommended change: add a dedicated release gate script that runs clean compile before bytecode, or update runbook order to run `npm run compile` immediately before `npm run bytecode`.

Test that should prove the mitigation: run `npm run coverage`, then `npm run compile`, then `npm run bytecode`, and assert bytecode values match the clean gas stats bytecode table.

## Finding KI-08: npm ci Reports Dependency Maintenance Warnings

Severity: Informational

Affected file and line: `package.json:49-68`, `package-lock.json`

Attack or failure scenario: `npm ci` reports a deprecated transitive `glob@10.5.0` warning and an `allow-scripts` review warning for `esbuild@0.28.1`. This does not change contract behavior, but it is release evidence that dependency review remains active work.

Current mitigation: dependency versions are pinned in `package-lock.json`; npm audit is part of the release gate.

Recommended change: review pending install scripts with `npm approve-scripts`, track transitive dependency updates through Dependabot, and document any accepted warning before V2 audit target freeze.

Test that should prove the mitigation: run `npm ci` and `npm run audit`, then attach accepted warnings or clean output to release evidence.

## Finding KI-09: Release Package Tooling Depends On Local Foundry PATH And Generated Site Output

Severity: Low

Affected file and line: `scripts/generate-audit-release-package.cjs`

Attack or failure scenario: a maintainer can have the pinned Foundry runtime available under `.tools/foundry`, while `forge` is not visible in the shell `PATH`. In that case, package generation fails locally even though CI can install Foundry correctly. The package generator also runs `npm run site:check`, which can rewrite tracked static site output and leave the tree dirty after a successful package run. This is not a fund-loss path, but it weakens release reproducibility and makes audit evidence harder to reproduce.

Current mitigation: the package generator and npm Foundry scripts now prepend the repository-pinned `.tools/foundry` directories to their child-process `PATH` when present. The package generator also restores the generated tracked site output after `site:check`.

Recommended change: keep CI installing the pinned Foundry version explicitly, and keep generated static site output deterministic. If the generated asset filenames change intentionally, update the package generator's tracked site output list in the same PR.

Test that should prove the mitigation: run `npm run release:package -- --commit <current-head-sha>` from a clean tree without manually exporting `forge` into `PATH`, then confirm the package is produced and `git status --short` remains clean after the command.
