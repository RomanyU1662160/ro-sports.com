// packages/shared-libs/middy-middlewares/src/validation-middleware.ts
import { MiddlewareObj } from '@middy/core';
import { validateEvent } from '@ro-app/event-schemas';
import { z } from 'zod';

export const validationEventSchemaMiddleware = <T>(
  schema: z.ZodSchema<T>
): MiddlewareObj => ({
  before: async (handler) => {
    handler.event = validateEvent(schema, handler.event);
  },
});
