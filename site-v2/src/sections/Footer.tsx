import { projectFacts } from "../data/projectFacts";
import { externalLinkProps } from "../lib/links";

type FooterCopy = {
  title: string;
  disclaimer: string;
  links: {
    repository: string;
    officialPreview: string;
    projectFacts: string;
    releaseControl: string;
    roadmap: string;
    securityPolicy: string;
    claimsMatrix: string;
    feedbackGuide: string;
    issues: string;
    etherscanToken: string;
    etherscanVault: string;
    noOffer: string;
    riskDisclosure: string;
  };
};

export function Footer({ copy }: { copy: FooterCopy }) {
  const links = [
    [copy.links.repository, projectFacts.links.repository],
    [copy.links.officialPreview, projectFacts.links.officialPreview],
    [copy.links.projectFacts, projectFacts.links.projectFacts],
    [copy.links.releaseControl, projectFacts.links.releaseControl],
    [copy.links.roadmap, projectFacts.links.roadmap],
    [copy.links.securityPolicy, projectFacts.links.securityPolicy],
    [copy.links.claimsMatrix, projectFacts.links.claimsMatrix],
    [copy.links.feedbackGuide, projectFacts.links.feedbackGuide],
    [copy.links.issues, projectFacts.links.issues],
    [copy.links.etherscanToken, projectFacts.verification.token],
    [copy.links.etherscanVault, projectFacts.verification.vault],
    [copy.links.noOffer, projectFacts.links.noOffer],
    [copy.links.riskDisclosure, projectFacts.links.riskDisclosure]
  ] as const;

  return (
    <footer className="site-footer" data-legal-footer>
      <div>
        <p className="footer-title">{copy.title}</p>
        <p>{copy.disclaimer}</p>
      </div>
      <nav aria-label="Footer links">
        {links.map(([label, href]) => (
          <a key={label} href={href} {...externalLinkProps(href)}>
            {label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
