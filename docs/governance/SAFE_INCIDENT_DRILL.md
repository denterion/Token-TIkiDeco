# Safe And Operations Incident Drill

Status: tabletop exercise using test-only data. No wallet, participant, booking or signer secrets are used. No transaction is prepared or broadcast.

| Scenario | Immediate action | Decision owner | Recovery evidence | Stop condition |
| --- | --- | --- | --- | --- |
| One signer unavailable | Pause non-essential proposals; verify expected return window through a separate channel. | Governance reviewer | Dated incident log and quorum assessment. | Required quorum cannot be achieved safely. |
| One signer compromised | Stop routine signing; isolate the signer device; preserve evidence; assess signer replacement. | Security reviewer | Incident record and independently reviewed recovery proposal. | Any uncertainty about remaining signer integrity. |
| Incorrect allocation draft | Reject the draft before signing; regenerate from reviewed input; compare aggregate totals. | Operations reviewer | Dry-run checksums and reviewer sign-off. | Recipient or total cannot be independently reproduced. |
| RPC outage | Do not substitute unapproved endpoints; verify through a second allowlisted source or wait. | Release manager | Endpoint status and later state verification. | Chain ID or state cannot be independently confirmed. |
| Site compromise | Disable or roll back the site; keep repository and explorer verification links available separately. | Site/security reviewer | Clean-build hash, incident timeline and restored CSP/hosting review. | Public facts differ from source-of-truth files. |
| False public claim | Remove or correct the claim; preserve the original; publish a correction with source links. | Communications reviewer | Claims-check output and correction record. | Correction cannot be verified or legal review is required. |
| Participant data exposure | Stop collection and publication; restrict access; preserve minimum evidence; follow privacy escalation. | Privacy reviewer | Aggregate-only incident summary after review. | Scope is unknown or sensitive data remains exposed. |

## Drill Procedure

1. Use fake addresses, invented campaign IDs clearly marked as fixtures and no personal data.
2. Assign observers for governance, security, privacy and operations.
3. Walk through detection, containment, decision authority, recovery and public communication.
4. Record elapsed time and missing evidence without claiming the procedure is operationally proven.
5. Update the resilience decision only after reviewer sign-off.

Current result: tabletop structure exists; a witnessed recovery drill is still required before any limited operator pilot approval.
