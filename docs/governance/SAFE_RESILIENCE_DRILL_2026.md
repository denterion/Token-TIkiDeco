# Safe Resilience Drill 2026

Status: completed local tabletop simulation on 2026-07-11 using fake data only. It did not access the current Sepolia Safe, prepare a Safe proposal, request signatures, or broadcast a transaction.

## Scope And Result

The drill tests review discipline around the canonical V1 owner model recorded in [`deployments/canonical.json`](../../deployments/canonical.json). The current Safe remains `3-of-3`. This exercise does not prove signer recovery, hardware-wallet use, signer independence, or production governance readiness.

The local transaction-review fixture passed all deterministic checks for target, Sepolia chain ID, method selector, zero amount, nonce, operation, human-readable summary, and independent second-person confirmation. The generated evidence is [`operations/governance/safe-drill-result.json`](../../operations/governance/safe-drill-result.json).

## Scenarios

### One signer unavailable

**Detection:** A required signer misses the agreed review window or confirms temporary unavailability through a separate channel.

**Immediate response:** Stop non-essential proposals and verify the expected return window without sharing transaction payloads through the same channel.

**Who decides:** The incident coordinator records the state; no remaining signer may bypass the threshold.

**Required signatures:** The current Safe still requires all 3 signatures.

**Operational impact:** Every owner action is delayed, including emergency actions controlled only by the Safe.

**Recovery path:** Resume only after the signer returns and independently rechecks the complete proposal.

**Evidence retained:** Time-stamped incident log, communication-channel check, proposal checksum, and quorum assessment.

**Public communication:** Publish a short service-status note only if a public operation is materially delayed; disclose no signer identity or recovery detail.

**Stop condition:** Quorum cannot be reached safely or signer integrity is uncertain.

### One signer permanently lost

**Detection:** The signer confirms unrecoverable access loss, or the documented recovery review concludes access cannot be restored.

**Immediate response:** Freeze routine governance activity and classify the Safe as operationally blocked.

**Who decides:** A named governance reviewer and security reviewer must jointly authorize any future recovery proposal after counsel or entity review where applicable.

**Required signatures:** Any Safe configuration change still requires the existing 3 signatures; this may be impossible under the current model.

**Operational impact:** A `3-of-3` Safe can become permanently unable to execute.

**Recovery path:** Use only a previously reviewed recovery mechanism, if one exists. Otherwise document irrecoverability and evaluate a new deployment without disguising historical state.

**Evidence retained:** Loss declaration, device incident record, Safe configuration snapshot, and recovery assessment.

**Public communication:** State that privileged operations are blocked; do not disclose recovery secrets or speculate about timing.

**Stop condition:** No reviewed recovery path exists or any proposed workaround would weaken custody controls.

### One signer compromised

**Detection:** Unexpected signature request, device alert, unauthorized account activity, or signer report of suspected compromise.

**Immediate response:** Stop signing, isolate the affected device, preserve evidence, and warn the other signers through an independent channel.

**Who decides:** Security incident owner coordinates; the uncompromised signers independently reject unverified proposals.

**Required signatures:** The current `3-of-3` threshold prevents two signers from executing alone, but also prevents removal of the compromised signer without that signer or a reviewed recovery path.

**Operational impact:** All Safe actions pause until signer integrity and recovery options are reviewed.

**Recovery path:** Revoke affected access through an approved recovery process, rotate devices, then run a fresh test-only signing drill before resuming.

**Evidence retained:** Device logs, suspicious proposal data, Safe activity export, communication timeline, and recovery decision.

**Public communication:** Disclose confirmed operational impact after containment; do not reveal exploit details that increase risk.

**Stop condition:** Any signer, device, proposal, or communication channel remains untrusted.

### Two signers disagree

**Detection:** Review records show conflicting interpretations of target, intent, amount, evidence, or policy.

**Immediate response:** Reject or leave the proposal unsigned and escalate the disagreement to the documented decision owner.

**Who decides:** The designated governance reviewer resolves policy questions; technical facts require an independent reproducibility check.

**Required signatures:** All 3 signatures remain required, so disagreement safely blocks execution.

**Operational impact:** The action is delayed; no signer is pressured to approve against their review.

**Recovery path:** Rewrite the human-readable action, reproduce calldata, and obtain a new second-person review. Create a new proposal only after consensus.

**Evidence retained:** Competing review notes, corrected specification, simulation output, and final decision record.

**Public communication:** Explain a governance review delay only when it affects a public commitment; make no promise of execution.

**Stop condition:** Intent, authority, or expected state change remains disputed.

### Malicious transaction proposed

**Detection:** Target, selector, value, operation, nonce, or human summary differs from the approved action.

**Immediate response:** Do not sign; preserve the full proposal; identify its creator and inspect signer and site compromise indicators.

**Who decides:** Security incident owner classifies the event, while each signer independently rejects the proposal.

**Required signatures:** Zero signatures should be provided. The threshold must not be used as a substitute for proposal validation.

**Operational impact:** All pending proposals and signing channels are quarantined.

**Recovery path:** Remove the malicious proposal from the active queue where the interface permits, rotate compromised access, and rebuild any legitimate action from reviewed source data.

**Evidence retained:** Proposal JSON, calldata, simulation, access logs, screenshots, and hashes.

**Public communication:** Publish confirmed impact and corrective controls after containment; route sensitive details through `SECURITY.md`.

**Stop condition:** Proposal origin or signer environment cannot be trusted.

### Incorrect report hash prepared

**Detection:** Locally recomputed SHA-256 or document URI differs from the proposed report metadata.

**Immediate response:** Reject the draft and freeze publication.

**Who decides:** Report owner corrects the source; governance reviewers verify the replacement independently.

**Required signatures:** No signatures for the incorrect draft; the corrected action would require the current 3-of-3 threshold.

**Operational impact:** Transparency publication is delayed, while the underlying document remains off-chain and reviewable.

**Recovery path:** Regenerate the hash from the approved immutable document, recheck URI and category, and create a new local review record.

**Evidence retained:** Both hashes, source document checksum, correction note, and review output.

**Public communication:** If an incorrect hash was only prepared, no on-chain correction claim is needed. If later executed, use the documented superseding-report process.

**Stop condition:** The document, hash, URI, or report purpose cannot be reproduced independently.

### Treasury address entered incorrectly

**Detection:** Address comparison against the canonical manifest or approved operation record fails.

**Immediate response:** Reject the draft; do not rely on visual truncation or address-book labels.

**Who decides:** Treasury operation owner provides the intended address; two independent reviewers verify the full address and network.

**Required signatures:** Zero signatures for the incorrect draft; any corrected owner action remains subject to 3-of-3.

**Operational impact:** Treasury-related work stops until the destination is verified.

**Recovery path:** Recreate the draft from source-of-truth data, compare full address and checksum, then simulate again.

**Evidence retained:** Rejected draft hash, canonical source link, full-address comparison, and corrected simulation.

**Public communication:** No public notice is needed for a rejected local draft unless the error indicates a broader control failure.

**Stop condition:** Destination ownership, purpose, network, or amount is uncertain.

### Website compromised while Safe remains secure

**Detection:** Public site content, links, DNS, or assets differ from the reviewed repository and deployment evidence.

**Immediate response:** Disable or roll back the site, warn users through repository channels, and tell signers not to follow site-provided transaction instructions.

**Who decides:** Site/security incident owner controls containment; Safe signers retain independent custody decisions.

**Required signatures:** None for site containment. No Safe action should be proposed solely from compromised site content.

**Operational impact:** Website availability may stop, but canonical contract verification remains available through repository and explorer links.

**Recovery path:** Restore from a clean commit, verify domain and CI access, rebuild, and compare artifact hashes before redeployment.

**Evidence retained:** DNS and hosting logs, malicious page capture, clean commit, build checksums, and incident timeline.

**Public communication:** Publish a verified warning and recovery update through an independent channel.

**Stop condition:** Hosting, domain, CI, repository, or public facts remain untrusted.

### All signers temporarily unavailable

**Detection:** No signer responds within the defined incident window through verified channels.

**Immediate response:** Declare privileged operations unavailable and stop creating proposals.

**Who decides:** The incident coordinator records the outage but cannot override the Safe.

**Required signatures:** The current Safe still requires all 3; no emergency bypass exists in this drill.

**Operational impact:** Pause, metadata, report, and other owner actions cannot execute.

**Recovery path:** Wait for independently verified signer availability, then revalidate every pending action from scratch.

**Evidence retained:** Availability timeline, channel checks, affected-operation list, and return-to-service review.

**Public communication:** State that privileged operations are delayed and avoid promising a recovery time.

**Stop condition:** Availability is not restored or any returning signer cannot establish trusted control.

## Threshold Comparison

| Model | Security | Availability | Collusion risk | Signer-loss tolerance | Operational complexity |
| --- | --- | --- | --- | --- | --- |
| Current `3-of-3` | Every signer must approve; strong unanimity | Low: one unavailable signer blocks execution | All three must collude | None | Low signer count, high coordination fragility |
| Hypothetical `2-of-3` | One dissenting signer can be bypassed | Higher: one signer may be unavailable | Two signers can collude | One | Moderate; independence and alerts become more important |
| Hypothetical `3-of-5` | Three independent approvals required | Higher: two signers may be unavailable | Three signers must collude | Two | High; requires five qualified, independent signers and mature operations |

## Decision

No threshold change is recommended from this tabletop exercise alone. Keep the current Sepolia `3-of-3` unchanged until signer roles, independence, hardware policy, recovery review, and incident ownership have evidence and a dated governance decision. Mainnet readiness remains blocked.
