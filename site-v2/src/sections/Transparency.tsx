import { GlassCard } from "../components/GlassCard";

type TransparencyCopy = {
  eyebrow: string;
  title: string;
  body: string;
  cards: readonly Array<{
    title: string;
    body: string;
    href?: string;
  }>;
};

export function Transparency({ copy }: { copy: TransparencyCopy }) {
  return (
    <section id="transparency" className="section" aria-labelledby="transparency-heading">
      <div className="section-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="transparency-heading">{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <div className="card-grid">
        {copy.cards.map((card) => (
          <GlassCard key={card.title} title={card.title} body={card.body} href={card.href} />
        ))}
      </div>
    </section>
  );
}
