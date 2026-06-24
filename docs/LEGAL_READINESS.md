# TikiDeco Legal Readiness Checklist

Review date: 2026-06-17

Status: preparation checklist only. This document is not legal advice, a legal opinion, securities analysis, tax advice, regulatory approval, or compliance certification.

Purpose: prepare TikiDeco / TIDE for a cautious public Sepolia prototype release while keeping legal, securities, money-transmission, consumer-protection, privacy, hospitality, and tax questions explicit.

## Current Release Boundary

| Item | Current public position |
| --- | --- |
| Network | Ethereum Sepolia testnet |
| Token status | Prototype token with no stated monetary value |
| Sale status | Not offered for sale |
| Mainnet status | Not deployed on mainnet |
| Audit status | Internal review exists; independent audit not started |
| Utility status | Hospitality loyalty and access scenarios are conceptual/planned, not active benefits |
| Property status | No completed property claim |
| Partnership status | No confirmed partner claim |
| Financial rights | No equity, debt, revenue rights, dividends, hotel ownership, or return rights |

## Legal Review Workstreams

| Workstream | Why it matters | Minimum review question |
| --- | --- | --- |
| Securities / token offering | Token distributions, fundraising, marketing, and resale expectations can create securities-law risk. | Can TIDE be publicly described, distributed, or later sold without securities registration or exemption? |
| Money transmission / AML | Token exchange, redemption, custody, or value transfer can create money-services obligations. | Would any planned custody, redemption, exchange, or reward flow trigger MSB/AML/KYC duties? |
| Consumer protection and marketing | Loyalty/access claims can mislead if benefits are not live or inventory-limited. | Are public claims clear enough that users understand this is only a Sepolia prototype? |
| Hospitality operations | Real benefits may require terms, eligibility rules, refund/cancellation policy, and operational controls. | What terms are required before any real guest benefit, discount, membership, or access program? |
| Entity and treasury governance | Operating through an individual wallet is weak for public credibility and legal separation. | What entity should own IP, treasury policies, public communications, and future operations? |
| Tax and accounting | Token allocations and rewards may have tax/accounting consequences. | How should treasury tokens, grants, rewards, and potential redemptions be recorded? |
| Privacy | Loyalty/access programs may involve guest data and eligibility snapshots. | What data can be collected, stored, hashed, or linked to wallets? |
| IP and branding | Logo, site assets, and hotel concept materials need clear ownership and licensing. | Are all brand and visual assets owned or licensed for public use? |

## Counsel Questions Before Any Token Sale Or Mainnet Launch

1. Is any proposed TIDE distribution a securities offering, commodity interest, stored-value product, or regulated payment product?
2. If a distribution is allowed, is it limited to free testnet use, rewards, private placement, registered sale, exemption, or another structure?
3. Can TIDE be transferable, or should transferability be restricted before utility exists?
4. Can TIDE be marketed as loyalty/access infrastructure without implying financial upside?
5. What exact statements must appear on the website, README, release notes, and social posts?
6. What jurisdictions are in scope if the project is based in Florida but visible globally?
7. What KYC/AML checks are required if tokens are ever sold, redeemed, exchanged, or tied to real-world perks?
8. What entity should control treasury, IP, website, Safe signers, and public communications?
9. What user terms, privacy policy, risk disclosures, and community rules are required before collecting emails, wallet addresses, or guest data?
10. What audit, insurance, and incident-response steps are required before any production use?

## Release Gate: Allowed Now

These are acceptable for the current public Sepolia prototype:

- Publish open-source repository materials.
- Publish verified Sepolia contract addresses.
- Publish public docs, FAQ, release draft, and communication playbook.
- Publish a read-only dashboard that does not connect wallets or request transactions.
- State that TIDE is not offered for sale and has no stated monetary value.
- State that loyalty/access use cases are conceptual or planned and subject to review.

## Release Gate: Do Not Do Yet

Do not do any of the following without counsel review and a documented go/no-go decision:

- Sell TIDE or accept funds for TIDE.
- Create a presale, waitlist with purchase language, allocation sale, coupon sale, or exchange listing announcement.
- Promise price support, appreciation, income, revenue, dividends, hotel ownership, or property backing.
- Claim active hotel benefits, discounts, membership rights, or booking access.
- Claim confirmed hotel partners, permits, customers, reservations, or completed property.
- Deploy to mainnet.
- Publish a GitHub Release that sounds like a commercial launch rather than a Sepolia prototype release.
- Collect personal data for loyalty or guest access without privacy review.

## Suggested Legal Documentation Package

Prepare these before any production or sale-related step:

| Document | Owner | Status |
| --- | --- | --- |
| Counsel memo on token classification | External counsel | Needed |
| Entity structure memo | External counsel / accountant | Needed |
| Token distribution policy | Counsel + project owner | Needed |
| Treasury governance policy | Project owner + counsel | Draft exists; review needed |
| Website terms of use | Counsel | Needed |
| Privacy policy | Counsel | Needed before data collection |
| Token risk disclosure | Counsel | Needed before broader public promotion |
| Loyalty/access program terms | Counsel + operations | Needed before real benefits |
| IP assignment/license records | Project owner + counsel | Needed |
| Incident disclosure policy | Project owner + counsel | Draft communication process exists; review needed |

## Regulatory Reference Points

Use current counsel for final interpretation. Public official references to discuss with counsel:

- SEC digital-asset guidance page, including its notice that the 2019 framework was withdrawn and superseded in 2026: https://www.sec.gov/about/divisions-offices/division-corporation-finance/framework-investment-contract-analysis-digital-assets
- SEC discussion of investment-contract analysis and Howey factors for digital assets: https://www.sec.gov/newsroom/speeches-statements/statement-framework-investment-contract-analysis-digital-assets
- FinCEN guidance on persons administering, exchanging, or using virtual currencies: https://www.fincen.gov/resources/statutes-regulations/guidance/application-fincens-regulations-persons-administering

## Practical Next Step

After publishing `v0.1.0-sepolia` as a public Sepolia prototype pre-release, ask counsel for a narrow written review before broader promotion, real-world utility, any token distribution beyond testnet/prototype use, or any production/mainnet decision:

1. README and public site wording.
2. `docs/PUBLIC_MATERIALS.md` posts.
3. `docs/releases/v0.1.0-sepolia.md`.
4. The current no-sale / no-value / no-mainnet boundary.
5. Whether GitHub About, topics, release notes, and localized EN/ES/RU site copy are acceptable for a public Sepolia prototype.
