import { expect, test, type Page } from "@playwright/test";

const validWallet = "0x087f0c360060ab380B2271FdcC32091d91bBec8F";
const rpcPattern = /https:\/\/(ethereum-sepolia-rpc\.publicnode\.com|rpc\.sepolia\.org)\/?/;

async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    width: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  expect(overflow.scrollWidth, `scrollWidth ${overflow.scrollWidth} should fit viewport ${overflow.width}`).toBeLessThanOrEqual(
    overflow.width + 1
  );
}

async function mockRpcUnavailable(page: Page) {
  await page.route(rpcPattern, (route) => route.abort("failed"));
}

async function mockRpcBalance(page: Page, tideBalance: bigint, chainId = 11155111) {
  await page.route(rpcPattern, async (route) => {
    const body = route.request().postDataJSON() as { method?: string; params?: Array<{ data?: string }> };
    const data = body.params?.[0]?.data?.toLowerCase() || "";
    let result = "0x0";

    if (body.method === "eth_chainId") {
      result = `0x${chainId.toString(16)}`;
    } else if (body.method === "eth_call" && data.startsWith("0x313ce567")) {
      result = "0x12";
    } else if (body.method === "eth_call" && data.startsWith("0x70a08231")) {
      result = `0x${tideBalance.toString(16)}`;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, result })
    });
  });
}

async function checkSepoliaBalanceWithKeyboard(page: Page) {
  const button = page.getByRole("button", { name: /Check Sepolia balance/i });
  await button.focus();
  await expect(button).toBeFocused();
  await page.keyboard.press("Enter");
}

test("homepage explains current status and avoids transaction CTAs", async ({ page, isMobile }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "TikiDeco", level: 1 })).toBeVisible();
  await expect(page.getByText("ETHEREUM SEPOLIA - NO MONETARY VALUE")).toBeVisible();
  await expect(page.getByText(/No Sale/i).first()).toBeVisible();
  await expect(page.getByText(/not independently audited/i).first()).toBeVisible();
  const topNav = page.locator("header.top-nav");
  if (isMobile) {
    await topNav.getByRole("button", { name: /Open navigation/i }).click();
    await expect(topNav.getByRole("button", { name: /Close navigation/i })).toBeVisible();
  }
  await expect(topNav.getByRole("link", { name: /Trust/i })).toBeVisible();
  await expect(topNav.getByRole("link", { name: /Status/i })).toBeVisible();
  await expect(topNav.getByRole("link", { name: /^Pilot$/i })).toBeVisible();
  await expect(topNav.getByRole("link", { name: /Audit/i })).toBeVisible();
  await expect(topNav.getByRole("link", { name: /Feedback/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /A loyalty experiment with public proof/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Current status in one panel/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /TIDE Loyalty Pilot eligibility flow/i })).toHaveCount(0);

  await expect(page.getByRole("button", { name: /buy|purchase|invest|stake|approve|transfer/i })).toHaveCount(0);
  await expect(page.getByText(/not offered for sale/i).first()).toBeVisible();
  await expect(page.getByText(/not deployed on mainnet/i).first()).toBeVisible();
  await assertNoHorizontalOverflow(page);
});

test("mobile layout has no horizontal overflow", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only regression");
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "TikiDeco", level: 1 })).toBeVisible();
  await expect(page.locator("header.top-nav")).toBeVisible();
  await assertNoHorizontalOverflow(page);

  await page.goto("/pilot/");
  await expect(page.getByRole("heading", { name: /TIDE Loyalty Pilot eligibility flow/i })).toBeVisible();
  await assertNoHorizontalOverflow(page);
});

test("pilot route exposes the blocked lifecycle and privacy-safe feedback loop", async ({ page }) => {
  await page.goto("/pilot/");

  await expect(page.getByRole("heading", { name: /TIDE Loyalty Pilot eligibility flow/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Evidence before preview/i })).toBeVisible();
  await expect(page.getByText("Approved testnet preview", { exact: true })).toBeVisible();
  await expect(page.getByText("Blocked", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Did the boundaries make sense/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Review pilot utility/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /buy|purchase|invest|stake|approve|transfer|transaction/i })).toHaveCount(0);
});

test("Trust Center separates releases, main, and evidence with source links", async ({ page }) => {
  await page.goto("/trust/");

  await expect(page.getByRole("heading", { name: "Trust Center", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Release Version Matrix", level: 2 })).toBeVisible();
  await expect(page.getByText("v0.1.0-sepolia", { exact: true })).toBeVisible();
  await expect(page.getByText("v0.2.0-utility-pilot", { exact: true })).toBeVisible();
  await expect(page.getByText(/draft-not-live/i).first()).toBeVisible();
  await expect(page.getByText("Independent smart-contract audit", { exact: true })).toBeVisible();
  await expect(page.locator("[data-source-linked-fact] a").first()).toBeVisible();
});

test("eligibility card handles RPC unavailable without fake zero data", async ({ page }) => {
  await mockRpcUnavailable(page);
  await page.goto("/pilot/");

  await page.getByLabel("Wallet address").fill(validWallet);
  await checkSepoliaBalanceWithKeyboard(page);

  await expect(page.getByText(/Data: UNAVAILABLE/i)).toBeVisible();
  await expect(page.getByText("NOT LIVE", { exact: true })).toBeVisible();
  await expect(page.locator("p").filter({ hasText: /manual review/i }).last()).toBeVisible();
  await expect(page.getByRole("button", { name: /buy|purchase|invest|stake|approve|transfer/i })).toHaveCount(0);
});

test("eligibility card displays mocked sufficient Sepolia balance as live read-only data", async ({ page }) => {
  await mockRpcBalance(page, 150n * 10n ** 18n);
  await page.goto("/pilot/");

  await page.getByLabel("Wallet address").fill(validWallet);
  await checkSepoliaBalanceWithKeyboard(page);

  await expect(page.getByText(/150 TIDE/i)).toBeVisible();
  await expect(page.getByText(/Data: LIVE/i)).toBeVisible();
  await expect(page.getByText("NOT LIVE", { exact: true })).toBeVisible();
  await expect(page.locator("p").filter({ hasText: /manual review/i }).last()).toBeVisible();
  await expect(page.getByText(/No transaction button/i)).toBeVisible();
});

test("homepage is English-only and loads the desktop product scene", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop scene regression");
  await page.goto("/");

  await expect(page.locator(".language-switcher")).toHaveCount(0);
  await expect(page.locator(".scene-layer canvas")).toBeVisible();
  await expect(page.getByText(/Read the site in English|Leer el sitio|русском/i)).toHaveCount(0);
  await assertNoHorizontalOverflow(page);
});
