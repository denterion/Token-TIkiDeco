# Independent Reviewer Guide

Status: reviewer navigation for non-canonical V2 candidate code. V1 remains the canonical Sepolia legacy deployment. An external independent audit has not started.

The source of truth for the frozen scope is [`config/audit/v2-independent-review.json`](../config/audit/v2-independent-review.json). Package checksums and the package manifest identify the later evidence commit used to assemble reports and artifacts.

`config/audit/v2-role-manifest.json` is a non-deployed template: all addresses are unassigned and on-chain assertions are incomplete. Review the role model and public-network deployment guardrails; deployment readiness is out of scope.

## 30-Minute Path

1. Read `AUDIT_SCOPE.md`, `docs/AUDIT_TERMINOLOGY.md` and `KNOWN_ISSUES.md`.
2. Confirm `deployments/canonical.json` identifies V1 and lists V2 only as a non-canonical candidate.
3. Compare the two V2 contracts and `scripts/deploy-v2.cjs` with the freeze commit.
4. Read `docs/V2_AUDIT_OWNER_DECISIONS.md` and `docs/AUDITOR_QUESTIONS.md`.
5. Verify `SHA256SUMS.txt` in the supplied package.

## Two-Hour Path

Complete the 30-minute path, then:

```bash
npm ci
npm run compile
npm test
npm run foundry:test
npm run slither
npm run bytecode
npm run deps
npm run external-review:check
npm run review:candidate:check
npm run review:handoff:check
```

Review role separation, prefunded vesting liabilities, revoke accounting, token-pause effects on release, metadata/report bounds and public-network deployment guards.

## Full-Review Path

1. Clone and checkout the exact freeze commit recorded in the package manifest.
2. Run Hardhat tests, Foundry tests and coverage, Slither, dependency advisory scan, bytecode and gas gates.
3. Rebuild ABI and bytecode and compare package checksums.
4. Review every accepted Slither item and known issue rather than treating the baseline as a waiver.
5. Validate the role assumptions and deployment fail-closed tests without deploying to a public network.
6. Follow `docs/AUDIT_RESPONSE_PROCESS.md` for findings and retest evidence.

## Canonical Fact Checks

```bash
npm run manifest
npm run claims
npm run value
```

Expected result: canonical V1 facts pass; V2 remains non-canonical; no sale, mainnet or active hospitality operation is represented.

## Stop Conditions

Stop and ask the maintainer for a rebuilt package if the freeze commit, evidence commit, checksums, compiler configuration or dependency lockfile disagree. Do not infer missing role addresses, signer identities, operator details or review completion.
