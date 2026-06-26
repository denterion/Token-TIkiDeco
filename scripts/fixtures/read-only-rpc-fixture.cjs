function rawAmountHex(amountTide) {
  return `0x${(BigInt(amountTide) * 10n ** 18n).toString(16)}`;
}

function createReadOnlyRpcFixture(defaults = {}) {
  const calls = [];
  const handler = async (endpoint, request) => {
    calls.push({ endpoint, request });
    const behavior = defaults.byEndpoint?.[endpoint] || defaults;
    if (behavior.fail) throw new Error(behavior.error || "RPC unavailable");
    const body = JSON.parse(request.body);
    let result = "0x0";
    if (body.method === "eth_chainId") result = `0x${Number(behavior.chainId).toString(16)}`;
    if (body.method === "eth_call" && body.params?.[0]?.data === "0x313ce567") result = "0x12";
    if (body.method === "eth_call" && body.params?.[0]?.data?.startsWith("0x70a08231")) {
      result = rawAmountHex(behavior.balanceTide || 0);
    }
    return {
      ok: behavior.httpOk !== false,
      status: behavior.status || 200,
      json: async () => ({ jsonrpc: "2.0", id: 1, result })
    };
  };
  return { calls, handler };
}

module.exports = { createReadOnlyRpcFixture };
