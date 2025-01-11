import { Request } from '@middy/core';
import { logger } from '@ro-app/pino-logger';
import { redactSensitiveData } from './utils/redactFields';

export type MiddleWareConfig = {
  message: string | Record<string, unknown>;
  level?: 'info' | 'error' | 'warn' | 'debug';
  data?: Record<string, unknown>;
};
const defaults = {
  level: process.env.LOG_LEVEL || 'info',
};

export const loggerMiddleware = <TEvent = unknown, TResult = unknown>(
  config: MiddleWareConfig
) => {
  const options = { ...defaults, ...config };

  const middlewareBefore = async (request: Request<TEvent, TResult>) => {
    logger.info({
      type: 'REQUEST',
      message: options.message,
      data: redactSensitiveData(options.data),
      event: request.event,
      invocationID: request.context.invocationId,
    });
  };

  const middlewareAfter = (request: Request<TEvent, TResult>) => {
    logger.info({
      type: 'RESPONSE',
      message: options.message,
      data: redactSensitiveData(options.data),
      event: request.event,
      invocationID: request.context.invocationId,
    });
  };
  const middlewareError = async (request: Request<TEvent, TResult>) => {
    logger.error({
      type: 'ERROR',
      message: options.message,
      data: redactSensitiveData(options.data),
      event: request.event,
      invocationID: request.context.invocationId,
    });
  };

  return {
    before: middlewareBefore,
    after: middlewareAfter,
    onError: middlewareError,
  };
};
