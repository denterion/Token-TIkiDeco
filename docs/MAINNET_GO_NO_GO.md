# Mainnet Go / No-Go Gate

Status: `not approved`

This document is a release-engineering control, not legal advice, not legal approval, not a value statement, not an offer, and not a promise of mainnet deployment.

TikiDeco / TIDE remains an Ethereum Sepolia prototype. TIDE is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit.

## Gate Rule

Mainnet discussion remains blocked unless every required artifact below exists, is current, and is explicitly marked `approved` by the responsible reviewer.

Any `not approved`, `requires review`, `blocked`, `draft`, `unknown`, or missing item is a no-go.

## Required Gate Artifacts

| Category | Required artifact | Current status | Responsible reviewer |
| --- | --- | --- | --- |
| External smart-contract audit | Public final audit report and remediation record | not approved | Independent auditor |
| Legal counsel memo | Written counsel memo for token, utility, promotion, and jurisdiction boundaries | not approved | External counsel |
| Entity and IP ownership | Entity/SPV, IP owner, website operator, and contract admin ownership record | requires review | Counsel / founder |
| Treasury governance | Production multisig policy, signer policy, treasury controls, and emergency process | requires review | Governance / counsel |
| Tax/accounting | Tax and accounting treatment for any operational flow | requires review | Tax/accounting advisor |
| Privacy | Privacy notice, data map, retention policy, access control, and incident process | requires review | Privacy reviewer |
| AML/sanctions | AML/sanctions review if any sale, redemption, transfer, or real-world benefit flow exists | requires review | Counsel / compliance reviewer |
| Hospitality operations readiness | Operator, inventory, staff process, support process, cancellation process, and local constraints | not approved | Operations reviewer |
| Guest terms | User-facing guest/pilot terms for any real-world utility | not approved | Counsel / operations |
| Incident response | Production incident response process covering contracts, site, domain, data, and operations | requires review | Security / operations |
| Public communications review | Approved public claims, disclaimers, translations, and launch copy | requires review | Counsel / communications |
| Token distribution policy | Written policy for any distribution, transfer campaign, redemption, or eligibility campaign | not approved | Counsel / governance |
| Liquidity/listing prohibition | Liquidity/listing remains prohibited unless counsel-approved in writing | not approved | Counsel / governance |

## Explicit No-Go Conditions

- No mainnet deployment is approved.
- No token sale is approved.
- No V2 promotion is approved.
- No value statement is approved.
- No independent audit claim is approved.
- No real-world guest utility is live.
- No liquidity or exchange-listing activity is approved.

## Required Command

```bash
npm run mainnet:check
```

The command must fail while this document remains blocked. A passing result would require all required artifacts to be present and explicitly marked `approved`.
