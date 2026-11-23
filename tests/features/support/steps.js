const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { requiredEnv } = require('../../utils/requiredEnv');

Given('I open the practice login application', async function () {
  await this.poManager.getLoginPage().goTo('practice');
});

When(
  'I enter username {string} and password {string}',
  async function (username, password) {
    await this.poManager.getLoginPage().invalidLogin(username, password);
  }
);

Then(
  'I should see an incorrect credentials message',
  async function () {
    const errorMessage = this.poManager.getLoginPage().errorMessage;
    await expect(errorMessage).toContainText('Incorrect');
    await expect(errorMessage).toContainText('username/password');
  }
);

When(
  'I login with username {string} and password {string}',
  async function (username, password) {
    await this.poManager.getLoginPage().validLogin(username, password);
  }
);

Then('I should be redirected to the shop', async function () {
  await expect(this.page).toHaveURL(/angularpractice\/shop/i);
  await expect(this.page.locator('app-card').first()).toBeVisible();
});

Given(
  'an invalid login to Ecommerce application with {string} and {string}',
  async function (username, password) {
    const loginPage = this.poManager.getLoginPage();
    await loginPage.goTo('ecommerce');
    await loginPage.invalidLogin(username, password);
  }
);

Then('Verify error message is displayed', async function () {
  const loginPage = this.poManager.getLoginPage();
  await expect(loginPage.errorMessage.first()).toBeVisible();
});


Given(
  'a login to Ecommerce application with the configured test account',
  async function () {
    const loginPage = this.poManager.getLoginPage();

    await loginPage.goTo('ecommerce');
    await loginPage.validLogin(
      requiredEnv('TEST_USER_EMAIL'),
      requiredEnv('TEST_USER_PASSWORD')
    );
  }
);


When('Add {string} to Cart', async function (productName) {
  const dashboardPage = this.poManager.getDashboardPage();
  await dashboardPage.addProductToCart(productName);
});

Then(
  'Verify {string} is displayed in the Cart',
  async function (productName) {
    const dashboardPage = this.poManager.getDashboardPage();
    const cartPage = this.poManager.getCartPage();
    await dashboardPage.navigateToCart();
    expect(await cartPage.verifyProductIsInCart(productName)).toBeTruthy();
  }
);

When(
  'Enter valid details and Place the Order',
  async function () {
    const cartPage = this.poManager.getCartPage();
    const checkoutPage = this.poManager.getCheckoutPage();
    await cartPage.checkout();
    await checkoutPage.selectCountry('India');
    await checkoutPage.placeOrder();
    await expect(checkoutPage.thankYouMessage).toContainText('Thankyou for the order.');
    this.orderId = await checkoutPage.getOrderId();
    expect(this.orderId).toBeTruthy();
  }
);

Then(
  'Verify order is present in the OrderHistory',
  async function () {
    await this.page.locator("button[routerlink*='myorders']").click();
    const rows = this.page.locator('tbody tr');
    await rows.first().waitFor();
    let orderFound = false;
    for (let i = 0; i < await rows.count(); i++) {
      const rowOrderId = (await rows.nth(i).locator('th').textContent())?.trim();
      if (rowOrderId === this.orderId) {
        orderFound = true;
        break;
      }
    }
    expect(orderFound, `Order ${this.orderId} should appear in My Orders`).toBeTruthy();
  }
);

