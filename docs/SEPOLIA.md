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

For the current deployed Sepolia contracts, owner control has already been transferred to Safe:

```text
CURRENT_OWNER_SAFE=0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3
```

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
| TikiDecoToken | [`0xE4c1DE533440b411Be5C17883FF662e95a462097`](https://sepolia.etherscan.io/address/0xE4c1DE533440b411Be5C17883FF662e95a462097#code) |
| TikiDecoVestingVault | [`0xc480565482af6B08A3b65D0C9aba985d6240702E`](https://sepolia.etherscan.io/address/0xc480565482af6B08A3b65D0C9aba985d6240702E#code) |
| Owner Safe | [`0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3`](https://sepolia.etherscan.io/address/0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3) |

Verification status: both contracts are verified on Sepolia Etherscan.

Ownership status: token and vesting vault owner is the Sepolia Safe `3-of-3`.

Check the deployed state:

```bash
npm run sepolia:state
```

## Post-Deploy Checks

1. Confirm `owner` is the intended Safe admin wallet.
2. Confirm `treasury` holds `100,000,000 TIDE`.
3. Confirm the vesting vault owner is correct.
4. Publish the token and vault addresses in the README.
5. Verify contracts on Etherscan/Sepolia explorer.
