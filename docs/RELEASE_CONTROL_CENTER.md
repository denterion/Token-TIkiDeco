# Release Control Center

The Release Control Center is the maintainer entry point for checking what TikiDeco can safely do next.

It is not a token sale, value statement, mainnet approval, live utility approval, V2 promotion, legal opinion, or independent audit claim.

## Why This Exists

The repository now has several good but separate safety systems:

- public claims checks;
- value-claim checks;
- v0.2 release-candidate checks;
- utility-pilot live blockers;
- mainnet/value readiness gates;
- roadmap and release-gate documents;
- V1 canonical deployment facts;
- V2 candidate audit-preparation docs.

The Control Center gives maintainers one command that summarizes the current state and points to the next safe action.

## Commands

Generate a status report:

```bash
npm run project:control
```

Generate a status report and run the fast release-management safety gates:

```bash
npm run project:control:verify
```

Get machine-readable output:

```bash
node scripts/project-control-center.cjs --json
```

Fail if any control-center blocker is detected:

```bash
node scripts/project-control-center.cjs --fail-on-blockers
```

## What The Control Center Checks

The script reads:

- `deployments/canonical.json`;
- `docs/releases/v0.2.0-utility-pilot-rc.1.md`;
- `docs/NEXT_RELEASE_GATES.md`;
- `config/utility-pilot/live-readiness-gates.json`;
- `config/utility-pilot/tide-community-preview-001.json`;
- `package.json`;
- current Git branch and commit.

It reports:

- current commit and branch;
- canonical network and contract version;
- independent audit and mainnet approval status;
- whether the v0.2 RC evidence commit matches current `HEAD`;
- whether the local review-bundle path exists;
- live-pilot gate counts;
- linked tracking issues;
- roadmap Gate 3 and Gate 4 checkbox status;
- immediate blockers;
- next maintainer actions.

## Expected Current State

For the current public-preview cycle, the healthy state is conservative:

- canonical deployment remains `v1-legacy` on Ethereum Sepolia;
- V2 remains candidate code only;
- independent audit is `not-started`;
- mainnet is not approved;
- utility pilot campaign remains `draft-not-live`;
- `npm run pilot:live:blocked` passes;
- `node scripts/check-mainnet-readiness.cjs --expect-blocked` passes.

If the Control Center says the v0.2 RC evidence is stale, the release manager should regenerate the review package on the current final `main` commit before attaching or announcing a release candidate.

## Current Follow-Up Pattern

After each merge that affects release docs, site, tests, gates, audit package, or public facts:

1. Run `npm run project:control`.
2. If the evidence commit is stale, run:

   ```bash
   npm run release -- --commit <current-main-sha> --release v0.2.0-utility-pilot
   ```

3. Update the RC evidence hashes and transparency report if a new release package is intended.
4. Run `npm run project:control:verify`.
5. Keep `npm run pilot:live:blocked` green until real approvals exist.

## Public Boundaries

The Control Center must never be used to imply these prohibited public claims:

- no token sale or presale approval;
- no stated monetary value approval;
- no mainnet deployment approval;
- no active guest benefits approval;
- no hotel ownership claim;
- no revenue rights claim;
- no V2 canonical deployment approval;
- no completed independent audit claim.
