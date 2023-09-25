import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from '@Redux/store';
import { trimObjects } from '@Lib/common/utility';
import { getAddressSuggestions } from '@Lib/cms/checkoutPage';
import EditAddressForm from '@Components/checkout/forms/editAddressForm';
import AddressSuggestionModal from '@Components/checkout/addressSuggestionModal';
import AddEditGiftMessage from '@Components/checkout/forms/shippingAddress/addEditGiftMessage';
import { addShippingAddress, addGiftMessage, removeGiftMessage } from '@Lib/cms/checkoutPage';
import { shippingFieldLabels } from '@Constants/checkoutConstants';
import { ADD_SHIPPING_ADDRESS_FAIL, ADD_REMOVE_GIFT_FAIL } from '@Constants/checkoutErrorConstants';
import Spinner from '@Components/common/spinner';
import ShippingStyles from '@Styles/checkout/shippingAddress.module.scss';
import { Ga4AddShippingInfoEcommerce } from 'src/interfaces/ga4Ecommerce';

const shippingFields = [
  'firstName',
  'lastName',
  'addressLineOne',
  'country',
  'city',
  'state',
  'zipCode'
];

const defaultGiftMessageFields = {
  giftSenderName: '',
  giftReceiverName: '',
  giftMessage: ''
};

export default function AddEditShippingAddress(props: any): JSX.Element {
  const dispatch = useDispatch();
  const { myProfileInfo } = useSelector((state) => state.auth) ?? {};
  const {
    defaultFormValues,
    countryStateData,
    contact,
    updateCheckoutFormUpdateClean,
    shippingInfoGtmData
  } = props;
  const [shippingFormValues, setShippingFormValues] = useState(defaultFormValues);
  const [isValidForm, setIsValidForm] = useState(false);
  const [isChecked, setIsChecked] = useState(defaultFormValues.isGiftMsgAdded);
  const selectRef = useRef(null);
  const [selectMenuStyling, setSelectMenuStyling] = useState({});
  const [bootAvs, setBootAvs] = useState(false);
  const [customerAddressSuggestions, setCustomerAddressSuggestions] = useState(false);
  const [isValidGiftMessage, setIsValidGiftMessage] = useState(true);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
  const [isSaveAndContinueTriggered, setIsSaveAndContinueTriggered] = useState(false);
  const [giftMesageFormValues, setGiftMessageFormValues] = useState(
    defaultFormValues.giftMessageDetails
  );
  const [saveShippingAddress, setSaveShippingAddress] = useState(false);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);

  const {
    heartBeatInfo: { isLoggedInUser }
  } = useSelector((state) => state.auth);
  useEffect(() => {
    shippingFormValues['country'] = countryStateData?.[0]?.name;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', identifySelectParentPosition);
    identifySelectParentPosition();
  }, []);

  useEffect(() => {
    const { giftSenderName, giftReceiverName, giftMessage } = giftMesageFormValues;

    if (isChecked) {
      setIsValidGiftMessage(!!(giftSenderName && giftReceiverName && giftMessage));
    }
  });

  useEffect(() => {
    validateFormfields();
  }, [shippingFormValues]);

  const identifySelectParentPosition = () => {
    const menuPropStyling = selectRef?.current?.getBoundingClientRect() ?? null;
    if (menuPropStyling) {
      setSelectMenuStyling({
        top: `${menuPropStyling?.top + 48}px !important`,
        left: `${menuPropStyling?.left}px !important`,
        width: `${menuPropStyling?.width}px !important`
      });
    }
  };
  const SaveAddressComp = (props) => {
    return (
      <div className={ShippingStyles.giftSectionWrapper}>
        <span className={ShippingStyles.checkboxWrapper}>
          <input
            checked={saveShippingAddress}
            onChange={(event) => setSaveShippingAddress(event?.target?.checked)}
            type="checkbox"
            className={ShippingStyles.giftCheckbox}
          />
          <label className={ShippingStyles.giftCheckboxLabel}>Save Address</label>
        </span>
      </div>
    );
  };

  const handleSaveAddress = (e, type) => {};

  const handleAddShippingAddress = async (addressFormValues) => {
    setIsSpinnerVisible(true);
    setIsSubmitButtonDisabled(true);
    const updatedShippingFormValue = trimObjects(addressFormValues);

    if (JSON.stringify(updatedShippingFormValue) !== JSON.stringify(addressFormValues)) {
      setShippingFormValues(updatedShippingFormValue);
    }

    const suggestedAddress = await getAddressSuggestions(updatedShippingFormValue);
    if (suggestedAddress?.CandidateAddresses?.length) {
      setBootAvs(true);
      setCustomerAddressSuggestions(suggestedAddress);
      setIsSpinnerVisible(false);
    } else {
      handleConfirmShippingAddress(updatedShippingFormValue);
    }
  };

  const handleAddShippingFromAvs = async (address) => {
    handleConfirmShippingAddress(address);
  };

  const handleConfirmShippingAddress = async (shippingAddresstoAdd) => {
    let updateCartResponse;
    let giftMessageDetails;
    setIsSubmitButtonDisabled(true);
    setIsSaveAndContinueTriggered(true);

    if (isChecked) {
      giftMessageDetails = await addGiftMessage({}, giftMesageFormValues);
    } else {
      giftMessageDetails = await removeGiftMessage();
    }
    if (!giftMessageDetails) {
      showErrorAlert(ADD_REMOVE_GIFT_FAIL);
    }
    try {
      delete shippingAddresstoAdd.addressId;
      shippingAddresstoAdd['saveToAddressBook'] = saveShippingAddress;

      updateCartResponse = await addShippingAddress(
        {},
        {
          ...shippingAddresstoAdd,
          ...contact,
          ...(myProfileInfo?.phone && { phone: myProfileInfo?.phone })
        },
        myProfileInfo?.taxExempt
      );
    } catch (err) {}

    setIsSubmitButtonDisabled(false);

    setBootAvs(false);
    if (updateCartResponse) {
      updateCheckoutFormUpdateClean(updateCartResponse, 'shipping');
    } else {
      showErrorAlert(ADD_SHIPPING_ADDRESS_FAIL);
    }
    setIsSpinnerVisible(false);

    if (window) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(shippingInfoGtmData);
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

  const handleCheckBoxInputChange = (isSelected) => {
    setIsChecked(isSelected);
    if (!isSelected) {
      setIsValidGiftMessage(true);
      setGiftMessageFormValues(defaultGiftMessageFields);
    }
  };

  const validateFormfields = () => {
    const isValid =
      Object.keys(shippingFormValues).length &&
      shippingFields.filter((e) => !shippingFormValues[e]).length === 0;
    setIsValidForm(isValid);
  };

  return (
    <>
      <div className={ShippingStyles.shippingSection}>
        <label className={ShippingStyles.shippingAddress}>
          {shippingFieldLabels?.shippingAddress}
        </label>
      </div>
      {isSpinnerVisible && (
        <div className={ShippingStyles.addressSpinner}>
          <Spinner spinnerVisible={true} />
        </div>
      )}

      <EditAddressForm
        handleAddressPersistanceCallBack={handleAddShippingAddress}
        checkoutFormValues={shippingFormValues}
        countryStateData={countryStateData}
        isSubmitButtonDisabled={isSubmitButtonDisabled || !isValidGiftMessage}
        updateFormValue={(e) => setShippingFormValues(trimObjects(e))}
        showNickNameField={isLoggedInUser}
        isShippingAddess
      >
        {/* TODO: for temp hiding the component */}
        {isLoggedInUser && <SaveAddressComp />}
        <AddEditGiftMessage
          defaultFormValues={{ ...giftMesageFormValues, isGiftMsgAdded: isChecked }}
          handleGiftMessageChange={(e) => {
            handleCheckBoxInputChange(e.isGiftMsgAdded);
            setGiftMessageFormValues(e);
          }}
        />
      </EditAddressForm>

      {bootAvs && (
        <AddressSuggestionModal
          openModal={bootAvs}
          handleModalClose={(e, reason) => {
            if (reason && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
              return;
            }
            setBootAvs(false);
            setIsSubmitButtonDisabled(false);
          }}
          adressEnteredInForm={shippingFormValues}
          avsAddressSuggestions={customerAddressSuggestions}
          handleConfirmShippingAddress={handleAddShippingFromAvs}
        />
      )}
    </>
  );
}
