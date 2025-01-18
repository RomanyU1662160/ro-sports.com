import {
  OneStockGetOrderResponse,
  OrderCreatedEvent,
} from '@ro-app/event-schemas';
import { OrderItemSchema } from 'packages/event-schemas/src/onestockSchemas/api/_common/order-item';

type OrderCreatedEventData = OrderCreatedEvent['detail']['data'];

export const mapOneStockOrderResponseToOrderCreatedEvent = (
  order: OneStockGetOrderResponse
): OrderCreatedEventData => {
  const orderCreatedEventData: OrderCreatedEventData = {
    orderId: order.id,
    checkoutLocale: 'en-GB',
    creationDate: order.date,
    currency: order.pricing_details.currency,
    customer: {
      email: order.customer.email,
      firstName: order.customer.first_name,
      id: order.customer.external_id,
      lastName: order.customer.last_name,
    },
    delivery: {
      address: {
        addressLine1: order.delivery.destination.address.lines[0],
        country: order.delivery.destination.address.regions.country.code,
        postalCode: order.delivery.destination.address.zip_code,
      },
      method: order.information.shipping_method,
      price: {
        total: order.pricing_details.price,
      },
      store: {
        collector: {
          firstName: order.delivery.destination.address.contact.first_name,
          lastName: order.delivery.destination.address.contact.last_name,
          phoneNumber: order.delivery.destination.address.contact.phone_number,
        },
        storeId: order.delivery.destination.address.id,
      },
    },
    delivery_promise: order.delivery_promise,
    orderItems: order.order_items.map((item: OrderItemSchema) => ({
      isPersonalisedItem: item.information.personalised_item,
      lineId: item.id,
      skuId: order.id,
      price: {
        discountedTotal: item.pricing_details.price,
        unitPrice: item.pricing_details.original_price,
        total: item.pricing_details.price,
      },
      product: {
        id: item.item_id,
        image: item.information.product_image_url,
        name: item.information.product_name,
        size: item.information.size,
        wasPrice: item.information.was_price,
      },
      quantity: item.quantity,
    })),
    payment: {
      contact: {
        firstName: order.pricing_details.address.contact.first_name,
        lastName: order.pricing_details.address.contact.last_name,
        phoneNumber: order.pricing_details.address.contact.phone_number,
      },
      address: {
        addressLine1: order.pricing_details.address.lines[0],
        additionalAddressLines: order.pricing_details.address.lines.slice(1),
        city: order.pricing_details.address.city,
        country: order.pricing_details.address.regions.country.code,
        postalCode: order.pricing_details.address.zip_code,
        region: order.pricing_details.address.regions.country?.code,
      },
    },
    price: {
      //Price for all line items without discounts
      subTotal: order.order_items.reduce(
        (sum: number, item: OrderItemSchema) =>
          sum + item.pricing_details.original_price,
        0
      ),
      // total price for the order (inc. shipping) without discounts
      total: order.pricing_details.original_price,
      //final total price for the order inc. discounts and shipping (discountedTotal)
      discountedTotal: order.pricing_details.price,
    },
  };
  return orderCreatedEventData;
};
