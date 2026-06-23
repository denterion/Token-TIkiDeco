export function Architecture() {
  const nodes = ["User / Public Viewer", "Read-only Website", "Sepolia RPC", "Token Contract", "Vesting Vault", "Safe", "Public Reports"];

  return (
    <section id="architecture" className="section architecture-section" aria-labelledby="architecture-heading">
      <div className="section-heading">
        <p className="eyebrow">Architecture</p>
        <h2 id="architecture-heading">A read-only path from public viewer to Sepolia records.</h2>
        <p>
          The interface is designed for observation. It does not request signatures and does not submit transactions.
        </p>
      </div>
      <div className="architecture-map" role="list" aria-label="Read-only architecture flow">
        {nodes.map((node, index) => (
          <div className="architecture-node" role="listitem" key={node}>
            <span className="node-index">{String(index + 1).padStart(2, "0")}</span>
            <span>{node}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
