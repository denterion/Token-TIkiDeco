import { Badge } from "../components/Badge";
import { projectFacts } from "../data/projectFacts";
import { externalLinkProps } from "../lib/links";

const badges = ["Sepolia Prototype", "Fixed Supply", "Read-Only Dashboard", "Internal Review", "Independent Audit Not Started"];

export function Hero() {
  return (
    <div className="hero-content">
      <p className="site-badge">SEPOLIA TESTNET · NO MONETARY VALUE</p>
      <p className="eyebrow">Miami-inspired transparency layer</p>
      <h1>TikiDeco</h1>
      <p className="hero-subtitle">A Sepolia prototype for transparent hospitality-linked token infrastructure.</p>
      <div className="badge-row" aria-label="Project status badges">
        {badges.map((badge, index) => (
          <Badge key={badge} tone={index === 0 ? "cyan" : index === 4 ? "violet" : "neutral"}>
            {badge}
          </Badge>
        ))}
      </div>
      <div className="hero-actions" aria-label="Primary links">
        <a className="button button-primary" href={projectFacts.verification.token} {...externalLinkProps(projectFacts.verification.token)}>
          View Contracts
        </a>
        <a className="button button-secondary" href={projectFacts.links.projectFacts} {...externalLinkProps(projectFacts.links.projectFacts)}>
          Read Project Facts
        </a>
        <a className="button button-ghost" href={projectFacts.links.repository} {...externalLinkProps(projectFacts.links.repository)}>
          Open Repository
        </a>
      </div>
      <p className="hero-note">
        Read-only public site. No sale flow, no wallet connection, no price chart, and no mainnet deployment.
      </p>
    </div>
  );
}
