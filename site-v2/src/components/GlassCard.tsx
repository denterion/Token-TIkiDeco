import { externalLinkProps } from "../lib/links";

type GlassCardProps = {
  title: string;
  body: string;
  href?: string;
};

export function GlassCard({ title, body, href }: GlassCardProps) {
  const content = (
    <>
      <span className="card-kicker" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{body}</p>
    </>
  );

  if (href) {
    return (
      <a className="glass-card interactive-card" href={href} {...externalLinkProps(href)}>
        {content}
      </a>
    );
  }

  return <article className="glass-card">{content}</article>;
}
