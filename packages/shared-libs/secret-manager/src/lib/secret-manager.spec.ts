import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { BaseSecretManager } from './secret-manager';
import { mockClient } from 'aws-sdk-client-mock';

type Test = {
  test: string;
};
class TestSecretManager extends BaseSecretManager<Test> {
  getSecretName = () => {
    return 'test';
  };

  validateSecret = (secret: Test) => {
    return typeof secret.test === 'string';
  };
}

describe('BaseSecretManager', () => {
  let testSecretManager: TestSecretManager;
  const mockSecretManager = mockClient(SecretsManagerClient);

  beforeEach(() => {
    jest.resetAllMocks();
    mockSecretManager.reset();
    testSecretManager = new TestSecretManager();
  });

  it('should fetch and cache secret', async () => {
    mockSecretManager.reset();
    const mockSecret = { test: 'value' };
    mockSecretManager.on(GetSecretValueCommand).resolves({
      SecretString: JSON.stringify(mockSecret),
    });

    const result = await testSecretManager.getSecret();
    expect(result).toEqual(mockSecret);

    // Should use cache on second call
    const cachedResult = await testSecretManager.getSecret();
    expect(cachedResult).toEqual(mockSecret);
    expect(mockSecretManager.commandCalls(GetSecretValueCommand)).toHaveLength(
      1
    );
  });

  it('should throw an error if the secret name is not configured in the .env file', async () => {
    testSecretManager.getSecretName = jest.fn().mockReturnValueOnce('');
    await expect(testSecretManager.getSecret()).rejects.toThrow();
  });

  it('should throw error for invalid secret', () => {
    mockSecretManager
      .on(GetSecretValueCommand)
      .resolvesOnce({ SecretString: JSON.stringify({ invalid: 'test' }) });

    expect(testSecretManager.getSecret()).rejects.toThrow();
  });
});
