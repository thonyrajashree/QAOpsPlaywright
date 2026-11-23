import { APIRequestContext } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// APiUtils class — reusable API helper
// Contains login and createOrder methods so any test file can use them
// without repeating the same API code over and over
// ─────────────────────────────────────────────────────────────────────────────
export class APiUtils {

  apiContext: APIRequestContext;
  loginPayload: { userEmail: string; userPassword: string };

  constructor(
    apiContext: APIRequestContext,
    loginPayload: { userEmail: string; userPassword: string }
  ) {
    this.apiContext   = apiContext;
    this.loginPayload = loginPayload;
  }


  // ── getToken() — login via API and return token ───────────────────────────
  // Called once in beforeAll — returns token string
  // ─────────────────────────────────────────────────────────────────────────
  async getToken(): Promise<string> {
    const loginResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login',
      { data: this.loginPayload }
    );
    const loginBody = await loginResponse.json();
    const token  = loginBody.token;
    return token;
  }


  // ── createOrder() — place order via API and return token + orderId ─────────
  // Calls getToken() internally so you don't need to call it separately
  // Returns object with both token and orderId
  // ─────────────────────────────────────────────────────────────────────────
  async createOrder(
    orderPayload: { orders: { 
      country: string; 
      productOrderedId: string }[] }): Promise<{ token: string; orderId: string }> {const token = await this.getToken();
   const orderResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        data: orderPayload,
        headers: {
          'Authorization': token,
          'Content-Type':  'application/json'
        }
      }
    );

    const orderBody = await orderResponse.json();
    const orderId   = orderBody.orders[0];
    console.log('Order placed. ID:', orderId);

    return { token, orderId };
  }
}