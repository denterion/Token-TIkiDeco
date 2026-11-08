import { GlassCard } from "../components/GlassCard";
import { useRef } from "react";
import { isRussian } from '../lib/locale';

type TransparencyCopy = {
  eyebrow: string;
  title: string;
  body: string;
  cards: ReadonlyArray<{
    title: string;
    body: string;
    href?: string;
  }>;
};

export function Transparency({ copy }: { copy: TransparencyCopy }) {
  const track = useRef<HTMLDivElement>(null);
  function move(direction: number) {
    const node = track.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.85, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  return (
    <section id="transparency" className="section" aria-labelledby="transparency-heading">
      <div className="section-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="transparency-heading">{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <div className="explore-controls" aria-label={isRussian ? 'Выбор темы' : 'Explore navigation'}>
        <button type="button" onClick={() => move(-1)} aria-label={isRussian ? 'Предыдущие темы' : 'Previous topics'}>←</button>
        <button type="button" onClick={() => move(1)} aria-label={isRussian ? 'Следующие темы' : 'Next topics'}>→</button>
      </div>
      <div className="card-grid explore-track" ref={track} tabIndex={0} role="region" aria-label={isRussian ? 'Темы для знакомства' : 'Explore topics'} onKeyDown={(event) => {
        if (event.target === event.currentTarget && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
          event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}>
        {copy.cards.map((card) => (
          <GlassCard key={card.title} title={card.title} body={card.body} href={card.href} />
        ))}
      </div>
    </section>
  );
}
