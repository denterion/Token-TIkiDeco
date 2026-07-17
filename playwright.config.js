import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  retries: 1,
  use: { baseURL: 'http://localhost:3000' },
  webServer: { command: 'npm run dev', port: 3000, reuseExistingServer: true },
});