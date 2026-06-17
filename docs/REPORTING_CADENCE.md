# TikiDeco Reporting Cadence

This document defines the starter public reporting cadence for the TikiDeco / TIDE prototype.

It is a transparency workflow, not an investment reporting obligation, securities disclosure, or promise of financial performance.

## Current Reporting Status

The first Safe-era transparency report has been published on-chain.

| Field | Value |
| --- | --- |
| Report ID | `0` |
| Category | `safe-ownership-openzeppelin-v2` |
| Hash | `0x04119c47a7c09f09bfdcee87d77925e6f5ec89c2ea1fe9759feaae7091c0b5cc` |
| Transaction | `0x5886945fc62fb8a48e64559eebecaaf80ee20115a02c82808a737063874041f9` |
| Published at | `2026-06-17T08:50:12.000Z` |

## Cadence

Recommended starter cadence:

| Report Type | Frequency | Purpose |
| --- | --- | --- |
| Monthly prototype update | Monthly | Summarize technical, documentation, governance, and community progress. |
| Governance action report | As needed | Record Safe ownership changes, signer changes, treasury policy changes, or admin actions. |
| Treasury action report | As needed | Record material token movements or vesting schedule changes. |
| Security report | Per review milestone | Record audits, review findings, remediation, or deployed contract changes. |
| Mainnet gate report | Before any mainnet decision | Summarize legal, security, governance, and risk readiness. |

## Report Format

Each report should include:

- report ID
- date
- network
- purpose
- current contract addresses
- owner and treasury status
- material changes since the prior report
- transaction hashes
- risk boundaries
- next steps

Reports should avoid:

- profit language
- investment performance claims
- equity language
- revenue-share language
- guarantees about hotel completion or token value

## On-Chain Publication Workflow

1. Write the report in `docs/reports/`.
2. Generate a hash and Safe Transaction Builder JSON:

```bash
npm run report:safe:sepolia
```

3. Import the generated JSON into Safe Transaction Builder.
4. Collect the required Safe confirmations.
5. Execute the Safe transaction.
6. Verify `reportsCount()` and `reportAt(reportId)`.
7. Update the report hash manifest with transaction hash, block, and timestamp.

## Categories

Use short, stable categories:

- `genesis-report`
- `safe-ownership-openzeppelin-v2`
- `monthly-update`
- `treasury-action`
- `vesting-action`
- `security-review`
- `mainnet-gate`

## Public Links

Published report:

<https://github.com/denterion/Token-TIkiDeco/blob/main/docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md>

Hash manifest:

<https://github.com/denterion/Token-TIkiDeco/blob/main/docs/reports/REPORT_2026_06_17_SAFE_AND_V2_HASH.md>

Token contract:

<https://sepolia.etherscan.io/address/0xE4c1DE533440b411Be5C17883FF662e95a462097>

Owner Safe:

<https://sepolia.etherscan.io/address/0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3>
