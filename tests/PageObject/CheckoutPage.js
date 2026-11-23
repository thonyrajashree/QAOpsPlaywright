class CheckoutPage {

    constructor(page) {
        this.page = page;
        this.countryInput = page.locator("[placeholder*='Country']");
        this.countryDropdown = page.locator('.ta-results');
        this.countryOptions = this.countryDropdown.locator('button');
         this.placeOrderButton = page.locator('.action__submit');
         this.thankYouMessage = page.locator('.hero-primary');
        this.orderIdLocator = page.locator(
            '.em-spacer-1 .ng-star-inserted'
        );
    }

    async selectCountry(countryName) {

        await this.countryInput.pressSequentially(
            countryName.substring(0, 3).toLowerCase(),
            { delay: 150 }
        );

        await this.countryDropdown.waitFor();
        const count = await this.countryOptions.count();
        let countrySelected = false;

        
    for (let i = 0; i < count; i++) {
        const option = this.countryOptions.nth(i);
        const text = await option.textContent();

        if (text?.trim() === 'India') {
            await option.click();
            countrySelected = true;
            break;
        }
    }
    if (!countrySelected) {
        throw new Error('Country not found in the dropdown');
    }

  }


  async placeOrder() {
    await this.placeOrderButton.click();
    await this.thankYouMessage.waitFor();
  }

    async getOrderId() {
        return (
            await this.orderIdLocator.textContent()
        )?.replace(/\|/g, '').trim();
    }
}

module.exports = { CheckoutPage };