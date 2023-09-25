export interface Ga4EcommerceItem {
  // A product affiliation to designate a supplying company or brick and mortar store location.
  //   It’s sent as event-level only with the `Purchase` event
  // e.g. Google Store
  affiliation: string;
  // The coupon name/code associated with the item. e.g. SUMMER30
  coupon: string;
  // The currency, in 3-letter ISO 4217 format.
  //   Multiple currencies per event is not supported.
  //   Currency is required if you set value, for revenue metrics to be computed accurately.
  // e.g. USD
  currency: string;
  // The monetary discount value associated with the item. e.g. 10
  discount: number;
  // The index/position of the item in a list. e.g. 0,1,2
  index: string;
  // The brand of the item. e.g. Brand name
  item_brand: string;
  // The category of the item.
  // If used as part of a category hierarchy or taxonomy then this will be the first category.
  // e.g. Apparel
  item_category: string;
  // The category of the item.
  // If used as part of a category hierarchy or taxonomy then this will be the second category.
  // e.g. Adult
  item_category2: string;
  // The category of the item.
  // If used as part of a category hierarchy or taxonomy then this will be the third category.
  // e.g. Shirts
  item_category3: string;
  // The category of the item.
  // If used as part of a category hierarchy or taxonomy then this will be the fourth category.
  // e.g. Crew
  item_category4: string;
  // The category of the item.
  // If used as part of a category hierarchy or taxonomy then this will be the fifth category.
  // e.g. Short sleeve
  item_category5: string;
  // The ID of the item.
  //   item_id or item_name is required.
  // e.g. SKU_12346
  item_id: string;
  // The ID of the list in which the item was presented to the user. e.g. related_products
  item_list_id: string;
  // The name of the list in which the item was presented to the user. e.g. Related products
  item_list_name: string;
  // The name of the item.
  //   item_id or item_name is required.
  // e.g. Grey Women's Tee
  item_name: string;
  // The item variant or unique code or description for additional item details/options. e.g. gray
  item_variant: string;
  // The monetary price of the item, in units of the specified currency parameter. e.g. 100
  price: number;
  // Item quantity.
  //   If not set, quantity is set to 1.
  // e.g. 1,2,3
  quantity: number;
}
