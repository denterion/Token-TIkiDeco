# Website renewal plan

Reviewed 2026-10-22 against main 742ecfb6b617448749dca16ac7fdcb4b76157863.

## Objective

A visitor should understand the prototype and try its demonstrations without needing to read GitHub. Repository links remain secondary source references and contribution paths.

## Observed defects and first fixes

- The hero explanation action stayed on the homepage. Add /learn/ with plain-language explanations and direct demonstration links.
- React navigation used homepage anchors for Status and Audit despite dedicated pages. Use those pages consistently.
- The audit Reports link targeted a missing homepage reports section. Point to the existing Trust Center report section.
- Evidence hash links inferred an absent _HASH.md file. Link the actual release evidence configuration.
- React and generated static pages use separate shells and CSS. Consolidate these in the next implementation phase.
- The English-only content file is named i18n but has no locale routing. Localization needs content review, not just a selector.

## Phase 1: Common page system

## Verification findings on 2026-10-22

The clean Windows checkout exposed CRLF conversion of nested immutable reports. Extend the LF rule to nested report paths; preserve the recorded SHA-256 and report content. Public evidence verification passes after this correction.

Dependency evidence at `b82022d` (site PR #139): Vite 7.3.7 and Hardhat 3.21.2 are pinned. The full npm advisory scan still blocks the release: six high-severity package entries trace to one [Zod resource-exhaustion advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). The production-only scan reported zero. Counts are snapshots, not a standing assurance; reproduce with `npm ci`, `npm run deps:audit` and `npm audit --omit=dev`.

[Hardhat's upstream assessment](https://github.com/NomicFoundation/hardhat/issues/8817) distinguishes trusted local configuration from a development node receiving untrusted signing requests with Ledger accounts configured. The project workflows run local tests; production serves a static site, not a Hardhat RPC server. Do not expose a development node or add Ledger accounts on the assumption that this assessment still applies. The upstream issue was closed without a compatible dependency upgrade; forcing Zod 4 is not a supported fix.

Release decision: keep the full advisory gate blocking. Recheck when Hardhat and its plugins support a patched Zod; run contract, coverage, site and browser tests before merging. An exception would require a separate documented maintainer decision. Do not change the frozen candidate lock or its package checksum. The Cloudflare Workers check is separate; its GitHub summary links to the build but contains no error log.

## Shared shell implementation

Create one shared navigation/content definition consumed by React and the static generator. Navigation: Learn, Explore, Trust, Developers; language control and current status alongside it. Preserve all existing legal and verification routes. Keep the current build stack initially.

Acceptance: identical navigation on every page, active-page indication, keyboard-operated menus, mobile menu with Escape and focus restoration, no horizontal overflow at 320px, static content readable without JavaScript.

## Phase 2: Full website content

Publish /learn/, /learn/tide/, /learn/how-it-works/, /faq/, /reports/ and /developers/. Reuse /pilot/, /operator-sandbox/, /utility/, /trust/, /status/, /audit/ and /roadmap/. Each page must answer one reader question, offer a next step and put technical source links after the explanation. Reports must distinguish historical snapshots from current checks.

Acceptance: basic understanding, status and demonstrations require no GitHub navigation; source code, issue submission and private disclosure may remain external. Retain canonical manifest data and explicit prototype limitations.

## Phase 3: Visual system and languages

Use restrained graphite, off-white reading surfaces and cyan/coral accents. Apply one typography and spacing system to all pages. Keep 3D optional and secondary to readable content; provide an image fallback and reduced-motion mode. Avoid repeated warning cards: preserve a concise visible prototype notice and full contextual legal information.

Introduce English and Russian pages with equivalent routes, language names, lang attributes, hreflang and localized metadata. Preserve old URLs. Translate error messages and accessibility labels as well as headings. Mark untranslated technical material explicitly; require review for legal translations.

Acceptance: navigation preserves the current page when switching language; no untranslated critical UI; long Russian strings fit; mobile and desktop screenshots reviewed; no automatic locale redirect.

## Phase 4: Verification and release

Run site typecheck/build, route/sitemap/canonical parity, browser regressions, eligibility tests and claims/value checks. Add browser scenarios for new navigation, locale switching and no-JavaScript reading. Measure performance before setting a score claim. Check dependency advisories separately from contract review.

Publish only after review. No contract, candidate identity or deployment change is required for this work. This plan does not establish external validation or active hospitality services.
