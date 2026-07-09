# TikiDeco Automation Development Plan

Status: internal execution plan for maintainer-operated project workflows.

This plan does not approve mainnet, token sale, value claims, active utility, independent audit claims, hotel partnerships, or completed-property claims.

## Current Automation Stack

- Daily internal status: `npm run project:status`
- Weekly steering report: `npm run project:weekly`
- Guarded Telegram update: `npm run telegram:update`
- Guarded X dry-run / future update: `npm run x:update:dry-run`, then `npm run x:update` after credentials are approved
- Telegram channel: `@tokenTikiDeco`
- Public claims source of truth: `docs/PROJECT_FACTS.md`
- Release gates source: `docs/NEXT_RELEASE_GATES.md`
- Known risk source: `KNOWN_ISSUES.md`

## Operating Model

1. Daily status checks create an internal report.
2. Weekly steering summarizes status, risks, and next actions.
3. Telegram posts are allowed only after the claims gate passes.
4. Release packaging remains a clean-tree operation, not a daily automation.
5. Any public copy must be backed by `docs/PROJECT_FACTS.md`.

## Phase 1: Stabilize The Autopilot

Goal: make routine project operation reliable and boring.

- Keep `project:status` green.
- Keep outbox and test runtime artifacts out of git noise.
- Add weekly steering automation.
- Review daily and weekly reports before any higher-risk public update.
- Keep mainnet/value readiness intentionally blocked until formal gates change.

Acceptance:

- `npm run project:status` writes a readable report.
- `npm run project:weekly` writes a readable steering report.
- Telegram automation uses guarded update command.
- Daily automation never publishes publicly.

## Phase 2: Turn Reports Into Action

Goal: make reports generate small execution tasks.

- Add a triage section that maps failing gates to exact files.
- Add a next-task queue with one small PR-sized recommendation.
- Add labels for task type: docs, site, contracts, tests, security, communications.
- Add a weekly maintainer task brief for the top safe task.

Acceptance:

- Weekly report contains exactly one recommended next PR.
- Recommended task links to source files and acceptance checks.
- No task suggests unsupported public claims or token-economics changes.

## Phase 3: Public Communications Expansion

Goal: grow public communication without increasing claims risk.

- Keep Telegram as the primary automated channel.
- Add X/Twitter only through approved API credentials or a scheduling tool.
- Keep X posts shorter than Telegram and one-idea-per-post.
- Add visual asset queue for safe diagrams, screenshots, and non-claim imagery.
- Do not use IP spoofing, account farms, browser automation, or rate-limit workarounds.

Acceptance:

- X integration has a dry-run mode.
- No post publishes unless `claims:check` passes.
- Public posts avoid sale, value, listing, audit, partner, mainnet, and active-benefit claims.

## Phase 4: Release And Audit Readiness

Goal: make release evidence reproducible from a clean tree.

- Run release package only after changes are committed or stashed.
- Keep Slither baseline and Foundry evidence current.
- Keep V2 as candidate code until explicit manifest promotion.
- Maintain counsel and audit intake packages as review material, not claims.

Acceptance:

- Clean-tree release package succeeds.
- V2 known issues are classified.
- Independent audit status remains accurate.
- Mainnet gate stays blocked until approvals are complete.

## Phase 5: Community Preview Operations

Goal: collect useful feedback without turning the project into a sale or benefit promise.

- Route feedback to docs/site/security/translation/utility categories.
- Summarize feedback weekly.
- Keep utility pilot status as draft/not-live until all approvals are complete.
- Publish monthly transparency summaries only from verified facts.

Acceptance:

- Feedback summaries separate current, planned, conceptual, and not-claimable items.
- No wallet transaction signing or payment flow is introduced.
- Public responses follow `docs/COMMUNICATION_PLAYBOOK.md`.
