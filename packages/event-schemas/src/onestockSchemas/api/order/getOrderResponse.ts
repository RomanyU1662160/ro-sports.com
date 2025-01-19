import { z } from 'zod';
import { AddressSchema } from '../_common/contact';
import { LineItemGroupZ } from '../_common/line-item-group';
import { ParcelSchemaZ } from '../_common/parcel';
import { OrderItemSchemaZ } from '../_common/order-item';

export const OneStockGetOrderResponseSchemaZ = z.object({
  id: z.string(),
  customer: z.object({
    external_id: z.string(),
    email: z.string().email(),
    first_name: z.string(),
    last_name: z.string(),
    phone_number: z.string(),
  }),
  date: z.number(),
  delivery: z.object({
    destination: z.object({
      address: AddressSchema,
    }),
  }),
  delivery_promise: z
    .object({
      original_delivery_option: z
        .object({
          carbon_footprint: z.number().optional(),
          cost: z.number().optional(),
          cutoff: z.number().optional(),
          delivery_method: z.string().optional(),
          destination: z
            .object({
              location: z
                .object({
                  country: z.string(),
                  zip_code: z.string(),
                })
                .optional(),
              eta_end: z.number().optional(),
              eta_start: z.number().optional(),
              shipment_number: z.string().optional(),
              status: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
      sent_delivery_option: z
        .object({
          eta_end: z.number().optional(),
          eta_start: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
  information: z.object({
    fully_paid: z.boolean(),
    has_dropshipped_items: z.boolean(),
    locale: z.string(),
    payment_method: z.string(),
    payment_provider: z.string(),
    shipping_method: z.string(),
  }),
  last_update: z.number(),
  pricing_details: z.object({
    currency: z.string(),
    address: AddressSchema,
    original_price: z.number(),
    price: z.number(),
    price_including_tax: z.number(),
    price_excluding_tax: z.number(),
  }),
  shipping_fees: z.array(
    z.object({
      currency: z.string(),
      original_price: z.number(),
      price: z.number(),
    })
  ),
  original_ruleset_id: z.string(),
  sales_channel: z.string(),
  state: z.string(),
  types: z.array(z.string()),
  on_available_stock: z.record(z.unknown()),
  sent_delivery_option: z.object({
    eta_end: z.number(),
    eta_start: z.number(),
  }),
  line_item_groups: z.array(LineItemGroupZ),
  parcels: z.array(ParcelSchemaZ),
  parcel_ids: z.array(z.string()),
  ruleset_id: z.string(),
  order_items: z.array(OrderItemSchemaZ),
});

export type OneStockGetOrderResponse = z.infer<
  typeof OneStockGetOrderResponseSchemaZ
>;
