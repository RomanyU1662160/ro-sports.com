import { handler as OrderCreatedHandler } from './order-state-changed/Events/order-created/lambda';

export { OrderCreatedHandler };
// import { OneStockClient } from '@ro-app/clients';
// import { mockCreateOrderPayload } from '@ro-app/event-schemas';

// const getToken = async () => {
//   const oneStockClient = await OneStockClient.getInstance();
//   const token = await oneStockClient.Authenticate();
//   console.log('token:::>>>', token);
//   return token;
// };

// const getOrder = async (orderId: string) => {
//   const oneStockClient = await OneStockClient.getInstance();
//   const order = await oneStockClient.getOrder(orderId);
//   console.log('order:::>>>', order);
//   return order;
// };

// const createOrder = async () => {
//   const oneStockClient = await OneStockClient.getInstance();
//   const response = await oneStockClient.createOrder(mockCreateOrderPayload);
//   console.log('response:::>>>', response);
//   return response;
// };

// getToken();
//getOrder('2790016982');
//createOrder();
