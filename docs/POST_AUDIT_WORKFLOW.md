# Post-Review Workflow

Status: process design for a future external independent review. No external independent audit has started.

```text
finding -> triage -> scoped fix -> regression test -> independent retest -> public response -> updated evidence package
```

1. **Finding:** record reviewer ID, severity, affected commit and private disclosure timestamp.
2. **Triage:** accept, dispute with evidence, or request clarification. Never silently suppress a finding.
3. **Scoped fix:** use a dedicated remediation branch and avoid unrelated scope changes.
4. **Regression test:** reproduce the failure first where feasible, then prove the remediation.
5. **Independent retest:** provide the exact fix commit and rebuilt checksums to the reviewer.
6. **Public response:** publish only after reviewer, security and communications review; identify open and accepted risks.
7. **Updated evidence package:** generate a new package and checksum set. The old package remains historical evidence.

Any contract change resets the V2 freeze commit and requires scope and checksum updates. A report does not promote V2, approve mainnet or activate hospitality operations.
