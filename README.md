<div align="center">

# TikiDeco Token

**TIDE: a transparent Ethereum token layer for the future TikiDeco Miami Beach hospitality concept.**

[![CI](https://github.com/denterion/Token-TIkiDeco/actions/workflows/ci.yml/badge.svg)](https://github.com/denterion/Token-TIkiDeco/actions/workflows/ci.yml)
![Solidity](https://img.shields.io/badge/Solidity-0.8.28-2f2f2f)
![Network](https://img.shields.io/badge/Testnet-Sepolia-2b6cb0)
![Supply](https://img.shields.io/badge/Supply-100M%20TIDE-0f766e)
![Status](https://img.shields.io/badge/Status-Pre--mainnet-b7791f)

</div>

## Snapshot

| Field | Value |
| --- | --- |
| Token name | `TikiDeco` |
| Symbol | `TIDE` |
| Standard | ERC-20 compatible |
| Fixed supply | `100,000,000 TIDE` |
| Owner wallet | Controls admin actions and report publishing |
| Treasury wallet | Receives the full initial token supply |
| Vesting | Cliff, linear release, owner-assisted release, revocation |
| Transparency | On-chain hashes for public project reports |

TikiDeco is built as a disciplined token foundation: fixed supply, separate owner and treasury roles, vesting for long-term allocations, and public report anchoring for project transparency.

## Contract System

| Contract | Purpose |
| --- | --- |
| [`TikiDecoToken`](contracts/TikiDecoToken.sol) | ERC-20 compatible fixed-supply token with pause controls and report hash publishing. |
| [`TikiDecoVestingVault`](contracts/TikiDecoVestingVault.sol) | Vesting vault for team, partners, community rewards, and future hotel perks. |

Security-minded defaults:

- no public mint function
- two-step ownership transfer
- owner/treasury separation
- safer allowance adjustments
- guarded vesting token calls
- reentrancy protection in vesting operations
- accidental native ETH rejection
- automated tests and GitHub CI

## Tokenomics

| Allocation | Percent | Amount | Vesting |
| --- | ---: | ---: | --- |
| Treasury operations | 20% | 20,000,000 TIDE | Unlocked to treasury/multisig |
| Team and advisors | 15% | 15,000,000 TIDE | 12-month cliff, then 36-month linear vesting |
| Strategic partners | 10% | 10,000,000 TIDE | 6-month cliff, then 24-month linear vesting |
| Community rewards | 20% | 20,000,000 TIDE | 48-month linear distribution |
| Future hotel perks | 15% | 15,000,000 TIDE | 48-month linear distribution |
| Strategic reserve | 20% | 20,000,000 TIDE | Held by treasury/multisig |

More detail: [`docs/TOKENOMICS.md`](docs/TOKENOMICS.md)

Print the plan from code:

```bash
npm run tokenomics
npm run vesting:plan
```

## White Paper

Draft white papers are available in three languages:

| Language | File |
| --- | --- |
| English | [`docs/WHITEPAPER_EN.md`](docs/WHITEPAPER_EN.md) |
| Russian | [`docs/WHITEPAPER_RU.md`](docs/WHITEPAPER_RU.md) |
| Chinese | [`docs/WHITEPAPER_ZH.md`](docs/WHITEPAPER_ZH.md) |

## Wallet Binding

The token is connected to project wallets at deployment time:

```text
OWNER_ADDRESS=0xA9a4f99D5902850D3a6Afcd59838110D26B101E4
TREASURY_ADDRESS=0xf1DAd608ddD5B71F039FEE82026164bc6a245081
```

`OWNER_ADDRESS` controls admin actions. `TREASURY_ADDRESS` receives `100,000,000 TIDE`.

Check the local wallet configuration:

```bash
npm run wallet:check
```

## Sepolia Deployment

Sepolia deployment is prepared but requires a real RPC URL and a funded test deployer wallet.

```bash
npm run sepolia:check
npm run deploy:sepolia
```

Read the full testnet runbook: [`docs/SEPOLIA.md`](docs/SEPOLIA.md)

Deployment records are written to `deployments/`.

## Local Development

Install dependencies:

```bash
npm install
```

Run the full test suite:

```bash
npm test
```

Run a local deployment:

```bash
npx hardhat run scripts/deploy.js
```

Start a local node and deploy to it:

```bash
npx hardhat node
npm run deploy:localhost
```

## Transparency Workflow

For each monthly update, financial summary, permit update, or construction milestone:

1. Create a final public report.
2. Upload it to IPFS or another durable public location.
3. Hash the final document.
4. Call `publishReport(hash, category, uri)`.

This creates an on-chain timestamped record proving which version of the document was published.

## Project Docs

| Document | Purpose |
| --- | --- |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Deployment runbook and mainnet gate. |
| [`docs/SEPOLIA.md`](docs/SEPOLIA.md) | Sepolia-specific deployment checklist. |
| [`SECURITY.md`](SECURITY.md) | Security scope, current protections, and reporting policy. |

## Legal Boundary

This repository is a technical prototype and project-management foundation. TIDE should not be marketed as equity, debt, revenue share, profit share, guaranteed appreciation, or an investment return without securities counsel and the correct compliant legal structure.

Before any public sale connected to capital raising, complete legal review, securities analysis, KYC/AML planning, treasury governance, and independent smart-contract audit.
