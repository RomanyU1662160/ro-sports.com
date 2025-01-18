import { BaseHttpClient } from '@ro-app/http-client';
import { logger } from '@ro-app/pino-logger';
import { AxiosError } from 'axios';
import { OneStockError } from './onestock-error';
import { IOneStockSecretConfig, OneStockSecretManager } from './secret-manager';
import {
  AuthResponse,
  CreateOrderOneStockPayLoad,
  CreateOrderResponse,
  OneStockGetOrderResponse,
} from '@ro-app/event-schemas';

export class OneStockClient extends BaseHttpClient {
  private static instance: OneStockClient;
  private static secretManager: OneStockSecretManager =
    OneStockSecretManager.getInstance();
  private static initialized = false;

  private constructor() {
    super();
  }

  protected handleError(error: AxiosError): never {
    logger.error(`Error in OneStockClient ${error}`);
    logger.error(`OneStockClient::HandleError- ${error.message}`);
    throw new OneStockError({
      message: error.message,
      statusCode: error.response?.status || 500,
      code: error.code || 'UNKNOWN_ERROR',
      details: error.response?.data || 'No details',
    });
  }

  private async initialize(): Promise<void> {
    if (OneStockClient.initialized) return;
    const secret = await OneStockClient.secretManager.getSecret();
    await this.setupAxiosClient(secret);
    OneStockClient.initialized = true;
  }

  private async setupAxiosClient(secret: IOneStockSecretConfig): Promise<void> {
    const USERNAME_SUFFIX = process.env.ONESTOCK_USER_SUFFIX;
    const PASSWORD_SUFFIX = process.env.ONESTOCK_PASSWORD_SUFFIX;
    const URL_SUFFIX = process.env.ONESTOCK_URL_SUFFIX;
    if (!USERNAME_SUFFIX || !PASSWORD_SUFFIX || !URL_SUFFIX) {
      logger.error(
        'Error in OneStockClient',
        'USERNAME_SUFFIX, PASSWORD_SUFFIX or URL_SUFFIX is not defined in your env file'
      );
    }
    this.client.defaults.baseURL = `${secret.ONESTOCK_BASE_URL}/v2`;
    this.client.defaults.headers['Content-Type'] = 'application/json';
    this.client.defaults.headers[
      'Auth-User'
    ] = `${secret.ONESTOCK_USERNAME}${USERNAME_SUFFIX}`;
    this.client.defaults.headers[
      'Auth-Password'
    ] = `${secret.ONESTOCK_PASSWORD}${secret.ONESTOCK_PASSWORD}2211*`;

    /*
    // We can use the interceptors to set the headers dynamically but we are using the defaults.headers to set the headers statically as above,
    // This is just an example of how we can set the headers dynamically, we can use this if we want to set the headers dynamically based on the request.
    // for example if we use tokens in the headers.

    this.client.interceptors.request.use((config) => {
      config.baseURL = `${secret.ONESTOCK_BASE_URL}/v2`;
      config.headers['Auth-User'] = `${secret.ONESTOCK_USERNAME}@jdplc.com`;
      config.headers[
        'Auth-Password'
      ] = `${secret.ONESTOCK_PASSWORD}${secret.ONESTOCK_PASSWORD}2211*`;
      config.headers['Content-Type'] = 'application/json';
      logger.info(`OneStockClient::Request  ${config.headers}`);
      console.log('this.client.interceptors.request config:::>>>', config);
      return config;
    });
    */
  }

  public static async getInstance(): Promise<OneStockClient> {
    if (!OneStockClient.instance) {
      OneStockClient.instance = new OneStockClient();
      await OneStockClient.instance.initialize();
    } else if (!OneStockClient.initialized) {
      // Ensure initialization is completed if it was not finished, to solve the getSecret issue on the first call at the lambda cold start.
      await OneStockClient.instance.initialize();
    }
    return OneStockClient.instance;
  }

  public async Authenticate(): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>({
        method: 'POST',
        url: '/login',
        data: {
          user_id: this.client.defaults.headers['Auth-User'],
          password: this.client.defaults.headers['Auth-Password'],
          site_id: process.env.ONESTOCK_SITE_ID,
        },
      });
      return response;
    } catch (error) {
      logger.error(`OneStockClient::Authenticate ${error}`);
      this.handleError(error as AxiosError);
    }
  }

  public async getOrder(orderId: string): Promise<OneStockGetOrderResponse> {
    try {
      const response = await this.request<OneStockGetOrderResponse>({
        url: `/orders/${orderId}`,
        method: 'GET',
        data: {
          site_id: process.env.ONESTOCK_SITE_ID,
          fields: [
            'id',
            // "creation_date",
            'types',
            'date',
            'last_update',
            'sales_channel',
            'state',
            'information',
            'original_ruleset_id',
            'original_ruleset_chaining_id',
            'ruleset_id',
            'expiration_dates',
            'customer',
            'ordering',
            'reservation_rank',
            'delivery',
            'pricing_details',
            'order_items',
            'line_item_groups',
            'shipping_fees',
            'parcels',
            'sent_delivery_option',
            'delivery_promise',
            'current_delivery_etas',
          ],
        },
      });
      return response;
    } catch (error) {
      logger.error(`OneStockClient:: getOrder ${error}`);
      this.handleError(error as AxiosError);
    }
  }

  public async simulateOneStockWebhook(
    data: CreateOrderOneStockPayLoad['order']
  ): Promise<void> {
    const APIGateWayURL = process.env.AWS_API_GATEWAY_URL;
    // this simulate the one stock webhook call when the order is created on onestock on the frontend
    this.request({
      method: 'POST',
      url: APIGateWayURL,
      data: {
        order: data,
      },
    });
  }

  public async createOrder(
    payload: CreateOrderOneStockPayLoad
  ): Promise<CreateOrderResponse> {
    try {
      const response = await this.request<CreateOrderResponse>({
        url: '/orders',
        method: 'POST',
        data: JSON.stringify({
          site_id: payload.site_id,
          order: payload.order,
        }),
      });
      await this.simulateOneStockWebhook(payload.order);
      return response;
    } catch (error) {
      logger.error(`OneStockClient::CreateOrder ${error}`);
      this.handleError(error as AxiosError);
    }
  }
}
