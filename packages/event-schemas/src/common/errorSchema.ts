import { z } from 'zod';

export const ErrorSchemaZ = z.object({
  code: z.string(),
  details: z.string(),
  message: z.string(),
});

export type ErrorSchema = z.infer<typeof ErrorSchemaZ>;
