import { CreateOrderOneStockPayLoad } from '../../../api/order/createOrderPayload';

export const mockCreateOrderPayload: CreateOrderOneStockPayLoad = {
  order: {
    types: ['ffs'],
    date: 1716478616,
    information: {
      fully_paid: true,
      has_dropshipped_items: false,
    },
    original_ruleset_id: 'ecomappjditstdhd',
    sales_channel: 'ecom_jd_it',
    delivery: {
      destination: {
        address: {
          lines: ['1', 'Via Roma'],
          city: 'Roma',
          zip_code: '00100',
          regions: {
            country: {
              code: 'IT',
            },
          },
          contact: {
            first_name: 'shipping-first-name',
            last_name: 'shipping-last-name',
            phone_number: '1234567890',
          },
        },
      },
    },
    delivery_promise: {
      original_delivery_option: {
        carbon_footprint: 1,
        cost: 1,
        cutoff: 1712331000,
        delivery_method: 'standard_home_delivery',
        destination: {
          location: {
            country: 'IT',
            zip_code: '00120',
          },
        },
        eta_end: 1712610001,
        eta_start: 1712527200,
        shipment_number: 1,
        status: 'valid',
      },
      sent_delivery_option: {
        eta_start: 1712527200,
        eta_end: 1712610001,
      },
    },
    customer: {
      external_id: '132a440d-683e-4883-b665-0164b2b3b256',
      email: 'customer-afd457d3-a994-4f21-bf32-4636825026ba@email.com',
      first_name: 'shipping-first-name',
      last_name: 'shipping-last-name',
      phone_number: '1234567890',
    },
    pricing_details: {
      price: 104.99,
      currency: 'EUR',
      address: {
        lines: ['1', 'Via Roma'],
        city: 'Roma',
        zip_code: '00100',
        regions: {
          country: {
            code: 'IT',
          },
        },
        contact: {
          first_name: 'billing-first-name',
          last_name: 'billing-last-name',
          phone_number: '1234567890',
        },
      },
    },
    order_items: [
      {
        item_id: 'test05white_1',
        quantity: 1,
        pricing_details: {
          price: 100,
        },
        information: {
          personalised_item: false,
          dropshipped_item: false,
          product_image_url: 'https://i8.amplience.net/i/jpl/jd_709869_a',
        },
      },
    ],
    shipping_fees: [
      {
        price: 4.99,
        currency: 'EUR',
      },
    ],
  },
};
