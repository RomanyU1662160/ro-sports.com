// onestock-client.spec.ts
import { OneStockClient } from './client';
import { OneStockSecretManager } from './secret-manager';
import { logger } from '@ro-app/pino-logger';
import { AxiosError } from 'axios';
import { OneStockError } from './onestock-error';
import { mockClient } from 'aws-sdk-client-mock';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

/*
The OneStockClient has a dependency on the OneStockSecretManager class.
 The OneStockSecretManager class is responsible for fetching the secrets from AWS Secrets Manager. The OneStockClient class uses the secrets to set up the axios client and make requests to the OneStock API.
 We need to mock the OneStockSecretManager class to prevent the OneStockClient from making actual requests to AWS Secrets Manager.
 We use the mockClient function from the aws-sdk-client-mock library to mock the SecretsManagerClient class.
 */
// Mock AWS Secrets Manager
const secretsManagerMock = mockClient(SecretsManagerClient);
// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the logger
jest.mock('@ro-app/pino-logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('OneStockClient', () => {
  const mockSecret = {
    ONESTOCK_BASE_URL: 'https://api.onestock.test',
    ONESTOCK_USERNAME: 'testuser',
    ONESTOCK_PASSWORD: 'testpass',
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    jest.resetAllMocks();
    secretsManagerMock.reset();

    // Setup mock AWS Secrets Manager response
    secretsManagerMock.on(GetSecretValueCommand).resolves({
      SecretString: JSON.stringify(mockSecret),
    });

    // Reset static properties
    (OneStockClient as any).instance = undefined;
    (OneStockClient as any).initialized = false;
    (OneStockClient as any).secretManager = OneStockSecretManager.getInstance();

    // Set up environment variables
    process.env.ONESTOCK_USER_SUFFIX = '@test.com';
    process.env.ONESTOCK_PASSWORD_SUFFIX = 'test';
    process.env.ONESTOCK_URL_SUFFIX = 'v2';
    process.env.ONESTOCK_SECRET_NAME = 'test/onestock/secret';
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.ONESTOCK_USER_SUFFIX;
    delete process.env.ONESTOCK_PASSWORD_SUFFIX;
    delete process.env.ONESTOCK_URL_SUFFIX;
    delete process.env.ONESTOCK_SECRET_NAME;
  });

  describe('getInstance', () => {
    it('should create a new instance and initialize it', async () => {
      const client = await OneStockClient.getInstance();

      expect(client).toBeInstanceOf(OneStockClient);
      expect(secretsManagerMock.calls()).toHaveLength(1);
    });

    it('should return the same instance on subsequent calls', async () => {
      const client1 = await OneStockClient.getInstance();
      const client2 = await OneStockClient.getInstance();

      expect(client1).toBe(client2);
    });
  });

  //   it('should throw OneStockError with correct properties', async () => {
  //     const client = await OneStockClient.getInstance();
  //     const mockAxiosError = {
  //       message: 'Test error',
  //       response: {
  //         status: 400,
  //         data: 'Error details',
  //       },
  //       code: 'TEST_ERROR',
  //     } as AxiosError;

  //     try {
  //       (client as any).handleError(mockAxiosError);
  //       mockedAxios.request.mockRejectedValue(mockAxiosError);
  //     } catch (error) {
  //       expect(error).toBeInstanceOf(OneStockError);
  //       expect(error).toMatchObject({
  //         message: 'Test error',
  //         statusCode: 400,
  //         code: 'TEST_ERROR',
  //         details: 'Error details',
  //       });
  //       expect(logger.error).toHaveBeenCalledTimes(2);
  //     }
  //   });

  //   it('should handle error with missing response data', async () => {
  //     const client = await OneStockClient.getInstance();
  //     const mockAxiosError = {
  //       message: 'Network error',
  //       code: undefined,
  //       response: undefined,
  //     } as AxiosError;

  //     try {
  //       (client as any).handleError(mockAxiosError);
  //       fail('Should have thrown an error');
  //     } catch (error) {
  //       expect(error).toBeInstanceOf(OneStockError);
  //       expect(error).toMatchObject({
  //         message: 'Network error',
  //         statusCode: 500,
  //         code: 'UNKNOWN_ERROR',
  //         details: 'No details',
  //       });
  //     }
  //   });
  // });

  describe('setupAxiosClient', () => {
    it('should properly set up axios client with correct headers', async () => {
      const client = await OneStockClient.getInstance();
      const axiosClient = (client as any).client;

      expect(axiosClient.defaults.baseURL).toBe('https://api.onestock.test/v2');
      expect(axiosClient.defaults.headers['Content-Type']).toBe(
        'application/json'
      );
      expect(axiosClient.defaults.headers['Accept']).toBe('application/json');
      expect(axiosClient.defaults.headers['Auth-User']).toBe(
        'testuser@test.com'
      );
      expect(axiosClient.defaults.headers['Auth-Password']).toBe(
        'testpasstestpass2211*'
      );
    });

    it('should log error when environment variables are missing', async () => {
      delete process.env.ONESTOCK_USER_SUFFIX;

      await OneStockClient.getInstance();

      expect(logger.error).toHaveBeenCalledWith(
        'Error in OneStockClient',
        'USERNAME_SUFFIX, PASSWORD_SUFFIX or URL_SUFFIX is not defined in your env file'
      );
    });
  });

  describe('request handling', () => {
    it('should successfully make a request', async () => {
      const client = await OneStockClient.getInstance();
      const mockResponse = { data: 'test data' };

      (client as any).client.request = jest.fn().mockResolvedValue({
        data: mockResponse,
      });

      const result = await client.request({
        method: 'GET',
        url: '/test',
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle request errors', async () => {
      const client = await OneStockClient.getInstance();
      const mockError = {
        message: 'Request failed',
        response: {
          status: 404,
          data: 'Not found',
        },
        code: 'NOT_FOUND',
      } as AxiosError;

      (client as any).client.request = jest.fn().mockRejectedValue(mockError);

      try {
        await client.request({
          method: 'GET',
          url: '/test',
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(OneStockError);
        expect(error).toMatchObject({
          message: 'Request failed',
          statusCode: 404,
          code: 'NOT_FOUND',
          details: 'Not found',
        });
      }
    });
  });
});
