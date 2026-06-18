# Foundry Fuzz And Invariant Testing

Status: secondary toolchain for V2 candidate tests. Hardhat remains the primary test suite.

## Scope

Foundry tests are stored in `foundry` and focus on V2 fuzz, invariant, and deterministic vesting boundary coverage.

The tests do not replace:

- `npm test`
- Hardhat deployment scripts
- Hardhat coverage
- Slither

## Deterministic Seed

The configured seed is:

```text
0x54494b494445434f5f56325f46555a5a5f534545445f3030303030303031
```

CI prints this seed before running Foundry. Reproduce locally with:

```bash
npm run foundry:test
```

or directly:

```bash
forge test --fuzz-seed 0x54494b494445434f5f56325f46555a5a5f534545445f3030303030303031 -vvv
```

## Test Files

| File | Purpose |
| --- | --- |
| `foundry/FoundryTestBase.sol` | Minimal local Foundry cheatcode/assert helper. |
| `foundry/TikiDecoTokenV2Invariant.t.sol` | Token invariants and role-gating boundary checks. |
| `foundry/TikiDecoVestingVaultV2Invariant.t.sol` | Vesting accounting invariants and deterministic boundary checks. |

## Failure Policy

Do not weaken an invariant to make it pass. If an invariant fails:

1. Preserve the failing seed and counterexample from the Foundry output.
2. Identify whether the failure is test-harness invalid input or contract behavior.
3. If the contract must change, document the required contract change before editing.
4. Add or update a deterministic regression test for the failing sequence.

