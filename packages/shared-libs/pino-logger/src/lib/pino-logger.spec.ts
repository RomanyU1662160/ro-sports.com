import { pinoLogger } from './pino-logger';

describe('pinoLogger', () => {
  it('should work', () => {
    expect(pinoLogger()).toEqual('pino-logger');
  });
});
