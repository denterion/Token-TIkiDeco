# TIDE Loyalty Pilot

Status: planned utility-pilot documentation. This is not a token sale, not a financial product, not a mainnet plan, and not confirmation of active hospitality benefits.

## What It Is

The TIDE Loyalty Pilot is a proposed, limited, Sepolia-only operating test for transparent hospitality-linked eligibility records.

The pilot is meant to explore whether public token balances, signed wallet verification, campaign snapshots, and published reports can support a clearer guest/community eligibility process for future hospitality operations.

## What It Tests

- Whether a wallet can prove control through message signing without sending a transaction.
- Whether a campaign can use a defined snapshot block to evaluate eligibility.
- Whether non-cash, limited perks can be documented without creating resale, cash, ownership, revenue, or financial-rights claims.
- Whether manual review, staff override, and dispute records can keep the pilot operationally fair.
- Whether public pilot reports can improve transparency without exposing private participant data.

## What It Does Not Promise

- No token sale or presale.
- No stated monetary value for TIDE.
- No mainnet deployment.
- No independent audit claim.
- No guaranteed benefit, access, allocation, discount, booking, membership, or hospitality service.
- No equity, debt, revenue, property, hotel ownership, dividend, profit, or return rights.
- No exchange listing, staking, yield, APY, or price claim.

## Why This Is Not An Investment Product

The pilot is framed as a Sepolia prototype for eligibility and transparency workflows. It does not ask users to buy TIDE, does not describe TIDE as having financial value, and does not provide financial rights or expected returns.

Any future activity that could create value, payment, redemption, transfer campaign, or regulated offering concerns requires separate counsel review and governance approval before it is described publicly or implemented.

## Why This Is Not A Sale

The pilot does not include a purchase flow, payment flow, presale, exchange listing, token price, redemption process, or mainnet token distribution.

Eligibility, if tested, should be based on a documented Sepolia snapshot and manual review rules. Participation should never be presented as a purchase opportunity.

## How It Connects To Hospitality Operations

Future hospitality teams may need transparent ways to manage waitlists, RSVP windows, non-cash welcome eligibility, and community preview participation. This pilot explores the operational controls needed for that kind of workflow:

- published rules before a campaign starts;
- fixed snapshot block and eligibility threshold;
- inventory limits and blackout dates;
- staff override and dispute handling;
- privacy-limited records;
- public post-campaign report.

The pilot remains conditional, limited, and subject to legal, operational, security, privacy, and availability constraints.

## Read-Only Eligibility Engine

The static site includes a read-only Sepolia eligibility card for explaining the planned review flow without wallet connection, transaction signing, private key collection, backend deployment, or production booking integration.

The v0.2 flow reads `balanceOf(wallet)` from the canonical Sepolia TIDE token through allowlisted RPC endpoints and shows Live, Cached, Stale, or Unavailable data states. It must not assume a zero balance when RPC data is unavailable.

See [`MOCK_ELIGIBILITY_ENGINE.md`](MOCK_ELIGIBILITY_ENGINE.md).

## Testnet Allocation

Future Sepolia-only campaign allocation must follow [`TESTNET_ALLOCATION_POLICY.md`](TESTNET_ALLOCATION_POLICY.md) and publish a privacy-safe report using [`ALLOCATION_REPORT_TEMPLATE.md`](ALLOCATION_REPORT_TEMPLATE.md).

## Campaign Rules Manifest

The first draft campaign manifest is `config/utility-pilot/tide-community-preview-001.json`.

It is intentionally marked `draft-not-live`: no request window is open, no active hospitality benefit exists, published capacity is `0`, and every legal, privacy, security, operations, and governance approval gate is still `not-approved`.

See [`CAMPAIGN_RULES_SCHEMA.md`](CAMPAIGN_RULES_SCHEMA.md).

## Measurable Public Preview

The blocked public-preview workflow is specified in [`PUBLIC_PREVIEW_PRODUCT_SPEC.md`](PUBLIC_PREVIEW_PRODUCT_SPEC.md). Its campaign lifecycle is machine-readable, its metrics are in-memory aggregate counters only, and its privacy threats are documented in [`PUBLIC_PREVIEW_PRIVACY_THREAT_MODEL.md`](PUBLIC_PREVIEW_PRIVACY_THREAT_MODEL.md).

The first future benefit example is documented, but inactive, in [`FUTURE_BENEFIT_SPEC.md`](FUTURE_BENEFIT_SPEC.md). The current inventory is `0`, no operator is established, and legal review remains `not-approved`.

Generate and verify the zero-sample proof baseline:

```bash
npm run preview
npm run privacy:preview
```

Run:

```bash
npm run pilot:campaign:check
```

The check fails if the campaign manifest disagrees with the canonical Sepolia deployment, enables any sale/transaction/private-key/mainnet flow, misses required disclaimers, or marks a campaign as published without approvals and operational details.
