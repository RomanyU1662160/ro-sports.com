import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import axiosRetry from 'axios-retry';
import { StatusCodes } from 'http-status-codes';

export interface IHttpClient {
  request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}
export abstract class BaseHttpClient implements IHttpClient {
  protected readonly client: AxiosInstance;
  protected config: AxiosRequestConfig;

  protected abstract handleError(error: AxiosError): Promise<never>;

  constructor(baseConfig: AxiosRequestConfig = {}) {
    this.config = baseConfig;
    this.client = axios.create({ timeout: 10000, ...baseConfig });
    this.setUpRetry();
  }

  // Configure retry behavior
  private setUpRetry() {
    axiosRetry(this.client, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,

      // Retry on service unavailable, network errors, or idempotent requests
      retryCondition: (error: AxiosError) =>
        error.response?.status === StatusCodes.SERVICE_UNAVAILABLE ||
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        (error.response?.status ? error.response.status >= 500 : false),
    });
  }

  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }
}
