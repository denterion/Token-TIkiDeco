# Inventory Limits Draft

Status: draft evidence for issue #58. This document does not publish inventory, open a request window, approve a live campaign, create a sale, create a value statement, or claim independent audit completion.

Campaign ID: `tide-community-preview-001`

## Purpose

Define the minimum inventory evidence required before a future limited Sepolia-only preview can move from planning to review.

The current campaign remains `draft-not-live`. No inventory is available, no participant request window is open, and no active guest benefit exists.

## Current Inventory State

| Field | Current value |
| --- | --- |
| Campaign status | `draft-not-live` |
| Published capacity | `0` |
| Inventory status | Not published |
| Allocation method | Not approved |
| Request cap | Not published |
| Per-wallet cap | Not approved |
| Active guest benefits | Not live |

## Required Inventory Fields Before Publication

| Field | Required before publication | Notes |
| --- | --- | --- |
| Campaign ID | Yes | Must match the campaign manifest. |
| Inventory category | Yes | Early RSVP, priority review, non-cash welcome eligibility, or zero-allocation test. |
| Published capacity | Yes | Can be `0` for a no-allocation test. |
| Request cap | Yes | Maximum accepted requests before closure or waitlist. |
| Per-wallet cap | Yes | Normally one request per wallet per campaign. |
| Allocation method | Yes | First eligible request, lottery among eligible requests, manual review queue, or zero-allocation. |
| Cancellation rules | Yes | Must explain legal, safety, staffing, venue, privacy, and operational cancellation reasons. |
| Dispute window | Yes | UTC start and end timestamps. |
| Report path | Yes | Must point to an aggregate-only report template or draft. |

## Draft Inventory Models

| Model | When to use | Current approval |
| --- | --- | --- |
| Zero-allocation test | Validate reporting and review flow without any pilot slots. | Not approved |
| Tiny testnet-only review queue | Validate manual review on a very small number of public requests. | Not approved |
| Limited non-cash preview | Only after legal, privacy, security, operations, and governance approval. | Not approved |

## No-Private-Data Rule

Public inventory reports must not publish:

- full wallet lists;
- wallet-to-person mappings;
- emails;
- guest names;
- booking details;
- identity documents;
- private keys, seed phrases, or passwords;
- sensitive personal data.

Use aggregate counts and broad reason categories only.

## Required Boundaries

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. Inventory planning does not create booking rights, property rights, revenue rights, cash redemption, resale value, or guaranteed benefits.
