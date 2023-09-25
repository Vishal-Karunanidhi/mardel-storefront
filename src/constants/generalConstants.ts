export default {
  currencies: {
    USD: '$',
    INR: '',
    EURO: ''
  }
};

const pageTitle = {
  '/': 'Hobby Lobby Arts &amp; Crafts Stores',
  cart: 'Your Shopping Cart',
  checkout: 'Proceed to Checkout'
};

const defaultHomeBCrumbs = {
  key: '/',
  label: 'Home',
  value: '/',
  openInNewTab: false
};

const PAGE_PATH_TYPE = [
  {
    path: '/',
    key: 'isHomePage'
  },
  {
    path: '/login',
    key: 'isLoginPage'
  },
  {
    path: '/my-account',
    key: 'isMyAccountPage'
  },
  {
    path: '/c/',
    key: 'isCategoryPage'
  },
  {
    path: '/search',
    key: 'isSrpPage'
  },
  {
    path: '/p/',
    key: 'isPdpPage'
  },
  {
    path: '/cart',
    key: 'isCartPage'
  },
  {
    path: '/checkout',
    key: 'isCheckoutPage'
  },
  {
    path: 'orderConfirmation',
    key: 'isOrderConfirmationPage'
  }
];

const defaultPageType = {
  isHomePage: true,
  isLoginPage: false,
  isMyAccountPage: false,
  isCategoryPage: false,
  isDlpPage: false,
  isPlpPage: false,
  isSrpPage: false,
  isGiftCardsCategory: false,
  isGiftCardsDetailsPage: false,
  isPdpPage: false,
  isCartPage: false,
  isCheckoutPage: false,
  isWeeklyAdPage: false,
  isDiyCategoryPage: false,
  isPageTypeUpdated: false,
  currentPath: '/'
};

const errorPages = {
  pageNotFound: '404',
  internalServerError: '500'
};

const productType = {
  GIFT_CARD: 'gift-card-type',
  GIFT_CARD_ORDER: 'Gift Card Type'
};

const productPrice = {
  isDiscountAlwaysOn:
    '*Marked price shown in strikethrough. Discounts Provided every day. Marked prices reflect general U.S market value for similiar products.'
};

const SESSION_TIMEOUT_USER_CONST = 'sessionTimeoutUserType';

const algoliaClickEvents = {
  PRODUCT_CLICKED: 'Product Clicked',
  PRODUCT_ADDED_TO_CART: 'Product Added To Cart'
};

export {
  pageTitle,
  defaultHomeBCrumbs,
  PAGE_PATH_TYPE,
  defaultPageType,
  errorPages,
  productType,
  productPrice,
  SESSION_TIMEOUT_USER_CONST,
  algoliaClickEvents
};
