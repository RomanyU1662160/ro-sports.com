import { z } from 'zod';
import { AddressSchema } from './contact';
import { HistorizationSchema, IndexRangeSchema } from './line-item-group';

const ParcelInformationSchema = z.object({
  parentFulfilmentId: z.string(),
  picksData: z.array(
    z.object({
      quantity: z.number(),
      reorderFlag: z.boolean(),
      skuId: z.string(),
      state: z.string(),
    })
  ),
});

export const ParcelSchemaZ = z.object({
  id: z.string(),
  delivery: z.object({
    destination: z.object({
      address: AddressSchema,
    }),
    origin: z.object({
      endpoint_id: z.string(),
    }),
  }),
  date: z.number(),
  last_update: z.number(),
  state: z.string(),
  user_id: z.string(),
  information: ParcelInformationSchema,
  historization: HistorizationSchema,
  line_item_index_ranges: z.array(IndexRangeSchema),
});
