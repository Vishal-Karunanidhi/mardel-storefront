import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ShippingStyles from '@Styles/checkout/shippingAddress.module.scss';
import HlButton from '@Components/common/button';
import CheckoutStyles from '@Styles/checkout/checkoutPage.module.scss';
import {
  billingAddressFormFieldLabels as addressLabels,
  addressFormlabels
} from '@Constants/checkoutConstants';
import HLSelect from '@Components/common/hlSelect';

const addressFields = [
  'firstName',
  'lastName',
  'addressLineOne',
  'country',
  'city',
  'state',
  'zipCode'
];
const createCountryState = (data) => {
  const result = {};
  data?.forEach((e) => {
    result[e.code] = e.stateList;
  });
  return result;
};
export default function EditAddressForm(props: any): JSX.Element {
  const {
    countryStateData,
    checkoutFormValues,
    isTextFieldDisabled = false,
    isSubmitButtonDisabled,
    additionalButton = <></>,
    showNickNameField = false,
    formSubmitTitle,
    autoFocusField = '',
    isShippingAddess = false
  } = props;

  const countryStateMap = createCountryState(countryStateData);
  const [addressFormValues, setAddressFormValues] = useState(checkoutFormValues);
  const [isValidForm, setIsValidForm] = useState(false);

  const currentCountry = addressFormValues?.country ?? 'US';
  let billingStateList = countryStateMap[currentCountry];

  useEffect(() => {
    if (!addressFormValues?.country) {
      setAddressFormValues({
        ...addressFormValues,
        country: 'US',
        state: addressFormValues?.state
      });
    }
    if (addressFormValues?.country && !addressFormValues?.state) {
      setAddressFormValues({
        ...addressFormValues,
        country: currentCountry,
        state: addressFormValues?.state
      });
    }
  }, []);

  useEffect(() => {
    if (checkoutFormValues?.billingSameAsShipping) {
      setAddressFormValues(checkoutFormValues);
    }
  }, [checkoutFormValues]);

  useEffect(() => {
    if (addressFormValues) {
      validateFormFields();
    }
  }, [addressFormValues]);

  const handleInputChange = (event, type) => {
    const tempAddressVal = { ...addressFormValues };
    if (type === 'country') {
      billingStateList = countryStateMap[event.target.value];
      tempAddressVal['state'] = '';
    }
    setAddressFormValues({
      ...tempAddressVal,
      [type]: event?.target?.value
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const tempAddressVal = { ...addressFormValues };
    if (!isShippingAddess && addressFormValues.zipCode.match(/^\d{5}(-\d*)?$/)) {
      const croppedZipCode = addressFormValues.zipCode.slice(0, 5);
      tempAddressVal['zipCode'] = croppedZipCode;
      setAddressFormValues({
        ...tempAddressVal
      });
    }
    props?.handleAddressPersistanceCallBack(tempAddressVal);
  };

  const validateFormFields = () => {
    const isValid =
      Object.keys(addressFormValues).length &&
      addressFields.filter((e) => !addressFormValues?.[e]).length === 0;
    setIsValidForm(isValid);

    if (props?.updateFormValue) {
      props?.updateFormValue(addressFormValues);
    }
  };

  const zipCodeFieldUpdate = (type, value) => {
    const tempAddressVal = { ...addressFormValues };
    const croppedZipCode = value && value.match(/^\d{5}(-\d*)?$/) ? value.slice(0, 5) : value;
    tempAddressVal['zipCode'] = croppedZipCode;
    setAddressFormValues({
      ...tempAddressVal
    });
  };

  const renderTextField = (textProps) => {
    const [labelShrink, setLabelShrink] = useState(false);
    return (
      <TextField
        error={false}
        variant="filled"
        className={CheckoutStyles.textInput}
        autoFocus={textProps.key === autoFocusField}
        onChange={(e) => handleInputChange(e, textProps.key)}
        onFocus={() => setLabelShrink(true)}
        onBlur={() => {
          !isShippingAddess &&
            textProps.key == 'zipCode' &&
            zipCodeFieldUpdate(textProps.key, textProps?.value);
          setLabelShrink(!!textProps?.value);
        }}
        value={textProps?.value}
        {...textProps}
        disabled={isTextFieldDisabled}
        InputLabelProps={{
          shrink: textProps?.value || labelShrink ? true : false
        }}
        inputProps={{
          maxLength: textProps?.maxLength,
          'data-testid': isShippingAddess
            ? 'shipping-' + textProps?.key
            : 'billing-' + textProps?.key
        }}
      />
    );
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className={`${CheckoutStyles.editContactForm} ${ShippingStyles.editContactForm}`}
    >
      <div className={CheckoutStyles.inputFieldWrapper}>
        {addressFormlabels.section1.map(({ label, key }) =>
          renderTextField({ label, key, value: addressFormValues?.[key], isShippingAddess })
        )}
      </div>
      {/* {showNickNameField && (
        <div className={CheckoutStyles.inputFieldWrapper}>
          {renderTextField({
            label: 'Address Nickname (Optional)',
            key: 'addressNickName',
            value: addressFormValues?.addressNickName,
            style: { width: '100%', borderRadius: 5 },
            isShippingAddess
          })}
        </div>
      )} */}
      <div className={CheckoutStyles.inputFieldWrapper}>
        {addressFormlabels.section2.map(({ label, key }) =>
          renderTextField({
            label,
            key,
            value: addressFormValues?.[key],
            style: { width: '100%' },
            isShippingAddess
          })
        )}
      </div>

      <div className={CheckoutStyles.inputFieldWrapper}>
        {addressFormlabels.addressLineOne.map(({ label, key, maxNumber }) =>
          renderTextField({
            label,
            key,
            value: addressFormValues?.[key],
            maxNumber,
            style: { width: '100%' },
            isShippingAddess
          })
        )}
      </div>

      <div className={CheckoutStyles.inputFieldWrapper}>
        {addressFormlabels.addressLineTwo.map(({ label, key, maxNumber }) =>
          renderTextField({
            label,
            key,
            value: addressFormValues?.[key],
            maxNumber,
            style: { width: '100%' },
            isShippingAddess
          })
        )}
      </div>

      <div className={CheckoutStyles.inputFieldWrapper}>
        <FormControl variant="filled" className={CheckoutStyles.textInput}>
          <InputLabel id="checkout_country">{addressLabels?.country}</InputLabel>
          <HLSelect
            handleSelectOnChange={(e) => handleInputChange(e, 'country')}
            selectBoxData={countryStateData}
            selectBoxValue={addressFormValues?.country ?? 'US'}
            isTextFieldDisabled={isTextFieldDisabled || isShippingAddess}
            additionalClassName={isShippingAddess ? CheckoutStyles.selectIconHide : ''}
            inputProps={{
              'data-testid': isShippingAddess ? 'shipping-country-select' : 'billing-country-select'
            }}
          />
        </FormControl>
        {addressFormlabels.section4.map(({ label, key }) =>
          renderTextField({ label, key, value: addressFormValues?.[key], isShippingAddess })
        )}
      </div>

      <div className={CheckoutStyles.inputFieldWrapper}>
        <FormControl variant="filled" className={CheckoutStyles.textInput}>
          <InputLabel id="checkout_state">{addressLabels?.state}</InputLabel>
          <HLSelect
            handleSelectOnChange={(e) => handleInputChange(e, 'state')}
            selectBoxData={billingStateList}
            selectBoxValue={addressFormValues?.state}
            isTextFieldDisabled={isTextFieldDisabled}
            inputProps={{
              'data-testid': isShippingAddess ? 'shipping-state-select' : 'billing-state-select'
            }}
          />
        </FormControl>

        {addressFormlabels.section5.map(({ label, key, maxLength }) =>
          renderTextField({
            label,
            key,
            value: addressFormValues?.[key],
            maxLength,
            isShippingAddess
          })
        )}
      </div>
      {props.children}
      <div className={'actionButtonGroup'}>
        {additionalButton}
        <HlButton
          buttonTitle={formSubmitTitle ?? addressLabels?.saveAndcontinue}
          parentDivClass={CheckoutStyles.submitWrapper}
          buttonClass={CheckoutStyles.submitButton}
          isDisabled={!isValidForm || isSubmitButtonDisabled}
          dataTestId={
            isShippingAddess ? 'shipping-address-submit-button' : 'billing-address-submit-button'
          }
        />
      </div>
    </form>
  );
}