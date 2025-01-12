import { z } from 'zod';

export const BaseEventZ = z.object({
  version: z.string(),
  id: z.string(),
  eventBusName: z.string(),
  detailType: z.string(),
  source: z.literal('com.ro.sports.oms'),
  account: z.string(),
  detail: z.object({
    data: z.object({
      orderId: z.string(),
    }),
    metadata: z.object({
      correlationId: z.string(),
      countryCode: z.string(),
      domain: z.string(),
      fascia: z.string(),
      service: z.string(),
      version: z.string(),
    }),
  }),
});

export type BaseEvent = z.infer<typeof BaseEventZ>;
