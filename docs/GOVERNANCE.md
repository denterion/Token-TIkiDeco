# TikiDeco Governance And Owner Operations

This document describes practical owner operations for the TikiDeco / TIDE Sepolia prototype.

It is not legal advice, investment advice, or a production governance charter.

## Current Model

TikiDeco currently separates:

- `owner`: controls admin actions such as pause, report publishing, project URI updates, vesting schedule management, and ownership transfer.
- `treasury`: holds the full TIDE supply.

Current Sepolia owner:

```text
0xA9a4f99D5902850D3a6Afcd59838110D26B101E4
```

Current Sepolia treasury:

```text
0xf1DAd608ddD5B71F039FEE82026164bc6a245081
```

## Recommended Production Direction

Before mainnet, owner and treasury should be moved to a multisig wallet such as Safe.

Recommended minimum:

- 2-of-3 Safe for testnet operations.
- 3-of-5 Safe for serious pre-mainnet or mainnet operations.
- Separate Safe wallets for owner and treasury if operationally possible.

## Owner Operations Checklist

Before any owner transaction:

1. Confirm the network.
2. Confirm the contract addresses.
3. Confirm current owner and pending owner.
4. Confirm the signer address.
5. Confirm the action is documented.
6. Save transaction hashes.

Check ownership state:

```bash
npm run owner:check:sepolia
```

## Transfer Ownership To Safe

Safe handover runbook:

```text
docs/SAFE_MULTISIG.md
```

Prepare calldata and Safe Transaction Builder JSON:

```bash
SAFE_ADDRESS=0xSAFE_ADDRESS npm run safe:handover:sepolia
```

Set:

```text
NEW_OWNER_ADDRESS=0xSAFE_ADDRESS
```

Then run from the current owner wallet:

```bash
npm run ownership:propose:sepolia
```

Then run from the new owner wallet or Safe:

```bash
npm run ownership:accept:sepolia
```

The contracts use two-step ownership transfer, so ownership is not moved until the pending owner accepts.

## Report Publishing

Only the token owner can publish report hashes.

Prepared command:

```bash
npm run report:publish:sepolia
```

If the signer is not the owner, the script will fail before sending a transaction.

## Do Not

- Do not use a wallet seed phrase in `.env`.
- Do not publish private keys.
- Do not transfer ownership to an address that cannot call `acceptOwnership`.
- Do not use a centralized owner wallet for mainnet without a written risk acceptance.
- Do not describe owner powers as community governance or legal control unless a proper governance structure exists.
