import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './src', // root directory for test files
  timeout: 30000,
  retries: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: 'http://localhost:8080', // optional if running sandbox server
  },
  projects: [
    {
      name: 'unit-tests',
      testMatch: /.*\.test\.jsx?$/,
      use: { ... }, // you can add any JS/React test-specific options
    },
    {
      name: 'integration-delegates',
      testMatch: /.*testIndex\.generated\.js$/, // runs the generated delegate index
      use: { ... }, // can be same browser options as above
    },
  ],
  webServer: {
    command: 'npm run sandbox', // launches your dev/sandbox server
    port: 8080,
    timeout: 60000,
    reuseExistingServer: true,
  },
});
