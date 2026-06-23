import { Badge } from "../components/Badge";
import { projectFacts } from "../data/projectFacts";
import { externalLinkProps } from "../lib/links";

type HeroCopy = {
  badge: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  badges: readonly string[];
  actionsAria: string;
  contracts: string;
  facts: string;
  repo: string;
  note: string;
  guideTitle: string;
  guideItems: readonly string[];
};

export function Hero({ copy }: { copy: HeroCopy }) {
  return (
    <div className="hero-content">
      <p className="site-badge">{copy.badge}</p>
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1>{copy.title}</h1>
      <p className="hero-subtitle">{copy.subtitle}</p>
      <div className="badge-row" aria-label="Project status badges">
        {copy.badges.map((badge, index) => (
          <Badge key={badge} tone={index === 0 ? "cyan" : index === 4 ? "violet" : "neutral"}>
            {badge}
          </Badge>
        ))}
      </div>
      <div className="hero-actions" aria-label={copy.actionsAria}>
        <a className="button button-primary" href={projectFacts.verification.token} {...externalLinkProps(projectFacts.verification.token)}>
          {copy.contracts}
        </a>
        <a className="button button-secondary" href={projectFacts.links.projectFacts} {...externalLinkProps(projectFacts.links.projectFacts)}>
          {copy.facts}
        </a>
        <a className="button button-ghost" href={projectFacts.links.repository} {...externalLinkProps(projectFacts.links.repository)}>
          {copy.repo}
        </a>
      </div>
      <p className="hero-note">{copy.note}</p>
      <aside className="hero-guide" aria-label={copy.guideTitle}>
        <strong>{copy.guideTitle}</strong>
        <ol>
          {copy.guideItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
