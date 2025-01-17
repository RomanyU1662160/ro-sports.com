import { OneStockClient } from '@ro-app/clients';
import { logger } from '@ro-app/pino-logger';
import { mapOneStockOrderResponseToOrderCreatedEvent } from '../mappers/orderCreated.mapper';

export class OrderService {
  private oneStockClient: OneStockClient;

  constructor(oneStockClient: OneStockClient) {
    this.oneStockClient = oneStockClient;
  }

  async processOrderCreatedEvent(orderId: string) {
    try {
      const order = await this.oneStockClient.getOrder(orderId);
      logger.info('Successfully retrieved order:', order);
      logger.info('OrderService.processOrderCreatedEvent', order);

      const enrichedData = mapOneStockOrderResponseToOrderCreatedEvent(order);
      logger.info('Successfully enriched data:', enrichedData);
      return enrichedData;
    } catch (error) {
      console.log('error:::>>>', error);
      logger.error(`Error processing order:, ${error}`);
      throw error;
    }
  }
}
