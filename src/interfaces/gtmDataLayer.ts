// Google Tag Manager DataLayer Object
export interface GtmDataLayer {
  anonymousUserId: string;
  email?: string; // used by eMarSys for specific events
  emailHash?: string; // unused. proposed for eMarSys
  event: string;
  marketingChannel?: string;
  pageType: string;
}

export interface CartGtmDataLayer extends GtmDataLayer {
  paymentMethod: string;
  shipping: string;
  t_Coupon?: string;
  tax: string;
  transactionId: string;
  transactionProducts: TransactionProduct[];
  transactionSubtotal: number; // Commission Junction (CJ)
  transactionTotal: string;
  wholeOrderDiscount: number; // Commission Junction (CJ)
}

export interface CategoryGtmDataLayer extends GtmDataLayer {
  category: string;
  department: string;
}

export interface DynamicCategoryGtmDataLayer extends GtmDataLayer {
  dcRule: string;
  dcRuleTitle: string;
  numResults: number;
}

export interface DepartmentGtmDataLayer extends GtmDataLayer {
  department: string;
}

export interface ErrorGtmDataLayer extends GtmDataLayer {
  errorType: string;
}

export interface ProductGtmDataLayer extends GtmDataLayer {
  brand?: string;
  category?: string;
  collection?: string;
  color?: string;
  department?: string;
  inStock?: string;
  inStoreOnly?: string;
  name: string;
  new?: string;
  onlineOnly?: string;
  onSale?: string;
  oosOnline?: string;
  pattern?: string;
  sku: string;
  subcategory?: string;
  theme?: string;
}

export interface SearchGtmDataLayer extends GtmDataLayer {
  numResults: number;
  searchKeywords: string;
}

export interface TransactionProduct {
  brand?: string;
  category?: string;
  collection?: string;
  color?: string;
  department?: string;
  discount?: number; // Commission Junction (CJ) - HL does not currently use product level discounts
  entryTotal: string;
  inStock?: string;
  inStoreOnly: string;
  name: string;
  new?: string;
  onlineOnly: string;
  onSale: string;
  oosOnline?: string;
  pattern?: string;
  price: string;
  quantity: number;
  sku: string;
  subcategory?: string;
  theme?: string;
}

// TODO: make this struct like so we can use it to populate page type
// This is the list of valid page types as per Commission Junction. Types not used for HL's industry were ommitted
var validCjPageTypes: string[] = [
  'accountCenter',
  'accountSignUp',
  'cart',
  'category',
  'conversionConfirmation',
  'department',
  'homepage',
  'productDetail',
  'searchResults',
  'storeLocator',
  'subCategory'
];

// TODO: make this struct like so we can use it to populate page type
// This is the list of valid marketing channels as per Commission Junction.
var validCjMarketingChannels: string[] = [
  'Affiliate',
  'Direct_Navigation',
  'Display',
  'Email',
  'Search',
  'Social'
];

// TODO: make this struct like so we can use it to populate page type
// all valid GA4 values for the `event` property of the GTM DataLayer
var validGa4Events: string[] = [
  'add_payment_info',
  'add_shipping_info',
  'add_to_cart',
  'add_to_wishlist',
  'begin_checkout',
  'carousel_click',
  'checkout_error',
  'click',
  'contact_form_submit',
  'content_collapse',
  'content_expand',
  'email_subscribe',
  'email_unsubscribe',
  'file_download',
  'find_store_by_locator',
  'find_store_near_me',
  'get_store_directions',
  'item_review_abandon',
  'item_review_submit',
  'login',
  'login_attempt',
  'navigation_click',
  'notify_when_in_stock',
  'page_view',
  'phone_click',
  'purchase',
  'remove_from_cart',
  'reset_password',
  'scroll',
  'search_filter',
  'search_sort',
  'select_item',
  'select_promotion',
  'share',
  'sign_up',
  'sign_up_attempt',
  'social_click',
  'view_item',
  'view_item_list',
  'view_promotion',
  'view_cart',
  'video_complete',
  'video_progress',
  'video_start',
  'view_all_search_results',
  'view_cart',
  'view_more_search_results',
  'view_search_results'
];
