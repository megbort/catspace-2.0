import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright e2e config for Catspace.
 * Tests live in ./e2e (outside src, so Vitest's src/**\/*.spec.ts glob never picks them up).
 * The webServer block auto-starts the Angular dev server before tests run.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'], // reuse local dev server; always fresh in CI
    timeout: 120_000, // ng serve cold start can be slow
  },
});
