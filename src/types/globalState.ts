import { ListResponse } from './cms/shoppingList';

type GlobalState = {
  auth: AuthState;
  checkout: CheckoutState;
  layout: LayoutState;
  list: ListState;
  myAccount: MyAccountState;
  plp: PlpState;
};

type AuthState = {
  heartBeatInfo: HeartBeatInfo;
  myProfileInfo: MyProfileInfo;
  signInInfo: {};
};

type HeartBeatInfo = {
  isLoggedInUser: boolean;
  sessionId: string;
  sessionState: string;
  userName: string;
};

type MyProfileInfo = {
  firstName: string;
  lastName: string;
  createdAt: string;
  email: string;
  phone: string;
  defaultShippingAddressID: string;
  defaultBillingAddressID: string;
  defaultPayment: string;
  taxExempt: string;
  taxExemptState: string;
  taxExemptCompanyName: string;
  taxExemptDate: string;
  shippingAddressIds: string[];
  billingAddressIds: string[];
  order: {};
};

type CheckoutState = {
  cartDeatilsFromRedux: {};
  cartTotalPrice: number;
  orderConfMode: boolean;
  orderSummaryFromRedux: {};
  updateCart: {};
};

type LayoutState = {
  currentRefinedSortBy: string;
  currentSelectedIndex: string;
  lineItemCount: number;
  openMiniCartDrawer: boolean;
  pageType: {
    isCartPage: boolean;
    isCategoryPage: boolean;
    isCheckoutPage: boolean;
    isDiyCategoryPage: boolean;
    isDlpPage: boolean;
    isGiftCardsCategory: boolean;
    isGiftCardsDetailsPage: boolean;
    isHomePage: boolean;
    isLoginPage: boolean;
    isMyAccountPage: boolean;
    isPdpPage: boolean;
    isPlpPage: boolean;
    isSrpPage: boolean;
    isWeeklyAdPage: boolean;
  };
  privacyTermsCmsData: {
    key: string;
    link: {
      label: string;
      openInNewTab: boolean;
      value: string;
    };
  };
  recentlyViewedKeys: [];
  stepperHeaderNumber: number;
  toasterData: {
    message: string;
    open: boolean;
    severity: string;
  };
};

type ListState = {
  shoppingLists: ListResponse[];
};

type MyAccountState = {
  accountViewOrder: {
    orderDetails: {};
    showOrderFullDetails: boolean;
  };
  addEditAddressInfo: {
    addressProps: {};
    showAddressForm: boolean;
    type: string;
  };
  addPaymentInfo: {
    addressFormMode: string;
    addressFormValues: {};
    isAddAddressForm: boolean;
    isAddPaymentForm: boolean;
  };
  addressList: [];
  canadaProvinceCodeList: [];
  countryStateList: {};
  defaultAddressId: null;
  defaultPaymentId: null;
  giftCardBalanceContent: {
    description: string;
    email: string;
  };
  helperText: string;
  isAddressListEmpty: boolean;
  isPaymentsEmpty: boolean;
  nonShippableStateList: [];
  payments: [];
  phoneNumber: string;
};

type PlpState = {
  hitsPerPage: number;
  purchaseRange: {
    maxPurchaseAmount: number;
    minPurchaseAmount: number;
  };
  recipientEmail: string;
  searchKey: string;
  selctedGiftCardPrice: number;
};

type ReduxCallback = (
  state: GlobalState
) => AuthState | CheckoutState | LayoutState | ListState | MyAccountState | PlpState;

export type {
  GlobalState,
  AuthState,
  CheckoutState,
  LayoutState,
  ListState,
  MyAccountState,
  PlpState,
  HeartBeatInfo,
  MyProfileInfo,
  ReduxCallback
};
