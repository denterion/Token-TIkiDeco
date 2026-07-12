import { expect, test, type Locator, type Page } from "@playwright/test";

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

async function mockRpcBalance(page: Page, tideBalance: bigint, chainId = 11155111, delayMs = 0) {
  await page.route(rpcPattern, async (route) => {
    if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs));
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

async function tabTo(page: Page, target: Locator, maxTabs = 20) {
  for (let index = 0; index < maxTabs; index += 1) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((element) => element === document.activeElement)) return;
  }
  throw new Error(`Could not reach ${await target.getAttribute("id") || "target"} with Tab.`);
}

async function enterWalletWithKeyboard(page: Page, walletAddress: string) {
  const input = page.getByLabel("Wallet address");
  await tabTo(page, input);
  await expect(input).toBeFocused();
  const focusStyle = await input.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth), color: style.outlineColor };
  });
  expect(focusStyle.style).not.toBe("none");
  expect(focusStyle.width).toBeGreaterThanOrEqual(2);
  expect(focusStyle.color).not.toBe("rgba(0, 0, 0, 0)");
  await page.keyboard.type(walletAddress);

  await page.keyboard.press("Tab");
  const button = page.getByRole("button", { name: /Check Sepolia balance/i });
  await expect(button).toBeFocused();
  return { input, button, status: page.getByRole("status") };
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

test("keyboard-only user reaches the checker, sees focus, and hears an eligible result", async ({ page }) => {
  await mockRpcBalance(page, 150n * 10n ** 18n, 11155111, 150);
  await page.goto("/pilot/");

  const { button, status } = await enterWalletWithKeyboard(page, validWallet);
  await page.keyboard.press("Enter");
  await expect(status).toContainText(/Checking the Sepolia network/i);
  await expect(status).toContainText(/Live Sepolia balance: 150 TIDE/i);
  await expect(button).toBeFocused();
  await expect(page.getByText("150 TIDE", { exact: true })).toBeVisible();
  await expect(page.getByText(/Data: LIVE/i)).toBeVisible();

  await page.keyboard.press("Tab");
  const checkbox = page.getByRole("checkbox", { name: /optional off-chain message proof/i });
  await expect(checkbox).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(button).toBeFocused();
  await assertNoHorizontalOverflow(page);
});

test("keyboard activation links an invalid-address error to the wallet field", async ({ page }) => {
  await mockRpcUnavailable(page);
  await page.goto("/pilot/");

  const { input, button, status } = await enterWalletWithKeyboard(page, "0x123");
  await page.keyboard.press("Enter");

  await expect(status).toContainText(/Error: Enter a valid Ethereum address first/i);
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAttribute("aria-errormessage", "pilot-wallet-error");
  await expect(page.locator("#pilot-wallet-error")).toHaveText("Enter a valid Ethereum address first.");
  await expect(button).toBeFocused();
});

test("Space activation announces a zero Sepolia balance", async ({ page }) => {
  await mockRpcBalance(page, 0n);
  await page.goto("/pilot/");

  const { button, status } = await enterWalletWithKeyboard(page, validWallet);
  await page.keyboard.press("Space");

  await expect(status).toContainText(/Live Sepolia balance: 0 TIDE/i);
  await expect(page.getByText(/Data: LIVE/i)).toBeVisible();
  await expect(button).toBeFocused();
});

test("keyboard-only checker announces unavailable RPC without inventing zero data", async ({ page }) => {
  await mockRpcUnavailable(page);
  await page.goto("/pilot/");

  const { button, status } = await enterWalletWithKeyboard(page, validWallet);
  await page.keyboard.press("Enter");

  await expect(status).toContainText(/Balance check failed/i);
  await expect(page.getByText(/Data: UNAVAILABLE/i)).toBeVisible();
  await expect(page.getByText(/^0 TIDE$/i)).toHaveCount(0);
  await expect(page.getByText("NOT LIVE", { exact: true })).toBeVisible();
  await expect(button).toBeFocused();
});

test("keyboard-only checker announces a wrong-chain RPC response", async ({ page }) => {
  await mockRpcBalance(page, 150n * 10n ** 18n, 1);
  await page.goto("/pilot/");

  const { button, status } = await enterWalletWithKeyboard(page, validWallet);
  await page.keyboard.press("Space");

  await expect(status).toContainText(/Expected Sepolia chain 11155111, received 1/i);
  await expect(page.getByText(/Data: WRONG-CHAIN/i)).toBeVisible();
  await expect(button).toBeFocused();
});

test("homepage is English-only and loads the desktop product scene", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop scene regression");
  await page.goto("/");

  await expect(page.locator(".language-switcher")).toHaveCount(0);
  await expect(page.locator(".scene-layer canvas")).toBeVisible();
  await expect(page.getByText(/Read the site in English|Leer el sitio|русском/i)).toHaveCount(0);
  await assertNoHorizontalOverflow(page);
});

test("community review pins the exact candidate and public-safe reporting paths", async ({ page }) => {
  const candidateCommit = "cdc9e7e27e66f204c50d59e45ccf970ad20290d6";
  const packageSha256 = "980555973d47cb5b21b900f3d463890d4faeeff1c45d351332906f5149bae1a2";

  await page.goto("/community-review/");

  await expect(page.getByRole("heading", { name: "Review the frozen V2 candidate", level: 1 })).toBeVisible();
  await expect(page.locator("main")).toContainText(candidateCommit);
  await expect(page.locator("main")).toContainText(packageSha256);
  await expect(page.locator(".audit-disclaimer")).toContainText("Community peer review is not a formal independent smart-contract audit");
  await expect(page.getByText("No reviewers have been acknowledged yet", { exact: true })).toBeVisible();

  expect(await page.locator(`a[href*="/tree/${candidateCommit}"]`).count()).toBeGreaterThan(0);
  expect(await page.locator("a[href='https://github.com/denterion/Token-TIkiDeco/security/advisories/new']").count()).toBeGreaterThan(0);
  await expect(page.getByRole("button", { name: /buy|connect wallet|approve|transfer|transaction/i })).toHaveCount(0);

  const publicText = await page.locator("main").innerText();
  expect(publicText).not.toMatch(/V2 is canonical|community review is a completed audit|mainnet live|buy TIDE/i);
  await assertNoHorizontalOverflow(page);
});

test("aggregate findings page is public-safe and mobile readable", async ({ page }) => {
  const candidateCommit = "cdc9e7e27e66f204c50d59e45ccf970ad20290d6";

  await page.goto("/community-review/findings/");

  await expect(page.getByRole("heading", { name: "Community findings, without sensitive details", level: 1 })).toBeVisible();
  await expect(page.locator("main")).toContainText(candidateCommit);
  await expect(page.getByText("Total submitted", { exact: true })).toBeVisible();
  await expect(page.getByText("Sensitive details", { exact: true })).toBeVisible();
  await expect(page.getByText("Not displayed on this page", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /buy|connect wallet|approve|transfer|transaction/i })).toHaveCount(0);

  const publicText = await page.locator("main").innerText();
  expect(publicText).not.toMatch(/V2 is canonical|community review is a completed audit|mainnet live|buy TIDE/i);
  await assertNoHorizontalOverflow(page);
});

test("keyboard navigation opens the Community Review route", async ({ page, isMobile }) => {
  await page.goto("/");
  const topNav = page.locator("header.top-nav");

  if (isMobile) await topNav.getByRole("button", { name: /Open navigation/i }).click();

  const reviewLink = topNav.getByRole("link", { name: "Review", exact: true });
  await reviewLink.focus();
  await expect(reviewLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/community-review\/$/);
  await expect(page.getByRole("heading", { name: "Review the frozen V2 candidate", level: 1 })).toBeVisible();
});

test("operator sandbox completes a fake campaign and produces an aggregate report", async ({ page }) => {
  await page.goto("/operator-sandbox/");

  await expect(page.getByRole("heading", { name: /Run a loyalty campaign without touching real operations/i })).toBeVisible();
  await expect(page.getByText("Local demonstration", { exact: true })).toBeVisible();
  await expect(page.getByText("Fake data", { exact: true })).toBeVisible();
  await expect(page.getByText("No active hospitality service", { exact: true })).toBeVisible();
  await expect(page.getByText("No real benefit", { exact: true })).toBeVisible();
  await expect(page.getByText("No transaction broadcasting", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Create fake campaign" }).click();
  await page.getByRole("button", { name: "Submit for simulation review" }).click();
  await page.getByRole("button", { name: "Approve simulation" }).click();
  await page.getByRole("button", { name: "Start simulation" }).click();
  await page.getByRole("button", { name: "Review eligible mock request" }).click();
  await page.getByRole("button", { name: "Approve mock request" }).click();
  await page.getByRole("button", { name: "Close campaign" }).click();

  await expect(page.getByRole("heading", { name: "Aggregate transparency report" })).toBeVisible();
  await expect(page.getByText("1 / 2", { exact: true })).toBeVisible();
  await expect(page.locator(".operator-hash")).toContainText(/[0-9a-f]{64}/);
  await expect(page.getByRole("button", { name: /connect wallet|pay|book|send transaction|approve token|transfer token/i })).toHaveCount(0);
  await assertNoHorizontalOverflow(page);
});

test("operator rationale is readable on mobile and links back to the local demo", async ({ page }) => {
  await page.goto("/operator-sandbox/why/");

  await expect(page.getByRole("heading", { name: /Why would a hospitality operator test this/i, level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: /A controlled process, not blockchain theatre/i })).toBeVisible();
  await expect(page.getByText(/without exposing guest data on-chain/i).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Open local demonstration" })).toHaveAttribute("href", "/operator-sandbox/");
  await expect(page.getByRole("button", { name: /connect wallet|pay|book|transaction/i })).toHaveCount(0);
  await assertNoHorizontalOverflow(page);
});
