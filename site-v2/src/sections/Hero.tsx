import { Badge } from "../components/Badge";
import { projectFacts } from "../data/projectFacts";
import { externalLinkProps } from "../lib/links";

type HeroCopy = {
  badge: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  context: string;
  badges: readonly string[];
  actionsAria: string;
  primaryAction: string;
  statusAction: string;
  repo: string;
  note: string;
};

export function Hero({ copy }: { copy: HeroCopy }) {
  return (
    <div className="hero-content">
      <p className="site-badge">{copy.badge}</p>
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1>{copy.title}</h1>
      <p className="hero-subtitle">{copy.subtitle}</p>
      <p className="hero-context">{copy.context}</p>
      <div className="badge-row" aria-label="Project status badges">
        {copy.badges.map((badge, index) => (
          <Badge key={badge} tone={index === 0 ? "cyan" : index === 3 ? "violet" : "neutral"}>
            {badge}
          </Badge>
        ))}
      </div>
      <div className="hero-actions" aria-label={copy.actionsAria}>
        <a className="button button-primary" href="#about">
          {copy.primaryAction}
        </a>
        <a className="button button-secondary" href="#status">
          {copy.statusAction}
        </a>
        <a className="button button-ghost" href={projectFacts.links.repository} {...externalLinkProps(projectFacts.links.repository)}>
          {copy.repo}
        </a>
      </div>
      <p className="hero-note">{copy.note}</p>
    </div>
  );
}
