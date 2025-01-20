import { z } from 'zod';

export const OrderStateChangedZ = z.object({
  account: z.string(),
  detail: z.object({
    data: z.object({
      date: z.number(),
      new_state: z.string(),
      old_state: z.string(),
      order_id: z.string(),
    }),
    metadata: z.object({
      correlationId: z.string(),
      domain: z.literal('fulfilment'),
      service: z.literal('OneStockConnector'),
      preciseTime: z
        .string()
        .describe(
          'Timestamp of the message with milliseconds e.g. 2022-02-01T18:41:53.000Z'
        ),
      version: z.string(),
      workspace: z.string().optional(),
    }),
  }),
  'detail-type': z.literal('order_state_changed'),
  id: z.string(),
  region: z.string(),
  resources: z.array(z.string()),
  source: z.literal('com.ro.sports.oms'),
  time: z.string().datetime({ offset: true }),
  version: z.string(),
});
