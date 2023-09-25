import { fetchGqlData, modifyDataViaGql } from '@Graphql/client';
import orderLookUpQuery from '@Graphql/queries/orderDetails/orderLookUp.graphql';
import getCustomerOrdersGql from '@Graphql/queries/orderDetails/getCustomerOrders.graphql';
import FindProductsByKeys from '@GqlQueries/headless/findProductsByKeys.graphql';
import cancelOrder from '@GqlMutations/orderStatus/cancelOrder.graphql';
import orderReturnQuery from '@Graphql/queries/orderDetails/orderReturn.graphql';
import AddMultipleItemsToCartGql from '@GqlMutations/orderDetails/reOrderItems.graphql';
import { OrderLookupRequest, CancelOrderRequest } from '@Types/cms/orderStatus';

async function getOrderLookUp(payload: OrderLookupRequest) {
  try {
    const { orderLookup } = (await fetchGqlData(orderLookUpQuery, payload)) ?? {
      orderLookup: { errorMessage: 'Error From Api' }
    };
    return getMultiPackageSubCart(orderLookup);
  } catch (err) {
    console.error(err);
  }
}

const getCustomerOrders = async ({ pageNumber, sortDirection }) => {
  const variables = {
    pageNumber,
    sortDirection
  };
  try {
    const { getCustomerOrders } = await fetchGqlData(getCustomerOrdersGql, variables);
    return getCustomerOrders;
  } catch (err) {
    console.error(err);
  }
};

async function cancelOrderMutation(payload: CancelOrderRequest) {
  try {
    const { data } = await modifyDataViaGql(cancelOrder, { ...payload });
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function addMultipleItemsToCart(request): Promise<any> {
  const variables = {
    request
  };

  try {
    const { data } = await modifyDataViaGql(AddMultipleItemsToCartGql, variables);
    return data;
  } catch (error) {
    console.error('Error Occurred with AddMultipleItemsToCart GQL', error);
  }
}

const getOrderReturn = async (deliveryKey: string) => {
  const variables = {
    deliveryKey
  };
  try {
    const { orderReturn } = await fetchGqlData(orderReturnQuery, variables);
    return orderReturn;
  } catch (err) {
    console.error(err);
  }
};

async function getProductsByKeys(keys) {
  const variables = { keys };
  try {
    const { findProductsByKeys } = await fetchGqlData(FindProductsByKeys, variables);
    return findProductsByKeys?.products;
  } catch (err) {
    console.error(err);
  }
}

const getMultiPackageSubCart = (orderLookup) => {
  if (orderLookup.order) {
    const oldDeliveriesData = orderLookup?.order.deliveries;
    const updatedDeliveries = [];
    oldDeliveriesData?.forEach((deli) => {
      if (deli?.parcels?.length) {
        deli?.parcels?.forEach((e) => {
          updatedDeliveries.push({
            ...deli,
            parcels: [e]
          });
        });
      } else {
        updatedDeliveries.push({
          ...deli
        });
      }
    });
    orderLookup.order.deliveries = updatedDeliveries;
  }
  return orderLookup;
};

export {
  getOrderLookUp,
  cancelOrderMutation,
  getCustomerOrders,
  addMultipleItemsToCart,
  getOrderReturn,
  getProductsByKeys
};
