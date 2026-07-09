# TikiDeco X Integration Plan

Status: prepared, not connected.

This plan covers compliant X posting for TikiDeco public updates. It does not approve sale, token value, exchange listing, mainnet launch, independent audit completion, hotel partnership, active hotel benefit, or completed-property claims.

## Recommended Connection Path

Use the official X API or a compliant scheduler. Do not use browser automation, IP spoofing, fake accounts, credential sharing, or rate-limit workarounds.

Preferred path:

1. Create or use a dedicated X account for TikiDeco.
2. Apply for an X Developer account and create a Developer App.
3. Configure user-context auth for the account that will publish posts.
4. Store the user access token locally as `TIKIDECO_X_USER_ACCESS_TOKEN`.
5. Use `npm run x:update:dry-run` first.
6. Publish only after `npm run claims:check` passes.

The X API create-post endpoint is `POST /2/tweets`. It requires an authenticated user token for publishing on behalf of the account.

## Environment Variables

Do not paste secrets into chat or commit them to the repository.

```powershell
$token = Read-Host "X user access token" -AsSecureString
$plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
)
[Environment]::SetEnvironmentVariable("TIKIDECO_X_USER_ACCESS_TOKEN", $plain, "User")
```

Optional:

```powershell
[Environment]::SetEnvironmentVariable("TIKIDECO_X_DRY_RUN", "1", "User")
```

## Local Commands

Preview the next X post:

```bash
npm run x:update:dry-run
```

Publish the next X post after the claims gate passes:

```bash
npm run x:update
```

By default, the X update command attaches this safe visual when the file exists:

```text
docs/community/assets/tikideco-x-roadmap-status.png
```

Theme override:

```bash
node scripts/publish-x-update.cjs --theme build --dry-run
node scripts/publish-x-update.cjs --theme transparency --dry-run
node scripts/publish-x-update.cjs --theme community --dry-run
node scripts/publish-x-update.cjs --theme roadmap --dry-run
```

## Content Rules For X

X posts should be shorter and narrower than Telegram posts.

Use:

- one idea per post;
- one link at most;
- one safe visual when available;
- current / planned / conceptual separation when needed;
- verifiable facts from `docs/PROJECT_FACTS.md`;
- calm build-in-public tone.

Avoid:

- sale, presale, buy, pump, listing, value, price, yield, investment, profit;
- "audited" unless an independent audit report exists;
- partner/property/active-benefit claims unless `docs/PROJECT_FACTS.md` verifies them;
- repeated near-identical posts;
- aggressive following, replies, or direct messages.

## Starter X Themes

### Build

```text
TikiDeco / TIDE is being built as a public Sepolia testnet prototype.

Focus now: verifiable contracts, clear project facts, Safe-controlled operations, and careful public communication.

No sale. No mainnet. No stated monetary value.
https://tikideco.xyz/
```

### Transparency

```text
TikiDeco public updates are source-backed:

- Sepolia deployment manifest
- verified token and vault source
- public project facts
- claims matrix
- transparency reports

Current status is tracked here:
https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PROJECT_FACTS.md
```

### Plain Language

```text
Plain-English version:

TikiDeco / TIDE is a testnet prototype for exploring transparent hotel-related loyalty and access ideas.

It is not a sale, not a mainnet token, and not a promise of profit or hotel benefits.
```

## IP And Access Policy

Do not simulate, spoof, rotate, or hide IP addresses to avoid platform rules, rate limits, account checks, geofencing, or abuse controls.

Acceptable options:

- official X API;
- approved scheduling tools;
- normal account login by the account owner;
- stable infrastructure that does not misrepresent identity or bypass limits.

## Rollout Plan

1. Keep dry-run only until X credentials are available.
2. Publish 2-3 posts per week after `claims:check`.
3. Reuse Telegram themes, but shorten each post to one point.
4. Add a monthly public report thread after the monthly report exists.
5. Review analytics manually at first; avoid automated scraping unless it is within the approved X API use case.
