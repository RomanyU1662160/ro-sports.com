import { loggerMiddleware } from '../logger-middleware';

describe('middyMiddlewares', () => {
  it('should work', () => {
    expect(loggerMiddleware({ level: 'info', message: 'test' })).toEqual(
      'middy-middlewares'
    );
  });
});
