# Privacy-Safe Pilot Reporting

Status: reporting policy draft. This document does not approve data collection or a live campaign.

## Core Rule

Public pilot reports must use aggregate-only reporting and must not include private participant data.

## Public Reports Must Not Include

- private keys, seed phrases, or passwords;
- emails;
- guest names;
- booking details;
- identity documents;
- wallet-to-person mappings;
- sensitive personal data;
- full wallet-address lists unless explicitly approved by privacy and governance review.

## Aggregate-Only Reporting

Use counts and categories:

- total requests;
- total eligible wallets;
- total ineligible wallets;
- total duplicate submissions;
- total testnet TIDE allocated, if any;
- known issue categories;
- user feedback themes;
- dispute count and outcome categories.

## Wallet Address Minimization

Wallet addresses should be minimized, truncated, or excluded unless explicitly approved.

Preferred public format:

- aggregate counts only;
- no full address list;
- no wallet-to-person link;
- no address-level outcome table.

If an address must be referenced after approval, use a truncated form such as `0x1234...abcd` and explain why it is necessary.

## Email And Guest Data

Email collection is off by default.

Guest data collection is not approved for the draft campaign. Before any email, guest, booking, or identity data is collected, the project needs:

- privacy review;
- legal review;
- retention policy;
- user-facing terms;
- storage security plan;
- deletion/correction process;
- incident process.

## Retention Policy Placeholder

Current draft default:

- public reports: retained in repository history;
- generated draft files: retained only if they contain no private data;
- operational notes: aggregate categories only;
- private participant data: not collected.

Any deviation requires privacy review before collection.

## Review Requirement

Privacy review is required before:

- collecting emails;
- collecting guest data;
- linking wallets to people;
- publishing wallet-level outcomes;
- using third-party forms or analytics for pilot participation;
- storing any participant record outside the repository.
