type StatusCopy = {
  eyebrow: string;
  title: string;
  body: string;
  labels: Record<string, string>;
  helper: string;
};

type StatusRow = {
  key: string;
  value: string | number;
};

export function ProjectStatus({ copy, rows }: { copy: StatusCopy; rows: readonly StatusRow[] }) {
  return (
    <section id="status" className="section status-section" aria-labelledby="status-heading">
      <div className="section-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="status-heading">{copy.title}</h2>
        <p>{copy.body}</p>
        <p className="section-helper">{copy.helper}</p>
      </div>
      <dl className="status-panel">
        {rows.map(({ key, value }) => (
          <div key={key}>
            <dt>{copy.labels[key] ?? key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
