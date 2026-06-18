# TikiDeco Known Issues And Review Findings

Status: internal review findings for V2 candidate and release process. These are not independent audit findings.

## Finding KI-01: V2 Token Metadata Can Encode Unverified Public Claims

Severity: Medium

Affected file and line: `contracts/TikiDecoTokenV2.sol:67-70`

Attack or failure scenario: `projectName`, `businessEntity`, `projectJurisdiction`, or `projectURI` can be deployed with wording that implies an entity, location, property, or operational status that is not verified. Once deployed, some fields are immutable or only partially updateable, which can create durable public confusion.

Current mitigation: constructor inputs are explicit, and public communications documents restrict sale/value/property claims.

Recommended change: replace hardcoded `projectName = "TikiDeco Miami Beach Hotel"` with a neutral prototype label before any V2 audit target freeze, or document a reviewed metadata string in the deployment runbook.

Test that should prove the mitigation: add a constructor metadata test that asserts the deployed V2 candidate project name and URI exactly match counsel/release-approved neutral strings.

## Finding KI-02: V2 Public Deploy Script Defaults Treasury To Owner

Severity: Medium

Affected file and line: `scripts/deploy-v2.cjs:18-19`

Attack or failure scenario: if `TREASURY_ADDRESS` is omitted, the script sets treasury to owner. A public candidate deployment could mint all supply to an admin/owner address rather than the intended treasury address.

Current mitigation: public-network V2 deployment requires `CONFIRM_NON_CANONICAL_V2_DEPLOY=true`; addresses are validated for shape.

Recommended change: for non-local networks, require explicit `OWNER_ADDRESS` and `TREASURY_ADDRESS`, reject equality unless an additional explicit override is set, and print a pre-deploy confirmation manifest.

Test that should prove the mitigation: script-level test or dry-run harness that fails when `TREASURY_ADDRESS` is missing on Sepolia-like network and passes on localhost.

## Finding KI-03: V2 Vault Has No On-Chain Pause Role

Severity: Low

Affected file and line: `contracts/TikiDecoVestingVaultV2.sol:173-188`

Attack or failure scenario: if an accounting or beneficiary issue is found in the vault, there is no vault-local pause switch. Token pause indirectly blocks token transfers, but it also blocks all token transfers globally and is controlled by token pauser, not vesting admin.

Current mitigation: token pause blocks `release` transfers because `TikiDecoTokenV2._update` is `whenNotPaused`; tests cover release while token is paused.

Recommended change: decide whether V2 audit target should include a vault-local pause role or explicitly document token-pause-only as the intended incident model.

Test that should prove the mitigation: if local pause is added, test beneficiary release and admin revoke under vault pause; if not added, test and document token pause as the only release circuit breaker.

## Finding KI-04: Report Supersede Graph Is Not Policy-Enforced Beyond Existing Id Check

Severity: Low

Affected file and line: `contracts/TikiDecoTokenV2.sol:119-139`

Attack or failure scenario: reporter can publish many superseding reports or supersede a report with a semantically unrelated category. This is not a fund-loss path, but can confuse public report history.

Current mitigation: superseded report id must exist, and `ProjectReportSuperseded` event is emitted.

Recommended change: define off-chain report policy requiring same category or explicit correction reason in the report content; consider adding optional `correctionReasonHash` in a later candidate if needed.

Test that should prove the mitigation: report workflow test that publishes original and corrected report, verifies event linkage, and checks release documentation requires correction reason.

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
