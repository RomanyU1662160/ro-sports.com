import { z } from 'zod';

const PricingDetailsSchema = z.object({
  currency: z.string(),
  original_price: z.number(),
  price: z.number(),
  price_including_tax: z.number(),
  price_excluding_tax: z.number(),
  original_unit_price: z.number().optional(),
  unit_price: z.number().optional(),
});

export const OrderItemSchemaZ = z.object({
  id: z.string(),
  item_id: z.string(),
  quantity: z.number(),
  pricing_details: PricingDetailsSchema,
  information: z.object({
    dropshipped_item: z.boolean(),
    personalised_item: z.boolean(),
    product_image_url: z.string(),
    product_name: z.string(),
    size: z.string(),
    was_price: z.number(),
  }),
  date: z.number(),
});

export type OrderItemSchema = z.infer<typeof OrderItemSchemaZ>;
