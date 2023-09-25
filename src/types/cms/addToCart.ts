export type AddToCartRequest = {
  sku: string;
  variantKey: string;
  quantity: number;
  customerId?: string;
  amount?: number;
  recipientEmail?: string;
};

export type UpdateCartRequest = {
  lineItemId: string;
  variantKey: string;
  quantity: number;
};

export type CartResponse = {
  id: string;
  customerId: string;
  anonymousId: string;
  lineItems: LineItem[];
  totalLineItemQuantity: number;
  inventoryMessages: string[];
  orderSummary: OrderSummary;
  cartSubTotalForFreeShippingEligibleItems: number;
  paymentDetails: PaymentDetails;
};

type PaymentDetails = {
  cardHolderName: string;
  maskedNumber: string;
  last4Digits: string;
  expirationMonth: number;
  expirationYear: number;
  cardType: string;
  paymentMethod: string;
};

type LineItem = {
  id: string;
  productId: string;
  productKey: string;
  name: string;
  productSlug: string;
  variant: LineItemVariant;
  originalPricePerQuantity: number;
  discountedPricePerQuantity: number;
  totalPrice: number;
  quantity: number;
};

type LineItemVariant = {
  id: number;
  sku: string;
  key: string;
};

type OrderSummary = {
  merchandisePrice: number;
  merchandiseDiscount: number;
  merchandiseSubTotal: number;
  standardShipping: number;
  shippingDiscount: number;
  additionalShipping: number;
  carrierSurCharge: number;
  shippingSubTotal: number;
  totalPrice: number;
  totalSaved: number;
  totalTax?: number;
  giftCardProcessingFee?: number;
};
