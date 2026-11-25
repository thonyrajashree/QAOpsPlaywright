const { Before, After, BeforeStep, AfterStep, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { POManager } = require('../../PageObject/POManager');
const fs = require('fs');
const path = require('path');

setDefaultTimeout(30_000);

Before(async function () {
  const browser = await chromium.launch({ headless: process.env.CI === 'true' });
  const context = await browser.newContext();
  const page = await context.newPage();

  this.browser = browser;
  this.context = context;
  this.page = page;
  this.poManager = new POManager(page);
});

BeforeStep({ tags: '@ecommerce or @loginValidation' }, function ({ pickleStep }) {
  console.log(`Running tagged step: ${pickleStep.text}`);
});

AfterStep(async function ({ result, pickleStep }) {
  if (result.status === 'FAILED' && this.page) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    const screenshotDirectory = path.join(process.cwd(), 'reports', 'screenshots');
    fs.mkdirSync(screenshotDirectory, { recursive: true });
    const screenshotPath = path.join(screenshotDirectory, `failed-${pickleStep.id}.png`);
    fs.writeFileSync(screenshotPath, screenshot);

    await this.attach(screenshot, {
      mediaType: 'image/png',
      fileName: path.basename(screenshotPath)
    });
  }
});

After(async function () {
  await this.context?.close();
  await this.browser?.close();
});