import { middyMiddlewares } from './middy-middlewares';

describe('middyMiddlewares', () => {
  it('should work', () => {
    expect(middyMiddlewares()).toEqual('middy-middlewares');
  });
});
