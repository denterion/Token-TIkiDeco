# TikiDeco Competitive Landscape

Checked: 2026-07-09

Status: strategic positioning document. This is not a token sale, value statement, mainnet approval, active hospitality-benefit announcement, partnership claim, or independent audit claim.

## Current TikiDeco Position

TikiDeco / TIDE is an open-source Ethereum Sepolia prototype for transparent hospitality-linked token infrastructure. The current product is strongest as a public verification and pilot-readiness project:

- V1 legacy contracts are deployed on Sepolia and recorded in `deployments/canonical.json`.
- V2 is candidate code only and remains an audit target, not a canonical deployment.
- The public site is read-only.
- The v0.2 utility-pilot flow checks Sepolia TIDE balance without wallet connection or transaction signing.
- The first campaign remains `draft-not-live`.
- TIDE is not offered for sale, has no stated monetary value, has no mainnet deployment, has no active guest benefits, and has not completed an independent audit.

## Comparison Frame

TikiDeco is not yet competing with full travel booking platforms or mature loyalty programs on live benefits. The useful comparison is narrower:

- hospitality or travel projects using web3 mechanics;
- loyalty and access infrastructure;
- public verification, reporting, and trust posture;
- operator readiness for a limited pilot.

## Competitor Matrix

| Project | Category | What is live publicly | Strong signal | Gap TikiDeco can target |
| --- | --- | --- | --- | --- |
| Blackbird | Direct-adjacent restaurant loyalty and payments | Restaurant app with check-ins, rewards, restaurant discovery, and payment features. | Strong consumer use case: loyalty is tied to real dining behavior. | TikiDeco can be more transparent about on-chain/public reporting, campaign gates, and privacy-safe evidence before any pilot. |
| Travala AVA Smart Program | Direct-adjacent web3 travel loyalty | Travel booking loyalty program with AVA-based memberships, booking benefits, and travel rewards. | Mature travel surface with clear user-facing tiers and booking flow. | TikiDeco should not copy a booking or token-lock model now; it can instead own the audit-ready, no-transaction, Sepolia-only pilot niche. |
| Camino Network | Travel-industry blockchain infrastructure | Travel-focused blockchain ecosystem, developer docs, explorer, wallet, and B2B travel messaging. | Strong industry infrastructure narrative and ecosystem breadth. | TikiDeco can be smaller and sharper: one hospitality concept, clear manifests, reports, pilot gates, and role accountability. |
| Uptrip | Web3 travel loyalty experience | Lufthansa Group-related app that turns flight activity into digital trading cards and reward redemption. | Clear user story: fly, collect, redeem. | TikiDeco needs an equally simple future user story, but should keep it marked as planned until operations are approved. |
| Unlock Protocol | On-chain membership infrastructure | Open protocol and developer docs for memberships and subscriptions. | Strong developer infrastructure and open-source posture. | TikiDeco can use a narrower hospitality-specific operating layer: reports, eligibility, privacy, dispute flow, and campaign status. |
| Marriott Bonvoy | Traditional hospitality loyalty benchmark | Large-scale hotel loyalty benefits and mobile guest experience. | Clear, understandable member benefits and app utility. | TikiDeco should learn from the clarity of benefits, but must not imply live hotel benefits before operations exist. |
| Open Loyalty | Enterprise loyalty engine | API-first loyalty engine with enterprise program mechanics and compliance/security posture. | Strong B2B implementation language and operator trust signals. | TikiDeco can borrow the operator-first vocabulary: rules, campaigns, evidence, review gates, and reporting. |
| Voucherify | API-first promotions and loyalty infrastructure | API-driven loyalty, promotions, referrals, and incentive management. | Practical developer framing and rules-based campaign design. | TikiDeco should express pilot rules as machine-readable campaigns and dry-run reports, not broad crypto promises. |

## What Competitors Do Better Today

- **Real user action loops.** Blackbird, Travala, Uptrip, Marriott, Open Loyalty, and Voucherify all explain what a user or operator can do now.
- **Shorter first-screen promise.** Mature loyalty products lead with the user action before showing architecture.
- **Operational vocabulary.** Enterprise loyalty tools speak in campaigns, rules, segments, limits, reports, and support processes.
- **Distribution.** Travel and restaurant competitors have app stores, partner surfaces, booking flows, merchant networks, or enterprise sales paths.

## What Competitors Often Do Poorly

These are positioning opportunities, not accusations:

- Public claim boundaries can be hard to verify without reading legal terms.
- Web3 loyalty pages often mix utility, rewards, and token mechanics in ways that are difficult for cautious operators to evaluate quickly.
- Consumer loyalty products rarely expose a reproducible audit-style package for contracts, reports, manifests, and checks.
- Traditional loyalty engines are operationally mature but usually do not provide public on-chain report hashes or crypto-native verification.

## TikiDeco Opportunity

TikiDeco should not try to look bigger than it is. The strongest near-term positioning is:

> A public, audit-ready Sepolia prototype for hospitality loyalty and access experiments, with transparent reports, strict claim boundaries, and a privacy-safe pilot gate.

This creates a credible niche between:

- consumer-facing hospitality loyalty apps;
- web3 travel token ecosystems;
- generic membership protocols;
- enterprise loyalty engines.

## Strategic Bets

### 1. Make Verification The Product Surface

Most projects hide verification in docs. TikiDeco should make verification feel like the product:

- one-click contract/source links;
- role and Safe status;
- release package hash;
- latest report hash;
- campaign status;
- audit status;
- live-gate status.

### 2. Build A Campaign Rules Layer

Before any live pilot, turn the draft campaign into a clean rules artifact:

- campaign ID;
- status;
- eligibility threshold;
- snapshot or approved live-check mode;
- request window;
- inventory limit;
- privacy status;
- legal/security/operations/governance status;
- aggregate report path.

### 3. Create A Privacy-Safe Feedback Loop

The public preview should measure clarity, trust, and user comprehension without collecting private guest data:

- short GitHub issue forms;
- aggregate-only feedback report;
- no emails by default;
- no private wallet-to-person mapping;
- no transaction flow.

### 4. Package The Operator Story

The next serious audience is not only token holders. It is:

- hospitality operator;
- security reviewer;
- legal/governance reviewer;
- technical contributor;
- community reviewer.

Each audience needs a short path and a decision checklist.

### 5. Keep The Site Minimal And Status-Led

The site should say less, but prove more:

- what exists;
- what is planned;
- what is blocked;
- what can be verified;
- where to give feedback.

## Product Moves For The Next 30 Days

| Priority | Move | Why it matters | Acceptance check |
| --- | --- | --- | --- |
| P0 | Rename visible maintainer branches and remove tool-name references from public docs. | The project should look maintained by people, not by an automation artifact. | Public repo search returns no tool-name matches. |
| P0 | Add a short market-positioning link to README and Start Here. | Reviewers need to know where TikiDeco fits. | New doc linked from README and `docs/START_HERE.md`. |
| P0 | Turn the live-gate matrix into issue-backed owner decisions. | The pilot cannot become credible while gates are just blocked. | Every gate has owner, evidence file, reviewer, and issue. |
| P1 | Add a public status card for "release package evidence". | Makes reproducibility visible without claiming audit completion. | Site `/status/` shows evidence commit and current bundle state. |
| P1 | Publish first privacy-safe preview feedback report after issue intake. | Turns community preview into measured learning. | Aggregate report exists; no private participant data. |
| P1 | Prepare external-audit handoff packet from a clean checkout. | Makes V2 review credible. | `npm run audit:handoff` and release proof pass from final main SHA. |
| P2 | Add a visual "campaign lifecycle" diagram. | Makes draft-not-live easier to understand. | README/site link to draft -> review -> published-testnet -> closed states. |
| P2 | Build a contributor "good first review" queue. | Converts attention into useful feedback. | 5-8 labeled GitHub issues for docs, site, translations, and tests. |

## Positioning Copy To Use

Short:

> TikiDeco is a Sepolia-only hospitality utility prototype focused on transparent verification, pilot rules, and public reporting.

Long:

> TikiDeco explores how a hospitality-linked token system could make loyalty and access experiments more transparent. The current release is a read-only Sepolia prototype with public manifests, contract links, release evidence, and a blocked pilot campaign that must pass legal, privacy, security, operations, and governance review before any limited preview.

## Positioning Copy To Avoid

- Anything that sounds like a sale, purchase path, market value, or token appreciation.
- Anything that describes the pilot as live.
- Anything that describes V2 as canonical.
- Avoid anything that implies hotel ownership, financial rights, or completed property.
- Anything that describes internal review as an independent audit.

## Sources Checked

- Blackbird: https://www.blackbird.xyz/ and https://www.blackbird.xyz/faqs
- Travala AVA Smart Program: https://www.travala.com/smart
- Camino Network: https://camino.network/
- Unlock Protocol docs: https://docs.unlock-protocol.com/
- Uptrip: https://www.uptrip.app/
- Marriott Bonvoy benefits: https://www.marriott.com/loyalty/member-benefits.mi
- Open Loyalty: https://www.openloyalty.io/
- Voucherify loyalty software: https://www.voucherify.io/loyalty-software
