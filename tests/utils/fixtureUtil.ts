import { test as base, expect, Page, request } from '@playwright/test';
import { APiUtils } from './APiUtils';
const { requiredEnv } = require('./requiredEnv');

// ── Constants ──────────────────────────────────────────────────────
const appUrl      = 'https://rahulshettyacademy.com/client';
const loginPayLoad = {
  userEmail:    requiredEnv('TEST_USER_EMAIL'),
  userPassword: requiredEnv('TEST_USER_PASSWORD')
};
const orderPayLoad = {
  orders: [{ country: 'India', productOrderedId: '6960eac0c941646b7a8b3e68' }]
};

// ── Type — tells TypeScript what fixtures exist ─────────────────────
type MyFixtures = {
  authenticatedPage: Page;                              // UI fixture
  apiResponse: { token: string; orderId: string };     // API fixture
};

// ── Export custom test with both fixtures ───────────────────────────
export const test = base.extend<MyFixtures>({

  // ── FIXTURE 1: UI Login ─────────────────────────────────────────
  // Logs in via browser UI and gives logged-in page to test
  // ───────────────────────────────────────────────────────────────
  authenticatedPage: async ({ browser }, use) => {

    // SETUP
    const context = await browser.newContext();
    const page    = await context.newPage();

    await page.goto(appUrl);
    await page.locator('#userEmail').fill(loginPayLoad.userEmail);
    await page.locator('#userPassword').fill(loginPayLoad.userPassword);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');

    await use(page);
    // ↑ test runs here with logged-in page

    // TEARDOWN
    await context.close();
  },


  // ── FIXTURE 2: API Response ────────────────────────────────────
  // Logs in via API + creates order via API
  // Gives token + orderId to test
  // ───────────────────────────────────────────────────────────────
  apiResponse: async ({ }, use) => {

    // SETUP
    const apiContext = await request.newContext();
    const apiUtils   = new APiUtils(apiContext, loginPayLoad);
    const response   = await apiUtils.createOrder(orderPayLoad);

    await use(response);
    // ↑ test runs here with { token, orderId }

    // TEARDOWN
    await apiContext.dispose();
  }

});

export { expect } from '@playwright/test';
