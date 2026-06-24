# GitHub Issue Triage

This guide describes how to triage public issues during the TikiDeco community preview.

Status: repository operations guide. It is not legal advice, audit evidence, or a promise of future utility.

## Issue Templates

Public issue templates are available for:

- bug reports;
- documentation issues;
- audit-readiness tasks;
- public security-note redirection;
- community preview feedback;
- EN/ES/RU translation review;
- read-only verification questions;
- claims or legal wording concerns.

Security vulnerabilities should not be reported through public issues. Follow [`../SECURITY.md`](../SECURITY.md).

## Recommended Labels

The recommended label manifest is stored in [`.github/labels.yml`](../.github/labels.yml). GitHub does not apply this file automatically unless a maintainer uses a label-sync workflow or creates labels manually.

Core labels:

| Label | Use |
| --- | --- |
| `community-preview` | Public preview feedback. |
| `feedback` | General structured feedback. |
| `translation` | EN/ES/RU wording and consistency. |
| `verification` | Read-only verification of contracts, Safe, reports, release package, or manifest. |
| `legal-wording` | Wording that may need claims-policy or counsel review. |
| `claims-review` | Public claims matrix consistency check. |
| `utility-feedback` | Conceptual utility feedback without active-benefit or financial claims. |
| `security-question` | Public security question without vulnerability details. |
| `audit-readiness` | V2 candidate or release-package review preparation. |
| `needs-source` | Needs repository, manifest, or on-chain evidence. |
| `needs-counsel` | Needs legal, regulatory, privacy, or consumer-protection review. |
| `needs-audit` | Needs smart-contract or deployment-security review. |
| `out-of-scope` | Conflicts with Sepolia/no-sale/no-value/no-mainnet boundary. |

## Triage Flow

1. Confirm the issue does not disclose private keys, secrets, or vulnerability details.
2. Confirm the issue does not request token sale, presale, purchase flow, price, listing, staking, yield, APY, or mainnet launch.
3. Assign one primary area label: `site`, `docs`, `verification`, `translation`, `audit-readiness`, or `community-preview`.
4. Add risk labels when needed: `needs-source`, `needs-counsel`, `needs-audit`, or `out-of-scope`.
5. Link the relevant source of truth, such as `PROJECT_FACTS.md`, `CLAIMS_MATRIX.md`, `deployments/canonical.json`, or Sepolia Etherscan.
6. Convert accepted work into a focused PR.

## Response Templates

### Accepted Feedback

```text
Thanks. This fits the current Sepolia prototype feedback scope.

Source of truth:
- <link>

Next step:
- We will track this as <docs/site/translation/verification/audit-readiness>.
```

### Needs Source

```text
Thanks. Before this can become public wording, we need a repository, manifest, or on-chain source.

Current status: not confirmed.
Please link the exact source that supports the claim.
```

### Needs Counsel

```text
Thanks. This may affect legal, regulatory, privacy, consumer-protection, or hospitality-operations posture.

We will not adopt this wording until counsel review is complete.
```

### Out Of Scope

```text
Thanks for the suggestion. This is outside the current project boundary.

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit.
```

## Maintainer Boundary

Maintainers should not:

- discuss token price or listing expectations;
- imply TIDE can be purchased;
- imply active hotel benefits;
- imply independent audit completion;
- imply mainnet readiness;
- accept claims that are not supported by `PROJECT_FACTS.md` or on-chain/repository evidence.
