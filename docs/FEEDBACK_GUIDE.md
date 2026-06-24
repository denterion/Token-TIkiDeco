# TikiDeco Feedback Guide

This guide helps reviewers give useful feedback without turning the Sepolia prototype into a sales, listing, or investment discussion.

## Quick Feedback Format

Use this structure for GitHub issues, messages, or review comments:

```text
Area: site / docs / contracts / release / translation / utility / security
Page or file:
What confused me:
What I expected:
Suggested change:
Risk level: low / medium / high
```

## Good Feedback Examples

- "The homepage explains Sepolia, but the status panel could link directly to the verify page."
- "The Spanish copy says the same thing as English, but this phrase sounds too promotional."
- "The utility document should repeat that these scenarios are not active guest benefits."
- "The verify page should show the canonical manifest link near the Etherscan links."
- "The release notes mention internal review; please make independent audit status more visible."

## Feedback That Needs Reframing

If feedback uses any of these angles, reframe it before opening an issue:

- token price;
- purchase process;
- exchange listing;
- expected returns;
- guaranteed hospitality benefit;
- hotel ownership;
- revenue rights;
- mainnet timeline pressure.

Preferred framing:

- "How can the project make this boundary clearer?"
- "Where should the docs explain this limitation?"
- "What can be verified today?"
- "What would need legal, operational, or security review before this becomes real?"

## Translation Review

For EN/ES/RU review, check:

- the same project boundary appears in every language;
- no language implies a sale or current monetary value;
- no language implies active hospitality benefits;
- "internal review" is not translated as an independent audit;
- "conceptual" and "planned" remain clearly separated from "current".

## Security Questions

Security questions should include:

- affected contract, script, doc, or site page;
- possible failure scenario;
- whether the question affects V1 legacy, V2 candidate, or the public site;
- suggested test or check.

For sensitive reports, follow [`../SECURITY.md`](../SECURITY.md) instead of opening a public issue.

## Maintainer Triage

Maintainers should also use [`GITHUB_ISSUE_TRIAGE.md`](GITHUB_ISSUE_TRIAGE.md) and the recommended labels in [`.github/labels.yml`](../.github/labels.yml).

Suggested triage outcome:

| Outcome | Meaning |
| --- | --- |
| Accept | Clear improvement, safe to implement. |
| Needs source | The claim or suggestion needs repository/on-chain support. |
| Needs counsel | The topic may affect legal, regulatory, privacy, or consumer-protection posture. |
| Needs audit | The topic affects V2 contract security or deployment controls. |
| Out of scope | The request conflicts with the Sepolia/no-sale/no-value boundary. |
