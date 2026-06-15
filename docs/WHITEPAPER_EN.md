# TikiDeco White Paper

Version: draft 0.1

## Overview

TikiDeco is an Ethereum-based token project connected to the future TikiDeco Miami Beach Hotel concept. The project is designed to create a transparent digital layer around brand participation, community rewards, future hospitality perks, and public project reporting.

TIDE is not designed as an uncontrolled fundraising token. The current smart-contract system focuses on fixed supply, transparent allocation, vesting, treasury discipline, and public report anchoring.

## Token

- Name: TikiDeco
- Symbol: TIDE
- Network target: Ethereum and Ethereum test networks
- Standard: ERC-20 compatible
- Total supply: 100,000,000 TIDE
- Initial supply holder: project treasury or multisig wallet

The token has a fixed maximum supply. No public minting function exists in the current contract.

## Project Utility

The intended utility model includes:

- community rewards
- loyalty campaigns
- early access to future hotel-related experiences
- booking-related perks where legally and operationally available
- transparent publication of project updates
- brand participation around the TikiDeco hospitality concept

Any future financial rights, revenue share, equity-like features, or investment offering must be handled through a separate compliant legal structure.

## Tokenomics

The starter allocation model is:

| Bucket | Percent | Amount |
| --- | ---: | ---: |
| Treasury operations | 20% | 20,000,000 TIDE |
| Team and advisors | 15% | 15,000,000 TIDE |
| Strategic partners | 10% | 10,000,000 TIDE |
| Community rewards | 20% | 20,000,000 TIDE |
| Future hotel perks | 15% | 15,000,000 TIDE |
| Strategic reserve | 20% | 20,000,000 TIDE |

Team, partner, community, and hotel-perk allocations can be placed into vesting schedules to reduce short-term pressure and improve accountability.

## Vesting

The TikiDecoVestingVault supports:

- cliff periods
- linear vesting
- beneficiary releases
- owner-assisted releases
- revocation of revocable schedules
- refund of unvested tokens to a specified treasury address

The vault rejects accidental native ETH transfers and uses guarded token calls and reentrancy protection.

## Transparency

The token contract allows the owner to publish report hashes on-chain. This creates a timestamped public reference for project updates, financial summaries, permit updates, or milestone reports.

Recommended workflow:

1. Prepare a final report.
2. Upload it to IPFS or another durable public location.
3. Hash the final document.
4. Publish the hash and URI through the token contract.

## Security

The starter security model includes:

- fixed supply
- two-step ownership transfer
- owner and treasury separation
- pause/unpause control during launch
- non-reentrant vesting operations
- safe token transfers in the vesting vault
- explicit rejection of accidental ETH transfers
- tests for core token and vesting behavior

Before mainnet deployment, the contracts should receive independent audit review.

## Legal Notice

This document is a technical and project draft. It is not an offer to sell securities, investment advice, legal advice, or a promise of profit. TIDE should not be marketed as equity, debt, revenue share, profit share, or guaranteed appreciation without proper securities counsel and a compliant legal structure.
