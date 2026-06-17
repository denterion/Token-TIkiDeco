# TikiDeco Treasury Policy

This policy defines the starter treasury discipline for the TikiDeco / TIDE prototype.

It is not legal advice, investment advice, a securities disclosure, or a promise that any token holder will receive profit, equity, revenue share, or hotel ownership.

## Current Treasury State

| Item | Address |
| --- | --- |
| Token | `0xE4c1DE533440b411Be5C17883FF662e95a462097` |
| Owner Safe | `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3` |
| Treasury wallet | `0xf1DAd608ddD5B71F039FEE82026164bc6a245081` |
| Supply held by treasury | `100,000,000 TIDE` |
| Network | Ethereum Sepolia |

The current deployment is a Sepolia prototype. Sepolia tokens have no market value.

## Treasury Principles

- Keep owner control behind Safe governance.
- Keep treasury movements documented before execution.
- Do not use treasury language that implies profit, dividends, equity, debt, or revenue share.
- Separate operational planning from token-holder financial expectations.
- Publish periodic transparency reports with on-chain hashes.
- Treat mainnet treasury policy as blocked until legal review is complete.

## Allocation Buckets

| Bucket | Amount | Starter Policy |
| --- | ---: | --- |
| Treasury operations | `20,000,000 TIDE` | Held for project setup, legal, permits, technical operations, and prototype expenses. |
| Team and advisors | `15,000,000 TIDE` | Subject to cliff and linear vesting before any serious launch. |
| Strategic partners | `10,000,000 TIDE` | Subject to documented partner criteria and vesting. |
| Community rewards | `20,000,000 TIDE` | Used only for non-investment community, education, loyalty, and participation programs. |
| Future hotel perks | `15,000,000 TIDE` | Reserved for future utility design, subject to legal review and operational feasibility. |
| Strategic reserve | `20,000,000 TIDE` | Held for governance-approved contingency and future planning. |

## Allowed Prototype Treasury Actions

During the Sepolia prototype stage, treasury actions may include:

- funding vesting schedules for test beneficiaries
- testing community reward distribution mechanics
- testing future perk allocation mechanics
- transferring test tokens between project-controlled wallets for verification
- publishing transparency reports
- documenting planned treasury workflows

## Prohibited Treasury Messaging

The treasury should not be described as:

- backing a guaranteed token price
- guaranteeing redemption value
- funding dividends or revenue share
- representing hotel equity
- representing real estate ownership
- guaranteeing mainnet launch
- guaranteeing future exchange listings

## Safe Approval Policy

Current owner Safe threshold:

```text
3-of-3
```

For the Sepolia prototype:

- admin actions should be executed through Safe
- report publication should be executed through Safe
- any token movement that could be interpreted as an allocation should be documented before execution

Before mainnet, review whether `3-of-3` is too rigid. A production setup often uses a threshold such as `3-of-5` to reduce key-loss and signer-availability risk.

## Documentation Requirements

Before material treasury actions, publish a short action note containing:

- action category
- wallet addresses involved
- token amount
- reason for the action
- risk boundary
- whether the action is testnet-only
- planned transaction hash after execution

After execution, update the relevant manifest or report with:

- transaction hash
- block number
- timestamp
- final token balances if relevant

## Mainnet Gate

No mainnet treasury policy should be considered final until:

- project entity or SPV structure is reviewed
- token utility is reviewed by qualified counsel
- KYC/AML needs are evaluated
- securities analysis is completed
- Safe signer policy is finalized
- incident response plan is written
- independent smart-contract audit is complete
