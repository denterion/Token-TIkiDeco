# Reviewer Handoff Checklist

## Before Sending

- [ ] `config/audit/v2-review-candidate.json` identifies the exact evidence commit and package SHA-256.
- [ ] `npm run review:candidate:check` passes.
- [ ] `npm run review:handoff:check` passes from a clean tree.
- [ ] Package `SHA256SUMS.txt` and source archive are present.
- [ ] Dependency lock hash matches the candidate definition.
- [ ] Hardhat and Foundry tests are included or explicitly referenced.
- [ ] Slither baseline and accepted findings are included.
- [ ] Known issues and owner decisions are complete.
- [ ] Role manifest is described as a non-deployed template with null addresses and incomplete on-chain assertions.
- [ ] V1 canonical facts and V2 non-canonical status are explicit.

## Reviewer Acknowledgement

- [ ] Reviewer confirms the evidence commit and package checksum.
- [ ] Reviewer confirms scope and exclusions.
- [ ] Reviewer confirms methodology, draft process, severity taxonomy and retest terms.
- [ ] Reviewer signs the conflict disclosure.
- [ ] Reviewer confirms no private keys, participant data or transaction authority are required.

## Handoff Contents

Send the immutable payload together with `V2_REVIEW_CANDIDATE.md`, the machine-readable candidate definition, procurement brief, reviewer questions, known issues, owner decisions and response process. Keep the original payload unchanged; remediation receives a new commit and package.

Handoff does not authorize deployment, mainnet, sale, liquidity, listing, value claims or active hospitality operations.
