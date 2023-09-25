import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '@Redux/store';
import { Divider } from '@mui/material';
import EditAddressForm from './editAddressForm';
import EditPaymentForm from './editPaymentForm';
import PaymentOption from '@Components/checkout/forms/loggedIn/paymentOption';
import GCBillingAddressList from '@Components/checkout/forms/loggedIn/gcBillingAddressList';
import GiftCardPaymentForm, {
  ViewGiftCardPaymentForm
} from '@Components/checkout/forms/payment/giftCardPaymentForm';
import HLAnchorTag from '@Components/common/hlAnchorTag';
import { billingAddressFormFieldLabels, shippingFieldLabels } from '@Constants/checkoutConstants';
import CheckoutStyles from '@Styles/checkout/checkoutPage.module.scss';
import { addPaymentAndBillingAddress, addBillingAddress } from '@Lib/cms/checkoutPage';
import { executeFnLastInEventQueue, fixForItemPricesWithoutChange } from '@Lib/common/utility';
import { deletePaymentFromCart } from '@Lib/cms/cartpage';
import { renderPaypalContainerItems } from '@Components/3rdPartyServices/paypalPaymentOption';
import { ADD_BILLING_ADDRESS_FAIL } from '@Constants/checkoutErrorConstants';
import Spinner from '@Components/common/spinner';
import { Ga4AddPaymentInfoEcommerce } from 'src/interfaces/ga4Ecommerce';
import { Ga4EcommerceItem } from 'src/interfaces/ga4EcommerceItem';
import { LineItem, OrderSummary } from 'src/interfaces/orderDetails';

export default function PaymentAndBillingAddressForm(props: any): JSX.Element {
  const { checkoutFormValue, currentFormMode, countryStateData, taxExempt } = props;
  const { updateCheckoutFormValue, updateCurrentFormMode, showFormEditButton, updateCartFormData } =
    props;

  const { pageType } = useSelector((state) => state.layout);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);

  const isBillingSameAsShipping =
    checkoutFormValue?.paymentAndBilling?.billingAddress?.billingSameAsShipping ?? false;
  const {
    heartBeatInfo: { isLoggedInUser, sessionId },
    myProfileInfo
  } = useSelector((state) => state.auth);
  const {
    cartDeatilsFromRedux,
    orderSummaryFromRedux: { isGCCoversFullPayment }
  } = useSelector((state) => state.checkout);

  const dispatch = useDispatch();

  useEffect(() => {
    const props = {
      containerId: 'payment-paypal-button-container',
      cartDetails: cartDeatilsFromRedux,
      buttonAlign: 'horizontal'
    };
    executeFnLastInEventQueue(renderPaypalContainerItems, props, 0);
  }, [!!pageType?.isCheckoutPage]);

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  const [microform, setMicroForm] = useState(null);
  const [flexToken, setFlexToken] = useState(null);
  const [flexTokenError, setFlexTokenError] = useState(null);
  const [cardType, setCardType] = useState();

  const [addressInfo, setAddressInfo] = useState(null);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(isBillingSameAsShipping);
  const [billingAddress, setBillingAddress] = useState(
    checkoutFormValue?.paymentAndBilling?.billingAddress
  );
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(false);
  const [savePaymentError, setSavePaymentError] = useState(false);

  const handleAddBilling = async (addressData) => {
    const addressInfo = billingSameAsShipping
      ? { ...checkoutFormValue.shipping }
      : { ...addressData };

    setAddressInfo({
      ...addressData,
      ...checkoutFormValue?.contact,
      billingSameAsShipping
    });

    if (microform) {
      setIsSpinnerVisible(true);
      setIsSubmitButtonDisabled(true);

      setFlexToken(null);
      createFlexToken();
    } else {
      handleAddBillingAddress(addressInfo);
    }
  };
  async function handleAddBillingAddress(addressInfo) {
    const addressCrudProps = {
      ...addressInfo,
      ...checkoutFormValue?.contact,
      billingSameAsShipping
    };

    const billingAddressResponse = (await addBillingAddress({}, { ...addressCrudProps })) ?? {};
    if (billingAddressResponse) {
      updateCheckoutFormValue('paymentAndBilling', {
        billingAddress: addressCrudProps
      });
    } else {
      showErrorAlert(ADD_BILLING_ADDRESS_FAIL);
    }
  }

  const showErrorAlert = (errMessage: any) => {
    dispatch({
      type: 'UPDATE_SNACKBAR_WITH_DATA',
      payload: {
        open: true,
        message: errMessage,
        severity: 'error'
      }
    });
  };

  const createFlexToken = () => {
    const options = {
      expirationMonth: document.querySelector('#month').getAttribute('value'),
      expirationYear: document.querySelector('#year').getAttribute('value')
    };

    microform.createToken(options, function (error, token) {
      if (error) {
        console.error(error);
        setFlexTokenError(error);
        setIsSpinnerVisible(false);
      } else {
        setFlexToken(token);
        setIsSpinnerVisible(false);
      }
    });
  };

  const addPaymentGtmData = (orderSummary, lineItems, paymentDetails) => {
    const addPaymentGtmData: Ga4AddPaymentInfoEcommerce = {
      payment_type: '',
      coupon: '',
      currency: 'USD',
      value: 0,
      anonymous_user_id: '',
      ecommerce: {
        items: []
      },
      event: 'add_payment_info',
      user_id: ''
    };

    if (sessionId) {
      isLoggedInUser
        ? (addPaymentGtmData.user_id = sessionId)
        : (addPaymentGtmData.anonymous_user_id = sessionId);
    }

    if (orderSummary) {
      addPaymentGtmData.value = orderSummary.merchandiseSubTotal;
    }

    if (paymentDetails) {
      addPaymentGtmData.payment_type = paymentDetails.paymentMethod;
    }

    if (lineItems) {
      var ga4EcommerceItems: Ga4EcommerceItem[] = [];

      lineItems.forEach((lineItem, index) => {
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

      addPaymentGtmData.ecommerce.items = ga4EcommerceItems;
    }

    return addPaymentGtmData;
  };

  useEffect(() => {
    async function savePaymentAndBillingAddress() {
      const paymentRequest = {
        flexToken,
        nameAsOnCard: document.querySelector('#cardHolderName').getAttribute('value'),
        cardType
      };

      const { paymentDetails, orderSummary, lineItems } =
        (await addPaymentAndBillingAddress({}, addressInfo, paymentRequest)) ?? {};

      setIsSubmitButtonDisabled(false);

      if (paymentDetails && orderSummary) {
        const creditCardDetails = {
          ...checkoutFormValue?.paymentAndBilling?.creditCardDetails,
          ...paymentDetails,
          totalPrice: orderSummary?.totalPrice ?? 0
        };
        updateCheckoutFormValue('paymentAndBilling', {
          creditCardDetails,
          billingAddress: addressInfo
        });

        // GTM event `add_payment_info`
        if (window) {
          let gtmData: Ga4AddPaymentInfoEcommerce = addPaymentGtmData(
            orderSummary,
            lineItems,
            paymentDetails
          );
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
          window.dataLayer.push(gtmData);
        }
      } else {
        setSavePaymentError(true);
      }
      setIsSpinnerVisible(false);
    }

    if (flexToken) {
      setIsSpinnerVisible(true);
      savePaymentAndBillingAddress();
    }
  }, [flexToken]);

  const renderViewBillingAddressForm = () => {
    const billingAddress = checkoutFormValue?.paymentAndBilling?.billingAddress;
    const {
      firstName,
      lastName,
      addressLineOne,
      addressLineTwo,
      country,
      city,
      state,
      zipCode,
      company
    } = billingAddress ?? {};

    const { paymentMethod } = checkoutFormValue?.paymentAndBilling?.creditCardDetails ?? {};
    const isPaypal = paymentMethod?.toLowerCase() === 'paypal';

    return (
      <div className={CheckoutStyles.individualFormBoxes}>
        {billingAddress ? (
          <>
            <div className={CheckoutStyles.viewContactForm}>
              <label>{billingAddressFormFieldLabels?.billingAddress}</label>
              {currentFormMode === 'VIEW' && !showFormEditButton && !isPaypal && !taxExempt && (
                <a onClick={updateCurrentFormMode}>{billingAddressFormFieldLabels?.editForm} </a>
              )}
            </div>

            {taxExempt && (
              <span className={CheckoutStyles.viewContactForm}>
                <span dangerouslySetInnerHTML={{ __html: shippingFieldLabels.taxExempt }}></span>
                <HLAnchorTag
                  anchorTheme="LinkType2"
                  label={shippingFieldLabels.contactUs}
                  value={shippingFieldLabels.contactUsLink}
                />
                <label>{shippingFieldLabels.contactusHelperText}</label>
              </span>
            )}

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {taxExempt && <label className={CheckoutStyles.header}>Default address</label>}
              <label className={CheckoutStyles.viewLabels}>{`${firstName} ${lastName}`}</label>
              <label className={CheckoutStyles.viewLabels}>{`${addressLineOne} ${
                addressLineTwo ?? ''
              }`}</label>
              {company && <label className={CheckoutStyles.viewLabels}>{`${company}`}</label>}
              <label className={CheckoutStyles.viewLabels}>{`${city} ${state} ${zipCode}`}</label>
              <label className={CheckoutStyles.viewLabels}>{`${country}`}</label>
            </div>
          </>
        ) : (
          <>
            <span>BILLING ADDRESS</span>
          </>
        )}
      </div>
    );
  };

  const renderViewPaymentSection = () => {
    const { last4Digits, cardType, expirationMonth, expirationYear, amount } =
      checkoutFormValue?.paymentAndBilling?.creditCardDetails ?? {};

    const { paymentMethod } = checkoutFormValue?.paymentAndBilling?.creditCardDetails ?? {};
    const isPaypal = paymentMethod?.toLowerCase() === 'paypal';

    const expiryYear = expirationYear?.toString().slice(-2);
    const expiryMonth =
      expirationMonth?.toString().length === 1 ? `0${expirationMonth}` : expirationMonth;

    const handleEditPayment = async () => {
      if (isPaypal) {
        const { paypal: paypalPayment } =
          checkoutFormValue?.paymentAndBilling?.creditCardDetails?.paymentClassification;
        const { paymentId } = paypalPayment?.[0];
        deletePaymentFromCart(paymentId)?.then((cartResponseToUpdate) => {
          updateCartFormData(cartResponseToUpdate);
        });
      }
      updateCurrentFormMode();
    };

    return (
      <div className={CheckoutStyles.individualFormBoxes}>
        <div className={CheckoutStyles.viewContactForm}>
          <label>Payment Option</label>
          {!showFormEditButton && (
            <a onClick={handleEditPayment}>{billingAddressFormFieldLabels?.editForm}</a>
          )}
        </div>

        <ViewGiftCardPaymentForm />

        {isPaypal && (
          <>
            <img
              src={'/icons/checkout/paypalBlue.svg'}
              alt="paypal_logo"
              width={94}
              height={22}
              aria-label="paypal_logo"
            />
            <label className={CheckoutStyles.viewLabels}>
              {checkoutFormValue.contact?.emailAddress}
            </label>
          </>
        )}
        {!isGCCoversFullPayment && (
          <>
            {last4Digits && (
              <div className={CheckoutStyles.paymentOverview}>
                <label className={CheckoutStyles.viewLabels}>{`${cardType} *${last4Digits}`}</label>

                <div className={CheckoutStyles.paymentTotal}>
                  <label className={CheckoutStyles.viewLabels}>
                    {`Exp ${expiryMonth}/${expiryYear}`}
                  </label>

                  <label className={CheckoutStyles.viewLabels}>
                    {fixForItemPricesWithoutChange(amount)}
                  </label>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderPaymentOption = () => {
    return (
      <div className={CheckoutStyles.individualFormBoxes}>
        <label>
          <b>PAYMENT OPTION</b>
        </label>
        <label className={CheckoutStyles.selectOptionDescription}>
          Select a payment option from the list
        </label>
        <label className={CheckoutStyles.secureOptionsDescription}>
          All options are safe and secure.
        </label>

        <br></br>

        <GiftCardPaymentForm updateCheckoutFormUpdateClean={props.updateCheckoutFormUpdateClean} />
        <Divider className={CheckoutStyles.paymentOptionDivider} />

        <PaymentOption
          checkoutFormValue={checkoutFormValue}
          countryStateData={countryStateData}
          updateCheckoutFormValue={updateCheckoutFormValue}
          updateCurrentFormMode={updateCurrentFormMode}
        />
      </div>
    );
  };

  const renderBillingEditAddressForm = () => {
    const handleAddressCheckBoxInputChange = (event) => {
      const { checked: billingSameAsShipping } = event?.target;
      setBillingSameAsShipping(billingSameAsShipping);
      if (billingSameAsShipping) {
        const addressZipCode = checkoutFormValue.shipping.zipCode;
        const croppedZipCode =
          addressZipCode && addressZipCode.match(/^\d{5}(-\d*)?$/)
            ? addressZipCode.slice(0, 5)
            : addressZipCode;
        const updatedAddress = { ...checkoutFormValue.shipping, zipCode: croppedZipCode };
        setBillingAddress({
          ...updatedAddress,
          billingSameAsShipping
        });
      } else {
        setBillingAddress({
          ...checkoutFormValue?.paymentAndBilling?.billingAddress,
          billingSameAsShipping
        });
      }
    };

    const handlePaymentCheckBoxInputChange = (event) => {
      const { checked: isDefaultPaymentMethod } = event?.target;
      setDefaultPaymentMethod(isDefaultPaymentMethod);
    };

    return (
      <>
        <div className={CheckoutStyles.individualFormBoxes}>
          <GiftCardPaymentForm
            updateCheckoutFormUpdateClean={props.updateCheckoutFormUpdateClean}
          />

          {!isGCCoversFullPayment && (
            <EditPaymentForm
              flexTokenError={flexTokenError}
              setSubmitDisabled={setIsSubmitButtonDisabled}
              microFormCallBack={setMicroForm}
              setCardType={setCardType}
            >
              <span className={CheckoutStyles.checkoutCheckboxWrapper}>
                <input
                  type="checkbox"
                  onChange={handlePaymentCheckBoxInputChange}
                  checked={defaultPaymentMethod}
                  className={CheckoutStyles.checkoutCheckbox}
                />
                <label className={CheckoutStyles.checkboxLabel}>Save Payment Method</label>
              </span>
            </EditPaymentForm>
          )}
          <Divider className={CheckoutStyles.divider} />
          {!isLoggedInUser && (
            <>
              <div className={CheckoutStyles.billingAddressTitle}>
                <label>
                  <b>{billingAddressFormFieldLabels?.billingAddress}</b>
                </label>
              </div>
              <span className={CheckoutStyles.checkoutCheckboxWrapper}>
                <input
                  type="checkbox"
                  onChange={handleAddressCheckBoxInputChange}
                  checked={billingSameAsShipping}
                  className={CheckoutStyles.checkoutCheckbox}
                />
                <label className={CheckoutStyles.checkboxLabel}>
                  My billing and shipping information is the same.
                </label>
              </span>
              <EditAddressForm
                handleAddressPersistanceCallBack={handleAddBilling}
                countryStateData={countryStateData}
                checkoutFormValues={billingAddress}
                isTextFieldDisabled={billingSameAsShipping}
                isSubmitButtonDisabled={isSubmitButtonDisabled}
              >
                {savePaymentError && (
                  <div className={CheckoutStyles.paymentErrorSection}>
                    <div className={CheckoutStyles.errorInfoImage}>
                      <img
                        src={'/icons/infoIcon.svg'}
                        alt="delete"
                        width={24}
                        height={24}
                        aria-label="delete"
                      />
                    </div>
                    <label className={CheckoutStyles.paymentErrorLabel}>
                      The information you provided does not match. Please enter correct information
                      and try again!
                    </label>
                  </div>
                )}
              </EditAddressForm>
            </>
          )}
          {isGCCoversFullPayment && isLoggedInUser && (
            <GCBillingAddressList
              checkoutFormValue={checkoutFormValue}
              countryStateData={countryStateData}
              updateCheckoutFormValue={updateCheckoutFormValue}
              updateCurrentFormMode={updateCurrentFormMode}
            />
          )}
        </div>
      </>
    );
  };

  let paymentAndBillingElement = (
    <div className={CheckoutStyles.individualFormBoxes}>
      <>PAYMENT OPTION</>
    </div>
  );
  switch (currentFormMode) {
    case 'VIEW':
      paymentAndBillingElement = <>{renderViewPaymentSection()}</>;
      break;
    case 'EDIT':
      paymentAndBillingElement = (
        <>
          {isLoggedInUser && !isGCCoversFullPayment
            ? renderPaymentOption()
            : renderBillingEditAddressForm()}
        </>
      );
      break;
  }

  return (
    <>
      {isSpinnerVisible && (
        <div className={CheckoutStyles.addressSpinner}>
          <Spinner spinnerVisible={true} />
        </div>
      )}
      {paymentAndBillingElement}
      {renderViewBillingAddressForm()}
    </>
  );
}
