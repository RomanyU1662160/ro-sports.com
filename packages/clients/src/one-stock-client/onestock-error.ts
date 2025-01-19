interface IOneStockError {
  statusCode: number;
  details: string | object;
  message: string;
  code: string;
}

export class OneStockError extends Error {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly code: string;
  public readonly details: string | object;

  constructor({ statusCode, details, code, message }: IOneStockError) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.message = message;
    this.code = code;
    this.name = 'OneStockError';
  }
}
