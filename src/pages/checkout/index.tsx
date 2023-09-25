import { useState, useEffect } from 'react';
import { useSelector } from '@Redux/store';
import { GetServerSidePropsResult } from 'next/types';
import { useRouter } from 'next/router';
import { useDispatch } from '@Redux/store';
import Script from 'next/script';
import Grid from '@mui/material/Grid';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Divider } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FeaturedItems from '@Components/homepage/featuredItems';
import {
  getCart,
  getFreeShippingMessages,
  getOrderSummaryData,
  resetCart
} from '@Lib/cms/cartpage';
import { getMyProfileDetails } from '@Lib/cms/accountpage';
import { getFeaturedItems } from '@Lib/cms/checkoutPage';
import { getCookie } from '@Lib/common/serverUtility';
import ContactInfoForm from '@Components/checkout/forms/contactInfoForm';
import ShippingAddressForm from '@Components/checkout/forms/shippingAddressForm';
import RenderHelpAndContact from '@Components/cartPage/needHelpSection';
import { ProductNotAvailableComp } from '@Pages/cart';
import OrderReview from '@Components/checkout/orderReview';
import PaymentAndBillingAddressForm from '@Components/checkout/forms/paymentAndBillingAddressForm';
import ExpressPayAndLoginForm from '@Components/checkout/forms/expressPayAndLoginForm';
import SignUp from '@Components/account/signUp';
import OrderSummary from '@Components/cartPage/orderSummary';
import ProductTile from '@Components/cartPage/productTile';
import OrderSummaryAccordion from '@Components/checkout/orderSummaryAccordion';
import { fixForItemPricesWithoutChange } from '@Lib/common/utility';
import OrderSummaryStyles from '@Styles/cartpage/orderSummary.module.scss';
import CheckoutStyles from '@Styles/checkout/checkoutPage.module.scss';
import { spinnerStart, spinnerEnd } from '@Utils/spinnerUtil';
import { Ga4EcommerceItem } from 'src/interfaces/ga4EcommerceItem';
import {
  Ga4AddShippingInfoEcommerce,
  Ga4BeginCheckoutEcommerce
} from 'src/interfaces/ga4Ecommerce';

const defaultCartDetails: any = null;

const formOrder = [
  'contact',
  'shipping',
  'paymentAndBilling',
  'review',
  'expressPay',
  'orderConfirmation'
];
const defaultCurrentFormMode = {},
  defaultCheckoutFormValue = {};
formOrder.forEach((e, i) => {
  defaultCurrentFormMode[e] = i === 0 ? 'EDIT' : '';
  defaultCheckoutFormValue[e] = {};
});

function getCoveredPaymentsAmount({ paymentClassification: paymentDetails }) {
  let totalPayment = 0;
  Object.keys(paymentDetails).map((key) => {
    if (Array.isArray(paymentDetails?.[key])) {
      paymentDetails?.[key]?.map((e) => {
        totalPayment += e?.amount ?? 0;
      });
    }
  });
  return totalPayment;
}

function processDefaultCartInfo(cartInfoFromSsr) {
  const {
    shippingAddress,
    giftMessage: giftMessageDetails,
    giftOrder,
    billingSameAsShipping,
    billingAddress,
    paymentDetails,
    orderSummary: { totalPrice },
    orderNumber,
    orderDate,
    cartState
  } = cartInfoFromSsr;

  defaultCheckoutFormValue['orderConfirmation'] = {
    orderTotal: totalPrice,
    email: shippingAddress?.email,
    orderNumber,
    orderDate
  };

  if (!shippingAddress?.phone) {
    defaultCheckoutFormValue['contact'] = {};
  }
  if (!shippingAddress?.firstName) {
    defaultCheckoutFormValue['shipping'] = {
      isGiftMsgAdded: false,
      giftMessageDetails: {}
    };
  }

  if (shippingAddress?.phone) {
    const { email: emailAddress, phone } = shippingAddress;
    defaultCheckoutFormValue['contact'] = { emailAddress, phone };
    defaultCurrentFormMode['contact'] = 'VIEW';
    defaultCurrentFormMode['shipping'] = 'EDIT';
    window.location.href = '#shipping';
  }

  if (shippingAddress?.firstName) {
    const {
      firstName,
      lastName,
      country,
      city,
      state,
      id: addressId,
      streetName: addressLineOne,
      additionalStreetInfo: addressLineTwo,
      postalCode: zipCode,
      company
    } = shippingAddress;

    defaultCheckoutFormValue['shipping'] = {
      addressId,
      firstName,
      lastName,
      country,
      city,
      state,
      addressLineOne,
      addressLineTwo,
      zipCode,
      isGiftMsgAdded: giftOrder,
      giftMessageDetails,
      company
    };

    defaultCurrentFormMode['shipping'] = 'VIEW';
    defaultCurrentFormMode['paymentAndBilling'] = 'EDIT';
    window.location.href = '#paymentAndBilling';
  }

  if (
    !billingAddress ||
    !billingAddress?.phone ||
    !billingAddress?.firstName ||
    !paymentDetails?.paymentMethod ||
    getCoveredPaymentsAmount(paymentDetails) !== totalPrice
  ) {
    defaultCheckoutFormValue['paymentAndBilling'] = {};
  } else {
    const {
      firstName,
      lastName,
      country,
      city,
      state,
      id: addressId,
      streetName: addressLineOne,
      additionalStreetInfo: addressLineTwo,
      postalCode: zipCode,
      company
    } = billingAddress;

    defaultCheckoutFormValue['paymentAndBilling'] = {
      creditCardDetails: { ...paymentDetails, totalPrice } ?? {},
      billingAddress: {
        addressId,
        firstName,
        lastName,
        country,
        city,
        state,
        addressLineOne,
        addressLineTwo,
        zipCode,
        billingSameAsShipping,
        company
      }
    };
    defaultCurrentFormMode['contact'] = 'VIEW';
    defaultCurrentFormMode['shipping'] = 'VIEW';
    defaultCurrentFormMode['paymentAndBilling'] = 'VIEW';
    defaultCurrentFormMode['review'] = 'EDIT';
    window.location.href = '#review';
  }
  const isCartActive = cartState?.toLowerCase() === 'active';
  if (orderNumber && !isCartActive && orderDate) {
    defaultCurrentFormMode['contact'] = 'VIEW';
    defaultCurrentFormMode['shipping'] = 'VIEW';
    defaultCurrentFormMode['paymentAndBilling'] = 'VIEW';
    defaultCurrentFormMode['review'] = 'VIEW';
    defaultCurrentFormMode['orderConfirmation'] = 'EDIT';
    window.location.href = '#orderConfirmation';
  }
}

export default function Checkout(props: any): JSX.Element {
  const dispatch = useDispatch();
  const { asPath, query } = useRouter();
  const { freeShippingDetails, orderSummaryDetails } = props;
  const { cartNumber, fullCartContent } = props?.orderSummaryDetails;
  const [currentFormMode, setCurrentFormMode] = useState(defaultCurrentFormMode);
  const [checkoutFormValue, setCheckoutFormValue] = useState<any>(defaultCheckoutFormValue);
  const [cartDetails, setCartDetails] = useState(defaultCartDetails);
  const [taxPrice, setTaxPrice] = useState();
  const [orderErrorMessages, setOrderErrorMessages] = useState([]);

  const [featuredItems, setFeaturedItems] = useState([]);

  const orderConfirmationMode = currentFormMode['orderConfirmation'] === 'EDIT';
  const { heartBeatInfo } = useSelector((state) => state.auth);
  const { cartTotalPrice } = useSelector((state) => state.checkout);
  const { countryStateList } = useSelector((state) => state.myAccount);

  const [taxExempt, setTaxExempt] = useState(false);
  const cardInfoMock = {
    orderSummary: { totalPrice: 0 },
    lineItems: [],
    inventoryMessages: ''
  };
  const [cartInfo, setCartInfo] = useState(cardInfoMock);
  const { shipping, contact } = checkoutFormValue;

  const guestSignUpFieldValues = {
    firstName: shipping?.firstName,
    lastName: shipping?.lastName,
    email: contact?.emailAddress,
    password: '',
    confirmPassword: '',
    phone: contact?.phone
  };

  const addshippinginfogtminitialdata: Ga4AddShippingInfoEcommerce = {
    shipping_tier: 'Ground',
    coupon: '',
    currency: 'USD',
    value: 0,
    anonymous_user_id: '',
    ecommerce: {
      items: []
    },
    event: 'add_shipping_info',
    user_id: ''
  };

  const { isLoggedInUser, sessionId } = heartBeatInfo;

  if (sessionId) {
    isLoggedInUser
      ? (addshippinginfogtminitialdata.user_id = sessionId)
      : (addshippinginfogtminitialdata.anonymous_user_id = sessionId);
  }

  const [shippingInfoGtmData, setShippingInfoGtmData] = useState(addshippinginfogtminitialdata);

  useEffect(() => {
    if (orderConfirmationMode) {
      window.location.href = '#orderConfirmation';
    }
  }, [orderConfirmationMode]);

  useEffect(() => {
    if (orderConfirmationMode && window?.location?.hash !== '#orderConfirmation') {
      window.location.href = '/';
    }
  }, [asPath]);

  useEffect(() => {
    async function getFeaturedItemsList() {
      const featuredItemsList = await getFeaturedItems();

      setFeaturedItems(featuredItemsList);
    }
    getFeaturedItemsList();
  }, []);

  useEffect(() => {
    const currentPath = Object.keys(currentFormMode).find((key) => currentFormMode[key] === 'EDIT');
    if (currentPath) {
      window.location.href = `#${currentPath}`;
    }
  }, [currentFormMode]);

  useEffect(() => {
    dispatch(spinnerStart);
    async function getCartData() {
      let cartResponse = await getCart({}, true, true);

      if (
        !heartBeatInfo?.isLoggedInUser &&
        !!cartResponse?.paymentDetails?.paymentMethod &&
        !(query?.redirectFrom === 'paypal')
      ) {
        cartResponse = await resetCart();
      }

      if (!cartResponse?.lineItemCount) {
        window.location.href = '/';
      }

      let profileDetails: any = {};
      if (heartBeatInfo?.isLoggedInUser) {
        profileDetails = await getMyProfileDetails({});
      }

      if (Object.keys(profileDetails)?.length && cartResponse) {
        const { email, phone } = cartResponse?.shippingAddress ?? {};
        if (!email || !phone) {
          if (cartResponse['shippingAddress']) {
            cartResponse['shippingAddress'] = {};
          }
          cartResponse['shippingAddress'] = {
            ...cartResponse['shippingAddress'],
            email: profileDetails.email,
            phone: profileDetails.phone
          };
        }
      }
      if (cartResponse) {
        processDefaultCartInfo(cartResponse);
        if (window) {
          let gtmData: Ga4BeginCheckoutEcommerce = {
            anonymous_user_id: '',
            coupon: '',
            currency: 'USD',
            ecommerce: {
              items: []
            },
            event: 'begin_checkout',
            value: cartResponse.orderSummary.merchandiseSubTotal,
            user_id: ''
          };
          cartResponse.lineItems.forEach((lineItem) => {
            let newItem: Ga4EcommerceItem = {
              affiliation: '',
              coupon: '',
              currency: 'USD',
              discount: lineItem.discountedPricePerQuantity
                ? lineItem.originalPricePerQuantity - lineItem.discountedPricePerQuantity
                : 0,
              index: '',
              item_brand: lineItem.variant?.attributes?.brand?.value ?? '',
              item_category: '',
              item_category2: '',
              item_category3: '',
              item_category4: '',
              item_category5: '',
              item_id: lineItem.variant.sku,
              item_list_id: '',
              item_list_name: '',
              item_name: lineItem.name,
              item_variant: '',
              price: lineItem.discountedPricePerQuantity
                ? lineItem.discountedPricePerQuantity
                : lineItem.originalPricePerQuantity,
              quantity: lineItem.quantity
            };

            gtmData.ecommerce.items.push(newItem);
          });

          if (sessionId) {
            isLoggedInUser
              ? (gtmData.user_id = sessionId)
              : (gtmData.anonymous_user_id = sessionId);
          }

          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
          window.dataLayer.push(gtmData);
        }

        dispatch({
          type: 'UPDATE_TOTAL_PRICE',
          payload: cartResponse?.orderSummary?.totalPrice
        });

        dispatch({
          type: 'UPDATE_ORDERSUMMARY',
          payload: cartResponse?.orderSummary
        });

        dispatch({
          type: 'UPDATE_CART_DETAILS',
          payload: cartResponse
        });
      }
      updateShippingInfoGtmData(cartResponse);
      setCartInfo(cartResponse);
      setCartDetails(cartResponse);
      setTaxPrice(cartResponse?.orderSummary?.totalTax);
      setTaxExempt(profileDetails?.taxExempt);
      dispatch(spinnerEnd);
    }

    if (!heartBeatInfo?.isExistingSession) {
      return;
    }

    getCartData();
    for (const [key, value] of Object.entries(defaultCurrentFormMode)) {
      if (value === 'EDIT') {
        updateHeaderStepper(key);
        return;
      }
    }
  }, [heartBeatInfo?.isExistingSession, orderErrorMessages]);

  useEffect(() => {
    dispatch({
      type: 'UPDATE_ORDERCONFIRMATION_MODE',
      payload: orderConfirmationMode
    });
  }, [orderConfirmationMode]);

  if (!cartDetails) {
    return <div className={OrderSummaryStyles.cartDomView}></div>;
  }

  orderSummaryDetails['cartNumber'] = cartDetails?.cartNumber;
  orderSummaryDetails['orderSummary'] = cartDetails?.orderSummary;
  orderSummaryDetails['cartSubTotalForFreeShippingEligibleItems'] =
    cartDetails?.cartSubTotalForFreeShippingEligibleItems;
  orderSummaryDetails['warningNotices'] = fullCartContent?.productTile?.warningNotices;

  const { productTile: productTileCmsData } = orderSummaryDetails?.fullCartContent;

  function updateShippingInfoGtmData(orderDetails) {
    if (orderDetails.orderSummary) {
      shippingInfoGtmData.value = orderDetails.orderSummary.merchandiseSubTotal;
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

      shippingInfoGtmData.ecommerce.items = ga4EcommerceItems;
    }
  }

  const handleCheckoutFormUpdate = (type, formValue, restrictFormViewChange = false) => {
    if (!restrictFormViewChange) {
      handleCurrentFormUpdateToView(type);
    }
    setCheckoutFormValue({ ...checkoutFormValue, [type]: formValue });
  };
  const handleCheckoutFormUpdateClean = (
    updatedCartResponse,
    type,
    restrictFormViewChange = false
  ) => {
    if (!restrictFormViewChange) {
      handleCurrentFormUpdateToView(type);
    }
    processDefaultCartInfo(updatedCartResponse);
    setTaxPrice(updatedCartResponse?.orderSummary?.totalTax);
    dispatch({
      type: 'UPDATE_TOTAL_PRICE',
      payload: updatedCartResponse?.orderSummary?.totalPrice
    });
    dispatch({
      type: 'UPDATE_ORDERSUMMARY',
      payload: updatedCartResponse?.orderSummary
    });

    dispatch({
      type: 'UPDATE_CART_DETAILS',
      payload: updatedCartResponse
    });

    setCheckoutFormValue({ ...defaultCheckoutFormValue });
  };

  const handleOrderConfirmationResponse = (orderResponse) => {
    processDefaultCartInfo(orderResponse);
    setCheckoutFormValue({ ...defaultCheckoutFormValue });
  };

  const handleCurrentFormUpdateToView = (type) => {
    const { paymentMethod } = checkoutFormValue?.['paymentAndBilling']?.['creditCardDetails'] ?? {};
    const isPaypal = paymentMethod?.toLowerCase() === 'paypal';
    let nextItem = formOrder.findIndex((e) => e === type) + 1;
    if (formOrder[nextItem] === 'paymentAndBilling' && isPaypal) {
      nextItem += 1;
    }
    setCurrentFormMode({
      ...currentFormMode,
      [type]: 'VIEW',
      [formOrder[nextItem]]: 'EDIT'
    });
    updateHeaderStepper(formOrder[nextItem]);
  };

  function updateHeaderStepper(editForm) {
    let stepperHeaderNumber = 99;
    switch (editForm) {
      case 'contact':
      case 'shipping':
        stepperHeaderNumber = 0;
        break;
      case 'paymentAndBilling':
        stepperHeaderNumber = 1;
        break;
      case 'review':
        stepperHeaderNumber = 2;
        break;
    }
    dispatch({
      type: 'UPDATE_CHECKOUT_STEPPER',
      payload: { stepperHeaderNumber }
    });
  }

  const handleCurrentFormUpdateToEdit = (type) => {
    const currentEditableItem = formOrder.findIndex((e) => currentFormMode[e] === 'EDIT');
    /*TODO: Check with business for alerting if there is a form which is already is edit mode.
      alert(`${formOrder[currentEditableItem]} is already in edit mode, Clicking ok will stash them`);
    */
    setCurrentFormMode({
      ...currentFormMode,
      [type]: 'EDIT',
      [formOrder[currentEditableItem]]: ''
    });
    updateHeaderStepper(type);
  };

  const renderContactSection = () => {
    return (
      <ContactInfoForm
        checkoutFormValue={checkoutFormValue}
        currentFormMode={currentFormMode['contact']}
        updateCheckoutFormValue={handleCheckoutFormUpdate}
        updateCurrentFormMode={() => handleCurrentFormUpdateToEdit('contact')}
        showFormEditButton={orderConfirmationMode}
      />
    );
  };

  const renderShippingSection = () => {
    return (
      <ShippingAddressForm
        countryStateData={countryStateList?.shippingCountries}
        checkoutFormValue={checkoutFormValue}
        currentFormMode={currentFormMode['shipping']}
        updateCheckoutFormValue={handleCheckoutFormUpdate}
        updateCheckoutFormUpdateClean={handleCheckoutFormUpdateClean}
        updateCurrentFormMode={() => handleCurrentFormUpdateToEdit('shipping')}
        showFormEditButton={orderConfirmationMode}
        shippingInfoGtmData={shippingInfoGtmData}
      />
    );
  };

  const renderPaymentAndBillingSection = () => {
    return (
      <PaymentAndBillingAddressForm
        countryStateData={countryStateList?.billingCountries}
        checkoutFormValue={checkoutFormValue}
        currentFormMode={currentFormMode['paymentAndBilling']}
        updateCheckoutFormValue={handleCheckoutFormUpdate}
        updateCartFormData={handleOrderConfirmationResponse}
        updateCheckoutFormUpdateClean={handleCheckoutFormUpdateClean}
        updateCurrentFormMode={() => handleCurrentFormUpdateToEdit('paymentAndBilling')}
        showFormEditButton={orderConfirmationMode}
        taxExempt={taxExempt}
      />
    );
  };

  const renderReviewOrderSection = () => {
    return (
      <>
        {currentFormMode['orderConfirmation'] !== 'EDIT' && (
          <OrderReview
            currentFormMode={currentFormMode['review']}
            totalPrice={cartInfo?.orderSummary?.totalPrice}
            updateOrderResponse={handleOrderConfirmationResponse}
            updateCurrentFormMode={() => handleCurrentFormUpdateToEdit('orderConfirmation')}
            cartInfo={cartInfo}
            freeShippingDetails={freeShippingDetails}
            orderSummaryDetails={orderSummaryDetails}
            taxPrice={taxPrice}
            setOrderErrorMessages={setOrderErrorMessages}
          />
        )}
      </>
    );
  };

  const renderOrderSummaryMobileSection = () => {
    return (
      <>
        {orderConfirmationMode && (
          <div className={CheckoutStyles.orderSummarryMobile}>
            <div className={CheckoutStyles.individualFormBoxes}>
              <OrderSummaryAccordion
                cartInfo={cartInfo}
                orderConfirmationMode={orderConfirmationMode}
                freeShippingDetails={freeShippingDetails}
                orderSummaryDetails={orderSummaryDetails}
                taxPrice={taxPrice}
              />
            </div>
          </div>
        )}
      </>
    );
  };

  const renderSignUpSection = () => {
    return (
      <>
        {orderConfirmationMode && !heartBeatInfo.isLoggedInUser && (
          <div
            className={`${CheckoutStyles.individualFormBoxes} ${CheckoutStyles.signUpFormBoxHeader}`}
          >
            <div className={CheckoutStyles.formBoxHeader} />
            <div className={CheckoutStyles.signUpWrapper}>
              <SignUp guestSignUpFieldValues={guestSignUpFieldValues} isGuestSignUp />
            </div>
          </div>
        )}
      </>
    );
  };

  const renderExpressPayAndLoginSection = () => {
    const { paymentMethod } = checkoutFormValue?.['paymentAndBilling']?.['creditCardDetails'] ?? {};
    const isPaypal = paymentMethod?.toLowerCase() === 'paypal';

    return (
      <>
        {!orderConfirmationMode && !isPaypal && (
          <ExpressPayAndLoginForm
            checkoutFormValue={checkoutFormValue}
            currentFormMode={currentFormMode['contact']}
            updateCheckoutFormValue={handleCheckoutFormUpdate}
            updateCurrentFormMode={() => handleCurrentFormUpdateToEdit('contact')}
          />
        )}
      </>
    );
  };

  const allFormSection = () => {
    return (
      <>
        <div>{renderExpressPayAndLoginSection()}</div>
        <div className={CheckoutStyles.individualFormBoxes}>{renderContactSection()}</div>
        <div className={CheckoutStyles.individualFormBoxes}>{renderShippingSection()}</div>
        <div>{renderPaymentAndBillingSection()}</div>

        <div>{renderReviewOrderSection()}</div>
        <div>{renderOrderSummaryMobileSection()}</div>
        <div>{renderSignUpSection()}</div>
      </>
    );
  };

  const CheckoutPage = () => {
    return (
      <>
        <Accordion className={CheckoutStyles.orderSummaryMobileSection}>
          <AccordionSummary
            expandIcon={
              <>
                {' '}
                <ArrowDropDownIcon />
              </>
            }
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <>
              <label className={CheckoutStyles.orderSummaryTotalPrice}>
                {fixForItemPricesWithoutChange(
                  `${
                    cartTotalPrice ? cartTotalPrice : orderSummaryDetails?.orderSummary?.totalPrice
                  }`
                )}
              </label>
              <label className={CheckoutStyles.viewOrderSummaryLabel}>View Order Summary</label>
            </>
          </AccordionSummary>
          <Divider className={CheckoutStyles.orderSummaryDivider} />
          <AccordionDetails>
            <OrderSummaryAccordion
              cartInfo={cartInfo}
              freeShippingDetails={freeShippingDetails}
              orderSummaryDetails={orderSummaryDetails}
              taxPrice={taxPrice}
              messageList={cartInfo?.inventoryMessages}
            />
          </AccordionDetails>
        </Accordion>

        <div className={CheckoutStyles.checkoutMainContainer}>
          <Grid container className={CheckoutStyles.checkoutParentGrid}>
            <Grid item id="order_confirmation" className={CheckoutStyles.formGrid}>
              {allFormSection()}
            </Grid>
            <div className={CheckoutStyles.needHelpSection}>
              <RenderHelpAndContact
                isMobile={true}
                cartNumber={cartDetails?.cartNumber}
                fullCartContent={fullCartContent}
              />
            </div>
            <Grid item className={CheckoutStyles.orderSummaryGrid}>
              <div className={OrderSummaryStyles.orderView}>
                <OrderSummary
                  isPlainSummary={true}
                  freeShippingDetails={freeShippingDetails}
                  orderSummaryDetails={orderSummaryDetails}
                  isTaxAvailable={true}
                  taxPrice={taxPrice}
                  isRetailDeliveryFeeAvailable
                />
              </div>
              <div className={CheckoutStyles.productTileTitle}>
                <label>CART SUMMARY</label>
              </div>
              <ProductNotAvailableComp
                messageList={orderErrorMessages.concat(cartInfo?.inventoryMessages)}
              />
              <div className={CheckoutStyles.productTileWrapper}>
                {cartInfo?.lineItems?.map((e, i: number) => (
                  <ProductTile
                    {...e}
                    cmsData={productTileCmsData}
                    inventoryMessages={cartInfo.inventoryMessages}
                    key={i}
                    isCheckoutPage
                  />
                ))}
              </div>
            </Grid>
          </Grid>
        </div>

        {/*  Featured items in checkoutPage */}
        {/* ToDo: Need to move this to order confirmation page */}
        {/* {orderConfirmationMode && featuredItems?.length > 0 && (
          <FeaturedItems label="Featured items" products={featuredItems} />
        )} */}
      </>
    );
  };

  return (
    <>
      <Script src="https://flex.cybersource.com/cybersource/assets/microform/0.11/flex-microform.min.js" />
      <CheckoutPage />
    </>
  );
}

export async function getServerSideProps(ctx): Promise<GetServerSidePropsResult<any>> {
  const headers = getCookie(ctx);
  const [freeShippingDetails, orderSummaryDetails] = await Promise.all([
    getFreeShippingMessages(headers),
    getOrderSummaryData(headers)
  ]);

  return {
    props: {
      freeShippingDetails,
      orderSummaryDetails
    }
  };
}
