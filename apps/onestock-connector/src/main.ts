import { OneStockClient } from '@ro-app/clients';
import { mockCreateOrderPayload } from '@ro-app/event-schemas';
import { logger } from '@ro-app/pino-logger';

export const testGetToken = async () => {
  const oneStockClient = await OneStockClient.getInstance();
  const token = await oneStockClient.Authenticate();
  logger.info('token:::>>>', token);

  return token;
};

export const testGetOrder = async (orderId: string) => {
  const oneStockClient = await OneStockClient.getInstance();
  const order = await oneStockClient.getOrder(orderId);
  console.log('order:::>>>', order);
  return order;
};

export const testCreateOrder = async () => {
  const oneStockClient = await OneStockClient.getInstance();
  const response = await oneStockClient.createOrder(mockCreateOrderPayload);
  console.log('response:::>>>', response);
  return response;
};

//getToken();
// getOrder('2790016982');
// createOrder();
