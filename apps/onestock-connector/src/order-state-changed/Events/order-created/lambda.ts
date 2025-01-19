import middy from '@middy/core';
import { APIGatewayEvent } from 'aws-lambda';
import { AppResponse, AppContext, app } from './app';
import {
  loggerMiddleware,
  validateEventPayloadMiddleware,
} from '@ro-app/middy-middlewares';
import { CreateOrderOneStockPayLoadZ } from '@ro-app/event-schemas';

const dependencies = (): middy.MiddlewareObj<
  APIGatewayEvent,
  AppResponse,
  Error,
  AppContext
> => {
  return {
    name: 'dependencies',
    before: async ({ context }) => {
      context.invocationId = context.awsRequestId;
      context.eventBusName = process.env.EVENT_BUS_NAME as string;
    },
  };
};
export const handler = middy()
  .use(dependencies())
  .use(
    loggerMiddleware({
      message: 'Order created event received',
      level: 'info',
      data: {
        message: 'Order created event received',
        event: 'order-created',
        context: {
          domain: 'fulfillment',
          service: 'onestock-connector',
        },
      },
    })
  )
  .use(
    validateEventPayloadMiddleware<AppContext['parsedPayload']>(
      CreateOrderOneStockPayLoadZ
    )
  )
  .handler(app);
