import { loggerMiddleware, MiddleWareConfig } from '../logger-middleware';
import { Request } from '@middy/core';
import { logger } from '@ro-app/pino-logger';

// In theses tests we are mocking the logger, we spy on the logger methods to check if they are called with the right arguments
// We also test the middleware functions before, after and onError
/*
// We also can use the jest.mock to mock the logger module, rather than using jest.spyOn
// jest.mock('@ro-app/pino-logger', () => ({
//   logger: {
//     info: jest.fn(),
//     error: jest.fn(),
//   },
// }));
*/

const middlewareConfig: MiddleWareConfig = {
  message: 'test',
  level: 'info',
  data: { test: 'test' },
};

const mockRequest: Partial<Request> = {
  event: { test: 'test-event' },
  context: { invocationId: 'test-invocationId' },
};

describe('loggerMiddleware', () => {
  it('should work', () => {
    const middleware = loggerMiddleware(middlewareConfig);
    expect(middleware).toBeDefined();
    expect(middleware.before).toBeDefined();
    expect(middleware.after).toBeDefined();
    expect(middleware.onError).toBeDefined();
  });
});

describe("loggerMiddleware's before", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log a request with default level', async () => {
    const middleware = loggerMiddleware(middlewareConfig);
    const spy = jest.spyOn(logger, 'info');
    await middleware.before(mockRequest as Request);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      type: 'REQUEST',
      message: middlewareConfig.message,
      data: middlewareConfig.data,
      event: mockRequest.event,
      invocationID: mockRequest.context.invocationId,
    });
  });
});

describe("loggerMiddleware's after", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should log a request with default level', async () => {
    const middleware = loggerMiddleware(middlewareConfig);
    const spy = jest.spyOn(logger, 'info');

    middleware.after(mockRequest as Request);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      type: 'RESPONSE',
      message: middlewareConfig.message,
      data: middlewareConfig.data,
      event: mockRequest.event,
      invocationID: mockRequest.context.invocationId,
    });
  });
});

describe("loggerMiddleware's onError", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log a request with default level', async () => {
    const middleware = loggerMiddleware(middlewareConfig);
    const spy = jest.spyOn(logger, 'error');
    middleware.onError(mockRequest as Request);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
