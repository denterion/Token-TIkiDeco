# TikiDeco Public Report Template

Status: template for public transparency reports.

This report template is not a financial disclosure, securities offering, audit certificate, mainnet approval, or promise of future utility.

## Report Metadata

| Field | Value |
| --- | --- |
| Report title |  |
| Report date |  |
| Report category | monthly-update |
| Network | Ethereum Sepolia |
| Scope | Current / Planned / Conceptual |
| Prepared by | TikiDeco maintainer |

## Required Boundary

TIDE is a Sepolia testnet prototype. It currently has no stated monetary value and is not offered for sale. TIDE is not deployed on mainnet and has not completed an independent smart-contract audit. This report is not a financial disclosure, securities offering, or promise of future utility.

## Plain-Language Summary

Write 3-5 short bullets for non-technical readers:

- What changed?
- What can be verified?
- What remains planned or conceptual?
- What is not approved?
- What happens next?

## Current Verified Facts

Use only facts from `docs/PROJECT_FACTS.md`.

- Current:
- Current:
- Current:

## Changes Since Last Report

- Contracts:
- Site:
- Documentation:
- Community:
- Security / review:

## Checks Run

| Check | Result | Notes |
| --- | --- | --- |
| `npm run claims:check` |  |  |
| `npm run release:check` |  |  |
| `npm run site:check` |  |  |
| `npm test` |  |  |
| `node scripts/check-mainnet-readiness.cjs --expect-blocked` |  |  |

Do not report a passing check unless it was run for this report or copied from a current automation report.

## Public Links

- Site:
- Project facts:
- Roadmap:
- Token source:
- Vault source:
- Latest report:

## Risks And Boundaries

- No token sale is approved.
- Mainnet is not approved.
- Independent audit has not started unless `docs/PROJECT_FACTS.md` says otherwise.
- Utility pilot remains planned/draft unless all required approvals are complete.
- No confirmed hotel partnership or completed property claim is supported unless `docs/PROJECT_FACTS.md` is updated.

## Next Steps

Use cautious, non-promissory language:

- Continue:
- Prepare:
- Review:
- Improve:

## Optional On-Chain Publication

If the report hash will be published on-chain:

1. Finalize this report file.
2. Generate the hash.
3. Prepare Safe transaction JSON.
4. Execute through Safe.
5. Update the hash manifest with transaction hash, block, and timestamp.
