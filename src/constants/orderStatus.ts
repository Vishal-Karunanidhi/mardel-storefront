import { defaultHomeBCrumbs } from '@Constants/generalConstants';
const olBreadCrumbs = {
  links: [
    defaultHomeBCrumbs,
    {
      key: 'Customer Service',
      label: 'Customer Service',
      value: '/customer-service',
      openInNewTab: false
    },
    {
      key: 'Order Status',
      label: 'Order Status',
      value: 'null',
      openInNewTab: false
    }
  ]
};

const defaultFormValue = {
  orderNumber: '',
  billingZipcode: '',
  email: ''
};

const defaultErrorMessage = {
  isOrderNumberError: false,
  isBillingZipCodeError: false,
  isEmailError: false
};

const formFields = [
  {
    label: 'ORDER NUMBER',
    type: 'number',
    key: 'orderNumber',
    errorMessage: 'Invalid Order Number',
    error: 'isOrderNumberError'
  },
  {
    label: 'BILLING ZIP CODE',
    type: 'string',
    key: 'billingZipcode',
    errorMessage: 'Invalid Order Number',
    error: 'isBillingZipCodeError'
  },
  {
    label: 'EMAIL ADDRESS',
    type: 'string',
    key: 'email',
    errorMessage: 'Invalid email format!',
    error: 'isEmailError'
  }
];

const dialogContent = {
  confirmTitle: 'Confirm',
  cancelTitle: 'Cancel',
  dialogErrorDescription:
    'You will receive an email with the confirmation and details of your order',
  confirmationDescription: 'Are you sure you want to cancel your order?',
  confirmationMessage: 'Once confirmed, it will be canceled and your payment will be voided.',
  returnConfirmation: 'Can’t find your order? Use the ',
  optionalDetails: 'Optional Details',
  paymentVoided: 'Payment Authorization has been voided',
  cancelAuthorization: 'CancelAuthorization'
};

const orderStatus = {
  cancelled: 'Cancelled',
  procesing: 'Processing',
  shipped: 'Shipped'
};

const orderReturnBreadCrumbs = {
  links: [
    defaultHomeBCrumbs,
    {
      key: 'orderReturn',
      label: 'Order Return',
      value: null,
      openInNewTab: false
    }
  ]
};

export {
  olBreadCrumbs,
  defaultFormValue,
  defaultErrorMessage,
  formFields,
  dialogContent,
  orderStatus,
  orderReturnBreadCrumbs
};
