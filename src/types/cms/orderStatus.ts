type CancelOrderRequest = {
  orderNumber: string;
};

type CancelOrderResponse = {
  cancelOrder: CancelOrderDetails;
};

type OrderLookupRequest = {
  orderNumber: string;
  billingZipcode: string;
  email: string;
};

type shippingAddress = {
  shippingAddress: address;
};

type billingAddress = {
  billingAddress: address;
};

type address = {
  key: string;
  country: string;
  firstName: string;
  lastName: string;
  addressLineOne: string;
  addressLineTwo: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  addressVerified: boolean;
};

type paymentsMethod = {
  paymentIndex?: number;
  payments: {
    cardType: string[];
    last4Digits: string;
    amount: string;
    method?: string;
  };
};

type CancelOrderDetails = {
  errorMessage: string;
  order: orderDetails;
};
type orderDetails = {
  orderNumber: string;
  orderState: string;
};
export type {
  CancelOrderRequest,
  CancelOrderResponse,
  OrderLookupRequest,
  shippingAddress,
  billingAddress,
  paymentsMethod
};
