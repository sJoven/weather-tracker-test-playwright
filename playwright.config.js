const { devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html']],
  use: {
    baseURL: process.env.CI
      ? 'http://localhost:3000'
      : 'https://sjoven.github.io/weather-tracker-app/',
    trace: 'on-first-retry',
    headless: !!process.env.CI,
  },
  projects: [
    {
      name: 'api',
      testMatch: 'api.spec.js', 
      use: {},
    },
    {
      name: 'chromium',
      testMatch: 'ui.spec.js', 
      use: { ...devices['Desktop Chrome'] },
    },
  ],
};

module.exports = config;