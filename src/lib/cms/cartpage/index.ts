import { fetchDataViaGql, modifyDataViaGql } from '@Graphql/client';
import GQL_CONST from '@Constants/gqlConstants';
import FreeShippingMessagesGql from '@GqlQueries/headless/freeShippingProgressBar.graphql';
import OrderSummaryGql from '@GqlQueries/headless/orderSummary.graphql';
import addToCartToasterContentGql from '@GqlQueries/headless/addToCartToasterContent.graphql';
import GetCartGql from '@GqlQueries/cart/getCart.graphql';
import AddToCart from '@GqlMutations/cart/addToCart.graphql';
import UpdateCart from '@GqlMutations/cart/updateCart.graphql';
import RemoveCartItemGql from '@GqlMutations/cart/removeCartItem.graphql';
import ResetCartGql from '@GqlMutations/cart/resetCart.graphql';
import AddPaypalPaymentToCartGql from '@GqlMutations/cart/addPaypalPaymentToCart.graphql';
import DeletePaymentFromCartGql from '@GqlMutations/cart/deletePaymentFromCart.graphql';
import AddGcPaymentToCartGql from '@GqlMutations/cart/addGcPaymentToCart.graphql';
import { AddToCartRequest, UpdateCartRequest, CartResponse } from '@Types/cms/addToCart';
import GetMiniCartContent from '@GqlQueries/cart/miniCart.graphql';
import GetFreeShippingPromoGql from '@GqlQueries/cart/freeShippingPromo.graphql';
import { getErrorsFromBff, getGiftCardsFromSession } from '@Lib/common/utility';
import MiniCartContent from 'src/static/miniCartContent.json';

async function getFreeShippingMessages(headers = {}): Promise<any> {
  try {
    const { data } = await fetchDataViaGql(
      FreeShippingMessagesGql,
      GQL_CONST._UNUSED,
      GQL_CONST._UNUSED,
      headers
    );
    return data;
  } catch (err) {
    console.error('Error Occurred with FreeShipping GQL', err);
    return null;
  }
}

async function getOrderSummaryData(headers = {}): Promise<any> {
  try {
    const { data } = await fetchDataViaGql(
      OrderSummaryGql,
      GQL_CONST._UNUSED,
      GQL_CONST._UNUSED,
      headers
    );
    return data;
  } catch (err) {
    console.error('Error Occurred with orderSummary GQL', err);
  }
}

// TODO: explicitly define type of 'headers'
async function getCart(headers = {}, recalculate = true, recalculateTax = true): Promise<any> {
  const otherProps = {
    variables: {
      recalculate,
      recalculateTax
    }
  };
  try {
    const { data } = await fetchDataViaGql(GetCartGql, GQL_CONST._UNUSED, otherProps, headers);
    const cartGiftCardPayment =
      data?.getCart?.paymentDetails?.paymentClassification?.['giftCard'] ?? [];

    const addedGiftCardsInSession = getGiftCardsFromSession();
    const isIssueInGCPayment =
      cartGiftCardPayment?.length > 0 &&
      (addedGiftCardsInSession === null ||
        cartGiftCardPayment?.length !== addedGiftCardsInSession?.length);

    if (isIssueInGCPayment) {
      await Promise.all(
        cartGiftCardPayment?.map(async (e) => {
          await deletePaymentFromCart(e?.paymentId);
        })
      );

      return getCart(headers, recalculate);
    }

    return data?.getCart;
  } catch (err) {
    return null;
  }
}

async function getAddToCartToasterContent() {
  try {
    const { data } = await fetchDataViaGql(addToCartToasterContentGql);
    return data;
  } catch (err) {
    console.error('Error Occurred with getAddToCartToasterContent GQL', err);
    return null;
  }
  // TODO: lacks ending return and return type does not include 'undefined'
}

// TODO: explicitly define type of 'headers'
async function addToCart(headers, request: AddToCartRequest): Promise<CartResponse> {
  try {
    const { data } = await modifyDataViaGql(AddToCart, { request }, headers);
    return data;
  } catch (error) {
    console.error('Error Occurred with AddToCart GQL', error);
    return null;
  }
  // TODO: lacks ending return and return type does not include 'undefined'
}

// TODO: explicitly define type of 'headers'
async function updateCart(headers, request: UpdateCartRequest): Promise<CartResponse> {
  try {
    const { data } = await modifyDataViaGql(UpdateCart, { request }, headers);
    return data;
  } catch (error) {
    console.error('Error Occurred with updateCart GQL', error);
  }
  // TODO: lacks ending return and return type does not include 'undefined'
}

// TODO: explicitly define type of 'headers'
async function removeCartItem(headers, lineItemId: string): Promise<CartResponse> {
  try {
    const { data } = await modifyDataViaGql(RemoveCartItemGql, { lineItemId }, headers);
    return data;
  } catch (error) {
    console.error('Error Occurred with removeCartItem GQL', error);
  }
  // TODO: lacks ending return and return type does not include 'undefined'
}

async function resetCart(): Promise<any> {
  try {
    const { data } = await modifyDataViaGql(ResetCartGql);
    return data?.resetCart;
  } catch (error) {
    console.error('Error Occurred during cartReset GQL', error);
  }
}

async function addPaypalPaymentToCart(paypalOrderId: string): Promise<CartResponse> {
  try {
    const { data } = await modifyDataViaGql(AddPaypalPaymentToCartGql, { paypalOrderId });
    return data?.addPayPalPaymentToCart;
  } catch (error) {
    console.error('Error Occurred during cartReset GQL', error);
  }
}

async function deletePaymentFromCart(paymentId: string): Promise<CartResponse> {
  try {
    const { data } = await modifyDataViaGql(DeletePaymentFromCartGql, { paymentId });
    return data?.deletePaymentFromCart;
  } catch (error) {
    console.error('Error Occurred during cartReset GQL', error);
    return null;
  }
}

async function addGcPaymentToCart(cardNumber, pinNumber): Promise<any> {
  const request = { cardNumber, pinNumber };
  let response: any = {
    isError: false,
    data: {},
    bffErrorMessage: ''
  };
  try {
    const { data, errors } = await modifyDataViaGql(AddGcPaymentToCartGql, { request });
    if (!!errors?.length) {
      response = {
        ...getErrorsFromBff({
          errors,
          defaultMessage: 'Error with GiftCard. Please check your details or try again later'
        })
      };
    }
    response.data = data?.addGcPaymentToCart;
    return response;
  } catch (error) {
    console.error('Error Occurred during addGcPaymentToCart GQL', error);
    return null;
  }
}

async function getMiniCartContent(): Promise<any> {
  try {
    const { data } = await fetchDataViaGql(GetMiniCartContent);
    return data;
  } catch (err) {
    console.error('Error Occurred with orderSummary GQL', err);
  }
  // TODO: lacks ending return and return type does not include 'undefined'
}

async function getMiniCartContentGql(): Promise<any> {
  try {
    const {
      data: { getFreeShippingPromoState }
    } = await fetchDataViaGql(GetFreeShippingPromoGql);
    const { data } = MiniCartContent;
    return { ...data, getFreeShippingPromoState };
  } catch (err) {
    console.error('Error Occurred with miniCart GQL', err);
  }
}

export {
  getFreeShippingMessages,
  getCart,
  getAddToCartToasterContent,
  addToCart,
  updateCart,
  resetCart,
  addPaypalPaymentToCart,
  removeCartItem,
  getOrderSummaryData,
  getMiniCartContent,
  getMiniCartContentGql,
  addGcPaymentToCart,
  deletePaymentFromCart
};
