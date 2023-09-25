import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '@Redux/store';
import { Divider } from '@mui/material';
import HlButton from '@Components/common/button';
import PaymentList from './paymentList';
import AddressList from './addressList';
import EditPaymentForm from '@Components/checkout/forms/editPaymentForm';
import EditAddressForm from '@Components/checkout/forms/editAddressForm';
import HLAnchorTag from '@Components/common/hlAnchorTag';
import { trimObjects } from '@Lib/common/utility';
import { getCustomerPaymentOption } from '@Lib/cms/myAccountPage';
import {
  addPaymentAndBillingAddress,
  addSavedPaymentAndBillingAddress
} from '@Lib/cms/checkoutPage';
import { billingAddressFormFieldLabels, shippingFieldLabels } from '@Constants/checkoutConstants';
import { SAVED_PAYMENT_BILLING_ADDRESS_FAIL } from '@Constants/checkoutErrorConstants';
import Spinner from '@Components/common/spinner';
import PaymentOptionStyles from '@Styles/checkout/loggedIn/paymentOption.module.scss';
import { Ga4AddPaymentInfoEcommerce } from 'src/interfaces/ga4Ecommerce';
import { Ga4EcommerceItem } from 'src/interfaces/ga4EcommerceItem';

export default function PaymentOption(props: any): JSX.Element {
  const dispatch = useDispatch();
  const { checkoutFormValue, updateCheckoutFormValue } = props;

  const { contact, shipping, paymentAndBilling } = checkoutFormValue ?? {};
  const { billingAddress, billingSameAsShipping } = paymentAndBilling ?? {};

  const { countryStateList, isAddressListEmpty, addressList, isPaymentsEmpty, payments } =
    useSelector((state) => state.myAccount);

  const {
    myProfileInfo,
    heartBeatInfo: { sessionId, isLoggedInUser }
  } = useSelector((state) => state.auth);

  const defaultPaymentId =
    payments.find((data) => data?.defaultPayment)?.paymentId ?? payments?.[0]?.paymentId;

  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);

  const prevPaymentCardNumber =
    checkoutFormValue?.paymentAndBilling?.creditCardDetails?.last4Digits;

  const prevPaymentId = payments.find(
    (data) => data?.last4Digits === prevPaymentCardNumber
  )?.paymentId;

  const defaultBillingAddressId =
    addressList.find((data) => data?.defaultAddress)?.addressId ?? addressList?.[0]?.addressId;

  const billingAddressList = addressList.filter((data) => {
    return !myProfileInfo?.taxExempt || data?.taxExemptedAddress;
  });

  const prevBillingAddressId = checkoutFormValue?.paymentAndBilling?.billingAddress?.addressId;

  const [paymentId, setPaymentId] = useState(prevPaymentId ?? defaultPaymentId ?? 'ADD_PAYMENT');
  const [addressId, setAddressId] = useState(
    prevBillingAddressId ?? defaultBillingAddressId ?? 'ADD_ADDRESS'
  );

  const [billingAddressValues, setBillingAddressValues] = useState({});
  const [addressInfo, setAddressInfo] = useState({});

  const [isBillingSameAsShipping, setBillingSameAsShipping] = useState(billingSameAsShipping);

  const [showAddPaymentForm, setShowAddPaymentForm] = useState(isPaymentsEmpty);
  const [showAddAddressForm, setShowAddAddressForm] = useState(isAddressListEmpty);

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  const [savePaymentOption, setSavePaymentOption] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);

  const [savePaymentError, setSavePaymentError] = useState(null);

  const [microform, setMicroForm] = useState(null);
  const [flexToken, setFlexToken] = useState(null);

  const [flexTokenError, setFlexTokenError] = useState(null);

  const [cardType, setCardType] = useState();

  const addPaymentGtmData = (orderDetails) => {
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

    if (orderDetails.orderSummary) {
      addPaymentGtmData.value = orderDetails.orderSummary.merchandiseSubTotal;
    }

    if (orderDetails.paymentDetails) {
      addPaymentGtmData.payment_type = orderDetails.paymentDetails.paymentMethod;
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

      addPaymentGtmData.ecommerce.items = ga4EcommerceItems;
    }

    return addPaymentGtmData;
  };

  const handleAfterSavePaymentAndBilling = (response) => {
    const { paymentDetails, billingAddress, orderSummary } = response ?? {};
    if (paymentDetails && billingAddress && orderSummary) {
      const creditCardDetails = {
        ...checkoutFormValue?.paymentAndBilling?.creditCardDetails,
        ...paymentDetails,
        totalPrice: orderSummary?.totalPrice ?? 0
      };
      const { id, streetName, additionalStreetInfo, postalCode } = billingAddress;
      updateCheckoutFormValue('paymentAndBilling', {
        creditCardDetails,
        billingAddress: {
          ...billingAddress,
          addressId: id,
          addressLineOne: streetName,
          addressLineTwo: additionalStreetInfo,
          zipCode: postalCode
        }
      });

      let gtmData: Ga4AddPaymentInfoEcommerce = addPaymentGtmData(response);
      if (window) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
        window.dataLayer.push(gtmData);
      }
    } else {
      setSavePaymentError(true);
    }
    setIsSubmitButtonDisabled(false);
    setIsSpinnerVisible(false);
  };

  useEffect(() => {
    async function savePaymentAndBillingAddress(paymentRequest) {
      const response = (await addPaymentAndBillingAddress({}, addressInfo, paymentRequest)) ?? {};

      handleAfterSavePaymentAndBilling(response);

      if (savePaymentOption) {
        const paymentResponse = await getCustomerPaymentOption();
        dispatch({
          type: 'UPDATE_PAYMENTS_LIST',
          payload: paymentResponse
        });
      }
    }

    if (flexToken) {
      const paymentRequest = {
        flexToken,
        nameAsOnCard: document.querySelector('#cardHolderName').getAttribute('value'),
        cardType,
        savePayment: savePaymentOption
      };
      savePaymentAndBillingAddress(paymentRequest);
    }
  }, [flexToken]);

  const createFlexToken = () => {
    if (microform) {
      setIsSpinnerVisible(true);
      const options = {
        expirationMonth: document.querySelector('#month').getAttribute('value'),
        expirationYear: document.querySelector('#year').getAttribute('value')
      };

      microform.createToken(options, function (error, token) {
        if (error) {
          console.error(error);
          setIsSpinnerVisible(false);
          setFlexTokenError(error);
        } else {
          setFlexToken(token);
        }
      });
    }
  };

  const savePaymentAndBilling = async (formValues) => {
    setIsSubmitButtonDisabled(true);

    formValues['saveToAddressBook'] = saveAddress;

    /* New Payment & Billing Address */
    if (showAddPaymentForm && showAddAddressForm) {
      setAddressInfo({ ...trimObjects(formValues), ...contact });
      createFlexToken();

      /* New Payment & Selected Billing Address */
    } else if (showAddPaymentForm && !showAddAddressForm) {
      const selectedAddress = billingAddressList.find((data) => data.addressId === addressId);
      const addressZipCode = selectedAddress.zipCode;
      const croppedZipCode =
        addressZipCode && addressZipCode.match(/^\d{5}(-\d*)?$/)
          ? addressZipCode.slice(0, 5)
          : addressZipCode;
      const updatedAddress = { ...selectedAddress, zipCode: croppedZipCode };
      setAddressInfo({ ...updatedAddress, ...contact });
      createFlexToken();

      /* selected Payment & Billing Address associated with selected Payments */
    } else if (!showAddPaymentForm) {
      setIsSpinnerVisible(true);
      const billingAddress = payments.find((data) => data.paymentId === paymentId)?.billingAddress;
      const addressZipCode = billingAddress.zipCode;
      const croppedZipCode =
        addressZipCode && addressZipCode.match(/^\d{5}(-\d*)?$/)
          ? addressZipCode.slice(0, 5)
          : addressZipCode;
      const updatedAddress = { ...billingAddress, zipCode: croppedZipCode };
      if (myProfileInfo?.phone) updatedAddress.phone = myProfileInfo?.phone;
      const response = await addSavedPaymentAndBillingAddress(updatedAddress, paymentId);
      if (response) {
        handleAfterSavePaymentAndBilling(response);
      } else {
        dispatch({
          type: 'UPDATE_SNACKBAR_WITH_DATA',
          payload: {
            open: true,
            message: SAVED_PAYMENT_BILLING_ADDRESS_FAIL,
            severity: 'error'
          }
        });
      }
    }
  };

  const handleBillingSameAsShippingChange = (event) => {
    const { checked: billingSameAsShipping } = event?.target;
    const billingAddressValues = billingSameAsShipping ? { ...shipping } : { ...billingAddress };
    setBillingAddressValues({ ...billingAddressValues, billingSameAsShipping });
    setBillingSameAsShipping(billingSameAsShipping);
  };

  const savePaymentErrorInfo = () => {
    return (
      <div className={PaymentOptionStyles.paymentErrorWrapper}>
        <div className={PaymentOptionStyles.errorImage}>
          <img
            src={'/icons/infoIcon.svg'}
            alt="delete"
            width={24}
            height={24}
            aria-label="delete"
          />
        </div>
        <label className={PaymentOptionStyles.errorLabel}>
          The information you provided does not match. Please enter correct information and try
          again!
        </label>
      </div>
    );
  };

  if (!billingAddressList.length && myProfileInfo?.taxExempt) {
    return (
      <span className={PaymentOptionStyles.billingAddressError}>
        <span>
          *Accounts marked as <b>Tax-Exempt</b> do not have the option to edit their Billing Address
          online.
        </span>
        <HLAnchorTag
          anchorTheme="LinkType2"
          label={shippingFieldLabels.contactUs}
          value={shippingFieldLabels.contactUsLink}
        />
        <label>{shippingFieldLabels.contactusHelperText}</label>
      </span>
    );
  }

  return (
    <>
      {isSpinnerVisible && (
        <div
          className={PaymentOptionStyles.addressSpinner}
          style={{ minHeight: showAddPaymentForm && '135%' }}
        >
          <Spinner spinnerVisible={true} />
        </div>
      )}
      <PaymentList
        payments={payments}
        paymentId={paymentId}
        setPaymentId={setPaymentId}
        setShowAddPaymentForm={setShowAddPaymentForm}
      />
      {showAddPaymentForm && (
        <>
          <EditPaymentForm
            flexTokenError={flexTokenError}
            setSubmitDisabled={setIsSubmitButtonDisabled}
            microFormCallBack={setMicroForm}
            setCardType={setCardType}
          >
            <span className={PaymentOptionStyles.checkboxWrapper}>
              <input
                type="checkbox"
                onChange={(event) => setSavePaymentOption(event?.target?.checked)}
                checked={savePaymentOption}
                className={PaymentOptionStyles.checkbox}
              />
              <label className={PaymentOptionStyles.checkboxLabel}>Save Payment Option</label>
            </span>
          </EditPaymentForm>
          <Divider />
          <AddressList
            addresses={billingAddressList}
            addressId={addressId}
            showAddPaymentForm={showAddPaymentForm}
            showAddAddressForm={showAddAddressForm}
            isBillingSameAsShipping={isBillingSameAsShipping}
            setAddressId={setAddressId}
            setShowAddAddressForm={setShowAddAddressForm}
            setBillingSameAsShipping={setBillingSameAsShipping}
          />
          {showAddAddressForm && !myProfileInfo?.taxExempt && (
            <>
              <div className={PaymentOptionStyles.checkboxGroup}>
                <span className={PaymentOptionStyles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    onChange={handleBillingSameAsShippingChange}
                    checked={isBillingSameAsShipping}
                    className={PaymentOptionStyles.checkbox}
                  />
                  <label className={PaymentOptionStyles.checkboxLabel}>
                    My billing and shipping information is the same.
                  </label>
                </span>
              </div>
              <EditAddressForm
                handleAddressPersistanceCallBack={savePaymentAndBilling}
                checkoutFormValues={billingAddressValues}
                countryStateData={countryStateList?.billingCountries}
                isSubmitButtonDisabled={isSubmitButtonDisabled}
                isTextFieldDisabled={isBillingSameAsShipping}
              >
                <span className={PaymentOptionStyles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    onChange={(event) => setSaveAddress(event?.target?.checked)}
                    checked={saveAddress}
                    className={PaymentOptionStyles.checkbox}
                  />
                  <label className={PaymentOptionStyles.checkboxLabel}>Save Address</label>
                </span>
                {savePaymentError && savePaymentErrorInfo()}
              </EditAddressForm>
            </>
          )}
        </>
      )}
      {(!showAddPaymentForm || !showAddAddressForm) && (
        <>
          {savePaymentError && savePaymentErrorInfo()}
          <HlButton
            buttonTitle={billingAddressFormFieldLabels.saveAndcontinue}
            callbackMethod={savePaymentAndBilling}
            isDisabled={
              !paymentId ||
              (showAddPaymentForm && !addressId) ||
              (showAddAddressForm && !addressId) ||
              isSubmitButtonDisabled
            }
            parentDivClass={PaymentOptionStyles.submitWrapper}
            buttonClass={PaymentOptionStyles.submitButton}
          />
        </>
      )}
    </>
  );
}
