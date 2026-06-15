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
npm run verify:sepolia -- 0xed5dA4F272A6DF8ddB170908108C267563B11621 \
  0xA9a4f99D5902850D3a6Afcd59838110D26B101E4 \
  0xf1DAd608ddD5B71F039FEE82026164bc6a245081 \
  "TikiDeco project company / SPV to be formed" \
  "Florida, USA" \
  "https://tikideco.example/project"
```

## Verify TikiDecoVestingVault

```bash
npm run verify:sepolia -- 0xcb31dD0b67Ad742E6B58eeF43ba3EA615F1d1683 \
  0xed5dA4F272A6DF8ddB170908108C267563B11621 \
  0xA9a4f99D5902850D3a6Afcd59838110D26B101E4
```

## After Verification

Check that each Sepolia Etherscan page has a `Contract` tab with verified source code.
