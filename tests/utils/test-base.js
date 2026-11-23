
const { test: base } = require('@playwright/test');
const { requiredEnv } = require('./requiredEnv');

exports.test = base.extend({
    testDataForOrder: {
        username: requiredEnv('TEST_USER_EMAIL'),
        password: requiredEnv('TEST_USER_PASSWORD'),
        productName : "ZARA COAT 3"
    }
});
