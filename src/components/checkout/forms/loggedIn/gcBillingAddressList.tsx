import { useState } from 'react';
import { useSelector, useDispatch } from '@Redux/store';
import HlButton from '@Components/common/button';
import AddressList from '@Components/checkout/forms/loggedIn/addressList';
import EditAddressForm from '@Components/checkout/forms/editAddressForm';
import { addBillingAddress } from '@Lib/cms/checkoutPage';
import { trimObjects } from '@Lib/common/utility';
import { billingAddressFormFieldLabels } from '@Constants/checkoutConstants';
import { ADD_BILLING_ADDRESS_FAIL } from '@Constants/checkoutErrorConstants';
import PaymentOptionStyles from '@Styles/checkout/loggedIn/paymentOption.module.scss';

export default function GCBillingAddressList(props: any): JSX.Element {
  const dispatch = useDispatch();
  const { checkoutFormValue, updateCheckoutFormValue } = props;
  const { contact, shipping, paymentAndBilling } = checkoutFormValue ?? {};
  const { billingAddress, billingSameAsShipping } = paymentAndBilling ?? {};

  const { countryStateList, isAddressListEmpty, addressList } = useSelector(
    (state) => state.myAccount
  );

  const { myProfileInfo } = useSelector((state) => state.auth);

  const defaultBillingAddressId =
    addressList.find((data) => data?.defaultAddress)?.addressId ?? addressList?.[0]?.addressId;

  const billingAddressList = addressList.filter((data) => {
    return !myProfileInfo?.taxExempt || data?.taxExemptedAddress;
  });

  const prevBillingAddressId = checkoutFormValue?.paymentAndBilling?.billingAddress?.addressId;

  const [addressId, setAddressId] = useState(
    prevBillingAddressId ?? defaultBillingAddressId ?? 'ADD_ADDRESS'
  );

  const [billingAddressValues, setBillingAddressValues] = useState({});
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  const [isBillingSameAsShipping, setBillingSameAsShipping] = useState(billingSameAsShipping);

  const [showAddAddressForm, setShowAddAddressForm] = useState(isAddressListEmpty);

  const [saveAddress, setSaveAddress] = useState(false);

  const handleBillingSameAsShippingChange = (event) => {
    const { checked: billingSameAsShipping } = event?.target;
    const billingAddressValues = billingSameAsShipping ? { ...shipping } : { ...billingAddress };
    setBillingAddressValues({ ...billingAddressValues, billingSameAsShipping });
    setBillingSameAsShipping(billingSameAsShipping);
  };

  const savePaymentAndBilling = async (formValues) => {
    setIsSubmitButtonDisabled(true);

    formValues['saveToAddressBook'] = saveAddress;

    if (showAddAddressForm) {
      const addressCrudProps = {
        ...trimObjects(formValues),
        ...contact,
        billingSameAsShipping
      };
      const response = (await addBillingAddress({}, { ...addressCrudProps })) ?? {};

      if (response) {
        updateCheckoutFormValue('paymentAndBilling', {
          billingAddress: addressCrudProps
        });
      } else {
        showErrorAlert(ADD_BILLING_ADDRESS_FAIL);
      }
    } else {
      const selectedAddress = billingAddressList.find((data) => data.addressId === addressId);
      const response = (await addBillingAddress({}, { ...selectedAddress })) ?? {};
      if (response) {
        updateCheckoutFormValue('paymentAndBilling', {
          billingAddress: selectedAddress
        });
      } else {
        showErrorAlert(ADD_BILLING_ADDRESS_FAIL);
      }
    }
  };

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

  return (
    <>
      {!isAddressListEmpty && (
        <AddressList
          addresses={billingAddressList}
          addressId={addressId}
          isBillingSameAsShipping={isBillingSameAsShipping}
          setAddressId={setAddressId}
          setShowAddAddressForm={setShowAddAddressForm}
          setBillingSameAsShipping={setBillingSameAsShipping}
        />
      )}

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
          </EditAddressForm>
        </>
      )}
      {!showAddAddressForm && (
        <>
          <HlButton
            buttonTitle={billingAddressFormFieldLabels.saveAndcontinue}
            callbackMethod={savePaymentAndBilling}
            isDisabled={(showAddAddressForm && !addressId) || isSubmitButtonDisabled}
            parentDivClass={PaymentOptionStyles.submitWrapper}
            buttonClass={PaymentOptionStyles.submitButton}
          />
        </>
      )}
    </>
  );
}
