export type CampaignLifecycleState =
  | "draft"
  | "review"
  | "approved-for-simulation"
  | "active-simulation"
  | "paused"
  | "closed"
  | "archived";
export type PerkStatus = "pending" | "approved" | "rejected" | "cancelled";
export type OperatorDecision = "approve" | "reject";
export const operatorDecisionReasonCodes = ["fake-eligible", "fake-threshold-not-met", "fake-not-selected"] as const;
export type OperatorDecisionReasonCode = (typeof operatorDecisionReasonCodes)[number];

export interface EligibilityRequest {
  requestId: string;
  campaignId: string;
  walletAddress: string;
  chainId: number;
  balanceBaseUnits: bigint;
  requestedAt: string;
}

export interface SimulationGates {
  operatorAssigned: boolean;
  privacyReviewed: boolean;
  supportOwnerAssigned: boolean;
}

export interface CampaignRule {
  templateId: string;
  campaignId: string;
  name: string;
  operatorStatus: "fake-operator-for-simulation";
  chainId: 11155111;
  eligibilityRule: string;
  minimumBalanceBaseUnits: bigint;
  inventoryLimit: number;
  startsAt: string;
  endsAt: string;
  state: CampaignLifecycleState;
  supportOwnerPlaceholder: string;
  disputeRules: string;
  cancellation: string;
  stopConditions: readonly string[];
  legalStatus: "simulation-reviewed" | "not-reviewed";
  privacyStatus: "simulation-reviewed" | "not-reviewed";
  simulationGates: SimulationGates;
}

export interface Inventory {
  campaignId: string;
  capacity: number;
  approved: number;
}

export type ReservationReferenceHash = `0x${string}`;

export interface OperatorDecisionRecord {
  requestId: string;
  decision: OperatorDecision;
  perkStatus: PerkStatus;
  reasonCode: OperatorDecisionReasonCode;
  reservationReferenceHash?: ReservationReferenceHash;
  decidedAt: string;
}

export interface AuditLogEntry {
  sequence: number;
  campaignId: string;
  requestId?: string;
  action:
    | "campaign-created"
    | "inventory-set"
    | "review-started"
    | "simulation-approved"
    | "simulation-activated"
    | "eligibility-reviewed"
    | "request-decided"
    | "dispute-recorded"
    | "simulation-paused"
    | "operation-rejected"
    | "campaign-closed"
    | "campaign-archived";
  result: string;
  reasonCode?: OperatorDecisionReasonCode;
  at: string;
}

export interface AggregateOperatorReport {
  campaignId: string;
  state: CampaignLifecycleState;
  requests: number;
  eligible: number;
  approved: number;
  rejected: number;
  inventoryLimit: number;
  inventoryUsed: number;
  errors: number;
  disputes: number;
  stopEvents: number;
  privacyStatement: string;
  containsPersonalData: false;
  containsRawWalletAddresses: false;
  containsGuestData: false;
  transactionBroadcast: false;
}

export interface OperatorSandboxSnapshot {
  campaign?: CampaignRule;
  inventory?: Inventory;
  report?: AggregateOperatorReport;
  auditEvents: number;
}

const lifecycleStates: readonly CampaignLifecycleState[] = [
  "draft", "review", "approved-for-simulation", "active-simulation", "paused", "closed", "archived"
];
const reasonCodeSet = new Set<string>(operatorDecisionReasonCodes);
const decisionReasonCodeSet: Record<OperatorDecision, ReadonlySet<OperatorDecisionReasonCode>> = {
  approve: new Set(["fake-eligible"]),
  reject: new Set(["fake-threshold-not-met", "fake-not-selected"])
};

function evidenceAssert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Invalid sandbox evidence: ${message}`);
}

export function validateOperatorSandboxEvidence(report: AggregateOperatorReport, auditLog: readonly AuditLogEntry[]): void {
  evidenceAssert(typeof report.campaignId === "string" && report.campaignId.trim().length > 0, "campaign ID is missing.");
  evidenceAssert(lifecycleStates.includes(report.state), "lifecycle state is unsupported.");
  for (const field of ["requests", "eligible", "approved", "rejected", "inventoryLimit", "inventoryUsed", "errors", "disputes", "stopEvents"] as const) {
    evidenceAssert(Number.isSafeInteger(report[field]) && report[field] >= 0, `${field} must be a non-negative safe integer.`);
  }
  evidenceAssert(report.eligible <= report.requests, "eligible count exceeds requests.");
  evidenceAssert(report.approved + report.rejected <= report.requests, "decision counts exceed requests.");
  evidenceAssert(report.inventoryUsed <= report.inventoryLimit, "inventory usage exceeds its limit.");
  evidenceAssert(report.inventoryUsed === report.approved, "inventory usage and approved decisions disagree.");
  evidenceAssert(report.containsPersonalData === false && report.containsRawWalletAddresses === false && report.containsGuestData === false, "privacy boundary flag is not false.");
  evidenceAssert(report.transactionBroadcast === false, "transaction broadcast flag is not false.");
  const reportRecord = report as AggregateOperatorReport & Record<string, unknown>;
  for (const key of ["guestName", "email", "bookingDetails", "privateKey", "seedPhrase", "walletAddresses"]) {
    evidenceAssert(!(key in reportRecord), `prohibited field ${key} is present.`);
  }
  evidenceAssert(!/0x[0-9a-fA-F]{40}/.test(report.privacyStatement), "privacy statement contains a raw wallet address.");
  evidenceAssert(!/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(report.privacyStatement), "privacy statement contains an email address.");

  auditLog.forEach((entry, index) => {
    evidenceAssert(entry.sequence === index + 1, "audit-log sequence is not strictly monotonic.");
    evidenceAssert(entry.campaignId === report.campaignId, "audit-log campaign ID disagrees with the report.");
  });
  const eligibility = auditLog.filter((entry) => entry.action === "eligibility-reviewed");
  const decisions = auditLog.filter((entry) => entry.action === "request-decided");
  evidenceAssert(eligibility.length === report.requests, "request total disagrees with the audit log.");
  evidenceAssert(eligibility.filter((entry) => entry.result === "eligible").length === report.eligible, "eligible total disagrees with the audit log.");
  evidenceAssert(decisions.filter((entry) => entry.result === "approve").length === report.approved, "approved total disagrees with the audit log.");
  evidenceAssert(decisions.filter((entry) => entry.result === "reject").length === report.rejected, "rejected total disagrees with the audit log.");
  evidenceAssert(decisions.every((entry) => entry.reasonCode && reasonCodeSet.has(entry.reasonCode)), "decision reason code is missing or unsupported.");
  evidenceAssert(decisions.every((entry) => (entry.result === "approve" || entry.result === "reject") && decisionReasonCodeSet[entry.result].has(entry.reasonCode!)), "decision reason code does not match its decision.");
  evidenceAssert(auditLog.filter((entry) => entry.action === "dispute-recorded").length === report.disputes, "dispute total disagrees with the audit log.");
  evidenceAssert(auditLog.filter((entry) => entry.action === "simulation-paused" || entry.action === "campaign-closed").length === report.stopEvents, "stop-event total disagrees with the audit log.");
  evidenceAssert(auditLog.filter((entry) => entry.action === "operation-rejected").length === report.errors, "error total disagrees with the audit log.");
}

type ReviewedRequest = {
  request: EligibilityRequest;
  eligible: boolean;
  decision?: OperatorDecisionRecord;
};

const startsAt = "2030-01-01T00:00:00.000Z";
const endsAt = "2030-01-02T00:00:00.000Z";
const sharedTemplate = {
  operatorStatus: "fake-operator-for-simulation" as const,
  chainId: 11155111 as const,
  minimumBalanceBaseUnits: 100n,
  inventoryLimit: 2,
  startsAt,
  endsAt,
  state: "draft" as const,
  supportOwnerPlaceholder: "Mock support owner",
  disputeRules: "A second mock reviewer checks eligibility and inventory evidence.",
  cancellation: "The simulation may be closed without creating participant rights.",
  stopConditions: ["inventory mismatch", "privacy boundary failure", "incorrect public claim"],
  legalStatus: "simulation-reviewed" as const,
  privacyStatus: "simulation-reviewed" as const,
  simulationGates: {
    operatorAssigned: true,
    privacyReviewed: true,
    supportOwnerAssigned: true
  }
};

export const fakeCampaignTemplates: readonly CampaignRule[] = [
  {
    ...sharedTemplate,
    templateId: "early-community-rsvp",
    campaignId: "fake-rsvp-001",
    name: "Early community RSVP",
    eligibilityRule: "Mock Sepolia balance meets the configured test threshold."
  },
  {
    ...sharedTemplate,
    templateId: "priority-preview-access",
    campaignId: "fake-preview-001",
    name: "Priority preview access",
    eligibilityRule: "Mock request passes the Sepolia-only eligibility review window."
  },
  {
    ...sharedTemplate,
    templateId: "conditional-welcome-perk",
    campaignId: "fake-welcome-001",
    name: "Conditional non-cash welcome-perk simulation",
    eligibilityRule: "Mock eligibility and limited inventory are both available; no outcome is guaranteed."
  }
];

export class OperatorSandbox {
  private rule?: CampaignRule;
  private inventory?: Inventory;
  private readonly requests = new Map<string, ReviewedRequest>();
  private readonly wallets = new Set<string>();
  private readonly auditLog: AuditLogEntry[] = [];
  private errors = 0;
  private disputes = 0;
  private stopEvents = 0;

  createCampaign(rule: CampaignRule): void {
    if (this.rule) this.fail("A sandbox campaign already exists.");
    if (!rule.campaignId.trim()) this.fail("Campaign ID is required.");
    if (rule.state !== "draft" || rule.chainId !== 11155111) this.fail("Sandbox campaigns must be draft and Sepolia-only.");
    if (rule.operatorStatus !== "fake-operator-for-simulation") this.fail("Only a clearly fake simulation operator is allowed.");
    if (rule.minimumBalanceBaseUnits < 0n) this.fail("Minimum balance cannot be negative.");
    if (!Number.isSafeInteger(rule.inventoryLimit) || rule.inventoryLimit < 0) this.fail("Inventory limit is invalid.");
    if (Date.parse(rule.endsAt) <= Date.parse(rule.startsAt)) this.fail("Campaign window is invalid.");
    this.rule = { ...rule, stopConditions: [...rule.stopConditions], simulationGates: { ...rule.simulationGates } };
    this.record("campaign-created", "draft");
  }

  setInventory(capacity: number): void {
    this.requireState("draft");
    if (!Number.isSafeInteger(capacity) || capacity < 0) this.fail("Inventory must be a non-negative integer.");
    if (capacity > this.rule!.inventoryLimit) this.fail("Inventory exceeds the template limit.");
    if ((this.inventory?.approved ?? 0) > capacity) this.fail("Inventory cannot be reduced below approvals.");
    this.inventory = { campaignId: this.rule!.campaignId, capacity, approved: this.inventory?.approved ?? 0 };
    this.record("inventory-set", String(capacity));
  }

  submitForReview(): void {
    this.requireState("draft");
    if (!this.inventory) this.fail("Inventory must be set before review.");
    this.setState("review", "review-started");
  }

  approveForSimulation(): void {
    this.requireState("review");
    const gates = this.rule!.simulationGates;
    if (!gates.operatorAssigned || !gates.privacyReviewed || !gates.supportOwnerAssigned) {
      this.fail("Operator, privacy, and support gates are required for simulation.");
    }
    if (this.rule!.legalStatus !== "simulation-reviewed" || this.rule!.privacyStatus !== "simulation-reviewed") {
      this.fail("Legal and privacy status must be reviewed for simulation.");
    }
    if (!this.rule!.supportOwnerPlaceholder.trim()) this.fail("A mock support owner is required.");
    this.setState("approved-for-simulation", "simulation-approved");
  }

  activateSimulation(): void {
    this.requireState("approved-for-simulation");
    this.setState("active-simulation", "simulation-activated");
  }

  reviewEligibility(request: EligibilityRequest): boolean {
    this.requireState("active-simulation");
    if (request.campaignId !== this.rule!.campaignId || request.chainId !== 11155111) this.fail("Request does not match the campaign.");
    if (!/^0x[0-9a-fA-F]{40}$/.test(request.walletAddress)) this.fail("Wallet address is invalid.");
    const requestedAt = Date.parse(request.requestedAt);
    if (!Number.isFinite(requestedAt) || requestedAt < Date.parse(this.rule!.startsAt) || requestedAt > Date.parse(this.rule!.endsAt)) {
      this.fail("Request is outside the campaign window.");
    }
    const wallet = request.walletAddress.toLowerCase();
    if (this.requests.has(request.requestId) || this.wallets.has(wallet)) this.fail("Duplicate mock request.");
    const eligible = request.balanceBaseUnits >= this.rule!.minimumBalanceBaseUnits;
    this.requests.set(request.requestId, { request: { ...request }, eligible });
    this.wallets.add(wallet);
    this.record("eligibility-reviewed", eligible ? "eligible" : "ineligible", request.requestId);
    return eligible;
  }

  decide(requestId: string, decision: OperatorDecision, reasonCode: OperatorDecisionReasonCode, reservationReferenceHash?: ReservationReferenceHash): OperatorDecisionRecord {
    this.requireState("active-simulation");
    const reviewed = this.requests.get(requestId);
    if (!reviewed || reviewed.decision) this.fail("Request is missing or already decided.");
    if (decision !== "approve" && decision !== "reject") this.fail("Operator decision is unsupported.");
    if (!reasonCodeSet.has(reasonCode)) this.fail("Decision reason code is unsupported.");
    if (!decisionReasonCodeSet[decision].has(reasonCode)) this.fail("Decision reason code does not match the decision.");
    if (reservationReferenceHash && !/^0x[0-9a-fA-F]{64}$/.test(reservationReferenceHash)) this.fail("Reservation reference hash is invalid.");
    if (decision === "approve") {
      if (!reviewed.eligible) this.fail("An ineligible request cannot be approved.");
      if (!this.inventory || this.inventory.approved >= this.inventory.capacity) this.fail("No sandbox inventory remains.");
      this.inventory.approved += 1;
    }
    const record: OperatorDecisionRecord = {
      requestId,
      decision,
      perkStatus: decision === "approve" ? "approved" : "rejected",
      reasonCode,
      reservationReferenceHash,
      decidedAt: new Date(0).toISOString()
    };
    reviewed.decision = record;
    this.record("request-decided", decision, requestId, reasonCode);
    return record;
  }

  recordDispute(reasonCode: string): void {
    if (!this.rule || !["active-simulation", "paused", "closed"].includes(this.rule.state)) this.fail("Disputes require an active, paused, or closed simulation.");
    if (!reasonCode.trim()) this.fail("A dispute reason is required.");
    this.disputes += 1;
    this.record("dispute-recorded", reasonCode);
  }

  pauseSimulation(reasonCode: string): void {
    this.requireState("active-simulation");
    if (!reasonCode.trim()) this.fail("A pause reason is required.");
    this.stopEvents += 1;
    this.setState("paused", "simulation-paused", reasonCode);
  }

  closeCampaign(): void {
    if (!this.rule || !["active-simulation", "paused"].includes(this.rule.state)) this.fail("Only an active or paused simulation can close.");
    this.stopEvents += 1;
    this.setState("closed", "campaign-closed");
  }

  archiveCampaign(): void {
    this.requireState("closed");
    this.setState("archived", "campaign-archived");
  }

  aggregateReport(): AggregateOperatorReport {
    if (!this.rule) this.fail("Campaign is missing.");
    const reviewed = [...this.requests.values()];
    const report: AggregateOperatorReport = {
      campaignId: this.rule!.campaignId,
      state: this.rule!.state,
      requests: reviewed.length,
      eligible: reviewed.filter((item) => item.eligible).length,
      approved: reviewed.filter((item) => item.decision?.decision === "approve").length,
      rejected: reviewed.filter((item) => item.decision?.decision === "reject").length,
      inventoryLimit: this.inventory?.capacity ?? 0,
      inventoryUsed: this.inventory?.approved ?? 0,
      errors: this.errors,
      disputes: this.disputes,
      stopEvents: this.stopEvents,
      privacyStatement: "Aggregate fake-data simulation only; no raw wallet addresses, guest data, or booking data are included.",
      containsPersonalData: false,
      containsRawWalletAddresses: false,
      containsGuestData: false,
      transactionBroadcast: false
    };
    validateOperatorSandboxEvidence(report, this.auditLog);
    return report;
  }

  snapshot(): OperatorSandboxSnapshot {
    return {
      campaign: this.rule ? { ...this.rule, stopConditions: [...this.rule.stopConditions], simulationGates: { ...this.rule.simulationGates } } : undefined,
      inventory: this.inventory ? { ...this.inventory } : undefined,
      report: this.rule ? this.aggregateReport() : undefined,
      auditEvents: this.auditLog.length
    };
  }

  getAuditLog(): readonly AuditLogEntry[] {
    return this.auditLog.map((entry) => ({ ...entry }));
  }

  private requireState(state: CampaignLifecycleState): void {
    if (!this.rule || this.rule.state !== state) this.fail(`Campaign must be ${state}.`);
  }

  private setState(state: CampaignLifecycleState, action: AuditLogEntry["action"], result: string = state): void {
    this.rule = { ...this.rule!, state };
    this.record(action, result);
  }

  private fail(message: string): never {
    this.errors += 1;
    if (this.rule) this.record("operation-rejected", message);
    throw new Error(message);
  }

  private record(action: AuditLogEntry["action"], result: string, requestId?: string, reasonCode?: OperatorDecisionReasonCode): void {
    this.auditLog.push({
      sequence: this.auditLog.length + 1,
      campaignId: this.rule!.campaignId,
      requestId,
      action,
      result,
      reasonCode,
      at: new Date(0).toISOString()
    });
  }
}
