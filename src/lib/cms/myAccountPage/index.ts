import { modifyDataViaGql, fetchGqlData } from '@Graphql/client';
import GetCustomerAddressGql from '@GqlQueries/myAccount/getCustomerAddress.graphql';
import AddCustomerAddressGql from '@GqlMutations/myAccount/addCustomerAddress.graphql';
import UpdateCustomerAddressGql from '@GqlMutations/myAccount/updateCustomerAddress.graphql';
import DeleteCustomerAddressGql from '@GqlMutations/myAccount/deleteCustomerAddress.graphql';

import GetCustomerPaymentOptionGql from '@GqlQueries/myAccount/getCustomerPaymentOption.graphql';
import AddCustomerPaymentOptionGql from '@GqlMutations/myAccount/addCustomerPaymentOption.graphql';
import DeleteCustomerPaymentOptionGql from '@GqlMutations/myAccount/deleteCustomerPaymentOption.graphql';
import UpdateCustomerPaymentOptionGql from '@GqlMutations/myAccount/updateCustomerPaymentOption.graphql';

import GetGiftCardBalanceGql from '@GqlQueries/myAccount/getGiftCardBalance.graphql';

async function getGiftCardBalanceTransaction(request): Promise<any> {
  try {
    const { getGiftCardBalance } = await fetchGqlData(GetGiftCardBalanceGql, { request });
    return getGiftCardBalance;
  } catch (err) {
    return { error: true };
  }
}

async function getCustomerAddress(): Promise<any> {
  try {
    const { getAddresses } = await fetchGqlData(GetCustomerAddressGql);
    return getAddresses;
  } catch (err) {
    return [];
  }
}

async function addCustomerAddress(request): Promise<any> {
  delete request.giftMessageDetails;
  delete request.isGiftMsgAdded;

  try {
    const { data } = await modifyDataViaGql(AddCustomerAddressGql, {
      request: { ...request, taxExemptedAddress: undefined }
    });
    return data?.addAddress;
  } catch (err) {
    return [];
  }
}

async function updateCustomerAddress(addressId, request): Promise<any> {
  delete request.setDefault;
  delete request.__typename;
  delete request.taxExemptedAddress;
  delete request.isEditable;
  try {
    const { data } = await modifyDataViaGql(UpdateCustomerAddressGql, {
      addressId,
      request: { ...request, taxExemptedAddress: undefined }
    });
    return data?.updateAddress;
  } catch (err) {
    return [];
  }
}

async function deleteCustomerAddress(addressId): Promise<any> {
  try {
    const { data } = await modifyDataViaGql(DeleteCustomerAddressGql, { addressId });
    return data?.deleteAddress;
  } catch (err) {
    return [];
  }
}

async function getCustomerPaymentOption(): Promise<any> {
  try {
    const { getPayments } = await fetchGqlData(GetCustomerPaymentOptionGql);
    return getPayments;
  } catch (err) {
    return [];
  }
}

async function addCustomerPaymentOption(request): Promise<any> {
  try {
    const { data, errors } = await modifyDataViaGql(AddCustomerPaymentOptionGql, { request });
    if (data) {
      return data?.addPayment;
    }
    return errors[0]?.extensions?.error;
  } catch (err) {
    return [];
  }
}

async function deleteCustomerPaymentOption(paymentId: String): Promise<any> {
  try {
    const { data, errors } = await modifyDataViaGql(DeleteCustomerPaymentOptionGql, { paymentId });
    if (data) {
      return data?.deletePayment;
    }
    return errors[0]?.extensions?.error;
  } catch (err) {
    return [];
  }
}

async function updateCustomerPaymentOption(paymentId: String): Promise<any> {
  try {
    const { data, errors } = await modifyDataViaGql(UpdateCustomerPaymentOptionGql, { paymentId });
    if (data) {
      return data?.setDefaultPayment;
    }
    return errors[0]?.extensions?.error;
  } catch (err) {
    return [];
  }
}

export {
  getCustomerAddress,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  getCustomerPaymentOption,
  addCustomerPaymentOption,
  getGiftCardBalanceTransaction,
  deleteCustomerPaymentOption,
  updateCustomerPaymentOption
};
