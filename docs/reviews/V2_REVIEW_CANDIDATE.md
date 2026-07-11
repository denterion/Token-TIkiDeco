# V2 Independent Review Candidate

Status: immutable package definition for a frozen, non-canonical and non-deployed V2 candidate. Independent technical review and formal independent smart-contract audit are both `not-started`.

## Immutable Identity

| Field | Value |
| --- | --- |
| V2 freeze commit | `9099fdb87a6be715b1d7fd4fafa6fade0b12b61c` |
| Evidence/source commit | `cdc9e7e27e66f204c50d59e45ccf970ad20290d6` |
| Deterministic package date | `2026-07-10T22:57:00+03:00` |
| Solidity / EVM | `0.8.28` / `paris` |
| Optimizer | enabled, 200 runs |
| Dependency lock SHA-256 | `d657f3abf336d7b59df9517fbc345c895dd34c3522b0e504e98f276d1a534787` |
| Package SHA-256 | `980555973d47cb5b21b900f3d463890d4faeeff1c45d351332906f5149bae1a2` |
| Package path | `release-artifacts/v2-review-candidate/cdc9e7e27e66f204c50d59e45ccf970ad20290d6` |

The package SHA-256 is the SHA-256 of the sorted internal `SHA256SUMS.txt`. The definition is committed after the evidence/source commit and is intentionally outside the payload hash-domain; otherwise the package would need to contain its own unknown checksum and commit hash.

## Scope

Contracts:

- `contracts/TikiDecoTokenV2.sol`
- `contracts/TikiDecoVestingVaultV2.sol`

Deployment script:

- `scripts/deploy-v2.cjs`

Tests:

- `test/TikiDecoTokenV2.js`
- `test/TikiDecoVestingVaultV2.js`
- `test/TikiDecoInvariants.js`
- `test/V2DeploymentConfig.js`
- `foundry/TikiDecoTokenV2Invariant.t.sol`
- `foundry/TikiDecoVestingVaultV2Invariant.t.sol`
- `foundry/FoundryTestBase.sol`

Known issues are `KI-01` through `KI-09` in `KNOWN_ISSUES.md`. Reviewer questions are in `docs/AUDITOR_QUESTIONS.md`.

## Role-Model Boundary

`config/audit/v2-role-manifest.json` is a non-deployed template. No role, treasury, token or vault address is assigned. On-chain assertions are incomplete. The reviewer evaluates role separation, admin-delay assumptions and fail-closed deployment guardrails; deployment readiness is explicitly out of scope.

## Reproduce The Payload

From a fresh clone with complete Git history:

```bash
git checkout cdc9e7e27e66f204c50d59e45ccf970ad20290d6
npm ci
npm run compile
npm test
npm run foundry:test
npm run foundry:coverage
npm run slither
npm run bytecode
npm run deps
npm run claims
npm run value
npm run review:candidate:build -- --commit cdc9e7e27e66f204c50d59e45ccf970ad20290d6
```

Then return to the definition branch/commit and run:

```bash
npm run review:candidate:check
npm run review:handoff:check
```

The build must reproduce package SHA-256 `980555973d47cb5b21b900f3d463890d4faeeff1c45d351332906f5149bae1a2`.

## Explicit Exclusions

- V1 deployed bytecode and semantics;
- deployment readiness and all public-network execution;
- mainnet, sale, liquidity, listing or value decisions;
- legal, tax, regulatory, property or operator conclusions;
- private keys, signer identities and participant data;
- active hospitality benefits.

No deployment or transaction is authorized by this definition.
