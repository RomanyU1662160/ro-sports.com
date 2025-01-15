import { z } from 'zod';

export const IndexRangeSchema = z.object({
  from: z.number(),
  to: z.number(),
});

export const HistorizationSchema = z.object({
  references_ids: z.array(z.string()),
});

export const LineItemGroupZ = z.object({
  id: z.string(),
  order_item_id: z.string(),
  endpoint_id: z.string().optional(),
  quantity: z.number(),
  parcel_id: z.string().optional(),
  last_update: z.number(),
  state: z.string(),
  index_ranges: z.array(IndexRangeSchema),
  historization: HistorizationSchema,
});
