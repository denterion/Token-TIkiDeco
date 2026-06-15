# Sepolia Etherscan Verification

Contract verification publishes the Solidity source on Etherscan so people can inspect the code directly in the explorer.

## Required Secret

Add this to `.env`:

```text
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

Do not commit `.env`.

## Verify TikiDecoToken

```bash
npm run verify:sepolia
```

The script reads `deployments/sepolia.json` and verifies both:

- `TikiDecoToken`
- `TikiDecoVestingVault`

## After Verification

Check that each Sepolia Etherscan page has a `Contract` tab with verified source code.
