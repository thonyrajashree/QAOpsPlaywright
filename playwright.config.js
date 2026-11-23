// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,
  workers: 1,

  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false,
    }],
  ],

  use: {
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});