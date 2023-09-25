import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Divider } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import HlButton from '@Components/common/button';
import { useDispatch, useSelector } from '@Redux/store';
import EditPaymentForm from '@Components/checkout/forms/editPaymentForm';
import EditAddressForm from '@Components/checkout/forms/editAddressForm';
import HLAnchorTag from '@Components/common/hlAnchorTag';
import DeleteListModal from '@Components/lists/deleteListModal';
import { shippingFieldLabels } from '@Constants/checkoutConstants';
import {
  addCustomerAddress,
  updateCustomerAddress,
  addCustomerPaymentOption,
  deleteCustomerPaymentOption,
  updateCustomerPaymentOption
} from '@Lib/cms/myAccountPage';

import PaymentOptionStyles from '@Styles/my-account/paymentOption.module.scss';
import CheckoutStyles from '@Styles/checkout/checkoutPage.module.scss';
import colors from '@Lib/common/colors';
import { formatMonth, trimObjects } from '@Lib/common/utility';
import { countryLabelsMap, addressBookLabels } from '@Constants/my-account/addressBookConstants';
import MyAccountStyles from '@Styles/my-account/myAccount.module.scss';

const EmptyPaymentOption = () => {
  return (
    <div className={PaymentOptionStyles.emptyPaymentOption}>
      <p>Oops! It seems that your payment options are empty.</p>
    </div>
  );
};

const EmptyAddressBook = ({ onClickCallBack }) => {
  const { myProfileInfo } = useSelector((state) => state.auth);
  return (
    <div className={PaymentOptionStyles.emptyAddressBook}>
      <span>It seems that your address book is empty. </span>
      {!myProfileInfo?.taxExempt && (
        <AddButton buttonLabel={'Add Address'} onClickCallBack={onClickCallBack} />
      )}
    </div>
  );
};

const renderAddressLabel = (address) => {
  const {
    firstName,
    lastName,
    addressLineOne,
    addressLineTwo,
    city,
    state,
    country,
    zipCode,
    company
  } = address;
  const isCanada = country === 'CA';
  let canadaProvinceCodeMap = {};
  if (isCanada) {
    const { canadaProvinceCodeList } = useSelector((state) => state.myAccount);
    canadaProvinceCodeMap = canadaProvinceCodeList.find((data) => data[state]);
  }
  return (
    <div className={PaymentOptionStyles.addressLabel}>
      <span>
        {firstName} {lastName}
      </span>
      <span>{addressLineOne}</span>
      {addressLineTwo && <span>{addressLineTwo}</span>}
      <span>{company}</span>
      <span>
        {city}, {isCanada ? canadaProvinceCodeMap[state] : `${state} ${zipCode}`}
      </span>
      <span>
        {isCanada ? zipCode : ''} {countryLabelsMap[country]}
      </span>
    </div>
  );
};

const AddressList = ({ addressId, setAddressId }) => {
  const dispatch = useDispatch();
  const { myProfileInfo } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.myAccount);
  const [defaultShippingAddress, setDefaultShippingAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (addressList?.length) {
      const defaultShippingAddress = addressList.find(
        (address) => address.defaultAddress && !myProfileInfo?.taxExempt
      );
      const addresses = addressList.filter((address) => {
        return !myProfileInfo?.taxExempt || address?.taxExemptedAddress;
      });
      setDefaultShippingAddress(defaultShippingAddress);
      setAddressId(defaultShippingAddress?.addressId);
      setAddresses(addresses);
    }
  }, [addressList, myProfileInfo]);

  const handleEditAddress = (addressId) => {
    if (addressId) {
      const editAddressData = addressList.find((address) => address.addressId === addressId);
      dispatch({
        type: 'ADD_PAYMENT_INFO',
        payload: {
          isAddAddressForm: true,
          addressFormValues: editAddressData,
          addressFormMode: 'EDIT'
        }
      });
    }
  };

  return (
    <>
      <FormControl
        sx={{
          width: '100%'
        }}
      >
        <RadioGroup value={addressId} onChange={(event) => setAddressId(event?.target?.value)}>
          <>
            {defaultShippingAddress && (
              <>
                <div className={PaymentOptionStyles.defaultShippingAddress}>
                  <b>DEFAULT SHIPPING ADDRESS</b>
                </div>
                <div className={PaymentOptionStyles.defaultShippingRadio}>
                  <FormControlLabel
                    value={defaultShippingAddress?.addressId}
                    control={
                      <Radio
                        sx={{
                          color: '#333',
                          '&.Mui-checked': {
                            color: colors.hlBlue
                          }
                        }}
                      />
                    }
                    label={<b>{defaultShippingAddress?.addressNickName?.toUpperCase()}</b>}
                  />
                  <a onClick={() => handleEditAddress(defaultShippingAddress?.addressId)}>
                    <label className={PaymentOptionStyles.editCta}>Edit</label>
                  </a>
                </div>
                {renderAddressLabel(defaultShippingAddress)}
                <Divider className={PaymentOptionStyles.divider} />
              </>
            )}
            <div className={PaymentOptionStyles.addressListWrapper}>
              {addresses.map((address) => (
                <div className={PaymentOptionStyles.addressList}>
                  <div className={PaymentOptionStyles.addressRadio}>
                    <FormControlLabel
                      value={address?.addressId}
                      control={
                        <Radio
                          sx={{
                            color: '#333',
                            '&.Mui-checked': {
                              color: colors.hlBlue
                            }
                          }}
                        />
                      }
                      label={<b>{address?.addressNickName?.toUpperCase()}</b>}
                    />
                    {!address?.taxExemptedAddress && (
                      <a onClick={() => handleEditAddress(address?.addressId)}>
                        <label className={PaymentOptionStyles.editCta}>Edit</label>
                      </a>
                    )}
                  </div>
                  <div className={PaymentOptionStyles.addressLabelInfo}>
                    {renderAddressLabel(address)}
                    <Divider />
                  </div>
                </div>
              ))}
            </div>
          </>
        </RadioGroup>
      </FormControl>
    </>
  );
};

const AddPaymentForm = (props) => {
  const {
    setIsSubmitButtonDisabled,
    flexTokenError,
    defaultPaymentMethod,
    setMicroForm,
    setCardType,
    setDefaultPaymentMethod,
    taxExempt
  } = props;

  const handlePaymentCheckBoxInputChange = (event) => {
    const { checked: isDefaultPaymentMethod } = event?.target;
    setDefaultPaymentMethod(isDefaultPaymentMethod);
  };

  return (
    <>
      <div className={PaymentOptionStyles.addPaymentTitle}>
        <b>ADD PAYMENT OPTION</b>
      </div>
      <div
        className={`${CheckoutStyles.checkoutParentGrid} ${PaymentOptionStyles.addPaymentWrapper}`}
      >
        <div className={`${CheckoutStyles.formGrid} ${PaymentOptionStyles.formGrid}`}>
          <div
            className={`${CheckoutStyles.individualFormBoxes} ${PaymentOptionStyles.paymentForm}`}
          >
            <EditPaymentForm
              flexTokenError={flexTokenError}
              setSubmitDisabled={setIsSubmitButtonDisabled}
              microFormCallBack={setMicroForm}
              setCardType={setCardType}
            >
              <span className={CheckoutStyles.checkoutCheckboxWrapper}>
                <label className={CheckoutStyles.checkboxLabel}>
                  <input
                    type="checkbox"
                    onChange={handlePaymentCheckBoxInputChange}
                    checked={defaultPaymentMethod}
                    className={CheckoutStyles.checkoutCheckbox}
                  />
                  Set as Default Payment Method
                </label>
              </span>
            </EditPaymentForm>
          </div>
        </div>
      </div>
    </>
  );
};

const AddAddress = (props) => {
  const { isSubmitButtonDisabled, setIsSubmitButtonDisabled, showAddAddressForm } = props;
  const dispatch = useDispatch();
  const checkboxRefState = useRef(null);

  const { myProfileInfo } = useSelector((state) => state.auth);
  const { addPaymentInfo, countryStateList, nonShippableStateList } = useSelector(
    (state) => state.myAccount
  );
  const { addressFormMode, addressFormValues } = addPaymentInfo;
  const isDefaultShipping = addressFormMode === 'EDIT' ? addressFormValues?.defaultAddress : false;

  const [defaultShipping, setDefaultShipping] = useState(isDefaultShipping);
  const [isCanada, setIsCanada] = useState(false);
  const [nonShippableState, setNonShippableState] = useState(false);

  const handleAfterSave = () => {
    dispatch({
      type: 'ADD_PAYMENT_INFO',
      payload: {
        addressFormValues: {},
        addressFormMode: 'ADD'
      }
    });
    showAddAddressForm(false);
  };

  const updateAddressFormValues = (formValues) => {
    const addressFormValues = trimObjects(formValues);
    setIsCanada(addressFormValues?.['country'] === 'CA');
    setNonShippableState(nonShippableStateList.includes(addressFormValues?.['state']));
  };

  const handleAddCustomerAddress = async (formValues) => {
    dispatch({
      type: 'LOAD_SPINNER',
      payload: {
        isVisible: true,
        className: '',
        isInitialLoading: false,
        isMenuClicked: false
      }
    });
    formValues['phone'] = myProfileInfo?.phone ?? '1234567890'; //remove after number validation
    formValues['defaultAddress'] = !!checkboxRefState?.current?.checked;

    setIsSubmitButtonDisabled(true);
    const addressFormValues = trimObjects(formValues);
    let saveAddressResponse = [];
    if (addressFormMode === 'EDIT') {
      saveAddressResponse = await updateCustomerAddress(
        addressFormValues?.addressId,
        addressFormValues
      );
    } else {
      saveAddressResponse = await addCustomerAddress(addressFormValues);
    }

    if (saveAddressResponse.length) {
      dispatch({
        type: 'UPDATE_ADDRESS_LIST',
        payload: saveAddressResponse
      });
      handleAfterSave();
    }
    setIsSubmitButtonDisabled(false);
    dispatch({
      type: 'LOAD_SPINNER',
      payload: {
        isVisible: false,
        className: '',
        isInitialLoading: false,
        isMenuClicked: false
      }
    });
  };

  return (
    <div className={PaymentOptionStyles.billingAddressFormWrapper}>
      <div className={PaymentOptionStyles.addAddressTitle}>
        <b>ADD ADDRESS</b>
      </div>
      <div
        className={`${CheckoutStyles.checkoutParentGrid} ${PaymentOptionStyles.billingParentGrid}`}
      >
        <div className={`${CheckoutStyles.formGrid} ${PaymentOptionStyles.billingAddressForm}`}>
          <EditAddressForm
            showNickNameField
            handleAddressPersistanceCallBack={handleAddCustomerAddress}
            checkoutFormValues={addressFormValues}
            updateFormValue={updateAddressFormValues}
            countryStateData={countryStateList?.billingCountries}
            isSubmitButtonDisabled={isSubmitButtonDisabled}
            formSubmitTitle={'Save address'}
            autoFocusField={'firstName'}
            additionalButton={
              <HlButton
                buttonTitle={'Cancel'}
                callbackMethod={handleAfterSave}
                parentDivClass={PaymentOptionStyles.cancelWrapper}
                buttonClass={PaymentOptionStyles.cancelButton}
              />
            }
          >
            <span className={CheckoutStyles.checkoutCheckboxWrapper}>
              {isCanada ? (
                addressBookLabels.nonShippableCountry
              ) : nonShippableState ? (
                addressBookLabels.nonShippableState
              ) : (
                <>
                  <input
                    type="checkbox"
                    className={CheckoutStyles.checkoutCheckbox}
                    ref={checkboxRefState}
                    checked={defaultShipping}
                    onChange={(event) => setDefaultShipping(event?.target?.checked)}
                  ></input>
                  <label
                    className={CheckoutStyles.checkboxLabel}
                    style={{ verticalAlign: 'text-bottom' }}
                  >
                    Select as your default shipping address
                  </label>
                </>
              )}
            </span>
          </EditAddressForm>
        </div>
      </div>
    </div>
  );
};

const MeatBall = ({ isDefault, cardExpired, paymentId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletePaymentError, setDeletePaymentError] = useState(null);

  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeletePayment = async () => {
    const paymentResponse = await deleteCustomerPaymentOption(paymentId);
    if (paymentResponse?.length || !paymentResponse?.errors?.length) {
      dispatch({
        type: 'UPDATE_PAYMENTS_LIST',
        payload: paymentResponse
      });
      handleClose();
    } else {
      const { status, message } = paymentResponse;
      if (status !== 200) {
        console.error(message);
        setDeletePaymentError(message);
      }
    }
  };

  const handleDefaultPayment = async () => {
    const paymentResponse = await updateCustomerPaymentOption(paymentId);
    if (paymentResponse?.length) {
      dispatch({
        type: 'UPDATE_PAYMENTS_LIST',
        payload: paymentResponse
      });
      handleClose();
    } else {
      const { status, message } = paymentResponse;
      if (status !== 200) {
        console.error(message);
        setDeletePaymentError(message);
      }
    }
  };

  const handleDeleteModalClose = () => {
    setModalOpen(false);
  };

  const handleDeleteModalOpen = () => {
    setModalOpen(true);
  };

  return (
    <div className={PaymentOptionStyles.meatBallMenu}>
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
        {!isDefault && !cardExpired && (
          <MenuItem onClick={handleDefaultPayment}>Set as Default</MenuItem>
        )}
        <MenuItem onClick={handleDeleteModalOpen}>Delete</MenuItem>
      </Menu>
      <DeleteListModal
        open={modalOpen}
        handleOpen={handleDeleteModalOpen}
        handleClose={handleDeleteModalClose}
        handleDelete={handleDeletePayment}
        title={addressBookLabels.deleteConfirmation}
        description={addressBookLabels.deleteDescription}
        deleteButtonTitle={addressBookLabels.deleteButtonTex}
      />
      {!!deletePaymentError && (
        <div className={PaymentOptionStyles.paymentErrorSection}>
          <div className={PaymentOptionStyles.errorInfoImage}>
            <img
              src={shippingFieldLabels.infoIcon}
              alt="delete"
              width={24}
              height={24}
              aria-label="delete"
            />
          </div>
          <label className={PaymentOptionStyles.paymentErrorLabel}>{deletePaymentError}</label>
        </div>
      )}
    </div>
  );
};

const PaymentsList = () => {
  const { payments } = useSelector((state) => state.myAccount);
  const [defaultPaymentOption, setDefaultPaymentOption] = useState(null);
  const [paymentOptions, setPaymentOptions] = useState([]);

  useEffect(() => {
    if (payments?.length) {
      const defaultPaymentOption = payments.find((payment) => payment.defaultPayment);
      const paymentOptions = payments.filter((payment) => !payment.defaultPayment);
      setDefaultPaymentOption(defaultPaymentOption);
      setPaymentOptions(paymentOptions);
    }
  }, [payments]);

  /* TODO: Kindly re-use 'DefaultPaymentComponent' and remove this item from here in future. */
  const renderCardInfo = (payment) => {
    const {
      last4Digits,
      cardType,
      expiryMonth,
      expiryYear,
      defaultPayment,
      cardExpired,
      paymentId
    } = payment;
    return (
      <div className={PaymentOptionStyles.cardInfoWrapper}>
        <div
          className={
            defaultPayment ? PaymentOptionStyles.defaultCardInfo : PaymentOptionStyles.cardInfo
          }
        >
          <label>{`${cardType} *${last4Digits}`}</label>
          <a>
            <MeatBall isDefault={defaultPayment} cardExpired={cardExpired} paymentId={paymentId} />
          </a>
        </div>
        <div>
          <label>{`Exp ${formatMonth(expiryMonth)}/${expiryYear}`}</label>
          {cardExpired && (
            <label className={PaymentOptionStyles.cardExpired}>{` (card expired)`}</label>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {defaultPaymentOption && (
        <>
          <div className={PaymentOptionStyles.defaultPaymentTitle}>
            <b>DEFAULT PAYMENT</b>
          </div>
          <div>
            {renderCardInfo(defaultPaymentOption)}
            <Divider className={PaymentOptionStyles.divider} />
          </div>
        </>
      )}
      {paymentOptions.length > 0 && (
        <>
          <div className={PaymentOptionStyles.myPaymentTitle}>
            <b>MY PAYMENT OPTIONS</b>
          </div>
          <div className={PaymentOptionStyles.paymentsListWrapper}>
            {paymentOptions?.map((paymentOption) => (
              <div className={PaymentOptionStyles.paymentOption}>
                {renderCardInfo(paymentOption)}
                <Divider className={PaymentOptionStyles.divider} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

const AddButton = ({ buttonLabel, onClickCallBack }) => {
  return (
    <a onClick={onClickCallBack}>
      <img
        src={'/icons/addIcon.svg'}
        alt={'Add'}
        className={PaymentOptionStyles.addAddressIcon}
        width={24}
        height={24}
        aria-label="add"
      />
      <label>{buttonLabel}</label>
    </a>
  );
};

export default function PaymentOption(props: any): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();

  const { myProfileInfo } = useSelector((state) => state.auth);

  const [addressId, setAddressId] = useState(null);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(false);
  const [savePaymentError, setSavePaymentError] = useState(null);

  const [microform, setMicroForm] = useState(null);
  const [flexToken, setFlexToken] = useState(null);

  const [flexTokenError, setFlexTokenError] = useState(null);

  const [cardType, setCardType] = useState();

  const { isAddressListEmpty, isPaymentsEmpty, addPaymentInfo } = useSelector(
    (state) => state.myAccount
  );
  const { isAddPaymentForm, isAddAddressForm } = addPaymentInfo;
  const { isInitialLoading } = useSelector((state) => state.layout.spinnerData);

  const showAddAddressForm = (state) => {
    dispatch({
      type: 'ADD_PAYMENT_INFO',
      payload: {
        isAddAddressForm: state
      }
    });
    router.push({ hash: `paymentOptions#${state ? 'addAddress' : 'add'}` });
  };

  const showAddPaymentForm = (state) => {
    dispatch({
      type: 'ADD_PAYMENT_INFO',
      payload: {
        isAddPaymentForm: state
      }
    });
    router.push({ hash: `paymentOptions${state ? '#add' : ''}` });
  };

  const showPaymentList = () => {
    showAddPaymentForm(false);
    setFlexToken(null);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const hashArray = router?.asPath?.split('#');
    const isAddPaymentForm = hashArray.includes('add') || hashArray.includes('addAddress');
    dispatch({
      type: 'ADD_PAYMENT_INFO',
      payload: {
        isAddPaymentForm,
        isAddAddressForm: hashArray.includes('addAddress')
      }
    });
    dispatch({
      type: 'LOAD_SPINNER',
      payload: {
        isVisible: false,
        className: '',
        isInitialLoading: false
      }
    });
  }, [router?.asPath]);

  useEffect(() => {
    async function saveCustomerPayments() {
      const paymentRequest = {
        flexToken,
        nameAsOnCard: document.querySelector('#cardHolderName').getAttribute('value'),
        cardType,
        billingAddressId: addressId,
        defaultPayment: defaultPaymentMethod
      };
      const paymentResponse = await addCustomerPaymentOption(paymentRequest);
      if (paymentResponse?.length) {
        dispatch({
          type: 'UPDATE_PAYMENTS_LIST',
          payload: paymentResponse
        });
        showPaymentList();
      } else {
        const { status, message } = paymentResponse;
        if (status !== 200) {
          setSavePaymentError(message);
        }
      }
      setIsSubmitButtonDisabled(false);
    }

    if (flexToken) {
      setSavePaymentError(null);
      saveCustomerPayments();
    }
  }, [flexToken]);

  const createFlexToken = () => {
    setIsSubmitButtonDisabled(true);
    dispatch({
      type: 'LOAD_SPINNER',
      payload: {
        isVisible: true,
        className: '',
        isInitialLoading: false,
        isMenuClicked: false
      }
    });
    const options = {
      expirationMonth: document.querySelector('#month').getAttribute('value'),
      expirationYear: document.querySelector('#year').getAttribute('value')
    };

    microform.createToken(options, function (error, token) {
      dispatch({
        type: 'LOAD_SPINNER',
        payload: {
          isVisible: false,
          className: '',
          isInitialLoading: false,
          isMenuClicked: false
        }
      });
      if (error) {
        console.error(error);
        setFlexTokenError(error);
      } else {
        setFlexToken(token);
      }
    });
  };

  const renderPaymentsList = () => (isPaymentsEmpty ? <EmptyPaymentOption /> : <PaymentsList />);

  const renderAddressList = () =>
    isAddressListEmpty ? (
      <EmptyAddressBook onClickCallBack={() => showAddAddressForm(true)} />
    ) : (
      <AddressList addressId={addressId} setAddressId={setAddressId} />
    );

  if (isInitialLoading) {
    return <div className={MyAccountStyles.divIsInitialLoading} />;
  }

  return (
    <div className={PaymentOptionStyles.paymentOptionAddressWrapper}>
      <div className={PaymentOptionStyles.paymentOptionWrapper}>
        <div className={PaymentOptionStyles.titleDiv}>
          <b>Payment Options</b>
          {!isAddPaymentForm && (
            <AddButton
              buttonLabel={'Add Payment Option'}
              onClickCallBack={() => {
                showAddPaymentForm(true);
                setDefaultPaymentMethod(false);
              }}
            />
          )}
        </div>
        {!isAddPaymentForm && renderPaymentsList()}
        {isAddPaymentForm && (
          <AddPaymentForm
            setIsSubmitButtonDisabled={setIsSubmitButtonDisabled}
            flexTokenError={flexTokenError}
            defaultPaymentMethod={defaultPaymentMethod}
            setMicroForm={setMicroForm}
            setCardType={setCardType}
            setDefaultPaymentMethod={setDefaultPaymentMethod}
            taxExempt={myProfileInfo?.taxExempt}
          />
        )}
      </div>
      {isAddPaymentForm && (
        <>
          <Divider />
          {isAddAddressForm ? (
            <AddAddress
              isSubmitButtonDisabled={isSubmitButtonDisabled}
              setIsSubmitButtonDisabled={setIsSubmitButtonDisabled}
              showAddAddressForm={showAddAddressForm}
            />
          ) : (
            <>
              {myProfileInfo?.taxExempt && (
                <span>
                  <span dangerouslySetInnerHTML={{ __html: shippingFieldLabels.taxExempt }}></span>
                  <HLAnchorTag
                    anchorTheme="LinkType2"
                    label={shippingFieldLabels.contactUs}
                    value={shippingFieldLabels.contactUsLink}
                  />
                  <label>{shippingFieldLabels.contactusHelperText}</label>
                </span>
              )}
              <div className={PaymentOptionStyles.billingAddressTitle}>
                <b>SELECT A BILLING ADDRESS FROM YOUR ADDRESS BOOK</b>
                {!isAddressListEmpty && !myProfileInfo?.taxExempt && (
                  <AddButton
                    buttonLabel={'Add Address'}
                    onClickCallBack={() => showAddAddressForm(true)}
                  />
                )}
              </div>
              {renderAddressList()}
              {savePaymentError && (
                <div className={PaymentOptionStyles.paymentErrorSection}>
                  <div className={PaymentOptionStyles.errorInfoImage}>
                    <img
                      src={'/icons/account/infoIcon.svg'}
                      alt="delete"
                      width={24}
                      height={24}
                      aria-label="delete"
                    />
                  </div>
                  <label className={PaymentOptionStyles.paymentErrorLabel}>
                    {savePaymentError}
                  </label>
                </div>
              )}
              <div className={PaymentOptionStyles.paymentsCta}>
                <HlButton
                  buttonTitle={'Cancel'}
                  callbackMethod={showPaymentList}
                  parentDivClass={PaymentOptionStyles.cancelWrapper}
                  buttonClass={PaymentOptionStyles.cancelButton}
                />
                <HlButton
                  buttonTitle={'Save card'}
                  callbackMethod={createFlexToken}
                  isDisabled={!addressId || isSubmitButtonDisabled}
                  parentDivClass={PaymentOptionStyles.submitWrapper}
                  buttonClass={PaymentOptionStyles.submitButton}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export { MeatBall };
