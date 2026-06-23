type BeachCopy = {
  eyebrow: string;
  title: string;
  body: string;
};

export function BeachTech({ copy }: { copy: BeachCopy }) {
  return (
    <section className="section beach-tech" aria-labelledby="beach-tech-heading">
      <div className="coastline-visual" aria-hidden="true">
        <span className="coastline-line line-one" />
        <span className="coastline-line line-two" />
        <span className="coastline-line line-three" />
        <span className="signal-node node-one" />
        <span className="signal-node node-two" />
        <span className="signal-node node-three" />
        <span className="signal-beam beam-one" />
        <span className="signal-beam beam-two" />
      </div>
      <div className="section-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="beach-tech-heading">{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
    </section>
  );
}
