
class DashboardPage {
    constructor(page) {
        this.page = page;

        this.products = page.locator('.card-body');
        this.productsText = page.locator('.card-body b');
        this.cart = page.locator('[routerlink*="cart"]');
    }

    async searchProduct(productName) {
        // Wait until product titles are available
        await this.productsText.first().waitFor();

        const count = await this.products.count();

        // Search through the product cards
        for (let i = 0; i < count; i++) {
            const title = await this.products
                .nth(i)
                .locator('b')
                .textContent();

            if (title?.trim().toLowerCase() === productName.trim().toLowerCase()) {
                return i;
            }
        }

        throw new Error(`Product not found: ${productName}`);
    }

    async addProductToCart(productName) {
        // Find the product's index
        const index = await this.searchProduct(productName);

        // Click Add To Cart on the matching product card
        await this.products
            .nth(index)
            .getByText('Add To Cart')
            .click();
    }

    async navigateToCart() {
        await this.cart.click();
    }
}

module.exports = { DashboardPage };
