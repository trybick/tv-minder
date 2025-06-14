import { defineConfig, devices } from '@playwright/test';

export const baseUrl = 'http://localhost:4000';

export default defineConfig({
  testDir: './e2e/tests',
  globalSetup: './e2e/config/global-setup.ts',
  fullyParallel: true,
  // forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  outputDir: './e2e/test-results',

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
    video: 'on',
    screenshot: 'on',
  },
});
