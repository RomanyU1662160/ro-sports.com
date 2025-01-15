import { z } from 'zod';

export const validateEvent = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};
