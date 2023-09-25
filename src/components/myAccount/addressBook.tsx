import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Divider } from '@mui/material';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import HlButton from '@Components/common/button';
import AddressUpdateSuccessModal from '@Components/myAccount/addressUpdateSuccessModal';
import EditAddressForm from '@Components/checkout/forms/editAddressForm';
import AddressSuggestionModal from '@Components/checkout/addressSuggestionModal';
import HLAnchorTag from '@Components/common/hlAnchorTag';
import { shippingFieldLabels } from '@Constants/checkoutConstants';
import { useDispatch, useSelector } from '@Redux/store';
import { getCountriesAndStateList } from '@Lib/cms/checkoutPage';
import {
  getCustomerAddress,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress
} from '@Lib/cms/myAccountPage';
import { trimObjects } from '@Lib/common/utility';
import { getAddressSuggestions } from '@Lib/cms/checkoutPage';
import CheckoutStyles from '@Styles/checkout/checkoutPage.module.scss';
import AddressBookStyles from '@Styles/my-account/addressBook.module.scss';
import { addressBookLabels } from '@Constants/my-account/addressBookConstants';
import MyAccountStyles from '@Styles/my-account/myAccount.module.scss';

const EmptyAddressBook = () => {
  return (
    <div className={AddressBookStyles.emptyBook}>
      <span>Oops! It seems that your address book is empty.</span>
    </div>
  );
};

const PopupMeatBall = ({ setDefault, addressProps }) => {
  const dispatch = useDispatch();
  const { nonShippableStateList } = useSelector((state) => state.myAccount);
  const { myProfileInfo } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isNonshippableStateSelected =
    nonShippableStateList.findIndex((e) => e === addressProps?.['state']) !== -1;

  const handleDeleteAddress = async () => {
    handleClose();
    const responseAddressList = await deleteCustomerAddress(addressProps.addressId);
    dispatch({
      type: 'UPDATE_ADDRESS_LIST',
      payload: responseAddressList
    });
  };

  const handleSetDefaultShippingAddress = async () => {
    handleClose();
    const responseAddressList = await updateCustomerAddress(addressProps.addressId, {
      ...addressProps,
      defaultAddress: true
    });
    dispatch({
      type: 'UPDATE_ADDRESS_LIST',
      payload: responseAddressList
    });
  };

  return (
    <div className={AddressBookStyles.meatBallMenu}>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disableRipple
      >
        <img src={'/icons/meatBall.svg'} alt={'Add'} width={16} height={16} aria-label="add" />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {setDefault &&
          addressProps['country'] !== 'CA' &&
          !isNonshippableStateSelected &&
          !myProfileInfo?.taxExempt && (
            <MenuItem onClick={handleSetDefaultShippingAddress}>Set as Default Shipping</MenuItem>
          )}
        <MenuItem
          onClick={() =>
            dispatch({
              type: 'ADD_EDIT_ADDRESS_INFO',
              payload: {
                showAddressForm: true,
                type: 'EDIT',
                addressProps
              }
            })
          }
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteAddress}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

/* TODO: Kindly re-use 'DefaultAddressComponent' and remove this item from here in future. */
const AddressComponent = (addressProps) => {
  const {
    addressNickName,
    firstName,
    lastName,
    addressLineOne,
    addressLineTwo,
    country,
    city,
    state,
    zipCode,
    company,
    setDefault = true,
    isEditable = true
  } = addressProps;
  const isCanada = country === 'CA';
  return (
    <div className={AddressBookStyles.addressComp} key={addressNickName}>
      <div>
        {/* {addressNickName && <label>{addressNickName}</label>} */}
        {isEditable && (
          <a>
            <PopupMeatBall
              setDefault={setDefault}
              addressProps={{ ...addressProps, isEditable: undefined }}
            />
          </a>
        )}
      </div>
      <label>
        {firstName} {lastName}
      </label>
      <label>{addressLineOne}</label>
      {addressLineTwo && <label>{addressLineTwo}</label>}
      <label>{company}</label>
      <label>
        {city}, {state} {isCanada ? '' : zipCode}
      </label>
      <label>
        {isCanada ? zipCode : ''} {country}
      </label>
      <label className={AddressBookStyles.addressSplitBorder} />
    </div>
  );
};

const AddressBookList = () => {
  const myProfileInfo = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.myAccount);
  let defaultAddress = addressList.filter((e) => {
    return e.defaultAddress;
  });
  let defaultBillingAddress = addressList.filter((e) => {
    return myProfileInfo?.defaultBillingAddressID === e?.addressId;
  });
  let nonDefaultAddress = addressList
    .filter((e) => {
      return !e.defaultAddress && !(myProfileInfo?.defaultBillingAddressID === e?.addressId);
    })
    .sort((a, b) => (a.taxExemptedAddress ? 1 : -1));
  let taxExempt = !!addressList.find((e) => e.taxExemptedAddress);

  /*Implement Same in backend system*/
  const isCanada = defaultAddress?.['country'] === 'CA';
  if (isCanada) {
    nonDefaultAddress.push(defaultAddress);
    defaultAddress = null;
  }
  /*Implement Same in backend system*/

  return (
    <div className={AddressBookStyles.addressBookList}>
      {defaultAddress?.map((address) => {
        return (
          <div className={AddressBookStyles.defaultAddress}>
            <label className={AddressBookStyles.defaultLabel}>Default shipping address</label>
            <AddressComponent
              {...address}
              setDefault={false}
              isEditable={!address?.taxExemptedAddress}
            />
          </div>
        );
      })}
      {defaultBillingAddress?.map((address) => {
        return (
          <div className={AddressBookStyles.defaultAddress}>
            <label className={AddressBookStyles.defaultLabel}>Default Billing address</label>
            <AddressComponent
              {...address}
              setDefault={false}
              isEditable={!address?.taxExemptedAddress}
            />
          </div>
        );
      })}
      <Divider className={AddressBookStyles.dividerLine} />
      <div className={AddressBookStyles.nonDefaultAddress}>
        {taxExempt && (
          <span>
            <span>
              *Accounts marked as <b>Tax-Exempt</b> do not have the option to edit their Billing
              Address online.{' '}
            </span>
            <HLAnchorTag
              anchorTheme="LinkType2"
              label={shippingFieldLabels.contactUs}
              value={shippingFieldLabels.contactUsLink}
            />
            <label>{shippingFieldLabels.contactusHelperText}</label>
          </span>
        )}
        <b>
          <label>My Addresses (up to 8)</label>
        </b>
        <span>{addressBookLabels.nonShippableCountry}</span>
        <div className={AddressBookStyles.listRenderer}>
          {nonDefaultAddress.map((e) => (
            <AddressComponent {...e} isEditable={!e?.taxExemptedAddress} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AddAddressForm = ({ handleAfterShippingAddition, defaultShippingFormForEdit = {}, type }) => {
  const dispatch = useDispatch();
  const checkboxRefState = useRef(null);
  const [bootAvs, setBootAvs] = useState(false);
  const { nonShippableStateList } = useSelector((state) => state.myAccount);
  const [defaultShippingCheckbox, setDefaultShippingCheckbox] = useState(
    defaultShippingFormForEdit['defaultAddress'] ?? false
  );
  const [countryStateData, setCountryStateData] = useState([]);
  const { myProfileInfo } = useSelector((state) => state.auth);
  const [isResponseFailed, setIsResponseFailed] = useState(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
  const [customerAddressSuggestions, setCustomerAddressSuggestions] = useState(false);
  const [shippingFormValues, setShippingFormValues] = useState(defaultShippingFormForEdit);

  useEffect(() => {
    async function fetchCountryStateData() {
      const countryStateList = await getCountriesAndStateList();
      setCountryStateData(countryStateList?.billingCountries);
    }
    fetchCountryStateData();
  }, []);

  const isCandaChoosen = shippingFormValues?.['country'] === 'CA';
  const isNonshippableStateSelected =
    nonShippableStateList.findIndex((e) => e === shippingFormValues?.['state']) !== -1;

  const handleAddCustomerShipping = async (formValuesToUpdate) => {
    setIsSubmitButtonDisabled(true);
    spinnerVisible(true);
    const formValues = JSON.parse(JSON.stringify(formValuesToUpdate));
    formValues['phone'] = myProfileInfo?.phone;
    formValues['defaultAddress'] = checkboxRefState?.current?.checked;
    const updatedShippingFormValue = trimObjects(formValues);
    setShippingFormValues(updatedShippingFormValue);

    const suggestedAddress = await getAddressSuggestions(updatedShippingFormValue);
    if (suggestedAddress?.CandidateAddresses?.length) {
      const { CandidateAddresses, CustomerAddress } = suggestedAddress;
      CandidateAddresses[0]['phone'] = myProfileInfo?.phone;
      CustomerAddress['phone'] = myProfileInfo?.phone;
      setIsSubmitButtonDisabled(false);
      spinnerVisible(false);
      setBootAvs(true);
      setCustomerAddressSuggestions(suggestedAddress);
    } else {
      handleConfirmShippingAddress(updatedShippingFormValue);
    }
  };

  const handleConfirmShippingAddress = async (address) => {
    handleAddShippingAddress(address);
  };

  const handleAddShippingAddress = async (shippingAddresstoAdd) => {
    let updatedShippingAddress;
    setIsSubmitButtonDisabled(true);

    try {
      if (type === 'EDIT') {
        updatedShippingAddress = await updateCustomerAddress(
          defaultShippingFormForEdit['addressId'],
          shippingAddresstoAdd
        );
      } else {
        updatedShippingAddress = await addCustomerAddress(shippingAddresstoAdd);
      }

      if (!updatedShippingAddress) {
        setIsResponseFailed(true);
      } else {
        dispatch({
          type: 'UPDATE_ADDRESS_LIST',
          payload: updatedShippingAddress
        });
        handleAfterShippingAddition();
      }
    } catch (err) {}

    setIsSubmitButtonDisabled(false);
    setBootAvs(false);
    spinnerVisible(false);
  };
  const spinnerVisible = (isVisible: boolean, className = '') => {
    dispatch({
      type: 'LOAD_SPINNER',
      payload: {
        isVisible,
        className,
        isInitialLoading: false,
        isMenuClicked: false
      }
    });
  };
  return (
    <div className={`${CheckoutStyles.checkoutParentGrid} ${AddressBookStyles.addAddressForm}`}>
      {isResponseFailed && (
        <div className={AddressBookStyles.errorMessage}>
          <img
            src={'/icons/account/infoIcon.svg'}
            alt={'Delete'}
            width={24}
            height={24}
            aria-label="delete"
          />
          <label>Customer Address already exists. Please Check.</label>
        </div>
      )}

      <div className={`${CheckoutStyles.formGrid} ${AddressBookStyles.editAddressWrapper}`}>
        <b>{type} ADDRESS</b>
        <br /> <br />
        <EditAddressForm
          showNickNameField
          handleAddressPersistanceCallBack={handleAddCustomerShipping}
          checkoutFormValues={shippingFormValues}
          countryStateData={countryStateData}
          isSubmitButtonDisabled={isSubmitButtonDisabled}
          formSubmitTitle={'Save address'}
          updateFormValue={(e) => setShippingFormValues(trimObjects(e))}
          additionalButton={
            <HlButton
              buttonTitle={'Cancel'}
              callbackMethod={() => handleAfterShippingAddition(false)}
              parentDivClass={CheckoutStyles.submitWrapper}
              buttonClass={CheckoutStyles.submitButton}
            />
          }
        >
          {isCandaChoosen || isNonshippableStateSelected ? (
            <label className={AddressBookStyles.caShippingWarning}>
              {isNonshippableStateSelected && !isCandaChoosen
                ? addressBookLabels.nonShippableState
                : addressBookLabels.nonShippableCountry}
            </label>
          ) : (
            <>
              {!myProfileInfo?.taxExempt && (
                <span className={CheckoutStyles.checkoutCheckboxWrapper}>
                  <input
                    type="checkbox"
                    checked={defaultShippingCheckbox}
                    onChange={(e) => setDefaultShippingCheckbox(e?.target?.checked)}
                    className={CheckoutStyles.checkoutCheckbox}
                    ref={checkboxRefState}
                  ></input>
                  <label
                    className={CheckoutStyles.checkboxLabel}
                    style={{ verticalAlign: 'text-bottom' }}
                  >
                    Set as Default Shipping Address
                  </label>
                </span>
              )}
            </>
          )}
        </EditAddressForm>
        {bootAvs && (
          <AddressSuggestionModal
            openModal={bootAvs}
            handleModalClose={(e, reason) => {
              if (reason && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
                return;
              }
              setBootAvs(false);
            }}
            adressEnteredInForm={shippingFormValues}
            avsAddressSuggestions={customerAddressSuggestions}
            handleConfirmShippingAddress={handleConfirmShippingAddress}
          />
        )}
      </div>
    </div>
  );
};

export default function AddressBook(props: any): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const [bootSuccessModal, setBootSuccessModal] = useState(false);
  const { addressList, addEditAddressInfo } = useSelector((state) => state.myAccount);
  const { showAddressForm: showAddAddressForm, addressProps, type } = addEditAddressInfo;
  const { isInitialLoading } = useSelector((state) => state.layout.spinnerData);

  useEffect(() => {
    dispatch({
      type: 'LOAD_SPINNER',
      payload: {
        isVisible: true,
        className: '',
        isInitialLoading: true
      }
    });
    async function getCustomerShipping() {
      const shippingAddressResponse = await getCustomerAddress();
      dispatch({
        type: 'UPDATE_ADDRESS_LIST',
        payload: shippingAddressResponse
      });
      dispatch({
        type: 'LOAD_SPINNER',
        payload: {
          isVisible: false,
          className: '',
          isInitialLoading: false
        }
      });
    }
    getCustomerShipping();
  }, []);

  useEffect(() => {
    const hashMenuArray = router?.asPath?.split('#');
    if (hashMenuArray?.length === 2 && showAddAddressForm) {
      dispatch({
        type: 'ADD_EDIT_ADDRESS_INFO',
        payload: {
          showAddressForm: false,
          type: 'ADD',
          addressProps: {}
        }
      });
    } else if (hashMenuArray?.length === 3 && hashMenuArray[2] === 'add') {
      dispatch({
        type: 'ADD_EDIT_ADDRESS_INFO',
        payload: { showAddressForm: true, type: 'ADD', addressProps: {} }
      });
    }
    dispatch({
      type: 'LOAD_SPINNER',
      payload: {
        isVisible: false,
        className: '',
        isInitialLoading: false
      }
    });
  }, [router?.asPath]);

  const handleAddCustomerAddress = () => {
    dispatch({
      type: 'ADD_EDIT_ADDRESS_INFO',
      payload: {
        showAddressForm: true,
        type: 'ADD',
        addressProps: {}
      }
    });
    router.push({ hash: 'addressBook#add' });
  };
  const renderAddressListbook = () =>
    addressList?.length ? <AddressBookList /> : <EmptyAddressBook />;

  const handleAfterShippingAdditionTrigger = (isUpdateDone = true) => {
    dispatch({
      type: 'ADD_EDIT_ADDRESS_INFO',
      payload: { showAddressForm: false, type: 'ADD', addressProps: {} }
    });
    router.push({ hash: 'addressBook' });

    if (isUpdateDone) {
      setBootSuccessModal(true);
    }
  };

  const addressCompProperties = {
    type,
    defaultShippingFormForEdit: addressProps,
    handleAfterShippingAddition: handleAfterShippingAdditionTrigger
  };

  if (isInitialLoading) {
    return <div className={MyAccountStyles.divIsInitialLoading} />;
  }
  return (
    <>
      <div className={AddressBookStyles.parentBookWrapper}>
        <div className={AddressBookStyles.titleDiv}>
          <b>Address Book</b>
          {!showAddAddressForm && (
            <a onClick={handleAddCustomerAddress}>
              <img
                src={'/icons/addIcon.svg'}
                alt={'Add'}
                className={AddressBookStyles.addAddressIcon}
                width={24}
                height={24}
                aria-label="add"
              />
              <label>Add Address</label>
            </a>
          )}
        </div>
        {!showAddAddressForm && renderAddressListbook()}
        {showAddAddressForm && type === 'ADD' && <AddAddressForm {...addressCompProperties} />}
        {showAddAddressForm && type === 'EDIT' && <AddAddressForm {...addressCompProperties} />}
        {bootSuccessModal && (
          <AddressUpdateSuccessModal
            isModalOpen={bootSuccessModal}
            handleSuccessModalClose={() => setBootSuccessModal(false)}
          />
        )}
      </div>
    </>
  );
}

export { AddressComponent, PopupMeatBall };
