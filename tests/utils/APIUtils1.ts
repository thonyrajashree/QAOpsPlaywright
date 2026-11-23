import { APIRequestContext } from '@playwright/test';

export class APiUtils {

    apiContext: APIRequestContext;
    loginPayLoad: { userEmail: string; userPassword: string };

    constructor(
        apiContext: APIRequestContext,
        loginPayLoad: { userEmail: string; userPassword: string }
    ) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getToken() {

        const loginResponse = await this.apiContext.post(
            "https://rahulshettyacademy.com/api/ecom/auth/login",
            {
                data: this.loginPayLoad
            }
        );

        const loginResponseJson = await loginResponse.json();

        const token = loginResponseJson.token;

        return token;
    }

    async createOrder(orderPayLoad: any) {

        let response: any = {};

        response.token = await this.getToken();

        const orderResponse = await this.apiContext.post(
            "https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data: orderPayLoad,
                headers: {
                    Authorization: response.token,
                    "Content-Type": "application/json"
                }
            }
        );

        const orderResponseJson = await orderResponse.json();

        console.log(orderResponseJson);

        response.orderId = orderResponseJson.orders[0];

        return response;
    }
}