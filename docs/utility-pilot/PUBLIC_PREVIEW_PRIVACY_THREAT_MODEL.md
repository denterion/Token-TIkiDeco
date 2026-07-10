# Public Preview Privacy Threat Model

Status: internal privacy preparation for a blocked Sepolia preview. Privacy review remains `not-approved`.

| Threat | Scenario | Current mitigation | Remaining action |
| --- | --- | --- | --- |
| Wallet-address correlation | A typed public address can be correlated with public chain history or external identity data. | The address is used only for the immediate read-only RPC call and in-memory cache; analytics receives no address. | Explain public-address exposure before any approved preview and review RPC policy. |
| RPC provider exposure | RPC endpoints receive the queried address and requester IP/network metadata. | Two allowlisted Sepolia RPC endpoints; no custom participant profile is sent. | Counsel/privacy reviewer must approve provider choice and disclosure. |
| Analytics exposure | A third-party analytics SDK could create identifiers or leak page behavior. | No analytics SDK, cookie, beacon, endpoint, or persistent identifier. Metrics are in-memory counters only. | Any future aggregation service requires a separate privacy review and data map. |
| Browser storage | localStorage, sessionStorage, IndexedDB, or cookies could retain addresses or behavior. | Preview metrics use none of these. Balance cache is memory-only and resets on reload. | Keep automated source checks blocking persistent storage. |
| Logs | Browser, hosting, proxy, or RPC logs may contain IP and request metadata. | The static site does not create application logs or a backend participant record. | Document hosting/RPC retention before approved preview. |
| Screenshots | A user may screenshot a typed wallet or balance result. | UI explains the public testnet nature; no name or booking information is shown. | Add reviewer guidance not to submit screenshots containing unwanted address data. |
| Accidental personal-data submission | A reviewer may paste names, email, booking details, secrets, or sensitive data into GitHub. | Issue forms display boundaries and do not request those fields. | Maintainers need a deletion/redaction and incident procedure for accidental submissions. |
| Abuse and spam | Repeated checks or issue submissions may distort aggregate metrics. | No persistent identifier; public issue moderation and aggregate-only reporting. | Define rate limits only if a backend is later introduced. |

## Data Flow

`browser input -> allowlisted Sepolia RPC -> balance result -> local explanation`

Separate feedback flow:

`reviewer -> GitHub issue form -> public non-sensitive feedback -> manual aggregate report`

No application backend, wallet-to-person mapping, guest profile, booking record, or address-level analytics dataset exists in this preview implementation.
