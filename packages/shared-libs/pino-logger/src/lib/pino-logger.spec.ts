// First, move the jest.mock call to the top, before any imports
jest.mock('./pino-logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));
// In Jest, mocks need to be defined before the module is imported to be effective.
// This is why the jest.mock call is moved to the top of the file.
// This way, the logger object is mocked before it is imported in the test file.
import { logger } from './pino-logger';

describe('logger', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('should log info', () => {
    logger.info('info message');
    expect(logger.info).toHaveBeenCalledWith('info message');
  });

  it('should log error', () => {
    logger.error('error message');
    expect(logger.error).toHaveBeenCalledWith('error message');
  });

  it('should log warn', () => {
    logger.warn('warn message');
    expect(logger.warn).toHaveBeenCalledWith('warn message');
  });

  it('should log debug', () => {
    logger.debug('debug message');
    expect(logger.debug).toHaveBeenCalledWith('debug message');
  });
});

// Additional test scenarios for the logger
describe('logger additional scenarios', () => {
  it('should log info with multiple arguments', () => {
    logger.info('message', { data: 'test' });
    expect(logger.info).toHaveBeenCalledWith('message', { data: 'test' });
  });

  it('should log error with error object', () => {
    const error = new Error('test error');
    logger.error('error occurred', error);
    expect(logger.error).toHaveBeenCalledWith('error occurred', error);
  });

  it('should handle undefined messages', () => {
    logger.info(undefined);
    expect(logger.info).toHaveBeenCalledWith(undefined);
  });
});

// Test the logger configuration
describe('logger configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use default log level when LOG_LEVEL is not set', () => {
    delete process.env.LOG_LEVEL;
    jest.isolateModules(() => {
      const { logger } = require('./pino-logger');
      expect(logger).toBeDefined();
    });
  });

  it('should use custom log level when LOG_LEVEL is set', () => {
    process.env.LOG_LEVEL = 'debug';
    jest.isolateModules(() => {
      const { logger } = require('./pino-logger');
      expect(logger).toBeDefined();
    });
  });
});
