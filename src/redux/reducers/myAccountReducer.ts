type AccountCtxProps = {
  helperText?: string;
  phoneNumber?: string;
  isAddressListEmpty?: boolean;
  defaultAddressId?: string;
  addressList?: Array<Object>;
  isPaymentsEmpty?: boolean;
  defaultPaymentId?: string;
  payments?: Array<Object>;
  addEditAddressInfo?: Object;
  accountViewOrder?: Object;
  addPaymentInfo?: Object;
  countryStateList?: Object;
  canadaProvinceCodeList?: Array<Object>;
  nonShippableStateList?: Array<Object>;
  giftCardBalanceContent?: object;
};

const initialAccountState: AccountCtxProps = {
  helperText: '',
  phoneNumber: '',
  isAddressListEmpty: true,
  defaultAddressId: null,
  addressList: [],
  isPaymentsEmpty: true,
  defaultPaymentId: null,
  payments: [],
  addEditAddressInfo: {
    showAddressForm: false,
    type: 'ADD',
    addressProps: {}
  },
  accountViewOrder: {
    showOrderFullDetails: false,
    orderDetails: {}
  },
  addPaymentInfo: {
    isAddPaymentForm: false,
    isAddAddressForm: false,
    addressFormMode: 'ADD',
    addressFormValues: {}
  },
  countryStateList: {},
  canadaProvinceCodeList: [],
  nonShippableStateList: [],
  giftCardBalanceContent: {
    description: '',
    email: ''
  }
};

const MyAccountReducer = (state = initialAccountState, { type, payload }) => {
  let currState = state;
  switch (type) {
    case 'UPDATE_MYACCOUNT_CONTENT':
      currState = payload;
      break;

    case 'GET_GC_LOOKUP_CMS_DATA':
      currState = { giftCardBalanceContent: payload };
      break;

    case 'UPDATE_ADDRESS_LIST':
      const addressList = payload.sort((a, b) => b.defaultAddress - a.defaultAddress);
      currState = {
        addressList,
        isAddressListEmpty: !payload?.length,
        defaultAddressId: addressList[0]?.addressId
      };
      break;

    case 'UPDATE_PAYMENTS_LIST':
      const payments = payload.sort((a, b) => b.defaultPayment - a.defaultPayment);
      currState = {
        payments: payload,
        isPaymentsEmpty: !payload?.length,
        defaultPaymentId: payments[0]?.paymentId
      };
      break;

    case 'ADD_EDIT_ADDRESS_INFO':
      currState = { addEditAddressInfo: payload };
      break;

    case 'ADD_PAYMENT_INFO':
      currState = { addPaymentInfo: { ...state.addPaymentInfo, ...payload } };
      break;

    case 'UPDATE_COUNTRY_STATE_LIST':
      const { shippingCountries, billingCountries } = payload;

      // Extract the Canada state list from the billing countries
      const canadaStateList = billingCountries.find((data) => data.code === 'CA')?.stateList;
      // Create a map of the Canada state codes and names
      const canadaProvinceCodeList = canadaStateList?.map(({ code, name }) => ({ [code]: name }));

      // Extract the shipping states and billing states
      const shippingStates = shippingCountries[0].stateList.map(({ code }) => code);
      const billingStates = billingCountries.flatMap(({ stateList }) =>
        stateList.map(({ code }) => code)
      );

      // Find states that are present in the billing states but not in the shipping states
      const nonShippableStateList = billingStates.filter(
        (state) => !shippingStates.includes(state)
      );

      currState = { countryStateList: payload, nonShippableStateList, canadaProvinceCodeList };
      break;

    case 'ACCOUNT_VIEW_ORDER_FLAG':
      currState = { accountViewOrder: payload };
      break;
  }

  return {
    ...state,
    ...currState
  };
};

export default MyAccountReducer;
