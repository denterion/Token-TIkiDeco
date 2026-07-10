# Pilot Campaign Rules Schema

Status: draft operating specification. This is not a live campaign, not a sale, not a mainnet deployment, and not a promise of any benefit.

The utility pilot campaign manifest is the source of truth for planned Sepolia-only pilot rules. The current draft manifest is:

- `config/utility-pilot/tide-community-preview-001.json`

## Status Model

- `draft-not-live`: rules are being prepared. No eligibility request window is open and no active guest benefit exists.
- `published-testnet`: a Sepolia-only test campaign has been published after all required approvals are marked approved.
- `closed`: the campaign is closed and should only be referenced for historical reporting.

Any status other than `draft-not-live` must have explicit legal, privacy, security, operations, and governance approval before publication.

The explicit lifecycle is defined by `config/utility-pilot/campaign-lifecycle.schema.json`:

- `draft`;
- `evidence-review`;
- `approved-testnet-preview`;
- `paused`;
- `closed`;
- `archived`.

`approved-testnet-preview` is a limited technical preview state, not active hospitality utility. The preview checker rejects that transition unless every gate in `config/utility-pilot/live-readiness-gates.json` is approved and includes an evidence file, reviewer, and timestamp.

## Required Fields

- `campaignId`: stable lowercase identifier.
- `campaignName`: human-readable campaign name.
- `status`: one of `draft-not-live`, `published-testnet`, or `closed`.
- `network` and `chainId`: must match the canonical Sepolia deployment manifest.
- `tokenAddress`: must match the canonical TIDE token address.
- `snapshot`: planned or published snapshot block details.
- `snapshot.mode`: `planned`, a published snapshot block, or an approved live-check window for a future campaign.
- `eligibility`: minimum balance, wallet-address, off-chain proof, read-only balance check, manual review, and duplicate-wallet policy.
- `requestWindow`: UTC window for future request intake. Draft campaigns keep this unpublished.
- `inventory`: published capacity for a future campaign. Draft campaigns keep capacity at zero.
- `forbiddenFlows`: all sale, transaction, approval, transfer, fee, booking, private-key, and mainnet flows must remain disabled.
- `disclaimers`: required no-sale, no-value, no-mainnet, no-audit, no-guarantee, no-ownership, and no-financial-rights statements.
- `requiredApprovalsBeforePublication`: approval gates before any campaign can be made public as testnet-published.
- `reports`: path to the allocation report template and optional published report.

## Publication Gate

`npm run pilot:campaign:check` fails if:

- the manifest disagrees with `deployments/canonical.json`;
- required disclaimers are missing;
- a forbidden flow is enabled;
- unsupported public claims appear;
- a campaign is marked published without all required approvals;
- a published campaign lacks a snapshot block or approved live-check window;
- a published campaign lacks request window, inventory, review statuses, or allocation report path.

## Public Communication Boundary

Allowed wording:

- Sepolia-only pilot rules;
- planned utility pilot;
- read-only balance check;
- off-chain message proof;
- no transaction signing;
- no sale and no stated monetary value;
- no active guest benefits until a campaign is published.

Not allowed:

- Prohibited phrase: buy TIDE.
- Prohibited phrase: presale.
- Prohibited phrase: investment.
- Prohibited phrase: guaranteed benefit.
- Prohibited phrase: hotel ownership.
- Prohibited phrase: revenue share.
- Prohibited phrase: mainnet live.
- Prohibited phrase: independently audited.
