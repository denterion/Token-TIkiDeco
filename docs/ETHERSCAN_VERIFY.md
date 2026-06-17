# Sepolia Etherscan Verification

Contract verification publishes the Solidity source on Etherscan so people can inspect the code directly in the explorer.

## Current Status

Current status: both canonical Sepolia V1 contracts are verified.

- `TikiDecoToken`
- `TikiDecoVestingVault`

## Hardhat 3 Note

This branch intentionally does not install `@nomicfoundation/hardhat-verify`.

Reason: the current Hardhat 3 verify plugin dependency tree pulls ethers v5 packages that reintroduce npm audit advisories. The repository keeps an audit-clean local toolchain and treats verification for future V2 deployments as a manual or separately reviewed step until the plugin dependency tree is clean.

## Future V2 Verification

For a future V2 candidate deployment:

1. Verify manually on Sepolia Etherscan, or
2. Re-enable a Hardhat 3 verify plugin once `npm audit` remains clean.

If automated verification is re-enabled, store only this value in `.env`:

```text
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

Do not commit `.env`.

## Local Command

```bash
npm run verify:sepolia
```

The command now prints the current verification policy and canonical V1 addresses. It does not publish transactions and does not call Etherscan.
