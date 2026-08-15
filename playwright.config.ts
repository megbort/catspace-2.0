import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright e2e config for Catspace.
 * Tests live in ./e2e (outside src, so Vitest's src/**\/*.spec.ts glob never picks them up).
 * The webServer block auto-starts the Angular dev server on port 4300 before tests run
 * (separate from the default 4200 dev server, so a manually-running `npm start` isn't reused/disturbed).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4300',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm start -- --port 4300',
    url: 'http://localhost:4300',
    reuseExistingServer: !process.env['CI'], // reuse a running e2e server on 4300; always fresh in CI
    timeout: 120_000, // ng serve cold start can be slow
  },
});
