import { awsServerless } from './aws-serverless';

describe('awsServerless', () => {
  it('should work', () => {
    expect(awsServerless()).toEqual('aws-serverless');
  });
});
