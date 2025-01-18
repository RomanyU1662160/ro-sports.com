import { OneStockClient } from '@ro-app/clients';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { OrderService } from '../../services/orderService';
import {
  mockCreateOrderPayload,
  OrderCreatedEvent,
} from '@ro-app/event-schemas';

export type AppContext = Context & {
  invocationId: string;
  eventBusName: string;
  parsedPayload: OrderCreatedEvent['detail']['data'];
};
export type AppResponse = NonNullable<unknown>;

export const app = async (event: APIGatewayEvent, context: AppContext) => {
  console.log('Event:', event.body);
  console.log('Context.invocationId:', context.invocationId);
  const oneStockClient = await OneStockClient.getInstance();
  const orderService = new OrderService(oneStockClient);
  const { id } = await orderService.createOneStockOrder(mockCreateOrderPayload); // this will create an order in OneStock and call the API Gateway to simulate the Webhook behavior
  return {
    statusCode: 200,
    body: JSON.stringify({ id }),
  };
};
