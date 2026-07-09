# Read-Only Sepolia Balance Check

Status: implemented for the static v0.2 utility-pilot pre-release. The campaign remains `draft-not-live`.

This flow reads the canonical Sepolia TIDE token balance for a manually entered wallet address. It does not connect a wallet, sign transactions, request approvals, transfer tokens, collect fees, create a booking, or confirm a live benefit.

## Source Of Truth

- Canonical token address: `deployments/canonical.json`
- Site data wrapper: `site-v2/src/data/projectFacts.ts`
- Campaign rules: `config/utility-pilot/tide-community-preview-001.json`
- Balance reader: `site-v2/src/lib/eligibility/readOnlyBalance.ts`
- UI card: `site-v2/src/components/PilotEligibilityCard.tsx`

## Flow

1. User manually enters a wallet address.
2. The UI validates Ethereum address format.
3. The balance reader checks Sepolia chain ID through allowlisted RPC endpoints.
4. The balance reader calls `balanceOf(wallet)` on the canonical TIDE token.
5. RPC calls use `Promise.allSettled` so one failed endpoint does not block every other endpoint.
6. The UI displays `Live`, `Cached`, `Stale`, `Wrong Chain`, or `Unavailable`.
7. If RPC data is unavailable, the UI must not invent a zero balance.

## Data States

- `live`: at least one allowlisted endpoint returned Sepolia chain ID and balance data.
- `cached`: a recent successful balance read exists in browser memory.
- `stale`: the last successful read exists but is older than the freshness window.
- `wrong-chain`: an endpoint returned a chain ID other than Ethereum Sepolia.
- `unavailable`: every endpoint failed and no cached value can be used.

## Pilot Boundary

The campaign manifest is `draft-not-live`. A sufficient testnet TIDE balance does not create:

- a live hospitality benefit;
- a booking;
- a payment right;
- a cash value;
- a resale right;
- a transfer of guest rights;
- no hotel ownership;
- revenue rights.

Any published pilot campaign still requires legal, privacy, security, operations, and governance approvals, plus a snapshot block or approved live-check window, request window, inventory limits, and allocation report path.

## Test Fixture Boundary

The codebase may keep a deterministic `testPilotCampaignFixture` for unit tests. Production UI must use the campaign manifest-backed `pilotCampaignRules`, not a hardcoded eligible wallet or mock-only address.
