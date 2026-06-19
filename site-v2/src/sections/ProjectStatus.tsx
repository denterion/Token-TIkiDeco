import { projectFacts } from "../data/projectFacts";

const rows = [
  ["Network", projectFacts.network],
  ["Chain ID", String(projectFacts.chainId)],
  ["Canonical version", projectFacts.canonicalVersion],
  ["Token supply", projectFacts.supply],
  ["Mainnet", projectFacts.mainnetStatus],
  ["Sale", projectFacts.saleStatus],
  ["Monetary value", projectFacts.monetaryValue],
  ["Audit", projectFacts.auditStatus]
] as const;

export function ProjectStatus() {
  return (
    <section id="status" className="section status-section" aria-labelledby="status-heading">
      <div className="section-heading">
        <p className="eyebrow">Project Status</p>
        <h2 id="status-heading">Current boundaries, shown before the visual story.</h2>
        <p>
          TIDE is an open-source Ethereum Sepolia testnet prototype. It is not offered for sale and has no stated monetary value.
        </p>
      </div>
      <dl className="status-panel">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
