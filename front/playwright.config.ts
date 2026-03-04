import { defineConfig, devices } from '@playwright/test';

const baseUrl = 'http://localhost:4174';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
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
    command: 'VITE_E2E=true npm run start -- --port 4174',
    url: baseUrl,
    reuseExistingServer: false,
    timeout: 20 * 1000,
  },

  use: {
    baseURL: baseUrl,
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
