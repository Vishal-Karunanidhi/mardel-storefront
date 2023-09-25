const billingAddressFormFieldLabels = {
  editForm: 'Edit',
  firstName: 'First Name',
  lastName: 'Last Name',
  addressLineOne: 'Street Address',
  addressLineTwo: 'Apt, Ste, Bldg (optional)',
  company: 'Company (optional)',
  country: 'Country',
  city: 'City',
  state: 'State',
  zipCode: 'Zip Code',
  creditcard: 'Credit/Debit Card',
  billingAddress: 'BILLING ADDRESS',
  saveAndcontinue: 'Save & Continue'
};

const giftCardLabels = {
  giftcard: 'Gift Card',
  cta: 'Apply gift card',
  newGc: 'Add another Gift Card',
  maxGcAdded: 'You have entered the maximum number of Gift Cards.',
  inputFields: [
    {
      key: 'cardNumber',
      label: 'Gift Card Number'
    },
    {
      key: 'pinNumber',
      label: 'PIN'
    }
  ]
};

const addressFormlabels = {
  section1: [
    {
      key: 'firstName',
      label: 'First Name'
    },

    {
      key: 'lastName',
      label: 'Last Name'
    }
  ],
  section2: [
    {
      key: 'company',
      label: 'Company (optional)'
    }
  ],
  addressLineOne: [
    {
      key: 'addressLineOne',
      label: 'Street Address',
      maxNumber: 40
    }
  ],
  addressLineTwo: [
    {
      key: 'addressLineTwo',
      label: 'Apt, Ste, Bldg (optional)',
      maxNumber: 40
    }
  ],
  section4: [
    {
      key: 'city',
      label: 'City'
    }
  ],
  section5: [
    {
      key: 'zipCode',
      label: 'Zip Code',
      maxLength: 10
    }
  ]
};

const paymentOptionFormFieldLabels = {
  section1: [
    {
      key: 'cardHolderName',
      label: 'Cardholder’s Name',
      maxNumber: 100,
      errorMsg: 'Please remove invalid characters.'
    }
  ],
  section2: [
    {
      key: 'cardNumber',
      label: 'Card Number',
      maxNumber: 19,
      errorMsg: 'Invalid card number entered.'
    }
  ],
  section3: [
    {
      key: 'month',
      label: 'MM',
      maxNumber: 2,
      errorMsg: 'Invalid Month'
    },
    {
      key: 'year',
      label: 'YYYY',
      maxNumber: 4,
      errorMsg: 'Invalid Year'
    }
  ],
  section4: [
    {
      key: 'cvv',
      label: 'CVV',
      maxNumber: 3,
      errorMsg: 'Invalid Pin'
    }
  ]
};

const shippingFieldLabels = {
  selectAddress: 'Select an address from your Address Book',
  shippingAddress: 'SHIPPING ADDRESS',
  editForm: 'Edit',
  firstName: 'First Name',
  lastName: 'Last Name',
  addressLineOne: 'Address',
  addressLineTwo: 'Apt, Ste, Bldg (optional)',
  company: 'Company (optional)',
  country: 'Country',
  city: 'City',
  state: 'State',
  zipCode: 'Zip Code',
  saveAndcontinue: 'Save & Continue',
  taxExempt: `*Accounts marked as <b>Tax-Exempt</b> do not have the option to edit their Billing Address online. `,
  contactusHelperText: ' to make changes to the address.',
  contactUs: 'Contact Us',
  contactUsLink: './customer-support/contact-us',
  infoIcon: '/icons/account/infoIcon.svg'
};

const giftOrderLabelConstants = {
  title: 'GIFT MESSAGE',
  giftCheckboxLabel: 'This order is a gift.',
  infoLabel: 'Select if you would like to send a gift. Otherwise, select Save & Continue.',
  messageCharacterBalanceLabel: 'characters remaining'
};

const giftMessageFieldLabels = {
  giftMessage: 'GIFT MESSAGE',
  giftCheckboxLabel: 'This order is a gift.',
  notAGiftMessageLabel: 'This order is not a gift.',
  senderName: 'Sender’s Name:',
  recipientName: 'Recipient’s Name:',
  message: 'Message:',
  giftInformationLabel:
    ' Select if you would like to send a gift. Otherwise, select Save & Continue. ',
  textAreaInfoLabel: 'characters remaining'
};

const viewGiftMessageData = [
  {
    key: 'giftSenderName',
    label: 'Sender’s Name:'
  },
  {
    key: 'giftReceiverName',
    label: 'Recipient’s Name:'
  },
  {
    key: 'giftMessage',
    label: 'Message:'
  }
];

const editGiftMessageForm = {
  fromToSection: [
    {
      key: 'giftSenderName',
      label: 'Sender’s Name'
    },
    {
      key: 'giftReceiverName',
      label: 'Recipient’s Name'
    }
  ],
  messageSection: [
    {
      key: 'giftMessage',
      label: 'Gift Message'
    }
  ]
};

const contactAddressFormFieldLabels = {};

export {
  billingAddressFormFieldLabels,
  shippingFieldLabels,
  giftMessageFieldLabels,
  contactAddressFormFieldLabels,
  addressFormlabels,
  paymentOptionFormFieldLabels,
  viewGiftMessageData,
  editGiftMessageForm,
  giftOrderLabelConstants,
  giftCardLabels
};
