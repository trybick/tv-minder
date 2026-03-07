import { defineConfig, devices } from '@playwright/test';

const baseUrl = 'http://localhost:4000';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Using 1 worker in CI is standard. Also use only one worker locally to avoid flakiness locally on older laptop
  workers: 1,
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
    serviceWorkers: 'block',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
