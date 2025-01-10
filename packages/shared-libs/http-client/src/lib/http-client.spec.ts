import { httpClient } from './http-client';

describe('httpClient', () => {
  it('should work', () => {
    expect(httpClient()).toEqual('http-client');
  });
});
