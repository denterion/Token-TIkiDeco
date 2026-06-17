# TikiDeco Site Design System

TikiDeco's public site should feel like premium hospitality infrastructure, not a token trading page. The identity keeps Art Deco geometry, Miami color accents, and the TIDE mark, while the interface uses calm editorial spacing and clear risk language.

## Identity

- Base colors: deep navy `#0b1020`, graphite `#171a22`, cream `#fffaf0`, paper `#f5efe5`.
- Accent colors: cyan `#22e5ec`, coral `#d84f45`, magenta `#c830d7`, muted gold `#9b7432`.
- Neon usage: reserve for testnet status, primary verification CTAs, and small trust indicators.
- Avoid: all-neon layouts, meme-token language, trading language, price language, and unlicensed hotel photography.

## Typography

- Display: Georgia or a compatible editorial serif for hero and section headings.
- UI/body: system sans-serif for readability and stable rendering.
- Code/address data: monospace only for contract addresses and machine-readable identifiers.
- Do not scale text with viewport width directly; use `clamp()` with readable min/max ranges.

## Layout

- Page order: Hero, Hospitality concept, Possible loyalty and access use cases, Current testnet implementation, On-chain trust dashboard, Token allocation, Security and governance, Roadmap, Reports, Documentation, Risks and disclaimers.
- Cards are quiet, flat, and used for repeated content only.
- Keep generous section spacing and avoid nested card surfaces.
- Every concept visualization must be labeled: `Concept visualization - not a completed property`.

## Accessibility

- Maintain visible `:focus-visible` states for every interactive element.
- Mobile navigation must remain available through a button with `aria-expanded` and `aria-controls`.
- Keep address text wrapping with `overflow-wrap: anywhere`.
- Respect `prefers-reduced-motion`.
- Do not hide critical navigation or risk language on mobile.

## Trust Dashboard

- Addresses must come from `deployments/canonical.json` through `scripts/build-site-manifest.cjs`.
- The browser reads only public data and never asks for wallet connection.
- RPC failure must display `Data temporarily unavailable`.
- Do not show zero values unless they were actually returned by RPC.

## Content Rules

- Allowed phrasing: Sepolia prototype, research direction, possible use case, no stated monetary value, no token sale.
- Avoid phrasing: investment, presale, profit, price growth, guaranteed utility, purchase token.
- Do not describe V2 as production or audited until a future manifest and review process explicitly promote it.
