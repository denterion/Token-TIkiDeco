type BriefCopy = {
  eyebrow: string;
  title: string;
  body: string;
  items: readonly {
    step: string;
    title: string;
    body: string;
  }[];
};

export function OneMinuteBrief({ copy }: { copy: BriefCopy }) {
  return (
    <section id="about" className="section brief-section" aria-labelledby="brief-title">
      <div className="section-heading brief-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="brief-title">{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <ol className="brief-grid">
        {copy.items.map((item) => (
          <li key={item.step}>
            <span aria-hidden="true">{item.step}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
