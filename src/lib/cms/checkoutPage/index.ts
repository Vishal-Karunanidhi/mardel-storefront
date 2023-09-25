import { fetchDataViaGql, modifyDataViaGql, fetchGqlData } from '@Graphql/client';
import { generateRecaptchaToken } from '@Components/3rdPartyServices/googleRecaptcha';
import GQL_CONST from '@Constants/gqlConstants';
import AuthorizeApplePayGql from '@GqlMutations/cart/authorizeApplePay.graphql';
import GetAddressSuggestionsGql from '@GqlQueries/checkout/getAddressSuggestion.graphql';
import GetFeaturedItemsGql from '@GqlQueries/checkout/getFeaturedItems.graphql';
import GetApplePayMerchantSessionGql from '@GqlQueries/checkout/getApplePayMerchantSession.graphql';
import GetCyberSourcePublicKeyGql from '@GqlQueries/checkout/getCyberSourcePublicKey.graphql';
import AddShippingAddressGql from '@GqlMutations/checkout/addShippingAddress.graphql';
import AddPayPalShippingAddressGql from '@GqlMutations/checkout/addPaypalShippingAddressToCart.graphql';
import AddPaymentAndBillingAddressGql from '@GqlMutations/checkout/addPaymentAndBillingAddress.graphql';
import AddBillingAddressGql from '@GqlMutations/checkout/addBillingAddress.graphql';
import AddSavedPaymentAndBillingAddressGql from '@GqlMutations/checkout/addSavedPaymentAndBillingAddress.graphql';
import AddGiftMessage from '@GqlMutations/checkout/addGiftMessage.graphql';
import RemoveGiftMessage from '@GqlMutations/checkout/removeGiftMessage.graphql';
import CreateOrder from '@GqlMutations/checkout/createOrder.graphql';
import { CartResponse } from '@Types/cms/addToCart';
import { addCustomerAddress } from '@Lib/cms/myAccountPage';
import { getGiftCardsFromSession } from '@Lib/common/utility';
import ShippingBillingCountriesList from 'src/static/shippingAndBillingCountries.json';
import { getCookie } from 'cookies-next';

/*As a part of Perf-discussion. Planned to Keep the Country-State Info at the storefront. */
/*Since Multiple palces are invoking this method. Used this as a one-point control*/
async function getCountriesAndStateList(): Promise<any> {
  try {
    return ShippingBillingCountriesList ?? {};
  } catch (err) {
    console.error('Error Occurred with Fetching countries and state info GQL', err);
    return {};
  }
}

async function getAddressSuggestions(addressInfo): Promise<any> {
  const {
    addressLineOne: Address1,
    addressLineTwo: Address2,
    city: City,
    state: State,
    zipCode: Zip,
    country: CountryCode,
    company: Company
  } = addressInfo;

  const subsidaryGqlProps = {
    variables: {
      address: {
        Address1,
        Address2: Address2 ?? '',
        City,
        Company,
        State,
        Zip,
        CountryCode,
        Name: `${addressInfo?.firstName} ${addressInfo?.lastName}`
      }
    }
  };
  try {
    const { data } = await fetchDataViaGql(
      GetAddressSuggestionsGql,
      GQL_CONST._UNUSED,
      subsidaryGqlProps
    );
    return compileAddressField(data?.getAddressSuggestions);
  } catch (err) {
    console.error('Error Occurred with getAddressSuggestions GQL', err);
    return null;
  }
}

function compileAddressField({ CustomerAddress, CandidateAddresses = [] }) {
  const formatPropName = (address) => {
    const {
      Address1: addressLineOne,
      Address2: addressLineTwo,
      City: city,
      State: state,
      Zip: zipCode,
      CountryCode: country
    } = address;

    return { addressLineOne, addressLineTwo, country, city, state, zipCode };
  };

  return {
    CustomerAddress: formatPropName(CustomerAddress),
    CandidateAddresses: CandidateAddresses?.map(formatPropName)
  };
}

async function addShippingAddress(headers, addressInfo, taxExempt = false): Promise<CartResponse> {
  delete addressInfo.isGiftMsgAdded;
  delete addressInfo.giftMessageDetails;
  delete addressInfo.smsAlert;
  delete addressInfo.emailAlert;
  delete addressInfo.__typename;
  delete addressInfo.defaultAddress;
  /* Temp deleteing taxExemptedAddress */
  delete addressInfo.taxExemptedAddress;
  addressInfo.addressLineTwo = addressInfo.addressLineTwo ?? '';
  const variables = {
    request: {
      ...addressInfo,
      addressVerified: true,
      taxExempt,
      taxExemptedAddress: undefined
    }
  };

  try {
    const { data } = await modifyDataViaGql(AddShippingAddressGql, variables, headers);
    return data?.addShippingAddress;
  } catch (error) {
    console.error('Error Occurred with addShippingAddress GQL', error);
    return null;
  }
}

async function addBillingAddress(headers, addressRequest): Promise<CartResponse> {
  delete addressRequest.isGiftMsgAdded;
  delete addressRequest.giftMessageDetails;
  delete addressRequest.__typename;
  delete addressRequest.taxExemptedAddress;

  addressRequest.addressLineTwo = addressRequest.addressLineTwo ?? '';
  const variables = {
    request: addressRequest
  };

  try {
    const { data } = await modifyDataViaGql(AddBillingAddressGql, variables, headers);
    return data?.addBillingAddress;
  } catch (error) {
    console.error('Error Occurred with AddSavedBillingAddress GQL', error);
    return null;
  }
}

async function addPaymentAndBillingAddress(
  headers,
  addressInfo,
  paymentInfo
): Promise<CartResponse> {
  delete addressInfo.isGiftMsgAdded;
  delete addressInfo.giftMessageDetails;
  delete addressInfo.__typename;

  addressInfo.addressLineTwo = addressInfo.addressLineTwo ?? '';

  /* Will remove billingDetails code from 122-138 once the BFF has fixed
  destructuing is not done to avoid any errors. + This code will be removed. Once BFF is done
  as part of the ticket NGW-3756 */
  const billingDetails = {};
  try {
    if (addressInfo?.saveToAddressBook && addressInfo?.addressId) {
      delete addressInfo?.addressId;
    }
    if (addressInfo?.addressId) {
      billingDetails['billingAddressId'] = addressInfo?.addressId;
    } else if (addressInfo?.saveToAddressBook || paymentInfo?.savePayment) {
      const addressResponse = await addCustomerAddress(addressInfo);
      const lastAddress = addressResponse[addressResponse.length - 1];
      addressInfo.saveToAddressBook = false;
      addressInfo['addressId'] = lastAddress?.addressId;
      billingDetails['billingAddressId'] = lastAddress?.addressId;
    }
  } catch (error) {
    paymentInfo['savePayment'] = false;
    addressInfo['saveToAddressBook'] = false;
  }
  /* Will remove billingDetails code from 122-138 once the BFF has fixed
  as part of the ticket NGW-3756 */

  const variables = {
    billingAddress: {
      ...addressInfo,
      taxExemptedAddress: undefined
    },
    paymentInfo: { ...paymentInfo, ...billingDetails }
  };

  try {
    const { data } = await modifyDataViaGql(AddPaymentAndBillingAddressGql, variables, headers);
    const {
      addBillingAddress,
      addPaymentToCart: { paymentDetails }
    } = data;
    addBillingAddress.paymentDetails = paymentDetails;
    return addBillingAddress;
  } catch (error) {
    console.error('Error Occurred with AddBillingAddressGql GQL', error);
    return null;
  }
}

async function addSavedPaymentAndBillingAddress(addressInfo, paymentId): Promise<CartResponse> {
  delete addressInfo.__typename;
  delete addressInfo.taxExemptedAddress;
  const variables = {
    billingAddress: {
      ...addressInfo,
      taxExemptedAddress: undefined
    },
    paymentId
  };
  try {
    const { data } = await modifyDataViaGql(AddSavedPaymentAndBillingAddressGql, variables);
    const {
      addBillingAddress,
      addSavedPaymentToCart: { paymentDetails }
    } = data;
    addBillingAddress.paymentDetails = paymentDetails;
    return addBillingAddress;
  } catch (error) {
    console.error('Error Occurred with AddSavedPaymentAndBillingAddress GQL', error);
    return null;
  }
}

async function addGiftMessage(headers, giftMessageRequest): Promise<any> {
  delete giftMessageRequest.isGiftMsgAdded;
  delete giftMessageRequest.__typename;
  const variables = {
    request: giftMessageRequest
  };
  try {
    const { data } = await modifyDataViaGql(AddGiftMessage, variables, headers);
    const { giftMessage: giftMessageDetails, giftOrder: isGiftMsgAdded } = data?.addGiftMessage;
    return { giftMessageDetails, isGiftMsgAdded };
  } catch (error) {
    console.error('Error Occurred with giftMessage GQL', error);
    return null;
  }
}

async function removeGiftMessage(): Promise<any> {
  try {
    const { data } = await modifyDataViaGql(RemoveGiftMessage);
    const { giftMessage: giftMessageDetails, giftOrder: isGiftMsgAdded } = data?.removeGiftMessage;
    return { giftMessageDetails, isGiftMsgAdded };
  } catch (error) {
    console.error('Error Occurred with giftMessage GQL', error);
    return null;
  }
}

async function addPaypalShippingAddressToCart(request): Promise<any> {
  const variables = {
    request
  };
  try {
    const { data } = await modifyDataViaGql(AddPayPalShippingAddressGql, variables);
    return data?.addPayPalShippingAddress;
  } catch (error) {
    console.error('Error Occurred order review GQL', error);
    return null;
  }
}

async function createOrder(): Promise<any> {
  const recaptchaToken = await generateRecaptchaToken('createOrder');

  const allGiftCards = getGiftCardsFromSession();
  const variables = {
    request: { recaptchaToken, sendEvent: true, giftCards: allGiftCards },
    cjEvent: getCookie('cje') ? getCookie('cje').toString() : ''
  };
  try {
    const response = await modifyDataViaGql(CreateOrder, variables);
    if (response?.data) {
      sessionStorage.removeItem('giftCards');
    }
    return response;
  } catch (error) {
    console.error('Error Occurred order review GQL', error);
    return error;
  }
}

async function getCyberSourcePublicKey(): Promise<any> {
  try {
    const { data } = await fetchDataViaGql(GetCyberSourcePublicKeyGql);
    return data?.getCardPublicKey?.token;
  } catch (err) {
    return null;
  }
}

async function getFeaturedItems(): Promise<any> {
  try {
    const { homePage } = await fetchGqlData(GetFeaturedItemsGql);
    const featuredProducts = homePage?.content?.filter((e) => e?.__typename === 'ProductSelector');
    return featuredProducts[0]?.products;
  } catch (err) {
    return [];
  }
}

async function getApplePayMerchantSession(request): Promise<any> {
  try {
    const response = await fetchGqlData(GetApplePayMerchantSessionGql, { request });
    return response.getApplePayMerchantSession;
  } catch (error) {
    console.error('Error occured apple pay merchant session GQL', error);
    return null;
  }
}

async function authorizeApplePayGql(request): Promise<any> {
  const variables = { request };
  try {
    const response = await modifyDataViaGql(AuthorizeApplePayGql, variables);
    return response;
  } catch (error) {
    console.error('Error occured during authorizeApplePay GQL', error);
    return null;
  }
}

export {
  getCountriesAndStateList,
  getAddressSuggestions,
  authorizeApplePayGql,
  addShippingAddress,
  addGiftMessage,
  addPaypalShippingAddressToCart,
  addPaymentAndBillingAddress,
  addSavedPaymentAndBillingAddress,
  removeGiftMessage,
  getCyberSourcePublicKey,
  createOrder,
  getApplePayMerchantSession,
  getFeaturedItems,
  addBillingAddress
};
