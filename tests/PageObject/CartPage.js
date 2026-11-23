``
class CartPage {
    constructor(page) {
        this.page = page;
        this.cartItems = page.locator('div li');
        this.checkoutButton = page.getByText('Checkout');
    }

    async verifyProductIsInCart(productName) {
        await this.cartItems.first().waitFor();

        const isVisible = await this.page
            .locator(`h3:has-text('${productName}')`)
            .isVisible();

        return isVisible;
    }

    async checkout() {
        await this.checkoutButton.click();
    }
}

module.exports = { CartPage };
