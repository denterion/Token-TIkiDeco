export type PerkStatus = "pending" | "approved" | "rejected" | "cancelled";
export type OperatorDecision = "approve" | "reject";

export interface EligibilityRequest {
  requestId: string;
  campaignId: string;
  walletAddress: string;
  chainId: number;
  balanceBaseUnits: bigint;
  requestedAt: string;
}

export interface CampaignRule {
  campaignId: string;
  chainId: 11155111;
  minimumBalanceBaseUnits: bigint;
  startsAt: string;
  endsAt: string;
  status: "draft" | "closed";
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
  reasonCode: string;
  reservationReferenceHash?: ReservationReferenceHash;
  decidedAt: string;
}

export interface AuditLogEntry {
  sequence: number;
  campaignId: string;
  requestId?: string;
  action: "campaign-created" | "inventory-set" | "eligibility-reviewed" | "request-decided" | "campaign-closed";
  result: string;
  at: string;
}

export interface AggregateOperatorReport {
  campaignId: string;
  status: "draft" | "closed";
  inventoryCapacity: number;
  totalReviewed: number;
  eligible: number;
  ineligible: number;
  approved: number;
  rejected: number;
  containsPersonalData: false;
  transactionBroadcast: false;
}

type ReviewedRequest = {
  request: EligibilityRequest;
  eligible: boolean;
  decision?: OperatorDecisionRecord;
};

export class OperatorSandbox {
  private rule?: CampaignRule;
  private inventory?: Inventory;
  private readonly requests = new Map<string, ReviewedRequest>();
  private readonly auditLog: AuditLogEntry[] = [];

  createCampaign(rule: CampaignRule): void {
    if (this.rule) throw new Error("A sandbox campaign already exists.");
    if (rule.status !== "draft" || rule.chainId !== 11155111) throw new Error("Sandbox campaigns must be draft and Sepolia-only.");
    if (rule.minimumBalanceBaseUnits < 0n) throw new Error("Minimum balance cannot be negative.");
    if (Date.parse(rule.endsAt) <= Date.parse(rule.startsAt)) throw new Error("Campaign window is invalid.");
    this.rule = { ...rule };
    this.record("campaign-created", "draft");
  }

  setInventory(capacity: number): void {
    this.requireOpenCampaign();
    if (!Number.isSafeInteger(capacity) || capacity < 0) throw new Error("Inventory must be a non-negative integer.");
    this.inventory = { campaignId: this.rule!.campaignId, capacity, approved: 0 };
    this.record("inventory-set", String(capacity));
  }

  reviewEligibility(request: EligibilityRequest): boolean {
    this.requireOpenCampaign();
    if (request.campaignId !== this.rule!.campaignId || request.chainId !== 11155111) throw new Error("Request does not match the campaign.");
    if (!/^0x[0-9a-fA-F]{40}$/.test(request.walletAddress)) throw new Error("Wallet address is invalid.");
    const requestedAt = Date.parse(request.requestedAt);
    if (!Number.isFinite(requestedAt) || requestedAt < Date.parse(this.rule!.startsAt) || requestedAt > Date.parse(this.rule!.endsAt)) {
      throw new Error("Request is outside the campaign window.");
    }
    if (this.requests.has(request.requestId)) throw new Error("Duplicate request ID.");
    const eligible = request.balanceBaseUnits >= this.rule!.minimumBalanceBaseUnits;
    this.requests.set(request.requestId, { request: { ...request }, eligible });
    this.record("eligibility-reviewed", eligible ? "eligible" : "ineligible", request.requestId);
    return eligible;
  }

  decide(requestId: string, decision: OperatorDecision, reasonCode: string, reservationReferenceHash?: ReservationReferenceHash): OperatorDecisionRecord {
    this.requireOpenCampaign();
    const reviewed = this.requests.get(requestId);
    if (!reviewed || reviewed.decision) throw new Error("Request is missing or already decided.");
    if (!reasonCode.trim()) throw new Error("A reason code is required.");
    if (reservationReferenceHash && !/^0x[0-9a-fA-F]{64}$/.test(reservationReferenceHash)) {
      throw new Error("Reservation reference hash is invalid.");
    }
    if (decision === "approve") {
      if (!reviewed.eligible) throw new Error("An ineligible request cannot be approved.");
      if (!this.inventory || this.inventory.approved >= this.inventory.capacity) throw new Error("No sandbox inventory remains.");
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
    this.record("request-decided", decision, requestId);
    return record;
  }

  closeCampaign(): void {
    this.requireOpenCampaign();
    this.rule = { ...this.rule!, status: "closed" };
    this.record("campaign-closed", "closed");
  }

  aggregateReport(): AggregateOperatorReport {
    if (!this.rule) throw new Error("Campaign is missing.");
    const reviewed = [...this.requests.values()];
    return {
      campaignId: this.rule.campaignId,
      status: this.rule.status,
      inventoryCapacity: this.inventory?.capacity ?? 0,
      totalReviewed: reviewed.length,
      eligible: reviewed.filter((item) => item.eligible).length,
      ineligible: reviewed.filter((item) => !item.eligible).length,
      approved: reviewed.filter((item) => item.decision?.decision === "approve").length,
      rejected: reviewed.filter((item) => item.decision?.decision === "reject").length,
      containsPersonalData: false,
      transactionBroadcast: false
    };
  }

  getAuditLog(): readonly AuditLogEntry[] {
    return this.auditLog.map((entry) => ({ ...entry }));
  }

  private requireOpenCampaign(): void {
    if (!this.rule || this.rule.status !== "draft") throw new Error("An open draft campaign is required.");
  }

  private record(action: AuditLogEntry["action"], result: string, requestId?: string): void {
    this.auditLog.push({
      sequence: this.auditLog.length + 1,
      campaignId: this.rule!.campaignId,
      requestId,
      action,
      result,
      at: new Date(0).toISOString()
    });
  }
}
