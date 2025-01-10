import { secretManager } from './secret-manager';

describe('secretManager', () => {
  it('should work', () => {
    expect(secretManager()).toEqual('secret-manager');
  });
});
