# Safe Allocation Runbook

Status: draft runbook for Sepolia-only testnet allocation review. This runbook does not approve or broadcast any Safe transaction.

## Generate Draft Files

```bash
npm run allocation:prepare -- --input <allocations.csv-or-json> --campaign-id tide-community-preview-001
npm run allocation
```

Outputs:

- Safe Transaction Builder JSON draft;
- human-readable allocation report draft.

## Review Safe Transaction Builder JSON

Before importing into Safe:

1. Confirm `chainId` is `11155111`.
2. Confirm every transaction target is the canonical Sepolia TIDE token.
3. Confirm every transaction value is `0`.
4. Confirm calldata selector is ERC-20 `transfer(address,uint256)`.
5. Confirm recipient count equals the reviewed allocation input.
6. Confirm total base units match the report draft.
7. Confirm no private participant data appears in the JSON.

## Verify Recipient Totals

- Re-run `npm run allocation:prepare` from the same input.
- Compare generated report totals.
- Check duplicate rejection.
- Check per-wallet cap.
- Check campaign cap.
- Keep reviewed input outside public history if it includes private operational context.

## Simulate Before Execution

Manual signer review should simulate in Safe or a compatible transaction simulation tool before execution.

Simulation should confirm:

- correct network;
- correct token address;
- sufficient treasury balance;
- no native ETH transfer;
- expected token transfer totals;
- no unexpected contract calls.

## Publish Allocation Report

After a future approved campaign closes:

1. Prepare an aggregate-only report.
2. Remove private participant data.
3. Include SHA-256 hash.
4. Link Safe transaction hash only if a transaction was actually executed.
5. Run `npm run pilot:report:check`.
6. Run `npm run claims` and `npm run value`.

## Avoid Private Data Exposure

Do not commit:

- emails;
- guest names;
- booking information;
- identity documents;
- full participant lists unless explicitly approved;
- wallet-to-person mappings;
- sensitive personal data.

If sensitive data is submitted publicly, stop the workflow and handle it through the platform moderation and incident process.
