import { defaultHomeBCrumbs } from '@Constants/generalConstants';
const quickOrderBreadCrumbs = {
  links: [
    defaultHomeBCrumbs,
    {
      key: 'Customer Service',
      label: 'Customer Service',
      value: '/customer-service',
      openInNewTab: false
    },
    {
      key: 'Quick Order',
      label: 'Quick Order',
      value: 'null',
      openInNewTab: false
    }
  ]
};
const itemInstance = {
  sku: '',
  quantity: '',
  disable: true,
  pdpPageData: null,
  variantKey: null,
  error: null
};

const formItem = [
  { ...itemInstance },
  { ...itemInstance },
  { ...itemInstance },
  { ...itemInstance },
  { ...itemInstance }
];

const formFields = {
  sku: {
    label: 'SKU NUMBER',
    key: 'sku',
    name: 'sku'
  },
  quantity: {
    label: 'QUANTITY',
    type: 'number',
    key: 'quantity',
    name: 'quantity'
  }
};

const dialogContent = {
  addtocart: 'Add items to Cart',
  outofstock: 'Out of stock',
  instore: 'Only available in store',
  newFieldLine: '*once you enter the last field a new line field will appear.',
  bulkOrder: `*Orders totaling more than $250.00 are considered bulk purchases and must be returned to HobbyLobby.com. Items from bulk purchase orders will not be allowed to be returned to a store. This $250.00 limit will be waived for Christmas Trees, Furniture, and Wall Decor items that were priced over $250.00 individually.Seasonal Items from a bulk purchase (including Christmas, New Year's, Valentine's Day, St. Patrick's Day, Spring, Easter, Graduation, Summer, July 4th, Back-to School, Fall/Thanksgiving) may incur a 20% restocking fee.`
};

const formErrorMessage = {
  skuNotFound: 'We couldn’t find the SKU. Please try another number.',
  duplicateSku: 'SKU Already Entered Please Increase the quantity.',
  giftCardError: 'You cannot quick order gift cards.'
};

export {
  quickOrderBreadCrumbs,
  formItem,
  formFields,
  dialogContent,
  itemInstance,
  formErrorMessage
};
