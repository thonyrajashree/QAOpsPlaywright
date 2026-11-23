
class LoginPage {
    constructor(page) {
        this.page = page;
        this.application = 'ecommerce';
    }

    async goTo(application = 'ecommerce') {
        this.application = application;

        if (application === 'practice') {
            await this.page.goto('https://rahulshettyacademy.com/loginpagePractise/');
            this.signInButton = this.page.locator('#signInBtn');
            this.userName = this.page.locator('#username');
            this.password = this.page.locator('#password');
            this.terms = this.page.locator('#terms');
            this.errorMessage = this.page.locator('.alert-danger');
            return;
        }

        await this.page.goto('https://rahulshettyacademy.com/client');
        this.signInButton = this.page.locator("[value='Login']");
        this.userName = this.page.locator('#userEmail');
        this.password = this.page.locator('#userPassword');
        this.errorMessage = this.page.locator('.toast-message, .alert-danger');
    }

    async validLogin(username, password) {
        await this.userName.fill(username);
        await this.password.fill(password);

        if (this.application === 'practice') {
            await this.terms.check();
            await Promise.all([
                this.page.waitForURL(/angularpractice\/shop/i),
                this.signInButton.click()
            ]);
            await this.page.locator('app-card').first().waitFor();
            return;
        }

        await Promise.all([
            this.page.waitForURL(/dashboard/i),
            this.signInButton.click()
        ]);
        await this.page.locator('.card-body').first().waitFor();
    }

    async invalidLogin(username, password) {
        await this.userName.fill(username);
        await this.password.fill(password);

        if (this.application === 'practice') {
            await this.terms.check();
            await this.signInButton.click();
            await this.errorMessage.waitFor({ state: 'visible' });
            return;
        }

        await this.signInButton.click();
        await this.errorMessage.waitFor({ state: 'visible' });
    }
}

module.exports = { LoginPage };

