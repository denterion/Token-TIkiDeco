# TikiDeco Incident Response

Status: operational response draft. This is not a legal notice template and is not a substitute for counsel review.

## Severity Levels

| Level | Meaning |
| --- | --- |
| Critical | Potential loss or unauthorized movement of treasury/vault tokens, role compromise, malicious release artifact, or public claim causing immediate user harm. |
| High | Privileged role misuse, wrong report hash publication, domain compromise, CI compromise, or material release misconfiguration. |
| Medium | Incorrect dashboard data, documentation inconsistency, non-blocking Slither finding requiring triage, or deployment artifact mismatch. |
| Low | Typo, stale link, non-material metadata mismatch, or non-user-impacting issue. |

## Initial Response

1. Preserve evidence: commit SHA, logs, tx hashes, screenshots, DNS records, workflow run links.
2. Stop changes: pause release work and avoid new announcements.
3. Classify severity.
4. Identify affected surface:
   - V1 Sepolia canonical contract;
   - V2 candidate contract;
   - website/domain;
   - GitHub Actions;
   - report hash;
   - public communication.
5. Notify project owner and required reviewers.

## Smart-Contract Related Incident

- Do not broadcast corrective transactions without explicit approval.
- If token pause is relevant, prepare Safe action and document rationale.
- If vesting is affected, reconcile vault balance and liabilities.
- If treasury is affected, inventory balances and pending approvals.
- Open a private remediation branch for tests and docs.

## Website Or Domain Incident

- Check latest Pages workflow run.
- Check DNS records for `tikideco.xyz`.
- Check `site/CNAME`, `robots.txt`, `sitemap.xml`, and public manifest.
- Revert malicious content through reviewed PR.
- Avoid public claims beyond confirmed facts.

## Report Hash Incident

- Identify incorrect report file, hash, URI, tx hash, and report id.
- Prepare corrected report.
- Publish superseding report only through approved reporter workflow.
- Document correction in release notes or transparency report.

## Communication Incident

- Remove or correct misleading copy.
- Preserve original text for review.
- Use `docs/COMMUNICATION_PLAYBOOK.md` response templates.
- Do not imply sale, value, mainnet, independent audit, active benefits, hotel ownership, revenue rights, or investment returns.

## Post-Incident Review

1. Root cause.
2. Affected files/contracts.
3. User impact.
4. Mitigation.
5. Tests added.
6. Documentation updated.
7. Remaining risk.

