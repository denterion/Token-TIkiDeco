# Hardhat 3 Migration Notes

Date: 2026-06-17

Branch: `codex/security-hardening`

## What Changed

- Migrated from Hardhat 2 to `hardhat@3.9.0`.
- Replaced deprecated `@nomicfoundation/hardhat-toolbox` with explicit Hardhat 3 plugins:
  - `@nomicfoundation/hardhat-ethers`
  - `@nomicfoundation/hardhat-ethers-chai-matchers`
  - `@nomicfoundation/hardhat-mocha`
- Switched the project to ESM with `"type": "module"`.
- Converted Hardhat scripts and config helpers to `.cjs` where CommonJS is still useful.
- Updated tests to Hardhat 3's `network.create()` API.
- Removed Hardhat 2-only `solidity-coverage` and `hardhat-gas-reporter`.
- Replaced them with Hardhat 3 built-in flags:
  - `hardhat test --coverage`
  - `hardhat test --gas-stats`
- Added npm overrides for audited transitive packages.

## Verification Tradeoff

`@nomicfoundation/hardhat-verify` is intentionally not installed in this branch because its current dependency tree reintroduces npm audit advisories through ethers v5 packages.

Canonical Sepolia V1 is already verified. Future V2 verification should be manual on Etherscan or re-enabled only when the Hardhat 3 verify dependency tree remains audit-clean.

## Slither Tradeoff

Slither currently has trouble parsing Hardhat 3 build output through `crytic-compile`.

The repository therefore runs Slither directly against `contracts/` with solc 0.8.28:

```bash
npm run slither
```

The known Slither findings are documented and triaged in [`../SECURITY_REVIEW.md`](../SECURITY_REVIEW.md). They remain visible and should be carried into any future V2 promotion review.

## Checks

```bash
npm run compile
npm test
npm run coverage
npm run gas:snapshot
npm run audit
npm run lint
```

Current status:

- `npm run audit`: 0 vulnerabilities
- V2 remains candidate code
- Sepolia V1 remains the legacy canonical deployment
