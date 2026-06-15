# Sepolia Deployment

Sepolia is the recommended first public test network for TikiDeco. It lets you verify deployment, contract addresses, ownership, treasury balances, and vesting operations before any mainnet decision.

## Required Values

Set these in `.env`:

```text
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
DEPLOYER_PRIVATE_KEY=0xYOUR_TEST_WALLET_PRIVATE_KEY
OWNER_ADDRESS=0xA9a4f99D5902850D3a6Afcd59838110D26B101E4
TREASURY_ADDRESS=0xf1DAd608ddD5B71F039FEE82026164bc6a245081
```

Use a test wallet only. Do not use a wallet that holds mainnet funds.

## Readiness Check

```bash
npm run sepolia:check
```

The check confirms:

- Sepolia RPC is configured
- deployer private key is present
- chain ID is `11155111`
- owner and treasury are valid addresses
- deployer has Sepolia ETH

## Deploy

```bash
npm run deploy:sepolia
```

After deployment, the script writes:

```text
deployments/sepolia.json
```

Commit `deployments/sepolia.json` after you confirm the addresses are correct. Do not commit `.env`.

## Current Sepolia Deployment

| Contract | Address |
| --- | --- |
| TikiDecoToken | `0xed5dA4F272A6DF8ddB170908108C267563B11621` |
| TikiDecoVestingVault | `0xcb31dD0b67Ad742E6B58eeF43ba3EA615F1d1683` |

Check the deployed state:

```bash
npm run sepolia:state
```

## Post-Deploy Checks

1. Confirm `owner` is the intended admin wallet.
2. Confirm `treasury` holds `100,000,000 TIDE`.
3. Confirm the vesting vault owner is correct.
4. Publish the token and vault addresses in the README.
5. Verify contracts on Etherscan/Sepolia explorer.
