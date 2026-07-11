# Audit Response Process

Status: response procedure for a future independent technical review or formal independent smart-contract audit of V2 candidate code. No such review is complete and mainnet is not approved.

## Severity Labels

| Severity | Meaning | Expected response |
| --- | --- | --- |
| Critical | Direct or near-direct loss of funds, supply integrity break, role takeover, or irreversible severe failure. | Stop promotion work; fix immediately; add regression tests and incident notes. |
| High | Serious exploit path, material custody/accounting issue, or high-impact authorization failure. | Prioritize fix before any new scope; add tests and package update. |
| Medium | Meaningful security, accounting, availability, or operational risk. | Fix or document accepted risk with auditor/governance agreement. |
| Low | Limited risk, clarity issue, or hardening recommendation. | Fix when practical or document rationale. |
| Informational | Documentation, tooling, maintainability, or non-exploitable observation. | Track and address as release-engineering debt where useful. |

## Remediation Branch Naming

Use:

```text
audit-fix/<finding-id>-<short-topic>
```

Examples:

- `audit-fix/v2-001-vault-accounting`
- `audit-fix/v2-004-report-metadata`

## Disputed Findings

If maintainers disagree with a finding:

1. Record the finding exactly as received.
2. Add a maintainer response with technical reasoning.
3. Identify whether the issue is accepted risk, false positive, documentation-only, or needs further reviewer discussion.
4. Do not silently close disputed findings.
5. Do not weaken tests or public claims to make a finding appear resolved.

## Publishing Fixed Issues

For each remediated issue:

- reference the finding ID;
- link the remediation PR;
- list changed files;
- describe tests added or updated;
- rerun the audit package command;
- update `KNOWN_ISSUES.md`, `SECURITY_REVIEW.md`, and release notes where applicable.

Do not call the project audited unless an independent final audit report exists and public wording has been separately approved.

## Updating The Release Package

After remediation:

```bash
npm run compile
npm test
npm run foundry:test
npm run foundry:coverage
npm run slither:baseline
npm run claims:check
npm run audit:package
npm run audit:handoff
```

The new package must include the updated source commit, checksums, test outputs, Slither baseline result, Foundry artifacts, known issues, and response notes.

Before remediation is treated as release evidence, also run:

```bash
npm run findings:check
npm run findings:release-impact
```

Any scoped V2 contract or deployment-script change invalidates the frozen candidate and requires a new candidate version, source commit, package checksum, and reviewer handoff. The old immutable candidate remains historical evidence.

## Handoff Discipline

- Generate the package.
- Verify checksums.
- Send only the reviewed package and listed scope documents.
- Freeze unrelated changes during review.
- Track every finding by severity and finding ID.
- Publish responses only after maintainer review.
- Update release package evidence after every remediation branch.

## Scope Discipline During Audit

During audit response:

- avoid unrelated refactors;
- avoid public claim changes unrelated to the finding;
- do not modify V1 deployed semantics;
- do not promote V2 to canonical;
- do not add sale, value, investment, mainnet, or active-benefit language;
- do not introduce new dependencies unless required for the finding and reviewed.
