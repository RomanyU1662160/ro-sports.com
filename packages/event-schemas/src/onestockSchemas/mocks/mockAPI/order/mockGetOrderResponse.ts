import { OneStockGetOrderResponse } from '../../../api/order/getOrderResponse';

export const mockGetOrderResponse: OneStockGetOrderResponse = {
  id: 'ORD-123456789',
  customer: {
    external_id: 'CUST-987654',
    email: 'john.doe@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '+1234567890',
  },
  date: 1704200400000, // January 2, 2024
  delivery: {
    destination: {
      address: {
        id: 'ADDR-123',
        city: 'New York',
        contact: {
          first_name: 'John',
          last_name: 'Doe',
          phone_number: '+1234567890',
        },
        coordinates: {
          lon: -73.935242,
          lat: 40.73061,
        },
        lines: ['123 Main Street', 'Apt 4B'],
        regions: {
          country: {
            code: 'US',
          },
        },
        zip_code: '10001',
      },
    },
  },
  information: {
    fully_paid: true,
    has_dropshipped_items: false,
    locale: 'en-US',
    payment_method: 'credit_card',
    payment_provider: 'stripe',
    shipping_method: 'standard',
  },
  last_update: 1704200400000,
  pricing_details: {
    currency: 'USD',
    address: {
      id: 'ADDR-123',
      city: 'New York',
      contact: {
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '+1234567890',
      },
      lines: ['123 Main Street', 'Apt 4B'],
      regions: {
        country: {
          code: 'US',
        },
      },
      zip_code: '10001',
    },
    original_price: 129.99,
    price: 129.99,
    price_including_tax: 141.64,
    price_excluding_tax: 129.99,
  },
  shipping_fees: [
    {
      currency: 'USD',
      original_price: 9.99,
      price: 9.99,
    },
  ],
  original_ruleset_id: 'RULE-001',
  sales_channel: 'web',
  state: 'processing',
  types: ['standard'],
  on_available_stock: {},
  sent_delivery_option: {
    eta_start: 1704459600000, // January 5, 2024
    eta_end: 1704546000000, // January 6, 2024
  },
  line_item_groups: [
    {
      id: 'LIG-123',
      order_item_id: 'ITEM-001',
      endpoint_id: 'EP-001',
      quantity: 1,
      parcel_id: 'PARCEL-001',
      last_update: 1704200400000,
      state: 'processing',
      index_ranges: [
        {
          from: 0,
          to: 1,
        },
      ],
      historization: {
        references_ids: ['REF-001'],
      },
    },
  ],
  parcels: [
    {
      id: 'PARCEL-001',
      delivery: {
        destination: {
          address: {
            id: 'ADDR-123',
            city: 'New York',
            contact: {
              first_name: 'John',
              last_name: 'Doe',
              phone_number: '+1234567890',
            },
            lines: ['123 Main Street', 'Apt 4B'],
            regions: {
              country: {
                code: 'US',
              },
            },
            zip_code: '10001',
          },
        },
        origin: {
          endpoint_id: 'EP-001',
        },
      },
      date: 1704200400000,
      last_update: 1704200400000,
      state: 'processing',
      user_id: 'USER-001',
      information: {
        parentFulfilmentId: 'FUL-001',
        picksData: [
          {
            quantity: 1,
            reorderFlag: false,
            skuId: 'SKU-001',
            state: 'processing',
          },
        ],
      },
      historization: {
        references_ids: ['REF-001'],
      },
      line_item_index_ranges: [
        {
          from: 0,
          to: 1,
        },
      ],
    },
  ],
  parcel_ids: ['PARCEL-001'],
  ruleset_id: 'RULE-001',
  order_items: [
    {
      id: 'ITEM-001',
      item_id: 'PROD-001',
      quantity: 1,
      pricing_details: {
        currency: 'USD',
        original_price: 129.99,
        price: 129.99,
        price_including_tax: 141.64,
        price_excluding_tax: 129.99,
        original_unit_price: 129.99,
        unit_price: 129.99,
      },
      information: {
        dropshipped_item: false,
        personalised_item: false,
        product_image_url: 'https://example.com/images/product-001.jpg',
        product_name: 'Premium T-Shirt',
        size: 'L',
        was_price: 149.99,
      },
      date: 1704200400000,
    },
  ],
};
