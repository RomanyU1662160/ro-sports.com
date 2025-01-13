import { z } from 'zod';

const CreateOrderResponse = z.object({
  id: z.string(),
});

export type CreateOrderResponse = z.infer<typeof CreateOrderResponse>;
