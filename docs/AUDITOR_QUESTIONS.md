# Auditor Questions

Status: questions for external V2 candidate review. This is not an audit report and not audit completion.

Please treat V2 as candidate code only. Do not treat V2 as canonical deployment, mainnet-ready, value-bearing, or independently audited.

The supplied role manifest is a non-deployed template: addresses are not assigned and on-chain assertions are incomplete. Evaluate the role model and fail-closed deployment guardrails; deployment readiness is out of scope.

## Focus Areas

1. Is `AccessControlDefaultAdminRules` used correctly for the intended Safe/governance model, including admin delay and role transfer assumptions?
2. Is role separation sufficient between default admin, pauser, reporter, vesting admin, and treasury?
3. What are the risks if `PAUSER_ROLE` is compromised or unavailable?
4. What are the risks if `REPORTER_ROLE` is compromised or publishes misleading report metadata?
5. Does treasury custody remain clear and separate from admin authority in both token and vesting vault?
6. Can vesting liabilities ever exceed vault token balance under valid operation sequences?
7. Is `revoke` accounting correct before cliff, during vesting, after full vesting, and after partial releases?
8. Are report metadata bounds, period fields, version fields, and supersede events sufficient for public transparency?
9. Are `projectURI` and public metadata update semantics safe enough for long-term public claims hygiene?
10. Is token-level pause as the only vesting release circuit breaker acceptable, or should the vault include a local pause role?
11. Can role misconfiguration occur through constructor inputs or deployment scripts despite the current public-network guardrails?
12. Do deployment script guardrails fail closed on public networks and prove no unintended deployer role remains?
13. Are accepted Slither baseline findings reasonable, or should any be remediated before audit freeze?
14. Are Foundry invariants broad enough for total supply, role gating, liabilities, release, revoke, treasury transfer, and arbitrary operation sequences?
15. Is the V2 audit package complete enough for reproducible review, including checksums, known issues, Slither baseline, Foundry references, and exact freeze/evidence commits?
16. Are any public docs likely to confuse V2 candidate status with canonical deployment status?

## Requested Output

For every finding, please include:

- severity;
- affected file and line;
- attack or failure scenario;
- impact;
- likelihood;
- recommended remediation;
- test or invariant that should prove remediation.

Please identify any finding that requires public-communications or release-package updates before publication.
