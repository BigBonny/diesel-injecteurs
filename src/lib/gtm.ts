declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function push(event: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

export function gtmViewItem(product: {
  id: number;
  name: string;
  price: number;
  category?: string;
  brand?: string;
}) {
  push({
    event: 'view_item',
    ecommerce: {
      currency: 'EUR',
      value: product.price,
      items: [
        {
          item_id: String(product.id),
          item_name: product.name,
          price: product.price,
          item_category: product.category || 'Pièces Auto',
          item_brand: product.brand || 'DTI',
          quantity: 1,
        },
      ],
    },
  });
}

export function gtmAddToCart(product: {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  brand?: string;
}) {
  push({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'EUR',
      value: product.price * product.quantity,
      items: [
        {
          item_id: String(product.id),
          item_name: product.name,
          price: product.price,
          item_category: product.category || 'Pièces Auto',
          item_brand: product.brand || 'DTI',
          quantity: product.quantity,
        },
      ],
    },
  });
}

export function gtmBeginCheckout(items: {
  id: number;
  name: string;
  price: number;
  quantity: number;
}[], total: number) {
  push({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'EUR',
      value: total,
      items: items.map((item) => ({
        item_id: String(item.id),
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    },
  });
}

export function gtmPurchase(orderId: string, items: {
  id: number;
  name: string;
  price: number;
  quantity: number;
}[], total: number) {
  push({
    event: 'purchase',
    ecommerce: {
      transaction_id: orderId,
      currency: 'EUR',
      value: total,
      shipping: 0,
      tax: 0,
      items: items.map((item) => ({
        item_id: String(item.id),
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    },
  });
}
