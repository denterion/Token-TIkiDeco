# Privacy Review Decision

Status: privacy no-go evidence. This document records privacy boundaries for the draft TIDE utility-pilot campaign. It does not approve participant data collection, a live campaign, guest-data processing, mainnet deployment, token sale, monetary-value claim, active guest benefit, or independent audit claim.

Last reviewed: 2026-06-28

Tracking issue: [#56](https://github.com/denterion/Token-TIkiDeco/issues/56)

Machine-readable gate: [`../../config/utility-pilot/live-readiness-gates.json`](../../config/utility-pilot/live-readiness-gates.json) -> `requiredBeforeLiveCampaign.privacyReview`

## Decision

The privacy review gate remains:

| Field | Required state |
| --- | --- |
| Campaign status | `draft-not-live` |
| Privacy gate status | `not-approved` |
| Privacy approval status | `not-approved` |
| Email collection | Not approved |
| Guest data collection | Not approved |
| Wallet-to-person mapping | Not approved |
| Public wallet-level outcome lists | Not approved |
| Third-party participant forms | Not approved |
| Active guest utility | Not live |

The project may keep preparing privacy-safe documentation and aggregate report templates. It must not collect private participant data until privacy, legal, security, operations, and governance gates are explicitly approved.

## Current Data Boundary

Current approved-by-default public behavior is limited to:

- browsing public documentation and the public site;
- entering a wallet address into a read-only Sepolia balance checker in the browser;
- reading public Sepolia RPC responses;
- opening public GitHub issues under templates that warn users not to submit sensitive data;
- publishing aggregate-only reports that exclude private participant data.

Current behavior must not include:

- private keys, seed phrases, passwords, or wallet approvals;
- email collection by default;
- names, booking data, identity documents, or guest preferences;
- wallet-to-person mappings;
- private hospitality records;
- public full-wallet-address outcome lists;
- third-party forms or analytics for pilot participation without review.

## Privacy Controls Required Before Any Future Approval

The privacy reviewer must verify all of the following before this gate can move away from `not-approved`:

- published data-minimization rules for the exact campaign;
- user-facing explanation of what is and is not collected;
- retention period and deletion/correction process;
- incident-response path for accidental sensitive-data submission;
- process for moderating or redacting sensitive public issue content where platform rules allow it;
- storage plan for any non-public operational data, if any is later proposed;
- review of any third-party form, analytics, RPC, or hosting data flows used for participation;
- aggregate-only public report template with no private participant data;
- explicit rule that wallet addresses are truncated or excluded unless separately approved;
- confirmation that no private guest data is required for the draft-not-live campaign.

## Current No-Go Rationale

- The first campaign manifest is still `draft-not-live`.
- No request window is open.
- No live campaign inventory is published.
- Legal, security, operations, and governance approvals are not complete.
- There is no reviewed process for collecting emails, guest data, identity data, or wallet-to-person mappings.
- Public feedback is intentionally routed through GitHub issue templates with sensitive-data warnings.

## Required Validation

The following commands should pass while preserving the blocked privacy state:

```bash
npm run claims
npm run value
npm run pilot:report
npm run pilot
npm run pilot:live:blocked
npm run site
npm run release:check
```

The following command is expected to fail until every live-campaign gate is approved:

```bash
npm run pilot:live:check
```

Expected failure here is a safety control, not a release failure.

## References

- [`PRIVACY_SAFE_REPORTING.md`](PRIVACY_SAFE_REPORTING.md)
- [`PILOT_OPERATIONS_PLAYBOOK.md`](PILOT_OPERATIONS_PLAYBOOK.md)
- [`PILOT_REPORT_TEMPLATE.md`](PILOT_REPORT_TEMPLATE.md)
- [`COMMUNITY_PREVIEW_REPORT_TEMPLATE.md`](../COMMUNITY_PREVIEW_REPORT_TEMPLATE.md)
- [`../FEEDBACK_GUIDE.md`](../FEEDBACK_GUIDE.md)
- [`../INCIDENT_RESPONSE.md`](../INCIDENT_RESPONSE.md)
