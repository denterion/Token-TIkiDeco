import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "site-v2/tests",
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4175",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npm run site:dev -- --port 4175",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } }
    },
    {
      name: "chromium-mobile",
      use: { ...devices["Pixel 5"] }
    }
  ]
});
