/* Using axios-mock-adapter:
in this test I will use axios-mock-adapter to mock Axios requests and be able to test the replies functionality of the BaseHttpClient class.
This is often more reliable than jest-mock-axios and nock for testing axios requests. It allows you to mock requests and responses,
 and it also provides a way to test error handling.
 */

/*
The BaseHttpClient uses a custom Axios instance (this.client) created with axios.create().
 This instance is completely independent of the global axios instance.
 By attaching the mock adapter to httpClient['client'], we ensure that the mock adapter intercepts all requests made by the BaseHttpClient.
I added a default base URL (http://localhost) in the TestHttpClient constructor to ensure that relative URLs like /test are resolved correctly.
*/
import { AxiosError } from 'axios';
import { BaseHttpClient } from './http-client';
import MockAdapter from 'axios-mock-adapter';

class TestHttpClient extends BaseHttpClient {
  constructor({ baseURL = 'http://localhost' }) {
    super({ baseURL });
  }

  protected handleError(error: AxiosError): never {
    throw new Error(`Test error: ${error.message}`);
  }
}

describe('baseHttpClient', () => {
  let httpClient: TestHttpClient;
  let mockAxios: any;

  beforeEach(() => {
    httpClient = new TestHttpClient({ baseURL: 'http://localhost' });
    mockAxios = new MockAdapter(httpClient['client']); // Attaching the mock adapter to httpClient['client'] because httpClient['client'] is the Axios instance used by BaseHttpClient
  });

  afterEach(() => {
    mockAxios.restore();
    mockAxios.resetHandlers();
  });

  it('should make a successful request', async () => {
    const mockData = { data: 'test' };
    mockAxios.onGet('/test').reply(200, mockData);

    const result = await httpClient.request({ method: 'GET', url: '/test' });

    expect(result).toEqual(mockData);
  });

  it('should use the configured URL when making a request', async () => {
    const mockData = { data: 'test' };
    mockAxios.onGet('http://localhost/test').reply(200, mockData);

    const result = await httpClient.request({
      method: 'GET',
      url: 'http://localhost/test',
    });

    expect(result).toEqual(mockData);
  });

  it('should handle an error when the request fails', async () => {
    mockAxios.onGet('/test').reply(500);

    await expect(
      httpClient.request({ method: 'GET', url: '/test' })
    ).rejects.toThrow('Test error: Request failed with status code 500');
  });

  it('should retry on 500 network errors§', async () => {
    const mockData = { data: 'test' };
    let attempts = 0;

    mockAxios.onGet('/test').reply(() => {
      attempts++;
      return attempts < 3 ? [500, null] : [200, mockData];
    });

    const result = await httpClient.request({ method: 'GET', url: '/test' });
    expect(attempts).toBe(3);
    expect(result).toEqual(mockData);
  });

  it('should retry on 503 network errors', async () => {
    const mockData = { data: 'test' };
    let attempts = 0;

    mockAxios.onGet('/test').reply(() => {
      attempts++;
      return attempts < 3 ? [503, null] : [200, mockData];
    });

    const result = await httpClient.request<typeof mockData>({
      url: '/test',
      method: 'GET',
    });

    expect(attempts).toBe(3);
    expect(result).toEqual(mockData);
  });
});
