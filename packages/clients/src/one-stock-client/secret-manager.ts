import { BaseSecretManager } from '@ro-app/secret-manager';

export interface IOneStockSecretConfig {
  ONESTOCK_BASE_URL: string;
  ONESTOCK_USERNAME: string;
  ONESTOCK_PASSWORD: string;
}
export class OneStockSecretManager extends BaseSecretManager<IOneStockSecretConfig> {
  private static instance: OneStockSecretManager;

  private constructor() {
    super();
  }

  public static getInstance(): OneStockSecretManager {
    if (!OneStockSecretManager.instance) {
      OneStockSecretManager.instance = new OneStockSecretManager();
    }
    return OneStockSecretManager.instance;
  }

  protected getSecretName = (): string => {
    const secretNameInEnv = process.env.AWS_ONE_STOCK_SECRET_NAME as string;
    return secretNameInEnv;
  };

  protected validateSecret = (secret: IOneStockSecretConfig): boolean => {
    // Validate the secret object to ensure it has the required properties, this is typed by the T generic type parameter passed to the BaseSecretManager
    return (
      !!secret.ONESTOCK_BASE_URL &&
      !!secret.ONESTOCK_USERNAME &&
      !!secret.ONESTOCK_PASSWORD
    );
  };
}
