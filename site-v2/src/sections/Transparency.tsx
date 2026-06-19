import { GlassCard } from "../components/GlassCard";
import { transparencyCards } from "../data/projectFacts";

export function Transparency() {
  return (
    <section id="transparency" className="section" aria-labelledby="transparency-heading">
      <div className="section-heading">
        <p className="eyebrow">Transparency</p>
        <h2 id="transparency-heading">Public verification surfaces, not transaction flows.</h2>
        <p>
          The site points viewers to contracts, Safe control, report hashes, claims rules, and security documentation without connecting a wallet.
        </p>
      </div>
      <div className="card-grid">
        {transparencyCards.map((card) => (
          <GlassCard key={card.title} title={card.title} body={card.body} href={card.href} />
        ))}
      </div>
    </section>
  );
}
