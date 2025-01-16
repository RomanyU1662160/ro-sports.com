// import { OneStockClient } from './client';
// import { OneStockError } from './onestock-error';
// import { OneStockSecretManager } from './secret-manager';
// import { AxiosError } from 'axios';

// jest.mock('./secret-manager');
// jest.mock('axios');

// describe('OneStockClient', () => {
//   let secretManagerMock: jest.Mocked<OneStockSecretManager>;

//   beforeEach(() => {
//     secretManagerMock =
//       OneStockSecretManager.getInstance() as jest.Mocked<OneStockSecretManager>;
//     (
//       OneStockSecretManager.getInstance().getSecret as jest.Mock
//     ).mockReturnValue(secretManagerMock);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should initialize the client and set up axios client', async () => {
//     const secret = {
//       ONESTOCK_BASE_URL: 'https://api.onestock.com',
//       ONESTOCK_USERNAME: 'user',
//       ONESTOCK_PASSWORD: 'pass',
//     };
//     secretManagerMock.getSecret.mockResolvedValue(secret);

//     const client = await OneStockClient.getInstance();

//     expect(secretManagerMock.getSecret).toHaveBeenCalled();
//     expect(client).toBeInstanceOf(OneStockClient);
//     expect(client.request).toBeDefined();
//   });

//   // it('should handle errors correctly', () => {
//   //   const client = OneStockClient.getInstance();
//   //   const axiosError = {
//   //     message: 'Request failed',
//   //     response: { status: 404, data: 'Not Found' },
//   //     code: 'ERR_BAD_REQUEST',
//   //   } as AxiosError;

//   //   expect(() => client['handleError'](axiosError)).toThrow(OneStockError);
//   //   try {
//   //     client['handleError'](axiosError);
//   //   } catch (error) {
//   //     expect(error).toBeInstanceOf(OneStockError);
//   //     expect((error as OneStockError).message).toBe('Request failed');
//   //     expect((error as OneStockError).statusCode).toBe(404);
//   //     expect((error as OneStockError).code).toBe('ERR_BAD_REQUEST');
//   //     expect((error as OneStockError).details).toBe('Not Found');
//   //   }
//   // });

//   it('should not reinitialize if already initialized', async () => {
//     const secret = {
//       ONESTOCK_BASE_URL: 'https://api.onestock.com',
//       ONESTOCK_USERNAME: 'user',
//       ONESTOCK_PASSWORD: 'pass',
//     };
//     secretManagerMock.getSecret.mockResolvedValue(secret);

//     const client = await OneStockClient.getInstance();
//     const initializeSpy = jest.spyOn(client as any, 'initialize');

//     await OneStockClient.getInstance();

//     expect(initializeSpy).toHaveBeenCalledTimes(1);
//   });
// });
