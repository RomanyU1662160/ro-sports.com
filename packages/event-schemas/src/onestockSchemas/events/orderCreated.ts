import { z } from 'zod';

export const OrderCreatedZ = z.object({
  account: z.string().describe('AWS account identifier. e.g. 123451235123'),
  time: z.string().describe('AWS message timestamp. e.g. 2022-02-01T18:41:53Z'),
  detail: z.object({
    data: z.object({
      orderId: z.string().describe('Unique identifier for the order'),
      checkoutLocale: z
        .string()
        .describe('Locale used during checkout (Language-country) en-GB')
        .optional(),
      creationDate: z.number().describe('Timestamp when the order was created'),
      currency: z.string().describe('Currency used for the order'),
      customer: z.object({
        email: z.string().email().describe('Email address of the customer'),
        firstName: z.string().describe('First name of the customer'),
        id: z.string().describe('Unique JD Customer ID').optional(),
        lastName: z.string().describe('Last name of the customer'),
      }),
      delivery: z.object({
        address: z.object({
          addressLine1: z
            .string()
            .describe('First line of the delivery address'),
          country: z
            .string()
            .describe('2-letter ISO Country Code of the Delivery'),
          postalCode: z.string().describe('Zip or Postcode of the Delivery'),
        }),
        method: z.string().describe('Delivery method').optional(),
        price: z.object({
          total: z.number().describe('Total cost shipping'),
        }),
        store: z
          .object({
            collector: z
              .object({
                firstName: z
                  .string()
                  .describe('First name of the person collecting the order')
                  .optional(),
                lastName: z
                  .string()
                  .describe('Last name of the person collecting the order')
                  .optional(),
                phoneNumber: z
                  .string()
                  .describe('Phone number of the person collecting the order')
                  .optional(),
              })
              .optional(),
            storeId: z.string().describe('Store ID').optional(),
          })
          .optional(),
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
      orderItems: z.array(
        z.object({
          isPersonalisedItem: z
            .boolean()
            .describe('Whether the item is personalised'),
          lineId: z.string().describe('Unique identifier for the order item'),
          price: z.object({
            discountedTotal: z
              .number()
              .describe('Total price of all units, after discounts'),
            total: z.number().describe('Total price for all units'),
            unitPrice: z.number().describe('Individual Unit Price'),
          }),
          quantity: z.number().int().describe('Quantity of the item ordered'),
          skuId: z.string().describe('Unique identifier for the item'),
        })
      ),
      payment: z.object({
        contact: z
          .object({
            firstName: z
              .string()
              .describe('First name of the person paying')
              .optional(),
            lastName: z
              .string()
              .describe('Last name of the person paying')
              .optional(),
            phoneNumber: z
              .string()
              .describe('Phone number of the person paying')
              .optional(),
          })
          .optional(),
        address: z
          .object({
            addressLine1: z
              .string()
              .describe('First line of the billing address'),
            additionalAddressLines: z.array(z.string()).describe('').optional(),
            city: z.string().describe('City of the billing address').optional(),
            country: z
              .string()
              .describe('2-letter ISO Country Code of the billing address'),
            postalCode: z.string().describe('Zip or Postcode of the Delivery'),
            region: z.string().optional(),
          })
          .describe("The customer's billing address"),
      }),
      price: z.object({
        discountedTotal: z
          .number()
          .describe(
            'Total value of the order, including shipping, after discounts'
          ),
        subTotal: z
          .number()
          .describe('Total value of the order, before shipping'),
        total: z
          .number()
          .describe('Total value of the order, including shipping'),
      }),
      salesChannel: z
        .string()
        .describe('The source of the order (Web/App/Kiosk)')
        .optional(),
    }),
    metadata: z.object({
      correlationId: z
        .string()
        .describe(
          'Unique message ID message e.g. 9420e981-2ce3-429c-9dc3-69867635e2ca'
        ),
      countryCode: z.string().describe('ISO CountryCode of the Fascia e.g. GB'),
      domain: z
        .string()
        .describe('JD Domain that owns the message e.g. fulfilment'),
      fascia: z.string().describe('JD fascia e.g. JD'),
      service: z
        .string()
        .describe('Service description e.g. OneStockConnector'),
      version: z.string().describe('Version of the DETAIL message e.g. 0.1'),
    }),
  }),
  'detail-type': z
    .literal('OrderCreated')
    .describe('AWS Event Name. e.g. OrderCreated'),
  id: z
    .string()
    .describe('AWS unique ID - e.g. UUID 0d079340-135a-c8c6-95c2-41fb8f496c53'),
  region: z.string().describe('AWS region. e.g. us-west-1'),
  source: z
    .literal('com.ro.sports.oms')
    .describe('AWS Event source e.g. com.jdsports.oms'),
});

export type OrderCreatedEvent = z.infer<typeof OrderCreatedZ>;
