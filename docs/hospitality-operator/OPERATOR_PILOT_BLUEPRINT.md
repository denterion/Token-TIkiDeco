# Hospitality Operator Pilot Blueprint

Status: future operating design, blocked and not live. No operator, property, inventory, partnership or active guest benefit is established by this document.

## Limited Use Case

`Sepolia TIDE eligibility -> conditional access to an early RSVP request window`

The token balance is only a test eligibility signal. A future early window would not guarantee a reservation, admission, inventory or non-cash item. It would remain limited, cancellable, subject to rules and reviewed off-chain by an identified operator.

## Current Facts

| Area | State |
| --- | --- |
| Participating operator | Not established or publicly verified |
| Property | Not established |
| Available inventory | `0` |
| Campaign | Local sandbox only |
| User terms | Not approved |
| Privacy review | Not approved |
| Support owner | Not assigned |
| Independent audit where required | Not completed |

## Staff Workflow

1. Create a mock campaign with an opaque campaign ID and zero public inventory.
2. Configure a Sepolia-only eligibility rule and a reviewed maximum inventory.
3. Receive a test eligibility request containing only the minimum wallet and campaign facts.
4. Record the balance-check result; do not copy guest, booking or payment data.
5. Approve or reject a mock request with a reason code.
6. If a separate booking system ever exists, exchange only a one-way reservation-reference hash.
7. Close the campaign and publish an aggregate privacy-safe report.

## PMS / CRM Touchpoints

No PMS or CRM integration exists. A future adapter may exchange only an opaque reservation-reference hash, status and timestamp. Names, email addresses, phone numbers, stay details, payment details and room data must remain outside chain records and outside the public report.

## Inventory And Availability

- Inventory begins at zero and cannot become public until the operator, policy and reviewer gates are approved.
- Every future unit must have an owner, validity window, blackout conditions and cancellation rule.
- Eligibility is not a guarantee. Staff may reject invalid, duplicate, abusive or out-of-window requests.

## Terms, Privacy And Support

- User terms must identify the actual operator, limits, cancellation and dispute route.
- Privacy review is required before any collection beyond the minimum test wallet input.
- The public report is aggregate-only.
- A named operational support owner and escalation schedule are required before launch.

## Disputes And Cancellation

The operator records a reason code and review timestamp. A second reviewer handles disputes involving duplicates, eligibility disagreement or staff error. The campaign may be paused or closed if inventory is wrong, privacy boundaries fail, public claims become inaccurate, RPC state cannot be verified or support capacity is unavailable.

## Reporting

Aggregate output may include total requests, eligible/ineligible decisions, approvals/rejections, remaining inventory and known incidents. It excludes raw wallet addresses, reservation references and participant data.

## Readiness Gates

- legal entity verified;
- operator verified;
- benefit inventory approved;
- user terms approved;
- privacy approved;
- support owner assigned;
- independent audit completed where required;
- incident procedure tested.

All gates are currently `not-approved`. The sandbox does not change their state.

The demonstrable fake-data workflow is documented in [`OPERATOR_SANDBOX_DEMO.md`](OPERATOR_SANDBOX_DEMO.md). It is a local simulation and does not satisfy any readiness gate.
