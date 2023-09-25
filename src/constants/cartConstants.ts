const DEFAULT_MINI_CART_DATA = {
  cartTitle: '',
  emptyCartMessage: {
    highlightTitle: '',
    description: ''
  },
  estimatedTotal: '',
  miniCartCta: {
    checkoutCtaLabel: {
      label: '',
      value: '',
      openInNewTab: ''
    },
    continueShoppingCtaLabel: {
      label: '',
      value: '',
      openInNewTab: ''
    },
    shopWeeklyAdCtaLabel: {
      label: '',
      value: '',
      openInNewTab: ''
    }
  },
  signIn: {
    registerLink: {
      label: '',
      value: '',
      openInNewTab: ''
    },
    registerMessage: '',
    signInCtaLabel: {
      label: '',
      value: '',
      openInNewTab: ''
    }
  }
};

const cartFormField = {
  invalidEmail: 'Incorrect email format',
  recipientLabel: 'Recipient Email Address',
  notifyCheckBox: 'Notify recipient via email to let them know a physical gift card is on the way.'
};

const availabilityCheck = {
  AddToCart: {
    title: 'Add To Cart',
    isDisable: false
  },

  'In store only': {
    title: 'In store only',
    isDisable: true
  },
  'Out of stock': {
    title: 'Out of stock',
    isDisable: true
  },
  NotifyMe: {
    title: 'Notify Me',
    isDisable: false
  },

  'Online only': {
    title: 'Online only',
    isDisable: false
  },
  'See Options': {
    title: 'See Options',
    isDisable: false
  }
};

export { DEFAULT_MINI_CART_DATA, cartFormField, availabilityCheck };
