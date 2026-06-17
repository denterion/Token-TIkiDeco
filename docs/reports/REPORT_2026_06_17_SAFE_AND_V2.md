# TikiDeco Transparency Report: Safe Ownership And OpenZeppelin V2

Report ID: `2026-06-17-safe-ownership-openzeppelin-v2`

Date: 2026-06-17

Network: Ethereum Sepolia

## Purpose

This report records two major governance and engineering milestones for the TikiDeco / TIDE prototype:

- Sepolia owner powers were transferred to a Safe multisig.
- The OpenZeppelin-based V2 contract track was merged into the main repository.

This report is not an investment memo, securities offering, hotel ownership document, revenue-share document, or promise of profit.

## Current Sepolia Deployment

TikiDecoToken:

`0xE4c1DE533440b411Be5C17883FF662e95a462097`

TikiDecoVestingVault:

`0xc480565482af6B08A3b65D0C9aba985d6240702E`

Owner Safe:

`0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3`

Treasury:

`0xf1DAd608ddD5B71F039FEE82026164bc6a245081`

Deployer:

`0x087f0c360060ab380B2271FdcC32091d91bBec8F`

## Safe Ownership Status

The token contract and vesting vault are now owned by the Sepolia Safe:

`0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3`

Safe threshold:

`3-of-3`

Final Safe ownership acceptance transaction:

`0x1ddab2941e8d5fc1a550e1a67db05e1d4f57d6705e5bf3f3e1dbfcd9534c145e`

Final ownership transfer timestamp:

`2026-06-17T08:25:12.000Z`

Final ownership transfer block:

`11078670`

## Ownership Transfer Trail

| Step | Transaction |
| --- | --- |
| Token `transferOwnership(Safe)` | `0xb573c39c9b510e8694164609587d586dabe73f30149f366aeadcfb6f9fb802ed` |
| Vault `transferOwnership(Safe)` | `0xf7478537ba264dd7c145e3619cc4c2cc7751084216c64a6b7337a06b613401ca` |
| Safe activation | `0x8015cb2e0ea0a871c3b4a606ba2ba435714f70a6ae20529277504fe7b3e8d96d` |
| Safe `acceptOwnership()` batch | `0x1ddab2941e8d5fc1a550e1a67db05e1d4f57d6705e5bf3f3e1dbfcd9534c145e` |

## Current Token State

Latest Sepolia state check:

```text
Token owner: 0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3
Vault owner: 0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3
Treasury: 0xf1DAd608ddD5B71F039FEE82026164bc6a245081
Treasury balance: 100000000.0 TIDE
Total supply: 100000000.0 TIDE
```

The prototype has no public mint function.

## OpenZeppelin V2 Track

The OpenZeppelin V2 track was merged into `main` as a candidate implementation for future review and deployment.

V2 adds:

- `contracts/TikiDecoTokenV2.sol`
- `contracts/TikiDecoVestingVaultV2.sol`
- `scripts/deploy-v2.js`
- V2 test coverage
- OpenZeppelin V2 documentation

V2 uses:

- OpenZeppelin `ERC20`
- OpenZeppelin `Ownable2Step`
- OpenZeppelin `Pausable`
- OpenZeppelin `SafeERC20`
- OpenZeppelin `ReentrancyGuard`

V2 is not currently the active Sepolia deployment. The active deployed Sepolia contracts remain the verified V1 token and vesting vault listed above.

## Test Status

Latest local test suite after the V2 merge:

```text
36 passing
```

The test suite covers both V1 and V2 contract tracks.

## Public Links

Website:

<https://tikideco.xyz/>

GitHub:

<https://github.com/denterion/Token-TIkiDeco>

Token contract:

<https://sepolia.etherscan.io/address/0xE4c1DE533440b411Be5C17883FF662e95a462097>

Vesting vault:

<https://sepolia.etherscan.io/address/0xc480565482af6B08A3b65D0C9aba985d6240702E>

Owner Safe:

<https://sepolia.etherscan.io/address/0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3>

## Communication Boundary

TIDE should be described as:

- public testnet prototype
- hospitality-linked token concept
- community and transparency layer
- future utility subject to legal review
- Safe-administered Sepolia prototype

TIDE should not be described as:

- guaranteed profit
- hotel equity
- real estate ownership
- revenue share
- dividend right
- debt claim
- regulator-approved product
- guaranteed mainnet launch

## Next Recommended Steps

- Publish this report hash on-chain through the owner Safe.
- Run a focused security review of the OpenZeppelin V2 contracts.
- Decide whether V2 should be deployed to Sepolia as a candidate deployment.
- Prepare a written treasury governance policy before any mainnet planning.

## Hashing And On-Chain Publication

This report can be hashed locally and published through `TikiDecoToken.publishReport`.

Suggested category:

`safe-ownership-openzeppelin-v2`

Suggested URI:

`https://github.com/denterion/Token-TIkiDeco/blob/main/docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md`

Publication note:

Only the token owner Safe can publish this report hash on-chain.
