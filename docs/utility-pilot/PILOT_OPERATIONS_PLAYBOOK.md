# Pilot Operations Playbook

Status: operations draft for a future Sepolia-only pilot. This playbook does not publish a live campaign, approve real-world utility, approve mainnet, or claim independent audit completion.

## Roles And Responsibilities

| Role | Responsibility | Boundary |
| --- | --- | --- |
| Maintainer | Keep campaign docs, issue triage, and reports current. | No private participant data collection by default. |
| Governance reviewer | Confirms campaign rules, blocker status, and Safe process. | No Safe transaction broadcast without separate manual review. |
| Privacy reviewer | Reviews any proposed participant data collection. | Required before emails, guest data, or wallet-to-person mappings. |
| Security reviewer | Reviews read-only flows, allocation scripts, and audit package evidence. | Internal review is not an independent audit. |
| Operations reviewer | Reviews inventory, staff process, disputes, and stop conditions. | No active guest benefits until explicitly approved. |
| Communications reviewer | Checks public copy against project facts and claims matrix. | No sale, value, mainnet, active-benefit, or audit-completion claims. |

## Campaign Status Lifecycle

| Status | Meaning | Allowed actions |
| --- | --- | --- |
| `draft` | Rules and technical instrumentation are being prepared. | Public documentation, read-only checks, issue feedback, aggregate planning. |
| `evidence-review` | Reviewers assess the configured evidence files. | Review comments and corrections only; no request window or inventory. |
| `approved-testnet-preview` | Every configured reviewer gate has approved evidence. | Limited Sepolia technical preview under published rules; no commercial hospitality service. |
| `paused` | An approved preview is temporarily stopped. | Investigation, correction, aggregate reporting, or closure. |
| `closed` | Request and feedback window is closed. | Privacy-safe summary report and correction notes. |
| `archived` | Historical record only. | Read-only reference; no new requests. |

Manifest status mapping: lifecycle `draft` and `evidence-review` remain `draft-not-live`; `approved-testnet-preview` requires a separately reviewed `published-testnet` manifest. No later lifecycle stage can be reached without evidence that the approved stage was valid.

## Draft-Not-Live Rules

- No request window is open.
- No active guest benefit exists.
- No inventory is available.
- No allocation is approved.
- Snapshot block or approved live-check window is not published.
- All legal, privacy, security, operations, and governance gates remain blocked or not-approved.

## Published-Testnet Rules

Before a campaign can move to `published-testnet`, the project must publish:

- campaign ID;
- eligibility threshold;
- snapshot block or approved live-check window;
- request window;
- inventory limits if any;
- privacy statement;
- manual review process;
- dispute process;
- allocation report path;
- approval evidence for legal, privacy, security, operations, and governance gates.

## Closed Campaign Rules

- Stop accepting requests.
- Preserve only approved, minimum necessary operational records.
- Publish an aggregate-only pilot report.
- Publish a correction note if rules, counts, or report hashes are corrected.
- Do not publish private participant data.

## Manual Review Process

1. Confirm the campaign status allows review.
2. Confirm the wallet address format and duplicate policy.
3. Confirm the read-only Sepolia balance result or documented fallback.
4. Apply campaign-specific threshold and timing rules.
5. Record only aggregate outcomes unless privacy review approves a different process.
6. Document reviewer notes as categories, not private user records.

## Duplicate Wallet Handling

- One review per wallet per campaign by default.
- Duplicate submissions should be counted in aggregate.
- Do not publish duplicate wallet addresses.
- If a duplicate appears abusive, categorize it in the abuse/spam summary.

## Dispute Handling

- Publish the dispute window before review starts.
- Accept only non-sensitive public dispute summaries unless a privacy-approved channel exists.
- Track disputes by category and outcome counts.
- Do not publish private guest details, email addresses, or wallet-to-person mappings.

## Abuse And Spam Review

Possible signals:

- repeated duplicate submissions;
- malformed addresses;
- coordinated low-quality submissions;
- attempts to submit private data publicly;
- attempts to pressure maintainers into sale, value, mainnet, or active-benefit claims.

Actions:

- close or label the issue;
- remove sensitive data if possible through platform moderation;
- route security-sensitive material to `SECURITY.md`;
- summarize abuse only in aggregate.

## What Must Not Be Collected

- Private keys.
- Seed phrases.
- Passwords.
- Emails by default.
- Guest names, booking data, or identity documents.
- Wallet-to-person mappings.
- Private hospitality preference data.
- Sensitive personal data.

## When To Stop The Pilot

Stop or keep blocked if:

- legal, privacy, security, operations, or governance approval is missing;
- public copy implies sale, value, mainnet, live guest use, or independent audit completion;
- sensitive data is submitted publicly;
- RPC or verification tooling is unreliable;
- Safe transaction review cannot be completed;
- campaign rules are disputed or incomplete;
- abuse/spam risk cannot be handled with aggregate reporting.
