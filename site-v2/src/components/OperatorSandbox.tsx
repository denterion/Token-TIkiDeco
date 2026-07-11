import { useEffect, useMemo, useRef, useState } from "react";
import {
  OperatorSandbox as SandboxModel,
  fakeCampaignTemplates,
  type CampaignLifecycleState,
  type OperatorSandboxSnapshot
} from "../lib/operator/operatorSandbox";

const lifecycle: readonly CampaignLifecycleState[] = [
  "draft",
  "review",
  "approved-for-simulation",
  "active-simulation",
  "paused",
  "closed",
  "archived"
];

async function sha256(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(`${JSON.stringify(value, null, 2)}\n`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function OperatorSandboxPage() {
  const model = useRef<SandboxModel>();
  const [templateId, setTemplateId] = useState(fakeCampaignTemplates[0].templateId);
  const [snapshot, setSnapshot] = useState<OperatorSandboxSnapshot>({ auditEvents: 0 });
  const [pending, setPending] = useState<{ requestId: string; eligible: boolean }>();
  const [message, setMessage] = useState("Choose a template and create a fake campaign.");
  const [reportHash, setReportHash] = useState("");
  const template = useMemo(() => fakeCampaignTemplates.find((item) => item.templateId === templateId)!, [templateId]);
  const state = snapshot.campaign?.state;

  useEffect(() => {
    if (snapshot.report && ["closed", "archived"].includes(snapshot.report.state)) {
      void sha256(snapshot.report).then(setReportHash);
    } else {
      setReportHash("");
    }
  }, [snapshot.report]);

  function refresh(note: string) {
    setSnapshot(model.current?.snapshot() ?? { auditEvents: 0 });
    setMessage(note);
  }

  function run(action: () => void, success: string) {
    try {
      action();
      refresh(success);
    } catch (error) {
      refresh(error instanceof Error ? error.message : "The simulation step failed.");
    }
  }

  function createCampaign() {
    const next = new SandboxModel();
    next.createCampaign(template);
    next.setInventory(template.inventoryLimit);
    model.current = next;
    setPending(undefined);
    refresh("Fake campaign created with limited mock inventory.");
  }

  function reviewMockRequest(eligible: boolean) {
    const requestId = eligible ? "fake-ui-eligible" : "fake-ui-ineligible";
    const walletAddress = eligible
      ? "0x0000000000000000000000000000000000000011"
      : "0x0000000000000000000000000000000000000012";
    run(() => {
      model.current!.reviewEligibility({
        requestId,
        campaignId: snapshot.campaign!.campaignId,
        walletAddress,
        chainId: 11155111,
        balanceBaseUnits: eligible ? snapshot.campaign!.minimumBalanceBaseUnits : 0n,
        requestedAt: "2030-01-01T01:00:00.000Z"
      });
      setPending({ requestId, eligible });
    }, eligible ? "Mock request meets the configured rule." : "Mock request is below the configured rule.");
  }

  function decide(decision: "approve" | "reject") {
    if (!pending) return;
    run(() => {
      model.current!.decide(pending.requestId, decision, decision === "approve" ? "fake-eligible" : "fake-not-selected");
      setPending(undefined);
    }, `Mock request ${decision === "approve" ? "approved" : "rejected"}.`);
  }

  return (
    <div className="operator-route">
      <section className="section operator-intro" aria-labelledby="operator-sandbox-title">
        <p className="eyebrow">Operator workflow prototype</p>
        <h1 id="operator-sandbox-title">Run a loyalty campaign without touching real operations.</h1>
        <p className="operator-lead">
          A ten-minute local demonstration of controlled inventory, mock eligibility review, staff decisions, and aggregate reporting.
        </p>
        <div className="operator-boundaries" aria-label="Sandbox boundaries">
          {[
            "Local demonstration",
            "Fake data",
            "Sepolia-only rules",
            "No active hospitality service",
            "No real benefit",
            "No transaction broadcasting"
          ].map((label) => <span key={label}>{label}</span>)}
        </div>
        <a className="button button-secondary" href="/operator-sandbox/why/">Why would an operator use this?</a>
      </section>

      <section className="section operator-workspace" aria-labelledby="operator-workspace-title">
        <div className="section-heading">
          <p className="eyebrow">Guided simulation</p>
          <h2 id="operator-workspace-title">Campaign control desk</h2>
          <p>Every action stays in this browser tab. Refreshing clears the demonstration.</p>
        </div>

        <div className="operator-layout">
          <aside className="operator-setup" aria-label="Fake campaign setup">
            <label className="field-label" htmlFor="operator-template">Campaign template</label>
            <select
              id="operator-template"
              className="text-field"
              value={templateId}
              disabled={Boolean(snapshot.campaign)}
              onChange={(event) => setTemplateId(event.target.value)}
            >
              {fakeCampaignTemplates.map((item) => <option key={item.templateId} value={item.templateId}>{item.name}</option>)}
            </select>
            <dl className="operator-rule-list">
              <div><dt>Operator status</dt><dd>Fake operator for simulation</dd></div>
              <div><dt>Eligibility</dt><dd>{template.eligibilityRule}</dd></div>
              <div><dt>Mock inventory</dt><dd>{template.inventoryLimit}</dd></div>
              <div><dt>Window</dt><dd>1-2 January 2030 fixture</dd></div>
              <div><dt>Support</dt><dd>{template.supportOwnerPlaceholder}</dd></div>
              <div><dt>Legal / privacy</dt><dd>Reviewed for simulation only</dd></div>
            </dl>
            {!snapshot.campaign ? (
              <button className="button button-primary" type="button" onClick={createCampaign}>Create fake campaign</button>
            ) : (
              <button className="button button-ghost" type="button" onClick={() => window.location.reload()}>Reset local demo</button>
            )}
          </aside>

          <div className="operator-console">
            <ol className="operator-lifecycle" aria-label="Campaign simulation lifecycle">
              {lifecycle.map((item, index) => (
                <li key={item} className={item === state ? "is-current" : lifecycle.indexOf(state ?? "draft") > index ? "is-complete" : ""}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.replace(/-/g, " ")}</strong>
                </li>
              ))}
            </ol>

            <div className="operator-message" role="status" aria-live="polite">{message}</div>

            <div className="operator-actions" aria-label="Simulation actions">
              {state === "draft" ? <button type="button" className="button button-primary" onClick={() => run(() => model.current!.submitForReview(), "Campaign moved to review.")}>Submit for simulation review</button> : null}
              {state === "review" ? <button type="button" className="button button-primary" onClick={() => run(() => model.current!.approveForSimulation(), "All local simulation gates passed.")}>Approve simulation</button> : null}
              {state === "approved-for-simulation" ? <button type="button" className="button button-primary" onClick={() => run(() => model.current!.activateSimulation(), "Simulation is active with fake data only.")}>Start simulation</button> : null}
              {state === "active-simulation" && !pending ? (
                <>
                  <button type="button" className="button button-secondary" onClick={() => reviewMockRequest(true)}>Review eligible mock request</button>
                  <button type="button" className="button button-secondary" onClick={() => reviewMockRequest(false)}>Review ineligible mock request</button>
                  <button type="button" className="button button-ghost" onClick={() => run(() => model.current!.closeCampaign(), "Campaign closed; aggregate report is ready.")}>Close campaign</button>
                </>
              ) : null}
              {state === "active-simulation" && pending ? (
                <>
                  {pending.eligible ? <button type="button" className="button button-primary" onClick={() => decide("approve")}>Approve mock request</button> : null}
                  <button type="button" className="button button-secondary" onClick={() => decide("reject")}>Reject mock request</button>
                </>
              ) : null}
              {state === "closed" ? <button type="button" className="button button-secondary" onClick={() => run(() => model.current!.archiveCampaign(), "Campaign archived locally.")}>Archive simulation</button> : null}
            </div>

            {snapshot.report ? (
              <div className="operator-report" aria-labelledby="operator-report-title">
                <h3 id="operator-report-title">Aggregate transparency report</h3>
                <dl>
                  <div><dt>Campaign ID</dt><dd>{snapshot.report.campaignId}</dd></div>
                  <div><dt>Requests</dt><dd>{snapshot.report.requests}</dd></div>
                  <div><dt>Eligible</dt><dd>{snapshot.report.eligible}</dd></div>
                  <div><dt>Approved</dt><dd>{snapshot.report.approved}</dd></div>
                  <div><dt>Rejected</dt><dd>{snapshot.report.rejected}</dd></div>
                  <div><dt>Inventory used</dt><dd>{snapshot.report.inventoryUsed} / {snapshot.report.inventoryLimit}</dd></div>
                  <div><dt>Errors</dt><dd>{snapshot.report.errors}</dd></div>
                  <div><dt>Disputes</dt><dd>{snapshot.report.disputes}</dd></div>
                  <div><dt>Stop events</dt><dd>{snapshot.report.stopEvents}</dd></div>
                </dl>
                <p>{snapshot.report.privacyStatement}</p>
                <p className="operator-hash"><strong>SHA-256</strong> {reportHash || "Generated after campaign close"}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

export function WhyOperatorPage() {
  const reasons = [
    ["Transparent campaign rules", "Teams can review one dated rule set before staff begin a limited simulation."],
    ["Controlled inventory", "Capacity is explicit, approvals cannot exceed it, and a closed campaign cannot accept further decisions."],
    ["Loyalty eligibility", "A read-only Sepolia signal can be evaluated without turning the workflow into checkout or booking infrastructure."],
    ["Public reporting", "Aggregate outcomes and a document hash can be published without exposing raw wallet or guest records."],
    ["Repeatable operations", "The same create, review, decide, close, and report sequence can be tested by different staff."],
    ["Private data stays off-chain", "Guest identity, booking details, payment information, and support records are outside this demonstration."]
  ];
  return (
    <div className="operator-route">
      <section className="section operator-intro" aria-labelledby="operator-why-title">
        <p className="eyebrow">Hospitality operations</p>
        <h1 id="operator-why-title">Why would a hospitality operator test this?</h1>
        <p className="operator-lead">To make small loyalty campaigns easier to review, limit, operate, and explain without exposing guest data on-chain.</p>
        <div className="operator-boundaries" aria-label="Page boundaries">
          <span>Concept workflow</span><span>No real operator</span><span>No active hospitality service</span><span>No real benefit</span>
        </div>
        <a className="button button-primary" href="/operator-sandbox/">Open local demonstration</a>
      </section>
      <section className="section" aria-labelledby="operator-reasons-title">
        <div className="section-heading">
          <p className="eyebrow">Operational value</p>
          <h2 id="operator-reasons-title">A controlled process, not blockchain theatre.</h2>
        </div>
        <div className="operator-reasons">
          {reasons.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}
        </div>
        <p className="privacy-note">Local demonstration, fake data, no transaction broadcasting, no payments, and no production integration.</p>
      </section>
    </div>
  );
}
