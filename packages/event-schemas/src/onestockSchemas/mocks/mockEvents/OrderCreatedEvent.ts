import { OrderCreatedEvent } from '../../events/orderCreated';

export const mockOrderCreatedEvent = (
  overRides: Partial<OrderCreatedEvent> = {}
): OrderCreatedEvent => {
  const mockOrderCreated: OrderCreatedEvent = {
    account: '603825719481',
    id: '0d079340-135a-c8c6-95c2-41fb8f496c53',
    region: 'eu-west-1',
    source: 'com.ro.sports.oms',
    time: '2024-01-19T14:30:00Z',
    'detail-type': 'OrderCreated',
    detail: {
      data: {
        checkoutLocale: 'en-GB',
        creationDate: 1672531200,
        currency: 'GBP',
        customer: {
          email: 'john.doe@example.com',
          firstName: 'John',
          id: 'CUST123456',
          lastName: 'Doe',
        },
        delivery: {
          address: {
            addressLine1: '123 Main Street',
            country: 'GB',
            postalCode: 'M1 1AA',
          },
          method: 'Standard Delivery',
          price: {
            total: 4.99,
          },
          store: {
            collector: {
              firstName: 'John',
              lastName: 'Doe',
              phoneNumber: '+44123456789',
            },
            storeId: 'STORE123',
          },
        },
        orderId: 'ORD123456789',
        orderItems: [
          {
            isPersonalisedItem: false,
            lineId: 'LINE123',
            price: {
              discountedTotal: 45.0,
              total: 50.0,
              unitPrice: 25.0,
            },
            quantity: 2,
            skuId: 'SKU123456',
          },
          {
            isPersonalisedItem: true,
            lineId: 'LINE124',
            price: {
              discountedTotal: 27.0,
              total: 30.0,
              unitPrice: 30.0,
            },
            quantity: 1,
            skuId: 'SKU789012',
          },
        ],
        payment: {
          address: {
            addressLine1: '123 Main Street',
            country: 'GB',
            postalCode: 'M1 1AA',
          },
        },
        price: {
          discountedTotal: 76.99,
          subTotal: 80.0,
          total: 84.99,
        },
        salesChannel: 'Web',
      },
      metadata: {
        correlationId: '9420e981-2ce3-429c-9dc3-69867635e2ca',
        countryCode: 'GB',
        domain: 'fulfilment',
        fascia: 'JD',
        service: 'OneStockConnector',
        version: '0.1',
      },
    },
  };

  return {
    ...mockOrderCreated,
    ...overRides,
  };
};
