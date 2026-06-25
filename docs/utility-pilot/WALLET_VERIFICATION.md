# TIDE Loyalty Pilot Wallet Verification

Status: planned wallet-verification model. Not live. Sepolia-only. No sale, no stated monetary value, no mainnet deployment, and independent audit not started.

## Message Signing

Wallet verification should use a human-readable off-chain message. The participant signs the message to prove control of a wallet for a specific pilot campaign.

The message should include:

- TikiDeco / TIDE pilot name;
- campaign ID;
- wallet address;
- chain ID `11155111`;
- nonce;
- issued-at timestamp;
- expiration timestamp;
- snapshot block;
- no-sale/no-value/no-mainnet disclaimer;
- statement that the signature does not authorize a transaction.

## No Transaction Signing

The pilot must not ask participants to sign transactions for eligibility verification. It must not request token approvals, transfers, swaps, staking, minting, or any paid action.

## No Private Key Collection

The project must never ask for seed phrases, private keys, recovery phrases, or wallet export files.

Any page, message, or staff instruction requesting those items should be treated as a security incident.

## No Wallet Connect Required For Public Pages

Public pages should remain readable without wallet connection. Contract addresses, reports, status, and legal pages should be available as read-only public information.

## One-Time Verification Session

Each verification session should be tied to:

- one campaign ID;
- one wallet address;
- one nonce;
- one issued-at timestamp;
- one expiration timestamp;
- one verification result.

Expired sessions should require a new nonce and new signature.

## Nonce

The nonce should be generated server-side or by a trusted verification service. It must be unique per wallet and campaign session.

The nonce should be stored only as long as needed for verification, dispute handling, audit logs, and privacy/legal requirements.

## Replay Protection

Replay protection should require:

- unique nonce;
- campaign ID match;
- chain ID match;
- wallet address match;
- expiration check;
- signature domain or message prefix;
- rejection of reused nonce after successful verification.

## Privacy Notes

The verification flow should collect the minimum data required for pilot eligibility.

Avoid publishing wallet-to-person mappings. Public reports should use aggregate counts and report hashes, not participant identities.

If emails, names, guest records, or other personal data become necessary, the pilot must pause until privacy terms, retention rules, access controls, and counsel review are complete.
