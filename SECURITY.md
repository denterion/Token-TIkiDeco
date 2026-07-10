# Security Policy

## Status

TikiDeco is pre-mainnet software. The contracts are covered by local tests, but they have not yet received an independent audit.

Current internal review:

[`SECURITY_REVIEW.md`](SECURITY_REVIEW.md)

The internal review is not a substitute for an independent audit.

## Supported Scope

Security review should focus on:

- ERC-20 transfer and allowance behavior
- ownership and pause controls
- report publication integrity
- vesting schedule creation, release, and revocation
- treasury and beneficiary configuration
- deployment scripts and environment handling

## Current Protections

- fixed supply
- no public mint function
- two-step ownership transfer
- separate owner and treasury roles
- vesting vault with reentrancy protection
- guarded token transfers in vesting vault
- rejection of accidental native ETH transfers
- local tests and GitHub CI

## Reporting

Do not disclose suspected vulnerabilities publicly before the project owner has had a chance to investigate. Use [GitHub private vulnerability reporting](https://github.com/denterion/Token-TIkiDeco/security/advisories/new) to report issues privately to the project maintainer.

Do not include private keys, seed phrases, passwords, RPC credentials, private guest data, or unrelated sensitive personal data. Public GitHub Issues are for non-sensitive questions and feedback only.

## Mainnet Requirement

Do not deploy to mainnet until the contracts and token communications have passed independent security and legal review.
