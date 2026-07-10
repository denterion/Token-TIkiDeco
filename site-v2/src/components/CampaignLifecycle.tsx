import campaign from "../../../config/utility-pilot/tide-community-preview-001.json";
import lifecycleSchema from "../../../config/utility-pilot/campaign-lifecycle.schema.json";

const labels: Record<string, string> = {
  draft: "Draft",
  "evidence-review": "Evidence review",
  "approved-testnet-preview": "Approved testnet preview",
  paused: "Paused",
  closed: "Closed",
  archived: "Archived"
};

export function CampaignLifecycle() {
  const stages = lifecycleSchema.properties.currentStage.enum;

  return (
    <section className="section lifecycle-section" aria-labelledby="campaign-lifecycle-title">
      <div className="section-heading">
        <p className="eyebrow">Campaign lifecycle</p>
        <h2 id="campaign-lifecycle-title">Evidence before preview.</h2>
        <p>
          The campaign is at <strong>{campaign.lifecycle.currentStage}</strong>. Approval for a testnet preview remains
          blocked until every configured reviewer gate has evidence and approval metadata.
        </p>
      </div>
      <ol className="lifecycle-track" aria-label="Public preview campaign stages">
        {stages.map((stage, index) => {
          const current = stage === campaign.lifecycle.currentStage;
          const blocked = stage === "approved-testnet-preview";
          return (
            <li key={stage} className={current ? "is-current" : blocked ? "is-blocked" : "is-future"}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{labels[stage]}</strong>
              <small>{current ? "Current" : blocked ? "Blocked" : "Not reached"}</small>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
