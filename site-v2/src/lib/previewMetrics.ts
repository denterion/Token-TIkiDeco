export type PreviewMetricEvent =
  | "balanceCheckAttempts"
  | "successfulChecks"
  | "rpcFailures"
  | "eligibleResults"
  | "ineligibleResults"
  | "feedbackLinkClicks";

export type PreviewLocale = "en" | "es" | "ru";

export type PreviewMetricsSnapshot = {
  pageSessions: number;
  balanceCheckAttempts: number;
  successfulChecks: number;
  rpcFailures: number;
  eligibleResults: number;
  ineligibleResults: number;
  languageSelected: Record<PreviewLocale, number>;
  feedbackLinkClicks: number;
};

function emptySnapshot(): PreviewMetricsSnapshot {
  return {
    pageSessions: 0,
    balanceCheckAttempts: 0,
    successfulChecks: 0,
    rpcFailures: 0,
    eligibleResults: 0,
    ineligibleResults: 0,
    languageSelected: { en: 0, es: 0, ru: 0 },
    feedbackLinkClicks: 0
  };
}

export function createPreviewMetrics(enabled = true) {
  const state = emptySnapshot();
  let pageSessionRecorded = false;

  return {
    enabled,
    recordPageSession() {
      if (!enabled || pageSessionRecorded) return;
      state.pageSessions += 1;
      pageSessionRecorded = true;
    },
    record(event: PreviewMetricEvent) {
      if (enabled) state[event] += 1;
    },
    recordLanguage(locale: PreviewLocale) {
      if (enabled) state.languageSelected[locale] += 1;
    },
    snapshot(): PreviewMetricsSnapshot {
      return { ...state, languageSelected: { ...state.languageSelected } };
    }
  };
}

const doNotTrack = typeof navigator !== "undefined" && navigator.doNotTrack === "1";

export const previewMetrics = createPreviewMetrics(!doNotTrack);
