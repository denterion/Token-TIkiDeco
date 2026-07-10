import { externalLinkProps } from "../lib/links";
import { previewMetrics } from "../lib/previewMetrics";

const comprehension = [
  "TIDE is Sepolia-only.",
  "No token sale exists.",
  "No mainnet deployment exists.",
  "No active hotel benefit exists.",
  "Independent audit has not started.",
  "V2 remains candidate code only."
];

const feedbackLinks = [
  ["Report a bug", "https://github.com/denterion/Token-TIkiDeco/issues/new?template=bug_report.yml"],
  ["Share UX feedback", "https://github.com/denterion/Token-TIkiDeco/issues/new?template=site_feedback.yml"],
  ["Review a translation", "https://github.com/denterion/Token-TIkiDeco/issues/new?template=translation_review.yml"],
  ["Review pilot utility", "https://github.com/denterion/Token-TIkiDeco/issues/new?template=utility_pilot_feedback.yml"]
] as const;

export function PreviewFeedbackPanel() {
  return (
    <section className="section preview-feedback" aria-labelledby="preview-feedback-title">
      <div className="section-heading">
        <p className="eyebrow">Public feedback</p>
        <h2 id="preview-feedback-title">Did the boundaries make sense?</h2>
        <p>Use the public issue forms without submitting wallet addresses, secrets, guest data, or sensitive personal data.</p>
      </div>
      <div className="feedback-grid">
        <div className="feedback-checklist">
          <h3>Comprehension check</h3>
          <ul>
            {comprehension.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p>Responses are manually summarized as aggregate counts from public issue forms.</p>
        </div>
        <div className="feedback-actions" aria-label="Public feedback categories">
          {feedbackLinks.map(([label, href]) => (
            <a
              key={label}
              className="button button-secondary"
              href={href}
              onClick={() => previewMetrics.record("feedbackLinkClicks")}
              {...externalLinkProps(href)}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
