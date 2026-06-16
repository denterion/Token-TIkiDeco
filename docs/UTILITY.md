# TikiDeco / TIDE Utility Scenarios

This document describes realistic utility scenarios for a hospitality-linked token. It is not an investment memo, offering document, or promise of profit. TIDE should not be described as equity, debt, revenue share, profit share, dividend right, hotel ownership, or an investment return.

## 1. Guest Loyalty And Stay Credits

### Problem

Independent hospitality brands often struggle to create portable loyalty systems before they have a full booking platform or large hotel footprint.

### User Story

As a future guest, I want my early community participation, referrals, and brand engagement to translate into visible loyalty status or limited stay-related perks when the TikiDeco hospitality experience becomes available.

### Token Role

TIDE can act as a non-financial loyalty signal. Holding or earning TIDE may qualify a user for defined perks such as priority access windows, welcome amenities, limited booking credits, or loyalty tiers, subject to availability and operational rules.

### On-Chain/Off-Chain Logic

On-chain:

- ERC-20 balance can be checked for eligibility.
- Snapshot dates can define who qualifies for a campaign.
- Report hashes can publish campaign rules and eligibility criteria.

Off-chain:

- Booking system or CRM verifies wallet ownership.
- Staff applies eligible perks manually or through a booking integration.
- Perks are limited by inventory, blackout dates, local law, and business policy.

### Risks

- Perks may be mistaken for financial value if described poorly.
- Hospitality operations may change before launch.
- Users may expect perks to be guaranteed even when inventory is limited.
- Wallet verification can create support friction for non-crypto guests.

### MVP Implementation

- Publish a "TIDE Loyalty Pilot" rules document.
- Use a wallet-signature flow to verify ownership.
- Define 2-3 simple non-cash perks, such as early reservation access, welcome drink eligibility where legal, or event RSVP priority.
- Publish the final rules hash with `publishReport`.

## 2. Early Access And Reservation Windows

### Problem

Early supporters and brand followers often want a fair way to access limited experiences, events, or booking windows without a private manual list.

### User Story

As a community member, I want TIDE to help me qualify for early access to selected TikiDeco experiences before they open to the general public.

### Token Role

TIDE can be used as an eligibility marker for early access. The token does not guarantee a reservation, room, discount, or financial benefit; it only qualifies a wallet for a defined access window.

### On-Chain/Off-Chain Logic

On-chain:

- A minimum balance threshold can be checked at a snapshot block.
- Snapshot criteria are published publicly.
- The contract can publish report hashes for access rules.

Off-chain:

- Reservation or event tools enforce time-limited access.
- Users prove wallet ownership by signing a message.
- Booking remains subject to payment, cancellation policy, KYC where needed, local rules, and availability.

### Risks

- Users may confuse access eligibility with guaranteed inventory.
- Speculative buyers may overvalue access windows.
- Snapshot timing can create complaints if users miss eligibility.
- Bot prevention may require off-chain controls.

### MVP Implementation

- Create a Sepolia-only "early access simulation" with mock reservation slots.
- Require wallet signature and minimum TIDE testnet balance.
- Publish rules, snapshot block, and outcome report.

## 3. Community Rewards For Referrals And Contributions

### Problem

Hospitality brands need authentic community growth, but referral and contribution tracking often becomes opaque or manually disputed.

### User Story

As a community member, I want to receive visible recognition for useful contributions such as referrals, translations, local research, event support, or content feedback.

### Token Role

TIDE can be distributed as a community reward or recognition token. It should be framed as participation credit, not compensation with expected market value.

### On-Chain/Off-Chain Logic

On-chain:

- Community reward allocations can be distributed from the treasury or vested bucket.
- Distribution reports can be anchored with document hashes.
- Wallet balances provide transparent participation records.

Off-chain:

- Contribution review happens through forms, CRM, Discord, Telegram, or GitHub.
- A community policy defines eligible activities and limits.
- Abuse prevention filters duplicate accounts, spam, and low-quality submissions.

### Risks

- Rewards can create expectation of monetary value if messaging is careless.
- Referral programs can attract spam.
- Uneven reward decisions can create community disputes.
- Some jurisdictions may regulate referral incentives.

### MVP Implementation

- Publish a community rewards policy.
- Start with capped testnet reward batches.
- Maintain a public reward report with categories, not personal data.
- Publish report hashes on-chain.

## 4. Event Access And RSVP Priority

### Problem

Boutique hospitality concepts often host limited-capacity previews, pop-ups, tastings, design walks, or partner events. Manual invite lists are hard to audit.

### User Story

As a TikiDeco community member, I want a transparent way to qualify for RSVP priority or access to limited brand events.

### Token Role

TIDE can act as an eligibility credential for event RSVP priority. It does not guarantee entry if the event is full, cancelled, age-restricted, or subject to venue rules.

### On-Chain/Off-Chain Logic

On-chain:

- Balance snapshot determines eligible wallets.
- Campaign rules and event limits can be published as report hashes.

Off-chain:

- RSVP platform verifies wallet signature.
- Event staff checks ID, age restrictions, and guest list.
- Venue capacity and safety rules control final entry.

### Risks

- Event access may be viewed as a resale asset.
- Local alcohol, hospitality, and event rules may apply.
- Wallet sharing can complicate check-in.
- Public guest lists create privacy concerns if not handled carefully.

### MVP Implementation

- Run a mock RSVP campaign on Sepolia.
- Use wallet signatures and a capped RSVP list.
- Publish anonymized eligibility and final attendance statistics.

## 5. Transparent Project Reporting

### Problem

People following a real-world hospitality project need a way to see that public updates have not been silently changed after publication.

### User Story

As a follower, partner, or early community member, I want project reports to be timestamped and verifiable so I can compare what was announced with what changed later.

### Token Role

TIDE is connected to a token contract that can publish report hashes. The token itself is not a claim on project assets; it is part of a transparency system around public reporting.

### On-Chain/Off-Chain Logic

On-chain:

- `publishReport(documentHash, category, uri)` stores timestamped proof that a specific report version existed.
- Report categories can include monthly update, permit update, tokenomics update, security update, or community campaign.

Off-chain:

- Reports are hosted on GitHub, IPFS, website, or public archive.
- Readers hash the file and compare it with the on-chain hash.
- Project team keeps a public index of reports.

### Risks

- A hash proves document integrity, not truthfulness.
- Reports may omit information if governance rules are weak.
- Non-technical users may not understand hash verification.
- Public updates can create regulatory exposure if written like fundraising material.

### MVP Implementation

- Create a "Genesis Report" summarizing Sepolia deployment, verified contracts, tokenomics, risk boundaries, and website launch.
- Host it in `docs/reports/`.
- Hash it locally.
- Publish the hash through the token contract.

## 6. Partner Perk Campaigns

### Problem

Future hospitality partners may want to offer small, controlled perks to a known audience without building a full loyalty integration from scratch.

### User Story

As a partner, I want to run a limited TikiDeco community perk campaign, such as priority RSVP, merchandise access, design preview, or local experience access.

### Token Role

TIDE can be used as a campaign eligibility signal. It should not be used to promise cash value, resale value, or financial returns.

### On-Chain/Off-Chain Logic

On-chain:

- Partner campaign eligibility can use balance thresholds or allowlists.
- Campaign rules and final reports can be published with report hashes.

Off-chain:

- Partner validates wallet ownership.
- Perk redemption is handled through partner systems.
- TikiDeco reviews partner messaging before launch.

### Risks

- Partner messaging may accidentally imply investment value.
- Perks may be unavailable in some jurisdictions.
- Campaign abuse can occur through wallet splitting.
- Poor partner execution can harm brand trust.

### MVP Implementation

- Start with one non-cash partner campaign.
- Use a capped eligibility list and manual redemption.
- Publish a pre-campaign rules report and post-campaign summary.

## 7. Governance Signaling Without Binding Control

### Problem

Early communities often want to express preferences, but binding governance over a real-world hospitality business can create legal and operational problems.

### User Story

As a community member, I want to signal preferences on non-binding topics such as event themes, community campaigns, merchandise concepts, or content priorities.

### Token Role

TIDE can support non-binding sentiment polls or weighted signaling. It should not grant legal control over the company, hotel, treasury, revenue, or assets.

### On-Chain/Off-Chain Logic

On-chain:

- Token balances can define voting weight at a snapshot.
- Poll rules and final summaries can be published as report hashes.

Off-chain:

- Polls can run through Snapshot, a website, or signed-message tools.
- Team reviews results and publishes a response.
- Final business decisions remain with the project operator.

### Risks

- Users may confuse signaling with legal governance rights.
- Token-weighted polls can favor large holders.
- Governance language can increase regulatory risk.
- Poll manipulation can happen through token transfers before snapshots.

### MVP Implementation

- Run non-binding polls only.
- Use clear labels: "community signal, not governance control."
- Publish poll rules, snapshot time, results, and team response.
