import { Ga4EcommerceItem } from './ga4EcommerceItem';

export interface Ga4Ecommerce {
  // an anonymously generated user Id. used for Commission Junction
  anonymous_user_id: string;
  ecommerce: {
    // Array of items used for ecommerce e.g. [item_name, item_brand, item_variant]
    items: Ga4EcommerceItem[];
  };
  email?: string; // used by eMarSys for specific events
  event: string;
  // A logged in users Id used for Commission Junction
  user_id: string;
}

// events: `view_item_list`, `select_item`
export interface Ga4ItemEcommerce extends Ga4Ecommerce {
  event: 'view_item_list' | 'select_item';
  // The ID of the list in which the item was presented to the user. e.g. related_products
  item_list_id: string;
  // The name of the list in which the item was presented to the user. e.g. Related products
  item_list_name: string;
}

// events: `view_promotion`, `select_promotion`
export interface Ga4PromotionEcommerce extends Ga4Ecommerce {
  event: 'view_promotion' | 'select_promotion';
  // The name of the promotional creative. e.g. summer_banner2
  creative_name: string;
  // The name of the promotional creative slot associated with the event. e.g. featured_app_1
  creative_slot: string;
  // The physical location associated with the item.
  // e.g.the physical store location
  // It's recommended to use the Google Place ID that corresponds to the associated item.
  location_id: string;
  // The name of the promotion associated with the event. e.g. Summer Sale
  promotion_name: string;
  // The ID of the promotion associated with the event. e.g. P_12345
  promotion_id: string;
}

// events: `view_item`, `add_to_cart`, `remove_from_cart`, `add_to_wishlist`, `view_cart`
export interface Ga4ViewItemEcommerce extends Ga4Ecommerce {
  // The currency, in 3-letter ISO 4217 format.
  //   Multiple currencies per event is not supported.
  //   Currency is required if you set value, for revenue metrics to be computed accurately.
  // e.g.USD
  currency: string;
  // The monetary value of the event. e.g. 49
  value: number;
}

// events: `begin_checkout`
export interface Ga4BeginCheckoutEcommerce extends Ga4ViewItemEcommerce {
  // The coupon name/code associated with the item. e.g. SUMMER30
  coupon: string;
}

// events: `add_shipping_info`
export interface Ga4AddShippingInfoEcommerce extends Ga4BeginCheckoutEcommerce {
  // The shipping tier selected for delivery of the purchased item.  e.g. Ground, Air, Next-day
  shipping_tier: string;
}

// events: `add_payment_info`
export interface Ga4AddPaymentInfoEcommerce extends Ga4BeginCheckoutEcommerce {
  // The chosen method of payment. e.g. Credit card, COD
  payment_type: string;
}

// events: `purchase`
export interface Ga4PurchaseEcommerce extends Ga4BeginCheckoutEcommerce {
  // Shipping cost associated with a transaction. e.g. 10
  shipping: number;
  // Tax cost associated with a transaction. e.g. 10
  tax: number;
  // The unique identifier of a transaction. e.g. OID123456
  transaction_id: string;
}
