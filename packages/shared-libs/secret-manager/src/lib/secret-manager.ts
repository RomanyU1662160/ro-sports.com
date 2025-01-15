import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

export abstract class BaseSecretManager<T> {
  private readonly client: SecretsManagerClient;
  private readonly ttl: number; // Time to live in hours
  private cache: Map<string, { secret: T; timestamp: number }>;

  protected abstract getSecretName(): string;
  protected abstract validateSecret(secret: T): boolean;
  protected abstract getInstance(): BaseSecretManager<T>;

  constructor(ttl = 1) {
    this.cache = new Map();
    this.ttl = ttl * 60 * 60 * 1000; // Convert hours to milliseconds
    try {
      this.client = new SecretsManagerClient({
        region: process.env.AWS_REGION || 'eu-west-1',
      });
    } catch (error) {
      console.log('error:::>>>', error);
      throw error;
    }
  }

  async getSecret(forceRefresh = false): Promise<T> {
    const secretName = this.getSecretName();
    console.log('secretName:::>>>', secretName);
    try {
      if (!secretName) {
        console.log(
          'Secret name is not configured in your .env file',
          secretName
        );
        throw new Error(
          `Secret name: ${secretName},  is not configured in your .env file`
        );
      }
      const cachedSecret = this.cache.get(secretName);
      console.log('cachedSecret:::>>>', cachedSecret);

      const isCached = this.isCacheValid(secretName);
      console.log('isCached:::>>>', isCached);

      if (!forceRefresh && isCached && cachedSecret) {
        console.log('Using cached secret');
        return JSON.parse(JSON.stringify(cachedSecret.secret)) as T;
      }
      console.log('retrieving secret from AWS Secrets Manager');
      const command = new GetSecretValueCommand({
        SecretId: secretName,
      });

      const response = await this.client.send(command);
      console.log('response:::>>>', response);

      const secretValue = response.SecretString;
      if (!secretValue) {
        console.log(
          'Secret value is empty or not found in AWS Secrets Manager'
        );
        throw new Error(
          'Secret value is empty or not found in AWS Secrets Manager'
        );
      }

      const parsedSecret = JSON.parse(secretValue) as T;
      console.log('parsedSecret:::>>>', parsedSecret);
      if (!this.validateSecret(parsedSecret)) {
        console.log('Secret is invalid');
        throw new Error('Secret validation failed, invalid secret format');
      }

      // store the secret in the cache
      this.cache.set(secretName, {
        secret: parsedSecret,
        timestamp: Date.now(),
      });

      return parsedSecret;
    } catch (error) {
      console.log('error retrieving Secret:::>>>', error);
      throw error;
    }
  }

  private isCacheValid(secretName: string) {
    const cachedSecret = this.cache.get(secretName);
    if (!cachedSecret) return false;

    const now = Date.now();
    return now - cachedSecret.timestamp < this.ttl;
  }

  private clearCache() {
    this.cache.clear();
  }
}
