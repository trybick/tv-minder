import { defineConfig, devices } from '@playwright/test';

export const baseUrl = 'http://localhost:4000';

export default defineConfig({
  testDir: './tests',
  globalSetup: './test/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: baseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 30 * 1000,
  },

  use: {
    baseURL: baseUrl,
    trace: 'on-first-retry',
  },
});
