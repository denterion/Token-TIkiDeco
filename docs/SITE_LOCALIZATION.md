# Website languages

English is available at `/`; Russian introductory content is at `/ru/`.
The language control is a normal link and requires no cookies or browser storage.
Russian copy is maintained in `site-v2/src/data/ru.ts` and
`scripts/lib/russian-pages.cjs`. Both use the existing build, without a translation service.

Translated introductory routes: home, learn, learn/tide, FAQ, status, pilot,
trust, audit, developers and feedback. These are plain-language summaries,
not translations of every technical report. English technical sources remain authoritative.
The interactive balance checker, operator sandbox, legal notices and specialist
review material remain English; outgoing links are labelled accordingly.

The pilot is still draft-not-live. Localization does not approve a campaign,
change contract versions or remove public limitations.

## Verification

- `npm run site`: type checks, build, internal links, canonical/sitemap parity and public boundaries.
- `npm run site:browser`: desktop/mobile language journey, overflow and no-JavaScript reading.
- `npm run claims` and `npm run value`: existing public communication checks.

Native-speaker review of specialist/legal terminology is still recommended before
translating the legal notices or using this copy for an operational campaign.
