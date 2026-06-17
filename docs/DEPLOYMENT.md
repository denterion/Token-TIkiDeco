# Deployment Runbook

Use this runbook for testnet deployment first. Do not deploy to Ethereum mainnet before legal review, independent smart-contract audit, and a final decision on token utility.

## 1. Prepare Wallets

- `OWNER_ADDRESS`: admin wallet or Safe multisig.
- `TREASURY_ADDRESS`: treasury wallet or Safe multisig that receives `100,000,000 TIDE`.
- `DEPLOYER_PRIVATE_KEY`: test deployment key with test ETH only.

Never use a seed phrase in `.env`. Use a private key from a test wallet for Sepolia.

## 2. Configure Project Metadata

Set these values in `.env`:

```text
BUSINESS_ENTITY=TikiDeco project company / SPV to be formed
PROJECT_JURISDICTION=Florida, USA
PROJECT_URI=https://tikideco.example/project
```

Update them before a public deployment.

## 3. Check Locally

```bash
npm run wallet:check
npm run tokenomics
npm run vesting:plan
npm test
```

## 4. Deploy To Sepolia

The current canonical Sepolia deployment is preserved as `v1-legacy` in [`deployments/canonical.json`](../deployments/canonical.json).

```bash
npm run deploy:sepolia
```

The deploy script writes a deployment record to `deployments/sepolia.json`.

OpenZeppelin V2 testnet candidate:

```bash
CONFIRM_NON_CANONICAL_V2_DEPLOY=true npm run deploy:v2:sepolia
```

The V2 deploy script writes a separate deployment record to `deployments/sepolia-v2.json`. V2 is non-canonical candidate code until it receives focused review, explicit approval, verification, and a canonical manifest update.

## 5. After Deployment

1. Confirm owner and treasury addresses.
2. Confirm total supply is held by treasury.
3. Publish contract addresses in the README or website.
4. Verify contracts on a block explorer.
5. Create vesting schedules only after beneficiary addresses are final.

## 6. Mainnet Gate

Before mainnet:

- independent Solidity audit
- legal review of token utility and communications
- final white paper review
- Safe multisig for owner and treasury
- incident response contacts
- written policy for report publishing and treasury actions
