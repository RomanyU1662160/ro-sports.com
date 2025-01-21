import { OneStockClient } from '@ro-app/clients';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { OrderService } from '../../services/orderService';
import {
  mockCreateOrderPayload,
  OrderCreatedEvent,
} from '@ro-app/event-schemas';
import { createPutEventsCommand, putEvent } from '@ro-app/aws-serverless';
import { logger } from '@ro-app/pino-logger';

export type OrderCreatedEventData = OrderCreatedEvent['detail']['data'];

export type AppContext = Context & {
  invocationId: string;
  eventBusName: string;
  parsedPayload: OrderCreatedEventData;
};
export type AppResponse = NonNullable<unknown>;

export const app = async (_event: APIGatewayEvent, context: AppContext) => {
  const oneStockClient = await OneStockClient.getInstance();
  const orderService = new OrderService(oneStockClient);
  const { id } = await orderService.createOneStockOrder(mockCreateOrderPayload); // this will create an order in OneStock and call the API Gateway to simulate the Webhook behavior
  logger.info(`start processing order created event for order id: ${id}`);
  const enrichedData = await orderService.processOrderCreatedEvent(id);

  const message = {
    version: '0.1',
    correlationId: context.invocationId,
    eventBusName: context.eventBusName,
    workspace: 'ro-workspace',
    service: 'OneStockConnector',
    domain: 'fulfilment',
    countryCode: 'UK',
    fascia: 'RO-UK',
    detailType: 'OrderCreated',
    source: 'com.ro.sports.oms',
    data: enrichedData,
  };

  const command = createPutEventsCommand<OrderCreatedEventData>(message);
  const result = await putEvent(command);
  console.log('attempts:::>>>', result.$metadata.attempts);
  if (result.FailedEntryCount !== 0) {
    logger.error(`Failed to send event to EventBridge: ${result}`);
    return {
      statusCode: result.$metadata.httpStatusCode,
      body: JSON.stringify({
        message: `Failed to send event to EventBridge ${result.$metadata.requestId}`,
      }),
    };
  }

  logger.info(`Successfully processed order created event for order id: ${id}`);
  return {
    statusCode: result.$metadata.httpStatusCode,
    body: JSON.stringify({ id }),
  };
};
