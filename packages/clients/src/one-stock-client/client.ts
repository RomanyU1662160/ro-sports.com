import { BaseHttpClient } from '@ro-app/http-client';
import { logger } from '@ro-app/pino-logger';
import { AxiosError, AxiosInstance } from 'axios';
import { OneStockError } from './onestock-error';
import { IOneStockSecretConfig, OneStockSecretManager } from './secret-manager';

export class OneStockClient extends BaseHttpClient {
  private static instance: OneStockClient;
  private static secretManager: OneStockSecretManager =
    OneStockSecretManager.getInstance();
  private static initialized = false;

  private constructor() {
    super();
  }

  protected handleError(error: AxiosError): never {
    logger.error('Error in OneStockClient', error);
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
    this.client.defaults.baseURL = `${secret.ONESTOCK_BASE_URL}/v2`;
    this.client.defaults.headers['Content-Type'] = 'application/json';
    this.client.defaults.headers['Accept'] = 'application/json';
    this.client.defaults.headers[
      'Auth-User'
    ] = `${secret.ONESTOCK_USERNAME}@jdplc.com`;
    this.client.defaults.headers[
      'Auth-Password'
    ] = `${secret.ONESTOCK_PASSWORD}${secret.ONESTOCK_PASSWORD}2211*`;
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
}
