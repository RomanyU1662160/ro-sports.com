import { OneStockClient } from '@ro-app/clients';

const getToken = async () => {
  const oneStockClient = await OneStockClient.getInstance();
  const token = await oneStockClient.Authenticate();
  console.log('token:::>>>', token);
  return token;
};

const getOrder = async (orderId: string) => {
  const oneStockClient = await OneStockClient.getInstance();
  const order = await oneStockClient.getOrder(orderId);
  console.log('order:::>>>', order);
  return order;
};

// getToken();
getOrder('2790016982');
