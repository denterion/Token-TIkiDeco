# TikiDeco Token

Starter Ethereum project for **TikiDeco**, a transparent token concept connected to a future Miami Beach hotel project.

The starter symbol is **TIDE**. It is short, readable, and connected to the beach/hotel identity. If you prefer the longer alias, change `symbol` in `contracts/TikiDecoToken.sol` from `TIDE` to `TIKIDE` before deployment.

## Current Design

- Token name: `TikiDeco`
- Symbol: `TIDE`
- Standard: ERC-20 compatible
- Supply: fixed at `100,000,000 TIDE`
- Owner wallet: address that can pause, unpause, update project URI, and publish report hashes
- Treasury wallet: address that receives the full initial token supply
- Owner controls: pause/unpause during launch, update project URI, publish report hashes
- Transparency feature: project reports can be anchored on-chain with a document hash and URI
- Vesting: `TikiDecoVestingVault` supports cliff, linear vesting, release, and revocation for selected allocations

## Tokenomics

The starter allocation plan is documented in [`docs/TOKENOMICS.md`](docs/TOKENOMICS.md).

White paper drafts:

- English: [`docs/WHITEPAPER_EN.md`](docs/WHITEPAPER_EN.md)
- Russian: [`docs/WHITEPAPER_RU.md`](docs/WHITEPAPER_RU.md)
- Chinese: [`docs/WHITEPAPER_ZH.md`](docs/WHITEPAPER_ZH.md)

Print the allocation table from code:

```bash
npm run tokenomics
```

## Wallet Binding

The token is connected to your wallet at deployment time.

- `OWNER_ADDRESS` controls the contract admin actions.
- `TREASURY_ADDRESS` receives the initial `100,000,000 TIDE`.
- For a simple first launch, both can be the same wallet.
- For a more professional launch, use a multisig treasury such as Safe for `TREASURY_ADDRESS`.

Check the wallet setup before deploying:

```bash
npm run wallet:check
```

## Important Legal Boundary

This starter contract is suitable for a utility/community prototype. If token holders receive profit rights, revenue share, ownership, debt rights, buyback promises, or investment returns from the hotel business, the token may be treated as a regulated securities product.

Before any sale connected to capital raising, create the legal structure first:

- project company or SPV
- offering documents
- investor eligibility rules
- KYC/AML process
- transfer restrictions if needed
- securities counsel review in the relevant jurisdictions

## Project Setup

```bash
npm install
npm test
```

## Deploy Locally

Start a local Hardhat node in one terminal:

```bash
npx hardhat node
```

Deploy in another terminal:

```bash
npm run deploy:localhost
```

## Deploy To Sepolia

Copy `.env.example` to `.env`, then fill in:

- `SEPOLIA_RPC_URL`
- `DEPLOYER_PRIVATE_KEY`
- `OWNER_ADDRESS`
- `TREASURY_ADDRESS`

Use a test wallet only. Never put a main wallet seed phrase or private key in this project.

```bash
npm run deploy:sepolia
```

## Transparency Workflow

For each monthly update, financial summary, permit update, or construction milestone:

1. Create a PDF or public report.
2. Upload it to a durable location such as IPFS or a public archive.
3. Hash the final document.
4. Call `publishReport(hash, category, uri)`.

This creates an on-chain timestamped record that proves what version of the document was published.
