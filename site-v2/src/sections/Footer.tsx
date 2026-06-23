import { projectFacts } from "../data/projectFacts";
import { externalLinkProps } from "../lib/links";

const links = [
  ["Repository", projectFacts.links.repository],
  ["Project Facts", projectFacts.links.projectFacts],
  ["Security Policy", projectFacts.links.securityPolicy],
  ["Claims Matrix", projectFacts.links.claimsMatrix],
  ["Etherscan Token", projectFacts.verification.token],
  ["Etherscan Vault", projectFacts.verification.vault],
  ["No Offer Notice", projectFacts.links.noOffer],
  ["Risk Disclosure", projectFacts.links.riskDisclosure]
] as const;

export function Footer() {
  return (
    <footer className="site-footer" data-legal-footer>
      <div>
        <p className="footer-title">TikiDeco / TIDE</p>
        <p>
          TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. Nothing on this site is financial, investment, legal or tax advice.
        </p>
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
