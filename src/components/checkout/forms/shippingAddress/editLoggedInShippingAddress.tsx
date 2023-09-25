import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@Redux/store';
import Radio from '@mui/material/Radio';
import { Divider } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import HlButton from '@Components/common/button';
import AddEditGiftMessage from '@Components/checkout/forms/shippingAddress/addEditGiftMessage';
import AddEditShippingAddress from '@Components/checkout/forms/shippingAddress/addEditShippingAddress';

import colors from '@Lib/common/colors';
import { addShippingAddress, addGiftMessage, removeGiftMessage } from '@Lib/cms/checkoutPage';
import { shippingFieldLabels } from '@Constants/checkoutConstants';
import { ADD_SHIPPING_ADDRESS_FAIL, ADD_REMOVE_GIFT_FAIL } from '@Constants/checkoutErrorConstants';
import Spinner from '@Components/common/spinner';

import LoggedInShippingStyles from '@Styles/shippingAddress/editLoggedInCheckout.module.scss';
import CheckoutStyles from '@Styles/checkout/checkoutPage.module.scss';
import ShippingStyles from '@Styles/checkout/shippingAddress.module.scss';

const ADD_ADDRESS_RADIO = 'ADD_ADDRESS';
const defaultGiftMessageFields = {
  giftSenderName: '',
  giftReceiverName: '',
  giftMessage: ''
};

const radioSelectSx = {
  alignSelf: 'start',
  paddingTop: '2px',
  paddingRight: '16px',
  color: '#333',
  '&.Mui-checked': {
    color: colors.hlBlue
  }
};

const LoggedInShippingTitle = ({ isAddressBookExists }) => {
  return (
    <div className={LoggedInShippingStyles.shippingTitleSection}>
      <label className={LoggedInShippingStyles.shippingAddress}>
        {shippingFieldLabels?.shippingAddress}
      </label>

      {isAddressBookExists && (
        <label className={LoggedInShippingStyles.selectAddressTitle}>
          {shippingFieldLabels?.selectAddress}
        </label>
      )}
    </div>
  );
};

const AddressRadioLabelComponent = (addressProps) => {
  const {
    addressNickName,
    firstName,
    lastName,
    addressLineOne,
    city,
    state,
    country,
    zipCode,
    company,
    defaultAddress
  } = addressProps;

  return (
    <div className={LoggedInShippingStyles.addressLabels}>
      {addressNickName && (
        <label className={LoggedInShippingStyles.nickName}>
          <b>
            {addressNickName.toUpperCase()} {defaultAddress ? '(DEFAULT ADDRESS)' : ''}
          </b>
        </label>
      )}
      <label>
        {firstName} {lastName}
      </label>
      <label>{addressLineOne}</label>
      <label>{company}</label>
      <label>
        {city}, {state} {zipCode}
      </label>
      <label>{country}</label>
    </div>
  );
};

function RadioGroupComponet({ shippingAddressList }) {
  const radioSelectionProps = shippingAddressList.map((e) => ({
    value: e.addressId,
    control: <Radio sx={radioSelectSx} />,
    label: <AddressRadioLabelComponent {...e} />
  }));

  radioSelectionProps.push({
    value: ADD_ADDRESS_RADIO,
    control: <Radio sx={radioSelectSx} />,
    label: <label className={LoggedInShippingStyles.addAddress}>Add Address</label>
  });

  return (
    <>
      {radioSelectionProps.map((e, i) => (
        <>
          <FormControlLabel {...e} />
          {i !== radioSelectionProps.length - 1 && <Divider />}
        </>
      ))}
    </>
  );
}

export default function EditLoggedInShippingAddress(props: any): JSX.Element {
  const dispatch = useDispatch();
  const { myProfileInfo } = useSelector((state) => state.auth) ?? {};
  const { addressCrudProps, shippingAddressList, isAddressBookExists, prevSelectedAddress } = props;

  const defaultShippingAddressId =
    shippingAddressList?.find((data) => data?.defaultAddress)?.addressId ??
    shippingAddressList?.[0]?.addressId;
  const [currAddressRadio, setCurrAddressRadio] = useState(null);

  const stateList = addressCrudProps?.countryStateData[0]?.stateList;

  const shippingAddressUpdatedList = shippingAddressList?.filter((shippingObj) =>
    stateList?.some((stateObj) => stateObj?.code === shippingObj?.state)
  );

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);

  const [isValidGiftMessage, setIsValidGiftMessage] = useState(true);
  const [isGiftOrderChecked, setIsGiftOrderChecked] = useState(
    addressCrudProps.defaultFormValues.isGiftMsgAdded
  );
  const [giftMesageFormValues, setGiftMessageFormValues] = useState(
    addressCrudProps.defaultFormValues.giftMessageDetails
  );

  useEffect(() => {
    if (defaultShippingAddressId && !currAddressRadio) {
      setCurrAddressRadio(prevSelectedAddress ?? defaultShippingAddressId ?? ADD_ADDRESS_RADIO);
    }
  }, [defaultShippingAddressId]);

  useEffect(() => {
    const { giftSenderName, giftReceiverName, giftMessage } = giftMesageFormValues;
    if (isGiftOrderChecked) {
      setIsValidGiftMessage(!!(giftSenderName && giftReceiverName && giftMessage));
    }
  }, [isValidGiftMessage, giftMesageFormValues]);

  const handleFormSubmit = async (event) => {
    setIsSpinnerVisible(true);
    event.preventDefault();
    const choosenAddress = shippingAddressList.find((e) => e.addressId === currAddressRadio);

    let updateCartResponse, giftMessageDetails;
    setIsSubmitButtonDisabled(true);

    try {
      if (isGiftOrderChecked) {
        giftMessageDetails = await addGiftMessage({}, giftMesageFormValues);
      } else {
        giftMessageDetails = await removeGiftMessage();
      }
      if (!giftMessageDetails) {
        showErrorAlert(ADD_REMOVE_GIFT_FAIL);
      }
      updateCartResponse = await addShippingAddress(
        {},
        {
          ...addressCrudProps.contact,
          ...choosenAddress,
          ...(myProfileInfo?.phone && { phone: myProfileInfo?.phone })
        },
        myProfileInfo?.taxExempt
      );
    } catch (err) {}

    setIsSubmitButtonDisabled(false);
    if (updateCartResponse) {
      addressCrudProps.updateCheckoutFormUpdateClean(updateCartResponse, 'shipping');
      if (window) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(addressCrudProps.shippingInfoGtmData);
      }
    } else {
      showErrorAlert(ADD_SHIPPING_ADDRESS_FAIL);
    }
    setIsSpinnerVisible(false);
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

  const handleRadioChange = (e) => setCurrAddressRadio(e?.target?.value);

  const isAddAddress = currAddressRadio === ADD_ADDRESS_RADIO;

  const renderGiftOrderAndFormButton = () => {
    if (isAddAddress) {
      return <></>;
    }

    function handleCheckBoxInputChange(isSelected) {
      setIsGiftOrderChecked(isSelected);
      if (!isSelected) {
        setIsValidGiftMessage(true);
        setGiftMessageFormValues(defaultGiftMessageFields);
      }
    }

    return (
      <>
        <AddEditGiftMessage
          defaultFormValues={{ ...giftMesageFormValues, isGiftMsgAdded: isGiftOrderChecked }}
          handleGiftMessageChange={(e) => {
            handleCheckBoxInputChange(e.isGiftMsgAdded);
            setGiftMessageFormValues(e);
          }}
        />
        <HlButton
          buttonTitle={shippingFieldLabels?.saveAndcontinue}
          parentDivClass={CheckoutStyles.submitWrapper}
          buttonClass={CheckoutStyles.submitButton}
          isDisabled={!isValidGiftMessage || isSubmitButtonDisabled}
        />
      </>
    );
  };

  return (
    <>
      {isSpinnerVisible && (
        <div className={ShippingStyles.addressSpinner}>
          <Spinner spinnerVisible={true} />
        </div>
      )}
      <form
        onSubmit={handleFormSubmit}
        className={`${CheckoutStyles.editContactForm} ${ShippingStyles.editContactForm}`}
      >
        <LoggedInShippingTitle isAddressBookExists={isAddressBookExists} />

        <FormControl sx={{ width: '100%' }}>
          {isAddressBookExists && (
            <RadioGroup value={currAddressRadio} onChange={handleRadioChange}>
              <div className={LoggedInShippingStyles.addressRadioGroup}>
                <RadioGroupComponet shippingAddressList={shippingAddressUpdatedList} />
              </div>
            </RadioGroup>
          )}
        </FormControl>
        {renderGiftOrderAndFormButton()}
      </form>
      {isAddAddress && (
        <div className={LoggedInShippingStyles.shippingForm}>
          <AddEditShippingAddress {...addressCrudProps} />
        </div>
      )}
    </>
  );
}
