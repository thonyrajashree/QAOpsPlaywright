
import {expect } from '@playwright/test';
import { POManager } from './PageObject/POManager';
const { test: customTest } = require('./utils/test-base');

//import testData from './utils/placeorderTestdata.json';

// Run the same test for each data set in the JSON array
//for (const data of testData) {
customTest('E2E - buy product using fixture',
    async ({ page , testDataForOrder }) => {
    //test(`E2E - buy product: ${data.productName}`, async ({ page }) => {

        // Create POManager and get page objects
        const poManager = new POManager(page);

        const loginPage = poManager.getLoginPage();
        const dashboardPage = poManager.getDashboardPage();
        const cartPage = poManager.getCartPage();
        const checkoutPage = poManager.getCheckoutPage();

        // STEP 1: Login
        await loginPage.goTo();

        await loginPage.validLogin(
            testDataForOrder.username,
            testDataForOrder.password
        );


        // STEP 2: Add product to cart
        await dashboardPage.addProductToCart(testDataForOrder.productName);

        // STEP 3: Open cart
        await dashboardPage.navigateToCart();

        // STEP 4: Verify product in cart
        const isVisible =
            await cartPage.verifyProductIsInCart(testDataForOrder.productName);

        expect(isVisible).toBeTruthy();




        // STEP 5: Proceed to checkout
        await cartPage.checkout();

        // STEP 6: Select country
        await checkoutPage.selectCountry('India');

        // STEP 7: Place order
        await checkoutPage.placeOrder();

        await expect(checkoutPage.thankYouMessage)
            .toHaveText(' Thankyou for the order. ');




        // STEP 8: Get order ID
        const orderId = await checkoutPage.getOrderId();

        expect(orderId, 'Order ID should be displayed')
            .toBeTruthy();

        console.log(
            `Order placed for ${testDataForOrder.productName}. ID:`,
            orderId
        );




        // STEP 9: Find order in My Orders
        await page.locator("button[routerlink*='myorders']").click();

        await page.locator('tbody tr').first().waitFor();

        const rows = page.locator('tbody tr');
        let orderFound = false;

        for (let i = 0; i < await rows.count(); i++) {
            const rowOrderId = (
                await rows.nth(i).locator('th').textContent()
            )?.trim();

            console.log(`Row ${i} Order ID:`, rowOrderId);

            if (orderId && rowOrderId === orderId) {
                await rows.nth(i)
                    .getByRole('button', { name: 'View' })
                    .click();

                orderFound = true;
                break;
            }
        }

        expect(
            orderFound,
            `Order for ${testDataForOrder.productName} should appear in My Orders`
        ).toBeTruthy();

        // STEP 10: Verify order details
        const orderIdDetails = (
            await page.locator('.col-text').textContent()
        )?.replace(/\|/g, '').trim();

        expect(orderIdDetails).toBe(orderId);
    });


