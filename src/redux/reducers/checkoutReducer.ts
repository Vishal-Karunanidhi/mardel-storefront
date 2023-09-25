type CheckoutCtxProps = {
  orderConfMode?: boolean;
  cartTotalPrice?: number;
  orderSummaryFromRedux?: object;
  cartDeatilsFromRedux?: object;

};

const initialCheckoutState: CheckoutCtxProps = {
  orderConfMode: false,
  cartTotalPrice: 0,
  orderSummaryFromRedux: {},
  cartDeatilsFromRedux: {}
};

const CheckoutReducer = (state = initialCheckoutState, { type, payload }) => {
  let currState = state;
  switch (type) {
    case 'UPDATE_ORDERCONFIRMATION_MODE':
      currState = { orderConfMode: payload };
      break;

    case 'UPDATE_TOTAL_PRICE':
      currState = { cartTotalPrice: payload };
      break;

    case 'UPDATE_ORDERSUMMARY':
      currState = { orderSummaryFromRedux: payload };
      break;
    
    case 'UPDATE_CART_DETAILS':
      currState = { cartDeatilsFromRedux: payload };
      break;
  }

  return {
    ...state,
    ...currState
  };
};

export default CheckoutReducer;
