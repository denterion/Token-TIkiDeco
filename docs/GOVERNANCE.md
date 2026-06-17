# TikiDeco Governance And Owner Operations

This document describes practical owner operations for the TikiDeco / TIDE Sepolia prototype.

It is not legal advice, investment advice, or a production governance charter.

## Current Model

TikiDeco currently separates:

- `owner`: controls admin actions such as pause, report publishing, project URI updates, vesting schedule management, and ownership transfer.
- `treasury`: holds the full TIDE supply.

Current Sepolia owner:

```text
0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3
```

Owner model:

```text
Safe multisig 3-of-3
```

Current Sepolia treasury:

```text
0xf1DAd608ddD5B71F039FEE82026164bc6a245081
```

## Current Governance Posture

Sepolia owner powers have been moved from the original owner wallet to Safe.

Completed ownership transfer:

| Step | Transaction |
| --- | --- |
| Token `transferOwnership(Safe)` | `0xb573c39c9b510e8694164609587d586dabe73f30149f366aeadcfb6f9fb802ed` |
| Vault `transferOwnership(Safe)` | `0xf7478537ba264dd7c145e3619cc4c2cc7751084216c64a6b7337a06b613401ca` |
| Safe activation | `0x8015cb2e0ea0a871c3b4a606ba2ba435714f70a6ae20529277504fe7b3e8d96d` |
| Safe `acceptOwnership()` batch | `0x1ddab2941e8d5fc1a550e1a67db05e1d4f57d6705e5bf3f3e1dbfcd9534c145e` |

Before mainnet, review whether `3-of-3` is too rigid operationally. A serious production setup commonly uses `3-of-5` or another threshold that balances security with signer availability.

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

The Sepolia transfer is complete. Keep the handover runbook for audit history and future deployments:

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

For a future redeployment, run from the current owner wallet:

```bash
npm run ownership:propose:sepolia
```

Then run from the new owner wallet or Safe:

```bash
npm run ownership:accept:sepolia
```

The contracts use two-step ownership transfer, so ownership is not moved until the pending owner accepts.

## Report Publishing

Only the token owner Safe can publish report hashes.

Prepared command:

```bash
npm run report:publish:sepolia
```

Because the owner is now Safe, report publishing should be proposed and executed through Safe.

## Do Not

- Do not use a wallet seed phrase in `.env`.
- Do not publish private keys.
- Do not transfer ownership to an address that cannot call `acceptOwnership`.
- Do not use a centralized owner wallet for mainnet without a written risk acceptance.
- Do not describe owner powers as community governance or legal control unless a proper governance structure exists.
