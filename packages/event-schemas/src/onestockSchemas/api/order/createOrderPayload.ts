import { z } from 'zod';
import { ContactZ, CustomerZ } from '../_common/contact';

export const CreateOrderOneStockPayLoadZ = z.object({
  site_id: z.string(),
  order: z.object({
    id: z.string(),
    types: z.array(z.string()),
    date: z.string(),
    information: z.object({
      fully_paid: z.boolean(),
      has_dropshipped_items: z.boolean(),
    }),
    original_ruleset_id: z.literal('ecomappjditstdhd'),
    sales_channel: z.literal('ecom_jd_it'),
    delivery: z.object({
      destination: z.object({
        address: z.object({
          lines: z.array(z.string()),
          city: z.string(),
          zip_code: z.string().optional(),
          regions: z
            .object({
              country: z.string(),
            })
            .optional(),
        }),
        contact: ContactZ,
      }),
    }),
    delivery_promise: z
      .object({
        original_delivery_option: z.object({
          carbon_footprint: z.number(),
          cost: z.number(),
          cutoff: z.number(),
          delivery_method: z.string(),
          destination: z.object({
            location: z.object({
              country: z.string(),
              zip_code: z.string(),
            }),
          }),
          eta_end: z.number(),
          eta_start: z.number(),
          shipment_number: z.number(),
          status: z.string(),
        }),
      })
      .optional(),
    customer: CustomerZ,
    pricing_details: z.object({
      price: z.number(),
      currency: z.string(),
      address: z.object({
        lines: z.array(z.string()),
        city: z.string(),
        zip_code: z.string(),
        regions: z.object({
          country: z.string(),
        }),
      }),
      contact: ContactZ,
    }),
    order_items: z.array(
      z.object({
        item_id: z.string(),
        quantity: z.number(),
        pricing_details: z.object({
          price: z.number(),
        }),
        information: z
          .object({
            personalised_item: z.boolean(),
            dropshipped_item: z.boolean(),
            product_image_url: z.string(),
          })
          .optional(),
      })
    ),
    shipping_fees: z.array(
      z.object({
        price: z.number(),
        currency: z.string(),
      })
    ),
  }),
});

export type CreateOrderOneStockPayLoad = z.infer<
  typeof CreateOrderOneStockPayLoadZ
>;
