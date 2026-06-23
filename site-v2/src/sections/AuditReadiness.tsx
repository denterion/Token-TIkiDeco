const readiness = [
  ["Internal security review", "Available as internal review material"],
  ["Independent audit", "Not started"],
  ["V2 contracts", "Candidate review code"],
  ["V1", "Legacy canonical Sepolia deployment"],
  ["Known limitations", "Published"],
  ["Public claims", "Restricted by claims matrix"]
] as const;

export function AuditReadiness() {
  return (
    <section id="audit" className="section audit-section" aria-labelledby="audit-heading">
      <div className="section-heading">
        <p className="eyebrow">Audit Readiness</p>
        <h2 id="audit-heading">Prepared for review, not represented as completed review.</h2>
        <p>
          Internal review is repository-maintained material. It is not an independent audit and does not make the prototype production ready.
        </p>
      </div>
      <div className="readiness-grid">
        {readiness.map(([label, value]) => (
          <article className="readiness-item" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
