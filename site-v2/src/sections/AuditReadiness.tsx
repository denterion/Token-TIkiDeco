type AuditCopy = {
  eyebrow: string;
  title: string;
  body: string;
  readiness: readonly (readonly [string, string])[];
};

export function AuditReadiness({ copy }: { copy: AuditCopy }) {
  return (
    <section id="audit" className="section audit-section" aria-labelledby="audit-heading">
      <div className="section-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="audit-heading">{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <div className="readiness-grid">
        {copy.readiness.map(([label, value]) => (
          <article className="readiness-item" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
