<div align="center">

<img src="site/assets/tide-logo.png" alt="TikiDeco TIDE logo" width="180">

# TikiDeco Token

**TikiDeco is an open-source Sepolia prototype exploring transparent loyalty and access infrastructure for a future hospitality concept. TIDE currently has no monetary value and is not offered for sale.**

[![CI](https://github.com/denterion/Token-TIkiDeco/actions/workflows/ci.yml/badge.svg)](https://github.com/denterion/Token-TIkiDeco/actions/workflows/ci.yml)
![Solidity](https://img.shields.io/badge/Solidity-0.8.28-2f2f2f)
![Network](https://img.shields.io/badge/Testnet-Sepolia-2b6cb0)
![Supply](https://img.shields.io/badge/Supply-100M%20TIDE-0f766e)
![Status](https://img.shields.io/badge/Status-Pre--mainnet-b7791f)
[![Security](https://github.com/denterion/Token-TIkiDeco/actions/workflows/security.yml/badge.svg)](https://github.com/denterion/Token-TIkiDeco/actions/workflows/security.yml)

[Website](https://denterion.github.io/Token-TIkiDeco/) |
[Token](https://sepolia.etherscan.io/address/0xE4c1DE533440b411Be5C17883FF662e95a462097) |
[Vault](https://sepolia.etherscan.io/address/0xc480565482af6B08A3b65D0C9aba985d6240702E) |
[White Paper](docs/WHITEPAPER_EN.md) |
[Project Facts](docs/PROJECT_FACTS.md) |
[Claims Matrix](docs/CLAIMS_MATRIX.md)

</div>

## Snapshot

| Field | Value |
| --- | --- |
| Token name | `TikiDeco` |
| Symbol | `TIDE` |
| Canonical Sepolia version | `v1-legacy` |
| Candidate implementation | `v2-openzeppelin-candidate` |
| Standard | ERC-20 compatible |
| Fixed supply | `100,000,000 TIDE` |
| Owner wallet | Sepolia Safe multisig `3-of-3` |
| Treasury wallet | Receives the full initial token supply |
| Safe migration | Completed on Sepolia |
| Vesting | Cliff, linear release, owner-assisted release, revocation |
| Transparency | On-chain hashes for public project reports |

TikiDeco is built as a disciplined token foundation: fixed supply, separate owner and treasury roles, vesting for long-term allocations, and public report anchoring for project transparency.

## Visual Identity

TIDE now has a dedicated token emblem inspired by Miami Beach nightlife, art deco architecture, palm silhouettes, shoreline reflections, and circuit-line transparency.

| Asset | Path |
| --- | --- |
| Token logo | [`site/assets/tide-logo.png`](site/assets/tide-logo.png) |
| Site favicon | [`site/assets/favicon.png`](site/assets/favicon.png) |
| Website hero | [`site/assets/tikideco-hero.png`](site/assets/tikideco-hero.png) |

## Contract System

| Contract | Purpose |
| --- | --- |
| [`TikiDecoToken`](contracts/TikiDecoToken.sol) | Canonical Sepolia `v1-legacy` fixed-supply token with pause controls and report hash publishing. |
| [`TikiDecoVestingVault`](contracts/TikiDecoVestingVault.sol) | Canonical Sepolia `v1-legacy` vesting vault preserved as deployed history. |
| [`TikiDecoTokenV2`](contracts/TikiDecoTokenV2.sol) | Non-canonical OpenZeppelin V2 candidate for review and future deployment. |
| [`TikiDecoVestingVaultV2`](contracts/TikiDecoVestingVaultV2.sol) | Non-canonical OpenZeppelin V2 vesting candidate with explicit `cliffDuration` and `vestingDuration`. |

Canonical deployment manifest:

[`deployments/canonical.json`](deployments/canonical.json)

Security-minded defaults:

- no public mint function
- two-step ownership transfer
- Safe multisig handover runbook
- OpenZeppelin V2 candidate with role-based access control
- owner/treasury separation
- standard OpenZeppelin ERC-20 allowance behavior in V2
- guarded vesting token calls
- reentrancy protection in vesting operations
- accidental native ETH rejection
- automated tests, coverage, bytecode checks, manifest checks, Slither workflow, npm audit, Dependabot, and secret scanning workflow

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
OWNER_ADDRESS=0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3
TREASURY_ADDRESS=0xf1DAd608ddD5B71F039FEE82026164bc6a245081
```

`OWNER_ADDRESS` controls admin actions through a Sepolia Safe multisig. `TREASURY_ADDRESS` receives `100,000,000 TIDE`.

Check the local wallet configuration:

```bash
npm run wallet:check
```

## Safe Multisig Governance

Sepolia Safe owner:

```text
0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3
```

The owner migration is complete on Sepolia. Token and vesting vault admin control now sits behind a Safe multisig with `3-of-3` approvals.

```text
Safe accept ownership tx:
0x1ddab2941e8d5fc1a550e1a67db05e1d4f57d6705e5bf3f3e1dbfcd9534c145e
```

Full runbook: [`docs/SAFE_MULTISIG.md`](docs/SAFE_MULTISIG.md)

## Sepolia Deployment

Sepolia deployment:

| Contract | Address |
| --- | --- |
| TikiDecoToken | [`0xE4c1DE533440b411Be5C17883FF662e95a462097`](https://sepolia.etherscan.io/address/0xE4c1DE533440b411Be5C17883FF662e95a462097#code) |
| TikiDecoVestingVault | [`0xc480565482af6B08A3b65D0C9aba985d6240702E`](https://sepolia.etherscan.io/address/0xc480565482af6B08A3b65D0C9aba985d6240702E#code) |
| Owner Safe | [`0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3`](https://sepolia.etherscan.io/address/0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3) |

Both contracts are verified on Sepolia Etherscan.

This is the canonical historical Sepolia deployment (`v1-legacy`). OpenZeppelin V2 contracts in this repository are candidate code and are not the active Sepolia deployment.

```bash
npm run sepolia:check
npm run deploy:sepolia
npm run sepolia:state
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

Current V1+V2 suite:

```text
56 passing
```

Security checks:

```bash
npm run lint
npm run coverage
npm run gas:snapshot
npm run audit
npm run slither
```

`npm run slither` requires Slither and solc 0.8.28 to be installed on the machine. GitHub Actions installs them and runs Slither directly against `contracts/`.

Run a local deployment:

```bash
npx hardhat run scripts/deploy.cjs
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
4. On V1, call `publishReport(hash, category, uri)` through the Safe workflow.

This creates an on-chain timestamped record proving which version of the document was published.

V1 uses the legacy three-argument report function. The V2 candidate adds bounded report metadata: period start/end, report version, and optional supersede linkage for corrections.

Genesis report:

[`docs/reports/GENESIS_REPORT.md`](docs/reports/GENESIS_REPORT.md)

Hash the report locally:

```bash
npm run report:hash
```

Current Genesis Report hash manifest:

[`docs/reports/GENESIS_REPORT_HASH.md`](docs/reports/GENESIS_REPORT_HASH.md)

Latest on-chain report:

[`docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md`](docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md)

Latest on-chain report hash:

```text
0x04119c47a7c09f09bfdcee87d77925e6f5ec89c2ea1fe9759feaae7091c0b5cc
```

Publication transaction:

[`0x5886945fc62fb8a48e64559eebecaaf80ee20115a02c82808a737063874041f9`](https://sepolia.etherscan.io/tx/0x5886945fc62fb8a48e64559eebecaaf80ee20115a02c82808a737063874041f9)

Because owner control is now Safe-based, future report publication should be prepared with `npm run report:safe:sepolia` and executed through Safe.

## Project Docs

| Document | Purpose |
| --- | --- |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Deployment runbook and mainnet gate. |
| [`SECURITY_REVIEW.md`](SECURITY_REVIEW.md) | Internal security review findings and remediation status. |
| [`docs/SEPOLIA.md`](docs/SEPOLIA.md) | Sepolia-specific deployment checklist. |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Public roadmap from prototype to mainnet gate. |
| [`docs/PITCH_DECK.md`](docs/PITCH_DECK.md) | Lightweight project pitch deck. |
| [`docs/UTILITY.md`](docs/UTILITY.md) | Realistic hospitality-linked token utility scenarios. |
| [`docs/GOVERNANCE.md`](docs/GOVERNANCE.md) | Owner operations and multisig migration plan. |
| [`docs/SAFE_MULTISIG.md`](docs/SAFE_MULTISIG.md) | Safe handover runbook and transaction workflow. |
| [`docs/OPENZEPPELIN_V2.md`](docs/OPENZEPPELIN_V2.md) | OpenZeppelin-based V2 track, differences, and deploy path. |
| [`docs/ACCESS_CONTROL.md`](docs/ACCESS_CONTROL.md) | V2 role separation, prefunded vault model, and treasury controls. |
| [`docs/HARDHAT3_MIGRATION.md`](docs/HARDHAT3_MIGRATION.md) | Hardhat 3 migration notes, audit-clean tooling, and verification tradeoffs. |
| [`docs/TREASURY_POLICY.md`](docs/TREASURY_POLICY.md) | Starter treasury discipline and Safe approval policy. |
| [`docs/REPORTING_CADENCE.md`](docs/REPORTING_CADENCE.md) | Reporting cadence and on-chain publication workflow. |
| [`docs/COMMUNICATION_POLICY.md`](docs/COMMUNICATION_POLICY.md) | Public language boundaries for community and partners. |
| [`docs/SHOWCASE.md`](docs/SHOWCASE.md) | Public links and safe messaging. |
| [`docs/FAQ.md`](docs/FAQ.md) | Public FAQ for collaborators and early community members. |
| [`docs/RISK_DISCLOSURE.md`](docs/RISK_DISCLOSURE.md) | Risk and communication boundaries. |
| [`docs/METAMASK.md`](docs/METAMASK.md) | How to view TIDE in MetaMask on Sepolia. |
| [`docs/reports/GENESIS_REPORT.md`](docs/reports/GENESIS_REPORT.md) | First transparency checkpoint report. |
| [`docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md`](docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md) | Safe ownership and OpenZeppelin V2 transparency checkpoint. |
| [`docs/ETHERSCAN_VERIFY.md`](docs/ETHERSCAN_VERIFY.md) | Source-code verification instructions. |
| [`SECURITY.md`](SECURITY.md) | Security scope, current protections, and reporting policy. |

Verify Sepolia source code after setting `ETHERSCAN_API_KEY`:

```bash
npm run verify:sepolia
```

This branch uses Hardhat 3 with an audit-clean dev dependency tree. The Hardhat verify plugin is intentionally not installed because its current dependency tree reintroduces npm audit advisories. The canonical Sepolia V1 contracts are already verified; future V2 verification should be handled manually on Etherscan or re-enabled once the Hardhat 3 verify dependency tree is clean.

## Public Website

The static public site lives in [`site/`](site/). GitHub Pages is configured through `.github/workflows/pages.yml`.

Expected Pages URL:

```text
https://denterion.github.io/Token-TIkiDeco/
```

## Legal Boundary

This repository is a technical prototype and project-management foundation. TIDE should not be marketed as equity, debt, revenue share, profit share, guaranteed appreciation, or an investment return without securities counsel and the correct compliant legal structure.

Before any public sale connected to capital raising, complete legal review, securities analysis, KYC/AML planning, treasury governance, and independent smart-contract audit.
