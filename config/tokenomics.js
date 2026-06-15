const MONTH = 30 * 24 * 60 * 60;

const tokenomics = [
  {
    key: "treasury",
    label: "Treasury operations",
    bps: 2000,
    vesting: "Unlocked to treasury/multisig",
    purpose: "Permits, legal setup, early project operations, and reserves for launch expenses."
  },
  {
    key: "team",
    label: "Team and advisors",
    bps: 1500,
    cliff: 12 * MONTH,
    duration: 36 * MONTH,
    revocable: true,
    vesting: "12-month cliff, then linear vesting over 36 months",
    purpose: "Long-term alignment for founders, operators, and advisors."
  },
  {
    key: "partners",
    label: "Strategic partners",
    bps: 1000,
    cliff: 6 * MONTH,
    duration: 24 * MONTH,
    revocable: true,
    vesting: "6-month cliff, then linear vesting over 24 months",
    purpose: "Architecture, hospitality, development, and brand partnerships."
  },
  {
    key: "community",
    label: "Community rewards",
    bps: 2000,
    cliff: 0,
    duration: 48 * MONTH,
    revocable: false,
    vesting: "Linear distribution over 48 months",
    purpose: "Community campaigns, referrals, education, and guest loyalty rewards."
  },
  {
    key: "hotel_perks",
    label: "Future hotel perks",
    bps: 1500,
    cliff: 0,
    duration: 48 * MONTH,
    revocable: false,
    vesting: "Linear distribution over 48 months",
    purpose: "Room upgrades, early booking access, events, and brand experiences."
  },
  {
    key: "reserve",
    label: "Strategic reserve",
    bps: 2000,
    vesting: "Held by treasury/multisig",
    purpose: "Unexpected costs, future liquidity planning, and governance-approved uses."
  }
];

function validateTokenomics() {
  const totalBps = tokenomics.reduce((sum, bucket) => sum + bucket.bps, 0);
  if (totalBps !== 10000) {
    throw new Error(`Tokenomics must total 10000 bps, got ${totalBps}`);
  }

  return tokenomics;
}

module.exports = {
  MONTH,
  tokenomics,
  validateTokenomics
};
