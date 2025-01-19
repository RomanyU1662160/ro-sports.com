// packages/shared-libs/middy-middlewares/src/validation-middleware.ts
import { MiddlewareObj } from '@middy/core';
import { z } from 'zod';
import { Context } from 'aws-lambda';

type AppContext<T> = Context & {
  parsedPayload: T;
};

export const validateEventPayloadMiddleware = <T>(
  schema: z.ZodSchema
): MiddlewareObj<T, unknown, Error, AppContext<T>> => ({
  before: async ({ event, context }) => {
    context.parsedPayload = schema.parse(event);
  },
});
