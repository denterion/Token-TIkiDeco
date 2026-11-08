import { projectFacts } from "../data/projectFacts";
import { externalLinkProps } from "../lib/links";
import { isRussian, localPath } from '../lib/locale';

type FooterCopy = {
  title: string;
  disclaimer: string;
  links: {
    trust: string;
    repository: string;
    officialPreview: string;
    pilotProofPack: string;
    finalEvidenceReport?: string;
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
    [isRussian ? 'О проекте' : 'Learn', "/learn/"],
    [isRussian ? 'Что такое TIDE' : 'Understand TIDE', "/learn/tide/"],
    [isRussian ? 'Вопросы' : 'FAQ', "/faq/"],
    [isRussian ? 'Разработчикам' : 'Developers', "/developers/"],
    [copy.links.trust, projectFacts.links.trust],
    [copy.links.repository, projectFacts.links.repository],
    [copy.links.officialPreview, "/status/"],
    [copy.links.pilotProofPack, "/proof/"],
    [isRussian ? 'Демо оператора' : 'Operator demo', projectFacts.links.operatorSandbox],
    [isRussian ? 'Отчёты' : 'Reports', "/reports/"],
    [copy.links.projectFacts, "/trust/"],
    [copy.links.releaseControl, "/status/"],
    [copy.links.roadmap, projectFacts.links.roadmap],
    [copy.links.securityPolicy, "/security/"],
    [copy.links.claimsMatrix, "/legal/project-status/"],
    [copy.links.feedbackGuide, "/feedback/"],
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
      <nav aria-label={isRussian ? 'Ссылки в подвале' : 'Footer links'}>
        {links.map(([label, href]) => (
          <a key={label} href={localPath(href)} {...externalLinkProps(href)}>
            {label}{isRussian && localPath(href) === href ? ' (EN)' : ''}
          </a>
        ))}
      </nav>
    </footer>
  );
}
