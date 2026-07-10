# External Audit Package Index

Status: audit-preparation index. This is not an independent audit, not a legal opinion, not a mainnet approval, not a value statement, and not an offer.

TikiDeco V2 remains non-canonical candidate code. V1 remains the historical canonical Ethereum Sepolia deployment.

## Scope

The audit package is intended to support external review of the V2 candidate contracts, V2 deployment guardrails, tests, invariants, and known review questions.

## Exact Commits

| Item | Commit |
| --- | --- |
| V2 freeze commit | `9099fdb87a6be715b1d7fd4fafa6fade0b12b61c` |
| Current evidence commit | Generated as `evidenceCommit` in `audit-package-manifest.json`. |
| Published Sepolia release commit | `e07471936375ffbe13c68da2708b4436931392a2` |

The freeze commit is the immutable V2 candidate contract baseline. Each package manifest records its own evidence commit for documentation, CI evidence, package scripts and generated review artifacts. An older package remains historical and must not be presented as evidence for a later commit.

## Contracts In Scope

- `contracts/TikiDecoTokenV2.sol`
- `contracts/TikiDecoVestingVaultV2.sol`

## Scripts In Scope

- `scripts/deploy-v2.cjs`
- `scripts/check-slither-baseline.cjs`
- `scripts/check-bytecode-size.cjs`
- `scripts/check-coverage-thresholds.cjs`
- `scripts/export-contract-artifacts.cjs`
- `scripts/generate-v2-audit-package.cjs`
- `scripts/check-external-review.cjs`

## Docs In Scope

- `AUDIT_SCOPE.md`
- `ARCHITECTURE.md`
- `THREAT_MODEL.md`
- `SPECIFICATION.md`
- `INVARIANTS.md`
- `KNOWN_ISSUES.md`
- `SECURITY_REVIEW.md`
- `docs/V2_AUDIT_TARGET_FREEZE.md`
- `docs/V2_AUDIT_OWNER_DECISIONS.md`
- `docs/V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md`
- `docs/FRESH_CHECKOUT_RELEASE_PROOF.md`
- `docs/ACCESS_CONTROL.md`
- `docs/V2_DEPLOYMENT_CHECKLIST.md`
- `docs/V2_MIGRATION_NOTES.md`
- `docs/V2_ROLE_MANIFEST_SCHEMA.md`
- `docs/EXTERNAL_AUDIT_READINESS.md`
- `docs/AUDITOR_QUESTIONS.md`
- `docs/AUDIT_RESPONSE_PROCESS.md`
- `docs/AUDIT_TERMINOLOGY.md`
- `docs/INDEPENDENT_REVIEWER_GUIDE.md`
- `docs/AUDIT_PROCUREMENT_BRIEF.md`
- `docs/POST_AUDIT_WORKFLOW.md`

## Tests In Scope

- `test/TikiDecoTokenV2.js`
- `test/TikiDecoVestingVaultV2.js`
- `test/TikiDecoInvariants.js`
- `test/V2DeploymentConfig.js`
- `foundry/TikiDecoTokenV2Invariant.t.sol`
- `foundry/TikiDecoVestingVaultV2Invariant.t.sol`
- `foundry/FoundryTestBase.sol`

## Known Issues

Primary known review items are tracked in `KNOWN_ISSUES.md`, especially:

- V2 public metadata as a claims surface.
- Role configuration safety in `scripts/deploy-v2.cjs`.
- Token-pause-only vesting release circuit breaker.
- Report supersede semantics remaining off-chain.
- Slither baseline and accepted V2 findings.
- Release package tooling and generated artifact reproducibility.

## Out Of Scope

- V1 deployed Sepolia bytecode and V1 source semantics.
- Any mainnet deployment.
- Any Sepolia deployment or transaction broadcast.
- Private keys, RPC secrets, or signer collection.
- Legal opinion or regulatory conclusion.
- Token sale, token value, liquidity, listing, hotel ownership, revenue, or investment claims.
- Active hospitality benefits or completed property claims.

## Explicit Non-Canonical Status

V2 is not canonical, not deployed by `deployments/canonical.json`, not independently audited, not approved for mainnet, and not promoted by this package.

Run:

```bash
npm run audit
npm run audit:handoff
npm run external-review:package
npm run external-review:check
npm run release -- --commit <final-main-sha> --release v0.2.0-utility-pilot
```

The package command must fail if V2 is promoted, if independent audit completion is claimed, or if banned public claims appear.

## Handoff Procedure

1. Generate the package from a clean tree and the intended evidence commit.
2. Verify `SHA256SUMS.txt`.
3. Confirm `npm run audit:handoff` passes.
4. Send the package directory, this index, auditor questions, known issues, and response process to the auditor.
5. Freeze unrelated changes while review is active.
6. Track findings by ID and severity.
7. Publish response material only after maintainer review and, if needed, counsel/communications review.
