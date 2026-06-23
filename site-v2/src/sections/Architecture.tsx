type ArchitectureCopy = {
  eyebrow: string;
  title: string;
  body: string;
  aria: string;
  nodes: readonly string[];
};

export function Architecture({ copy }: { copy: ArchitectureCopy }) {
  return (
    <section id="architecture" className="section architecture-section" aria-labelledby="architecture-heading">
      <div className="section-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="architecture-heading">{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <div className="architecture-map" role="list" aria-label={copy.aria}>
        {copy.nodes.map((node, index) => (
          <div className="architecture-node" role="listitem" key={node}>
            <span className="node-index">{String(index + 1).padStart(2, "0")}</span>
            <span>{node}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
