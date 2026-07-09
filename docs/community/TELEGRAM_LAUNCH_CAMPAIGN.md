# TikiDeco Telegram Launch Campaign

Status: prepared for public Telegram channel updates.

Channel: `@tokenTikiDeco`

Source-of-truth files:

- `docs/PROJECT_FACTS.md`
- `docs/COMMUNICATION_POLICY.md`
- `docs/COMMUNICATION_PLAYBOOK.md`
- `docs/CLAIMS_MATRIX.md`
- `docs/NEXT_RELEASE_GATES.md`

## Channel Positioning

TikiDeco / TIDE is a Sepolia testnet prototype exploring transparent loyalty and access infrastructure for a future hospitality concept.

The Telegram channel should be used for:

- build-in-public updates;
- Sepolia verification links;
- public report links;
- roadmap and gate progress;
- community-preview notes;
- utility-pilot research boundaries;
- security and transparency updates.

The channel must not be used for:

- token price or listing discussion;
- sale, presale, or investment language;
- claims of independent audit completion;
- claims of active hotel benefits;
- partner/property claims not listed as verified in `docs/PROJECT_FACTS.md`.

## Posting Rhythm

Starter cadence:

- Monday: build-in-public progress update.
- Tuesday: fact card for non-crypto readers.
- Wednesday: verification, docs, or transparency note.
- Friday: roadmap or community-preview update.
- Sunday: plain-language recap when useful.
- Monthly: transparency report summary after report preparation.

Best windows:

- 09:00-11:00 ET for Miami/hospitality context.
- 16:00-18:00 UTC for crypto/dev visibility.

## First Broadcast

```text
TikiDeco / TIDE public channel is now live.

Current:
- Sepolia testnet token and vesting vault are deployed and verified
- privileged V1 actions are controlled by a Sepolia Safe
- public reports and project facts are maintained in the repository
- OpenZeppelin V2 remains candidate code for review, not the canonical deployment

Planned:
- keep improving the public site and verification flow
- prepare community-preview feedback
- continue legal, governance, and security-readiness work before any production decision

Boundary:
TIDE is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit.

Project site: https://tikideco.xyz/
Project facts: https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PROJECT_FACTS.md
```

## Follow-Up Broadcasts

### Build-In-Public Update

```text
TikiDeco build update:

The project is being organized around public verification first:
- canonical Sepolia deployment manifest
- verified token and vault source links
- Safe-controlled privileged operations
- public project facts and claims matrix
- read-only site experience

Next focus: keep public messaging simple and make every claim traceable to repo or Sepolia evidence.

Testnet prototype only. No sale, no mainnet, no stated monetary value.
```

### Community Preview Update

```text
Community preview focus:

We are looking for feedback on clarity, verification, and utility boundaries.

Useful questions:
- can a new reader understand the Sepolia status quickly?
- are no-sale, no-value, no-mainnet, and no-audit boundaries visible?
- are planned utility ideas clearly separated from live benefits?

Start here: https://tikideco.xyz/

TIDE remains a Sepolia testnet prototype and is not offered for sale.
```

### Transparency Update

```text
TikiDeco transparency note:

The project maintains public facts, communication rules, and report material in the repository so claims can be checked against source files and Sepolia data.

Current public boundary:
- Sepolia testnet prototype
- no token sale
- no stated monetary value
- no mainnet deployment
- independent audit not started
- utility pilot remains draft / not live

Project facts: https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PROJECT_FACTS.md
```

## Visual Direction

Use clean Miami / hospitality / technical imagery:

- Art Deco geometry;
- ocean-light palette;
- subtle token or dashboard detail;
- roadmap nodes and public-report motifs;
- no charts implying price;
- no hotel property photo unless the property claim is verified.

## Pre-Publish Checklist

- Run `npm run claims:check`.
- If the post mentions site status, run `npm run site:check`.
- If the post mentions tests, run `npm test` first.
- Do not mention passing tests while the local suite is failing.
- Do not describe internal review as an audit.
- Do not imply active guest benefits or hotel partnership.

## Local Commands

Preview the next safe Telegram update without publishing:

```bash
npm run telegram:update:dry-run
```

Publish the next safe Telegram update after the claims gate passes:

```bash
npm run telegram:update
```

Theme override:

```bash
node scripts/publish-telegram-update.cjs --theme build --dry-run
node scripts/publish-telegram-update.cjs --theme facts --dry-run
node scripts/publish-telegram-update.cjs --theme transparency
node scripts/publish-telegram-update.cjs --theme community
node scripts/publish-telegram-update.cjs --theme roadmap
node scripts/publish-telegram-update.cjs --theme plain --dry-run
```
