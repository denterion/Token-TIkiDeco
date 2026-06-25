# TIDE Loyalty Pilot Eligibility Rules

Status: planned rules for a future limited pilot. Not live. Sepolia-only. No sale, no stated monetary value, no mainnet deployment, and independent audit not started.

## Wallet Signature Verification

Eligibility verification should use an off-chain message signature to prove wallet control.

The participant signs a human-readable message that includes:

- project name;
- campaign ID;
- nonce;
- wallet address;
- chain ID `11155111`;
- snapshot block;
- timestamp;
- statement that no transaction, payment, sale, or financial value is involved.

The system verifies the signature off-chain. It must not request private keys.

## Balance Snapshot

Eligibility should be measured at a published Sepolia snapshot block. The snapshot avoids later balance movement changing the campaign result.

Snapshot records should include:

- campaign ID;
- snapshot block;
- token address;
- minimum balance threshold;
- read method;
- timestamp of verification;
- whether data came from live RPC, cached RPC, or manual recheck.

## Campaign Snapshot Block

Each campaign must publish a snapshot block before review starts. Changing the block after the campaign opens requires a correction note and governance review.

If an RPC provider fails, reviewers should use a documented fallback provider or pause review until the data can be checked.

## Minimum Balance Threshold

Each campaign may set a minimum Sepolia TIDE balance threshold. The threshold must be published before the campaign opens and must not be framed as a purchase instruction.

The threshold is only an eligibility input. It does not assign market value, resale value, cash value, or financial rights to TIDE.

## Anti-Spam Rules

The pilot may reject or manually review requests involving:

- repeated submissions from the same wallet;
- repeated submissions from linked wallets;
- automated form abuse;
- suspicious signature reuse;
- attempts to sell, resell, or transfer pilot slots;
- false identity or eligibility claims;
- abusive behavior toward staff or participants.

## Duplicate Wallet Policy

One wallet should map to one pilot request per campaign unless the campaign rules explicitly allow otherwise.

If duplicate wallets, linked wallets, or coordinated submissions appear, staff may:

- request clarification;
- keep only the first valid request;
- run manual review;
- reject abusive submissions;
- publish a privacy-safe summary in the pilot report.

## Manual Review

Manual review is required because the pilot is operational, legal, and privacy-sensitive. Reviewers may confirm:

- signature validity;
- wallet balance at snapshot;
- campaign inventory;
- duplicate or spam status;
- participant acceptance of terms;
- local-law restrictions;
- staff override needs.

## Privacy Constraints

The pilot should collect the minimum data needed for eligibility review.

Do not publish:

- private names;
- email addresses;
- phone numbers;
- government IDs;
- guest records;
- exact travel plans;
- unnecessary wallet-to-person mappings.

Public reporting should use aggregate counts, campaign IDs, report hashes, and privacy-safe status summaries.

## User-Facing Explanation

Plain-language participant explanation:

> This pilot uses Sepolia testnet TIDE only. We may ask you to sign a message to prove wallet control, but we will not ask for your private key and you will not sign a transaction. Eligibility is limited, manually reviewed, and does not guarantee any benefit. TIDE is not offered for sale, has no stated monetary value, and is not deployed on mainnet.
