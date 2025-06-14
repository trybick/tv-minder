import { defineConfig, devices } from '@playwright/test';

export const baseUrl = 'http://localhost:4000';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  outputDir: './e2e/test-results',
  globalTimeout: 5000,

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: baseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 20 * 1000,
  },

  use: {
    baseURL: baseUrl,
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
