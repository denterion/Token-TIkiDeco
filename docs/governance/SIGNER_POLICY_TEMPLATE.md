# Signer Policy Template

Status: unapproved template. It contains no signer identity, seed material, storage location, recovery secret, or operational authorization.

## Hardware Wallet Expectation

Each signer should use a supported hardware wallet for higher-impact governance. Device model, firmware policy, replacement process, and evidence owner require approval without publishing sensitive device identifiers.

## Device Separation

Signer devices, routine computers, communication channels, and backups should avoid shared control and correlated failure. Exact locations and recovery arrangements must remain private.

## Recovery Policy

Define how loss is reported, who reviews recovery evidence, which test-only drill is required, and when the Safe must stop operating. Never place seed phrases or recovery secrets in repository evidence.

## Signer Independence

Record whether each signer is controlled by a distinct person or accountable function, can review independently, and is free from shared seed material or unilateral instruction.

## Conflict Disclosure

Signers disclose material treasury, allocation, vendor, reviewer, or operator conflicts before reviewing an affected action. A conflict record should state the decision, not sensitive personal details.

## Signing Review Checklist

- [ ] Network and chain ID match the approved action.
- [ ] Safe address and current threshold match the canonical source.
- [ ] Full target address matches the reviewed specification.
- [ ] Method selector and decoded parameters match the intended call.
- [ ] Native value, token amount, nonce, and operation are expected.
- [ ] Simulation output has been independently reproduced.
- [ ] Human-readable summary matches calldata.
- [ ] Source document, checksum, and approvals are attached.
- [ ] A second reviewer has confirmed the same facts.
- [ ] No signer is relying only on website labels or truncated addresses.

## Transaction Simulation

Every action should be simulated on the correct chain against current state before signing. A simulation success is evidence, not authorization; reviewers must still validate intent and all decoded fields.

## Address Verification

Compare full addresses against the canonical manifest or a dated approved decision. Use checksum formatting and an independent source. Address-book names and first/last-character comparisons are insufficient.

## Emergency Communication

Define a primary and independent backup channel, incident coordinator, acknowledgement format, and escalation window. Do not send transaction approvals, secrets, or recovery material through emergency chat.

## Approval Record

| Item | State | Reviewer | Date | Evidence |
| --- | --- | --- | --- | --- |
| Signer roles | Not assigned | Unassigned | Not reviewed | None |
| Hardware policy | Not approved | Unassigned | Not reviewed | This template only |
| Independence | Not confirmed | Unassigned | Not reviewed | None |
| Recovery process | Requires review | Unassigned | Not reviewed | Drill evidence only |
| Incident owners | Not assigned | Unassigned | Not reviewed | None |
