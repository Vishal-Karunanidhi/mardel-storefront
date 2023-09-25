import { Variant } from '@Types/cms/schema/pdp/pdpData.schema';

export interface OrderDetails {
  __typename: string;
  anonymousId: string;
  billingAddress?: Address;
  billingSameAsShipping: boolean;
  cartNumber: number;
  cartState?: string;
  cartSubTotalForFreeShippingEligibleItems: number;
  customerEmail: string;
  customerId?: string;
  displayGiftCardPayment: boolean;
  giftMessage: GiftMessage;
  giftOrder: boolean;
  id: string;
  inventoryMessages?: string;
  lineItemCount: number;
  lineItems: LineItem[];
  orderDate: string;
  orderNumber: string;
  orderSummary: OrderSummary;
  paymentDetails: PaymentDetails;
  shippingAddress: Address;
  totalLineItemQuantity?: number;
}

export interface Address {
  __typename: string;
  additionalStreetInfo: string;
  city: string;
  company?: string;
  country: string;
  email?: string;
  firstName: string;
  id?: string;
  key?: string;
  lastName: string;
  phone: string;
  postalCode: string;
  state: string;
  addressLineOne: string;
  addressLineTwo: string;
}

export interface GiftMessage {
  __typename: string;
  giftMessage?: string;
  giftRecieverName?: string;
  giftSenderName?: string;
}

export interface LineItem {
  discountedPricePerQuantity: number;
  id: string;
  name: string;
  originalPricePerQuantity: number;
  pdpUrl: string;
  productId: string;
  productKey: string;
  productSlug: string;
  quantity: number;
  totalPrice: number;
  variant: Variant;
}

export interface OrderSummary {
  additionalShipping: number;
  carrierSurCharge: number;
  giftCardProcessingFee: number;
  isGCCoversFullPayment: boolean;
  merchandisePrice: number;
  merchandiseDiscount: number;
  merchandiseSubTotal: number;
  retailDeliveryFee: number;
  shippingSubTotal: number;
  standardShipping: number;
  totalPrice: number;
  totalSaved: number;
  totalTax: number;
}

// properties are `any` type since all we need for now is to know whether they are null or not.
export interface PaymentClassification {
  applePay?: any;
  paypal?: any;
  giftCard?: any;
  creditCard?: any;
}

export interface PaymentDetails {
  paymentMethod: string;
  paymentClassification: PaymentClassification;
}
