module.exports = [
  {
    path: 'feedback/index.html', title: 'Give feedback', eyebrow: 'Participate',
    heading: 'Help make the prototype clearer.',
    description: 'Choose a public feedback or private security reporting route for TikiDeco.',
    intro: 'Tell us what was confusing, what failed or what could be easier. Public feedback helps shape the next iteration.',
    sections: [
      ['Useful feedback', [
        ['Website and language', 'Mention the page, your device and the confusing wording. Describe what you expected to happen.'],
        ['Pilot demonstration', 'Describe the steps and the result. Do not include private participant information or wallet secrets.'],
        ['Operator demonstration', 'Use fictional examples to explain which campaign or inventory step needs improvement.']
      ]],
      ['Choose the right route', [
        ['Public feedback', 'Open a GitHub issue using the appropriate form. A GitHub account is needed to submit; reading this website needs no account.', 'https://github.com/denterion/Token-TIkiDeco/issues/new/choose'],
        ['Sensitive security reports', 'Do not publish unresolved exploitable details in public feedback. Read the security reporting instructions.', '/security/']
      ]]
    ], links: [['FAQ', '/faq/'], ['Project status', '/status/'], ['Privacy notice', '/legal/privacy/']]
  },
  {
    path: 'security/index.html', title: 'Security and reporting', eyebrow: 'Trust / Security',
    heading: 'Review carefully. Report responsibly.',
    description: 'Understand review boundaries and find the private vulnerability reporting route.',
    intro: 'Independent audit not started. Published tests, internal checks and community peer review are evidence to inspect, not an independent audit conclusion.',
    sections: [
      ['Review boundaries', [
        ['Historical deployment', 'V1 remains the canonical legacy Sepolia deployment.'],
        ['Candidate review', 'V2 is frozen non-canonical candidate code. Confirm the exact commit and checksum before reviewing.', '/community-review/'],
        ['Known limitations', 'Review the current scope, tooling and known limitations.', '/audit/']
      ]],
      ['Report a suspected vulnerability', [
        ['Private route', 'Use GitHub private vulnerability reporting for sensitive findings.', 'https://github.com/denterion/Token-TIkiDeco/security/advisories/new'],
        ['Include', 'Affected file or contract, exact version, reproduction steps, expected behavior and impact. Use local or test-only evidence.'],
        ['Keep private', 'Never include private keys, recovery phrases or participant data. Keep unresolved exploitable details out of public issues.'],
        ['After submission', 'The maintainer needs to reproduce and triage the finding. Resolution requires remediation and retest evidence; submission alone does not establish a confirmed finding.']
      ]]
    ], links: [['Review scope', '/audit/'], ['Public findings summary', '/community-review/findings/'], ['Reporting policy source', 'https://github.com/denterion/Token-TIkiDeco/blob/main/SECURITY.md']]
  },
  {
    path: 'learn/tide/index.html', title: 'Understand TIDE', eyebrow: 'Learn / TIDE',
    heading: 'A test token with public rules.',
    description: 'Understand TIDE, Sepolia and the distinction between a test balance and hospitality access.',
    intro: 'TIDE is the token used in the TikiDeco prototype. It helps test how eligibility rules and public records can be inspected on Ethereum Sepolia.',
    sections: [
      ['Three things to understand', [
        ['Sepolia', 'A public Ethereum testing network. The current TikiDeco contracts run here.'],
        ['A balance', 'A record of test tokens at an address. The website can read that record without connecting your wallet.'],
        ['Eligibility', 'A comparison against test campaign rules. A matching balance does not confirm access, a reservation or a real-world benefit.']
      ]],
      ['Follow the demonstration', [
        ['1. Open the checker', 'Enter a public test wallet address on the pilot page.'],
        ['2. Read the result', 'The checker requests Sepolia data and explains its result. If data cannot be obtained, it shows an unavailable state.'],
        ['3. Review the rules', 'The campaign remains draft-not-live. Explore the operator sandbox to see a fictional review workflow.']
      ]],
      ['Versions and limitations', [
        ['V1', 'The canonical legacy Sepolia deployment. Contract addresses are available in the verification center.', '/verify/'],
        ['V2', 'A non-canonical candidate for community review. Community review is not a formal independent audit.', '/community-review/'],
        ['Current boundary', 'No sale; no stated monetary value; no mainnet deployment; no active guest benefits; not independently audited.']
      ]]
    ],
    links: [['Try the read-only checker', '/pilot/'], ['Frequently asked questions', '/faq/'], ['Verify contracts', '/verify/']]
  },
  {
    path: 'faq/index.html', title: 'Frequently asked questions', eyebrow: 'Start here / Questions',
    heading: 'Your first questions, answered.',
    description: 'Plain-language answers about the TikiDeco prototype, demonstrations and project status.',
    intro: 'Start with the basics. You can explore the website and demonstrations without understanding smart contracts.',
    sections: [
      ['About the project', [
        ['Is TikiDeco a hotel?', 'There is no commercial hospitality service operating. The project explores future loyalty and access workflows.'],
        ['What can I do today?', 'Read the project facts, check a public Sepolia test address and explore the operator demonstration with fictional data.'],
        ['Why use a public network?', 'It allows reviewers to inspect selected rules and records independently. It does not prove that an off-chain service or benefit exists.']
      ]],
      ['Using the demonstration', [
        ['Do I need to connect a wallet?', 'No. Browsing requires no wallet. The balance checker accepts a manually entered public address.'],
        ['What does a matching balance mean?', 'It satisfies a test balance threshold only. The campaign is draft-not-live and no guest benefit is activated.'],
        ['What information should I enter?', 'Only a public test address in the checker. Never enter private keys, recovery phrases or guest information. RPC providers receive the public address being queried.'],
        ['Why is the result unavailable?', 'The public RPC service may be unreachable or return an unexpected network. Try again later; unavailable data is not a zero balance.']
      ]],
      ['Status and participation', [
        ['Is TIDE offered for sale?', 'No sale. TIDE has no stated monetary value and no mainnet deployment.'],
        ['Has there been an independent audit?', 'Independent audit not started. Internal checks and community peer review do not establish an independent audit.'],
        ['How can I help?', 'Test the demonstrations, suggest clearer wording or review the public code. Report sensitive vulnerabilities through the private reporting route.', '/community-review/']
      ]]
    ],
    links: [['Learn about TikiDeco', '/learn/'], ['Try the pilot demonstration', '/pilot/'], ['Project status', '/status/'], ['Privacy', '/legal/privacy/']]
  },
  {
    path: 'developers/index.html', title: 'Developer guide', eyebrow: 'Build understanding',
    heading: 'Inspect the prototype.',
    description: 'A starting point for developers examining the TikiDeco Sepolia prototype and frozen V2 candidate.',
    intro: 'Choose the deployed test contracts, the read-only interface or the frozen candidate review. Each has a distinct purpose and evidence trail.',
    sections: [
      ['Choose a review path', [
        ['Deployed V1', 'Inspect the canonical Sepolia token and vesting vault using the verification instructions.', '/verify/'],
        ['Frozen V2 candidate', 'Use the exact candidate commit, package checksum and scope shown in the Community Review Hub.', '/community-review/'],
        ['Frontend workflow', 'Try the public-address checker and its unavailable-data states. No transaction is requested.', '/pilot/'],
        ['Operator workflow', 'Explore campaign rules, inventory and aggregate reporting with fictional data.', '/operator-sandbox/']
      ]],
      ['Evidence before conclusions', [
        ['Source identity', 'Distinguish current development from immutable release snapshots. Check the version matrix before comparing outputs.', '/trust/'],
        ['Known limitations', 'Read the review scope and limitations before interpreting passing tests.', '/audit/'],
        ['Reporting', 'Use public findings for non-sensitive issues. Follow the private disclosure instructions for unresolved exploitable vulnerabilities.', '/community-review/']
      ]]
    ],
    links: [['Verification instructions', '/verify/'], ['Review hub', '/community-review/'], ['Roadmap', '/roadmap/'], ['Source repository', 'https://github.com/denterion/Token-TIkiDeco']]
  }
];
