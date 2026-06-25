# TikiDeco V2 Audit-Target Freeze

Status: proposed internal freeze baseline for external audit preparation.

Freeze baseline commit: `58806906a273a95c58944d892eb368fc1b758620`

Freeze date: 2026-06-24

Current evidence/package commit: `e74c85612e745f14aa92260bf8b3633f9fd9fa4a`

This document does not promote V2 to canonical deployment status. V2 remains candidate code, not independently audited, not deployed by the canonical manifest, and not approved for mainnet use.

## Scope

Primary contracts:

- `contracts/TikiDecoTokenV2.sol`
- `contracts/TikiDecoVestingVaultV2.sol`

Deployment and evidence scripts:

- `scripts/deploy-v2.cjs`
- `scripts/check-slither-baseline.cjs`
- `scripts/check-bytecode-size.cjs`
- `scripts/check-coverage-thresholds.cjs`
- `scripts/generate-audit-release-package.cjs`

Tests and invariants:

- `test/TikiDecoTokenV2.js`
- `test/TikiDecoVestingVaultV2.js`
- `test/TikiDecoInvariants.js`
- `test/V2DeploymentConfig.js`
- `foundry/TikiDecoTokenV2Invariant.t.sol`
- `foundry/TikiDecoVestingVaultV2Invariant.t.sol`
- `foundry/FoundryTestBase.sol`

Documentation:

- `AUDIT_SCOPE.md`
- `ARCHITECTURE.md`
- `THREAT_MODEL.md`
- `SPECIFICATION.md`
- `INVARIANTS.md`
- `KNOWN_ISSUES.md`
- `docs/ACCESS_CONTROL.md`
- `docs/V2_DEPLOYMENT_CHECKLIST.md`
- `docs/V2_MIGRATION_NOTES.md`
- `docs/V2_ROLE_MANIFEST_SCHEMA.md`

## Explicit Exclusions

- V1 deployed Sepolia bytecode and source semantics.
- Mainnet deployment.
- Any Sepolia deployment or transaction broadcast.
- Private keys, RPC secrets, or signer collection.
- Legal opinion or regulatory conclusion.
- Independent audit certification.
- Any claim that TIDE is for sale, has stated monetary value, is active on mainnet, or grants equity, debt, revenue, property, hotel ownership, or return rights.

## Freeze Decisions

### FD-01: V2 Remains Candidate Code

Decision: keep V2 explicitly non-canonical until a later manifest promotes a reviewed deployment.

Reason: V1 is the historical canonical Sepolia deployment. V2 has stronger architecture, but it must not be presented as active deployment until reviewed, deployed, verified, and documented separately.

Required proof:

- `deployments/canonical.json` continues to mark V1 as canonical and V2 as non-canonical candidate.
- README/site/release docs do not present V2 as active deployment.

### FD-02: Vault Pause Model

Decision: do not add a vault-local pause role before this freeze. Use token-level pause as the release circuit breaker.

Reason: V2 token pause blocks `transfer`, `transferFrom`, and vault `release` because release calls `token.safeTransfer(...)`. This creates one global incident switch and avoids separate pause-state ambiguity between token and vault.

Consequence:

- During a token pause, beneficiaries can be temporarily unable to release vested tokens.
- Every pause/unpause should be explained through governance/reporting.
- External auditors should review whether a vault-local pause role is preferable before any production or mainnet decision.

Required proof:

- Hardhat tests cover beneficiary release while token is paused.
- Hardhat tests cover vesting-admin release while token is paused.

### FD-03: Report Supersede Policy Remains Off-Chain

Decision: keep V2 on-chain supersede validation limited to existing report IDs; enforce semantic correction policy off-chain.

Reason: category/correction semantics can evolve through report policy without increasing on-chain storage and logic. The event graph is sufficient for a candidate audit target.

Consequence:

- A reporter could publish many corrections or semantically unrelated corrections if governance policy is weak.
- Maintainers must require correction explanations in repository reports.

Required proof:

- V2 emits `ProjectReportSuperseded`.
- Public reporting docs require clear report context and correction history.

### FD-04: Role Configuration Is Release-Critical

Decision: V2 public-network deployment must fail closed unless every privileged role and treasury address is explicitly supplied and the non-canonical deployment confirmation is set.

Reason: the deployer must not silently become owner/admin/treasury on public networks.

Required proof:

- `test/V2DeploymentConfig.js` covers missing environment variables.
- `scripts/deploy-v2.cjs` asserts on-chain roles after deployment.
- role manifest schema is documented.

### FD-05: Slither Baseline Is A Blocking V2 Gate

Decision: accepted V2 Slither findings are documented in `security/slither-baseline-v2.json`; every new untriaged V2 finding must fail the baseline gate.

Reason: known V2 findings are accepted and explained; new findings require triage before audit freeze or promotion.

Required proof:

- `npm run slither:baseline` exits with zero.
- new untriaged V2 findings count remains zero.

## Freeze Gate Commands

Run before sending the V2 package to an external auditor:

```bash
npm ci
npm run compile
npm test
npm run coverage
npm run lint
npm run audit
npm run manifest
npm run bytecode
npm run gas
npm run foundry:test
npm run foundry:coverage
npm run slither:baseline
npm run claims:check
npm run release
```

Optional package generation for auditor review:

```bash
npm run release:package -- --commit e74c85612e745f14aa92260bf8b3633f9fd9fa4a
```

The package commit is the reproducibility anchor for current documentation, dependency versions, CI evidence, and generated review artifacts. The freeze baseline remains the V2 candidate contract baseline unless V2 source, deployment semantics, role schema, or security assumptions change. The package command must not deploy contracts, broadcast transactions, create a tag, or publish a GitHub Release.

## Freeze Reset Conditions

Reset the freeze baseline and update this document if any of the following change:

- V2 contract source code;
- V2 constructor arguments or metadata validation;
- V2 deployment script role assignment or confirmation logic;
- role manifest schema;
- canonical deployment manifest semantics;
- Slither baseline;
- Foundry invariant assumptions;
- OpenZeppelin, Hardhat, Solidity compiler, or major test-tool versions;
- public claims that affect legal/security boundaries.

## Auditor Notes

Please treat:

- V1 as historical canonical Sepolia deployment;
- V2 as candidate review code;
- internal review as not equivalent to independent audit;
- public-site/dashboard code as read-only informational infrastructure;
- all hospitality utility as conceptual or planned, not active guest benefits.

## Open Questions For External Review

1. Should V2 include vault-local pause in addition to token-level pause?
2. Should report supersede corrections enforce same-category or correction-reason hashes on-chain?
3. Are AccessControlDefaultAdminRules delays and role separation appropriate for the intended Safe/governance model?
4. Are vesting liability invariants sufficient for arbitrary prefunding and schedule lifecycle sequences?
5. Are the metadata bounds and URI/report fields appropriate for long-term public transparency?
