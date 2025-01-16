import { BaseHttpClient } from '@ro-app/http-client';
import { logger } from '@ro-app/pino-logger';
import { AxiosError } from 'axios';
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
    const USERNAME_SUFFIX = process.env.ONESTOCK_USER_SUFFIX;
    const PASSWORD_SUFFIX = process.env.ONESTOCK_PASSWORD_SUFFIX;
    const URL_SUFFIX = process.env.ONESTOCK_URL_SUFFIX;
    if (!USERNAME_SUFFIX || !PASSWORD_SUFFIX || !URL_SUFFIX) {
      logger.error(
        'Error in OneStockClient',
        'USERNAME_SUFFIX, PASSWORD_SUFFIX or URL_SUFFIX is not defined in your env file'
      );
    }
    this.client.defaults.baseURL = `${secret.ONESTOCK_BASE_URL}/${URL_SUFFIX}`;
    this.client.defaults.headers['Content-Type'] = 'application/json';
    this.client.defaults.headers['Accept'] = 'application/json';
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
}
