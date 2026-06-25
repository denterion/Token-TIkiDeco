export const privacyBoundaries = {
  noPrivateKeys: true,
  noSeedPhrases: true,
  noPersonalGuestData: true,
  noProductionBookingIntegration: true,
  localOnlyMock: true
} as const;

export function privacyNotice(): string {
  return [
    "This mock should collect only a wallet address typed by the user.",
    "Do not collect private keys, seed phrases, names, emails, guest records, travel plans, or booking data.",
    "Do not store wallet-to-person mappings in the static website.",
    "Production data collection requires privacy review, counsel review, retention rules, and access controls."
  ].join(" ");
}
