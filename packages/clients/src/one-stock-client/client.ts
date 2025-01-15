import { BaseHttpClient } from '@ro-app/http-client';
import { logger } from '@ro-app/pino-logger';
import { AxiosError } from 'axios';
import { OneStockError } from './onestock-error';

export class OneStockClient extends BaseHttpClient {
  private static client: OneStockClient;

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
}
