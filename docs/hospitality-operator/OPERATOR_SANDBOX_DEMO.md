# Operator Sandbox Demonstration

Status: local demonstration with fake data only. No operator, property, partnership, active hospitality service, real benefit, booking workflow, payment flow, token distribution, or transaction broadcasting is created by this sandbox.

## Ten-Minute Workflow

1. Choose one fake campaign template.
2. Create a draft with a Sepolia-only eligibility rule and limited mock inventory.
3. Move the campaign through review and approval for simulation.
4. Start the local simulation.
5. Review an eligible or ineligible mock request.
6. Approve or reject the mock request.
7. Close the campaign.
8. Inspect the aggregate report and SHA-256.

All state exists only in the browser tab or deterministic local test process. Refreshing the page clears the interactive state.

## Fake Campaign Templates

| Template | Operator status | Campaign state | Eligibility rule | Inventory | Window | Support owner | Disputes | Cancellation | Stop conditions | Legal / privacy |
| --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| Early community RSVP | Fake operator for simulation | Draft | Mock Sepolia balance meets the configured threshold | 2 | Fixed 2030 fixture | Mock support owner | Second mock reviewer | Simulation can close without participant rights | Inventory mismatch, privacy boundary failure, incorrect public claim | Reviewed for simulation only |
| Priority preview access | Fake operator for simulation | Draft | Mock request passes the Sepolia-only review window | 2 | Fixed 2030 fixture | Mock support owner | Second mock reviewer | Simulation can close without participant rights | Inventory mismatch, privacy boundary failure, incorrect public claim | Reviewed for simulation only |
| Conditional non-cash welcome-perk simulation | Fake operator for simulation | Draft | Mock eligibility and limited inventory are both available | 2 | Fixed 2030 fixture | Mock support owner | Second mock reviewer | Simulation can close without participant rights | Inventory mismatch, privacy boundary failure, incorrect public claim | Reviewed for simulation only |

No template creates a guaranteed outcome, resale right, cash redemption, booking, or active guest benefit.

## Lifecycle

`draft -> review -> approved for simulation -> active simulation -> paused -> closed -> archived`

Approval for simulation is not legal approval, production approval, partner approval, or campaign publication. Activation fails unless the fake operator, simulation privacy review, and mock support owner gates are present.

## Aggregate Report

The generator records only:

- campaign ID;
- request, eligibility, approval, and rejection totals;
- inventory limit and inventory used;
- error, dispute, and stop-event totals;
- privacy statement;
- SHA-256.

It excludes raw wallet addresses, guest data, booking data, and participant identity. The committed example is [`operations/hospitality-operator/operator-sandbox-report.json`](../../operations/hospitality-operator/operator-sandbox-report.json).

## Commands

```bash
npm run operator-sandbox:test
npm run operator-sandbox:report
npm run operator-sandbox:demo:check
```

The scripts do not connect to an RPC, prepare a Safe proposal, distribute tokens, or broadcast a transaction.
