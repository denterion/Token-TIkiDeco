import { projectFacts } from "../../data/projectFacts";
import { SEPOLIA_CHAIN_ID } from "./campaignRules";
import { normalizeWalletAddress } from "./snapshot";

export const RPC_ALLOWLIST = ["https://ethereum-sepolia-rpc.publicnode.com", "https://rpc.sepolia.org"] as const;

const BALANCE_OF_SELECTOR = "0x70a08231";
const DECIMALS_SELECTOR = "0x313ce567";
const CACHE_TTL_MS = 5 * 60 * 1000;

export type RpcDataStatus = "idle" | "live" | "cached" | "stale" | "unavailable" | "wrong-chain";

export type TideBalanceResult = {
  status: RpcDataStatus;
  chainId?: number;
  balanceTide?: number;
  balanceRaw?: string;
  decimals?: number;
  endpoint?: string;
  checkedAt?: string;
  blockTag: "latest";
  error?: string;
};

export type BalanceReader = (walletAddress: string) => Promise<TideBalanceResult>;

type JsonRpcSuccess = {
  jsonrpc: "2.0";
  id: number;
  result: string;
};

type JsonRpcError = {
  jsonrpc: "2.0";
  id: number;
  error: { code: number; message: string };
};

type JsonRpcResponse = JsonRpcSuccess | JsonRpcError;

const memoryCache = new Map<string, TideBalanceResult>();

function assertAllowlistedEndpoint(endpoint: string): void {
  if (!RPC_ALLOWLIST.includes(endpoint as (typeof RPC_ALLOWLIST)[number])) {
    throw new Error("RPC endpoint is not allowlisted");
  }
}

function encodeBalanceOf(walletAddress: string): string {
  const normalized = normalizeWalletAddress(walletAddress).replace(/^0x/, "");
  return `${BALANCE_OF_SELECTOR}${normalized.padStart(64, "0")}`;
}

function hexToNumber(hexValue: string): number {
  return Number(BigInt(hexValue));
}

function rawTokenAmountToNumber(raw: bigint, decimals: number): number {
  const scale = 10n ** BigInt(decimals);
  const whole = raw / scale;
  const fraction = raw % scale;
  return Number(whole) + Number(fraction) / Number(scale);
}

async function rpcCall(endpoint: string, method: string, params: unknown[]): Promise<string> {
  assertAllowlistedEndpoint(endpoint);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params })
  });
  if (!response.ok) throw new Error(`RPC HTTP ${response.status}`);
  const payload = (await response.json()) as JsonRpcResponse;
  if ("error" in payload) throw new Error(payload.error.message);
  return payload.result;
}

async function readFromEndpoint(endpoint: string, walletAddress: string): Promise<TideBalanceResult> {
  const [chainIdHex, decimalsHex, balanceHex] = await Promise.all([
    rpcCall(endpoint, "eth_chainId", []),
    rpcCall(endpoint, "eth_call", [{ to: projectFacts.tokenAddress, data: DECIMALS_SELECTOR }, "latest"]),
    rpcCall(endpoint, "eth_call", [{ to: projectFacts.tokenAddress, data: encodeBalanceOf(walletAddress) }, "latest"])
  ]);
  const chainId = hexToNumber(chainIdHex);
  if (chainId !== SEPOLIA_CHAIN_ID) {
    return {
      status: "wrong-chain",
      chainId,
      endpoint,
      checkedAt: new Date().toISOString(),
      blockTag: "latest",
      error: `Expected Sepolia chain ${SEPOLIA_CHAIN_ID}, received ${chainId}`
    };
  }
  const decimals = hexToNumber(decimalsHex);
  const raw = BigInt(balanceHex);
  return {
    status: "live",
    chainId,
    balanceTide: rawTokenAmountToNumber(raw, decimals),
    balanceRaw: raw.toString(),
    decimals,
    endpoint,
    checkedAt: new Date().toISOString(),
    blockTag: "latest"
  };
}

export function cachedBalanceFor(walletAddress: string, now = Date.now()): TideBalanceResult | undefined {
  const cached = memoryCache.get(normalizeWalletAddress(walletAddress));
  if (!cached?.checkedAt) return undefined;
  const age = now - Date.parse(cached.checkedAt);
  if (age <= CACHE_TTL_MS) return { ...cached, status: "cached" };
  return { ...cached, status: "stale", error: "Last live RPC result is stale." };
}

export async function readTideBalance(walletAddress: string, endpoints: readonly string[] = RPC_ALLOWLIST): Promise<TideBalanceResult> {
  const normalized = normalizeWalletAddress(walletAddress);
  const attempts = await Promise.allSettled(endpoints.map((endpoint) => readFromEndpoint(endpoint, normalized)));
  const live = attempts.find(
    (attempt): attempt is PromiseFulfilledResult<TideBalanceResult> => attempt.status === "fulfilled" && attempt.value.status === "live"
  );
  if (live) {
    memoryCache.set(normalized, live.value);
    return live.value;
  }
  const wrongChain = attempts.find(
    (attempt): attempt is PromiseFulfilledResult<TideBalanceResult> =>
      attempt.status === "fulfilled" && attempt.value.status === "wrong-chain"
  );
  if (wrongChain) return wrongChain.value;
  const cached = cachedBalanceFor(normalized);
  if (cached) return cached;
  const errors = attempts
    .map((attempt) => (attempt.status === "rejected" ? attempt.reason?.message || String(attempt.reason) : attempt.value.error))
    .filter(Boolean)
    .join("; ");
  return {
    status: "unavailable",
    blockTag: "latest",
    error: errors || "Data temporarily unavailable"
  };
}
