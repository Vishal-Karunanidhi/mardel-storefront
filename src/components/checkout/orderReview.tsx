import { useEffect, useState } from 'react';
import HlButton from '@Components/common/button';
import { createOrder } from '@Lib/cms/checkoutPage';
import { useSelector, useDispatch } from '@Redux/store';
import { Divider } from '@mui/material';
import OrderSummaryAccordion from '@Components/checkout/orderSummaryAccordion';
import { deletePaymentFromCart } from '@Lib/cms/cartpage';
import { getGiftCardsFromSession } from '@Lib/common/utility';
import { CREATE_ORDER } from '@Constants/checkoutErrorConstants';
import CheckoutStyles from '@Styles/checkout/checkoutPage.module.scss';
import OrderReviewStyles from '@Styles/checkout/orderReview.module.scss';
import { fixForItemPricesWithoutChange } from '@Lib/common/utility';
import { useRouter } from 'next/router';
import { OrderDetails } from 'src/interfaces/orderDetails';
import { Ga4PurchaseEcommerce } from 'src/interfaces/ga4Ecommerce';
import { Ga4EcommerceItem } from 'src/interfaces/ga4EcommerceItem';
import { Ga4DataLayer } from 'src/interfaces/ga4DataLayer';

export default function OrderReview(props: any): JSX.Element {
  const dispatch = useDispatch();
  const {
    currentFormMode,
    updateCurrentFormMode,
    totalPrice,
    updateOrderResponse,
    cartInfo,
    freeShippingDetails,
    orderSummaryDetails,
    taxPrice,
    setOrderErrorMessages
  } = props;
  const { privacyTermsCmsData } = useSelector((state) => state.layout);
  const {
    cartTotalPrice,
    cartDeatilsFromRedux: { lineItemCount, paymentDetails }
  } = useSelector((state) => state.checkout);
  const {
    heartBeatInfo: { sessionId, isLoggedInUser }
  } = useSelector((state) => state.auth);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsSubmitButtonDisabled(!lineItemCount);
  }, [lineItemCount]);

  const orderDetailsGtmData = (orderDetails: OrderDetails) => {
    const orderDetailsGtmData: Ga4PurchaseEcommerce = {
      anonymous_user_id: '',
      coupon: '',
      currency: 'USD',
      ecommerce: {
        items: []
      },
      email: '',
      event: 'purchase',
      shipping: 0,
      tax: 0,
      transaction_id: '',
      value: 0,
      user_id: ''
    };

    if (sessionId) {
      isLoggedInUser
        ? (orderDetailsGtmData.user_id = sessionId)
        : (orderDetailsGtmData.anonymous_user_id = sessionId);
    }

    if (orderDetails) {
      orderDetailsGtmData.transaction_id = orderDetails.orderNumber;

      // should always be present, but still want to check until we create a "model validator"
      if (orderDetails.customerEmail) {
        orderDetailsGtmData.email = orderDetails.customerEmail;
      }

      if (orderDetails.orderSummary) {
        orderDetailsGtmData.shipping = orderDetails.orderSummary.standardShipping;
        orderDetailsGtmData.tax = orderDetails.orderSummary.totalTax;
        orderDetailsGtmData.value = orderDetails.orderSummary.merchandiseSubTotal;
      }

      if (orderDetails.lineItems) {
        var ga4EcommerceItems: Ga4EcommerceItem[] = [];

        orderDetails.lineItems.forEach((lineItem, index) => {
          const newGa4EcommerceItem: Ga4EcommerceItem = {
            affiliation: '',
            coupon: '',
            currency: 'USD',
            discount: 0,
            index: `${index}`,
            item_brand: '',
            item_category: '',
            item_category2: '',
            item_category3: '',
            item_category4: '',
            item_category5: '',
            item_id: '',
            item_list_id: '',
            item_list_name: '',
            item_name: '',
            item_variant: '',
            price: 0,
            quantity: 0
          };

          if (lineItem) {
            newGa4EcommerceItem.discount = lineItem.discountedPricePerQuantity
              ? lineItem.originalPricePerQuantity - lineItem.discountedPricePerQuantity
              : 0;
            newGa4EcommerceItem.item_brand = lineItem.variant.attributes.brand?.label ?? '';
            newGa4EcommerceItem.item_id = lineItem.variant.sku;
            newGa4EcommerceItem.item_name = lineItem.name;
            newGa4EcommerceItem.price = lineItem.discountedPricePerQuantity
              ? lineItem.discountedPricePerQuantity
              : lineItem.originalPricePerQuantity;
            newGa4EcommerceItem.quantity = lineItem.quantity;
          }

          ga4EcommerceItems.push(newGa4EcommerceItem);
        });

        orderDetailsGtmData.ecommerce.items = ga4EcommerceItems;
      }
    }

    return orderDetailsGtmData;
  };

  const handleReviewOrder = async () => {
    let orderResponse;
    setIsSubmitButtonDisabled(true);

    const cartGiftCardPayment = paymentDetails?.paymentClassification?.['giftCard'] ?? [];
    const addedGiftCardsInSession = getGiftCardsFromSession();

    const isIssueInGCPayment =
      cartGiftCardPayment?.length > 0 &&
      (addedGiftCardsInSession === null ||
        cartGiftCardPayment?.length !== addedGiftCardsInSession?.length);

    if (isIssueInGCPayment) {
      cartGiftCardPayment?.map(async (e) => await deletePaymentFromCart(e?.paymentId));
      window.location.href = '/checkout';

      dispatch({
        type: 'UPDATE_SNACKBAR_WITH_DATA',
        payload: {
          open: isIssueInGCPayment,
          message: 'Your session is out ! Please Enter the gift card details again',
          severity: 'warning'
        }
      });

      return;
    }

    try {
      orderResponse = (await createOrder()) ?? {};
      if (orderResponse?.data?.createOrder) {
        updateCurrentFormMode();
        updateOrderResponse(orderResponse?.data?.createOrder);
        const orderConformElement = document.getElementById('order_confirmation');
        orderConformElement.scrollIntoView({ behavior: 'smooth' });
        const orderDetails = orderResponse?.data?.createOrder;
        const checkoutFormValue = {
          orderConfirmation: {
            orderNumber: orderDetails?.orderNumber,
            email: orderDetails?.customerEmail
              ? orderDetails?.customerEmail
              : orderDetails?.shippingAddress.email,
            billingZipCode: orderDetails?.billingAddress.postalCode
          }
        };

        // GTM DataLayer push for order confirmation
        let gtmData: Ga4PurchaseEcommerce = orderDetailsGtmData(orderDetails);
        if (window) {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
          window.dataLayer.push(gtmData);
        }

        const encodedOrderData = encodeURIComponent(JSON.stringify(checkoutFormValue));
        router.push({
          pathname: '/orderConfirmation',
          query: { state: encodedOrderData }
        } as any);
      } else {
        let messageList = orderResponse?.errors?.map((errorItem) => {
          return errorItem?.extensions?.error?.message;
        });
        const errorMessages =
          messageList?.filter((e) => {
            return e?.indexOf('Item has been removed') !== -1;
          }) ?? [];
        if (errorMessages.length) {
          setOrderErrorMessages(errorMessages);
        } else {
          dispatch({
            type: 'UPDATE_SNACKBAR_WITH_DATA',
            payload: {
              open: true,
              message: CREATE_ORDER,
              severity: 'error'
            }
          });
        }
      }
    } catch (err) {
      if (window) {
        let gtmData: Ga4DataLayer = {
          anonymous_user_id: '',
          event: 'checkout_error',
          user_id: ''
        };

        if (sessionId) {
          isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(gtmData);
      }
    }
    setIsSubmitButtonDisabled(false);
  };
  const renderReviewOrder = () => {
    return (
      <>
        <label className={OrderReviewStyles.orderTitle}>review your order</label>
        <Divider className={OrderReviewStyles.divider} />
        <label className={OrderReviewStyles.orderSummaryTitle}>Order summary</label>
        <div className={OrderReviewStyles.orderSummarySection}>
          <label className={OrderReviewStyles.orderDescription}>
            Your order has not yet been placed. Verify your shipping address is correct and confirm
            below to place your order.
          </label>
          <OrderSummaryAccordion
            cartInfo={cartInfo}
            freeShippingDetails={freeShippingDetails}
            orderSummaryDetails={orderSummaryDetails}
            taxPrice={taxPrice}
          />
        </div>

        <HlButton
          buttonTitle={`Place Order: ${fixForItemPricesWithoutChange(
            cartTotalPrice ? cartTotalPrice : totalPrice
          )}`}
          callbackMethod={handleReviewOrder}
          isDisabled={isSubmitButtonDisabled}
          dataTestId="submit-order-button"
        />
        <span className={OrderReviewStyles.orderHelperText}>
          <label className={OrderReviewStyles.orderPlacingText}>
            By placing your order, you agree to Hobby Lobby’s
          </label>
          <span>
            <a
              target={privacyTermsCmsData.link.openInNewTab ? '_blank' : '_self'}
              href={privacyTermsCmsData?.link?.value}
              rel="noreferrer"
            >
              Privacy Policy
            </a>
          </span>
          <span>
            <a
              target={privacyTermsCmsData.link.openInNewTab ? '_blank' : '_self'}
              href={privacyTermsCmsData?.link?.value}
              rel="noreferrer"
            >
              Terms and Conditions
            </a>
          </span>
        </span>
      </>
    );
  };

  return (
    <div className={CheckoutStyles.individualFormBoxes}>
      {currentFormMode === 'EDIT' ? renderReviewOrder() : <>REVIEW YOUR ORDER</>}
    </div>
  );
}
