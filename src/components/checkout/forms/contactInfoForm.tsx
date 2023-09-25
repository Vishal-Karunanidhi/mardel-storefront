import { useEffect, useState } from 'react';
import { useSelector } from '@Redux/store';
import TextField from '@mui/material/TextField';
import HlButton from '@Components/common/button';
import {
  isValidAccountEmail,
  isValidAccountPhone,
  isOnTypePhoneValid,
  cleanupPhoneNumber,
  phoneFormatter
} from '@Components/common/accountValidator';
import { logoutUser } from '@Lib/cms/accountpage';
import CheckoutStyles from '@Styles/checkout/checkoutPage.module.scss';
import ContactStyles from '@Styles/checkout/contactInfo.module.scss';

// const defaultContactFormValues = { emailAddress: '', phone: '', smsAlert: 'off', emailAlert: 'off' };
const formFieldLabels = {
  guestCheckout: 'Guest Checkout',
  contactInfo: 'CONTACT INFORMATION',
  editForm: 'Edit',
  emailAddress: 'Email',
  phone: 'Phone Number',
  orderStatusMessage: 'We’ll use these details for order status updates.',
  smsAlert: 'I would like to to receive promotional SMS texts from Hobby Lobby.',
  emailAlert: 'I would like to to receive promotional emails from Hobby Lobby.',
  saveAndcontinue: 'Save & Continue',
  emailErrorMsg: 'Enter a complete email address.',
  phoneErrorMsg: 'Enter a complete phone number.'
};

export default function ContactInfoForm(props: any): JSX.Element {
  const { heartBeatInfo, myProfileInfo } = useSelector((state) => state.auth);
  const { checkoutFormValue, currentFormMode, showFormEditButton } = props;
  const { updateCheckoutFormValue, updateCurrentFormMode } = props;
  const [errorFields, setErrorFields] = useState({
    isEmailError: false,
    isPhoneError: false
  });
  const [isValidForm, setIsValidForm] = useState(false);
  const [contactFormValues, setContactFormValues] = useState(checkoutFormValue.contact);

  useEffect(() => {
    validateFormfields();
  }, [contactFormValues]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (validateFormfields()) {
      const phone = cleanupPhoneNumber(contactFormValues?.phone);
      contactFormValues['phone'] = phone;
      if (contactFormValues && !phone?.includes('+1')) {
        contactFormValues['phone'] = '+1' + phone;
      }

      updateCheckoutFormValue('contact', contactFormValues);
    }
  };

  const handleInputChange = (value, type) => {
    if (type === 'phone' && !isOnTypePhoneValid(value.trim())) {
      return;
    }

    if (type === 'emailAddress') {
      value = value.replace(/\s/g, '');
    }

    setContactFormValues({
      ...contactFormValues,
      [type]: value.trim()
    });
  };

  const validateFormfields = () => {
    const { emailAddress, phone } = contactFormValues;

    const isValidEmail = isValidAccountEmail(emailAddress);
    const isValidPhone = isValidAccountPhone(phone);
    const isValid = isValidEmail && isValidPhone;

    const fieldValidity = {
      isEmailError: !!emailAddress && !isValidEmail,
      isPhoneError: !!phone && !isValidPhone
    };
    setIsValidForm(isValid);
    setErrorFields(fieldValidity);
    return isValid;
  };

  const viewContactForm = () => {
    return (
      <>
        <div className={CheckoutStyles.viewContactForm}>
          <label>{formFieldLabels?.contactInfo}</label>
          {!showFormEditButton && (
            <a onClick={updateCurrentFormMode} data-testid="edit-contact-info-button">
              {formFieldLabels?.editForm}
            </a>
          )}
        </div>
        {renderLoggedInUserWelcome()}

        <label className={CheckoutStyles.viewLabels}>{contactFormValues?.emailAddress}</label>
        <label className={CheckoutStyles.viewLabels}>
          {phoneFormatter(contactFormValues?.phone)}
        </label>
      </>
    );
  };

  const promoCheckItem = (promoLabel, promoType) => {
    return (
      <span>
        <input
          type="checkbox"
          className={ContactStyles.promoCheckRadio}
          onChange={(e) => handleInputChange(e?.target?.checked, promoType)}
          checked={contactFormValues?.[promoType]}
          data-testid={promoType + '-checkbox'}
        />
        <label>{promoLabel}</label>
      </span>
    );
  };

  const renderErrorInfoIcon = () => {
    return (
      <img
        src={'/icons/account/infoIcon.svg'}
        alt={'Delete'}
        width={24}
        height={24}
        aria-label="delete"
      />
    );
  };

  const renderLoggedInUserWelcome = () => {
    const { firstName, lastName } = myProfileInfo;

    if (!heartBeatInfo.isLoggedInUser) {
      return <></>;
    }

    return (
      <>
        {!showFormEditButton && (
          <div className={ContactStyles.loginWelcome}>
            <b>
              Welcome back, {firstName} {lastName}!
            </b>
            <label>
              Not you?{' '}
              <a href="/logout" onClick={() => logoutUser({})}>
                Log out
              </a>
            </label>
          </div>
        )}
      </>
    );
  };

  const editContactForm = () => {
    return (
      <>
        <div className={ContactStyles.checkoutLabelWrapperDiv}>
          {!heartBeatInfo.isLoggedInUser && (
            <label className={ContactStyles.guest}>{formFieldLabels?.guestCheckout}</label>
          )}
          <label className={ContactStyles.contact}>{formFieldLabels?.contactInfo}</label>
        </div>
        <label className={ContactStyles.statusContact}>{formFieldLabels?.orderStatusMessage}</label>

        {renderLoggedInUserWelcome()}

        <form
          onSubmit={handleFormSubmit}
          className={`${CheckoutStyles.editContactForm} ${ContactStyles.editContactForm}`}
        >
          <div className={CheckoutStyles.inputFieldWrapper}>
            <TextField
              label={formFieldLabels?.emailAddress}
              className={
                !errorFields.isEmailError
                  ? CheckoutStyles.textInput
                  : `${CheckoutStyles.textInput} ${CheckoutStyles.errorInput}`
              }
              variant="filled"
              onBlur={validateFormfields}
              value={contactFormValues?.emailAddress}
              onChange={(e) => handleInputChange(e?.target?.value, 'emailAddress')}
              defaultValue={contactFormValues?.emailAddress}
              error={errorFields.isEmailError}
              helperText={errorFields.isEmailError ? formFieldLabels.emailErrorMsg : ''}
              InputProps={{
                endAdornment: errorFields.isEmailError ? renderErrorInfoIcon() : <></>
              }}
              inputProps={{
                'data-testid': 'email-address'
              }}
            />
            <TextField
              label={formFieldLabels?.phone}
              variant="filled"
              className={
                !errorFields.isPhoneError
                  ? CheckoutStyles.textInput
                  : `${CheckoutStyles.textInput} ${CheckoutStyles.errorInput}`
              }
              onBlur={validateFormfields}
              value={phoneFormatter(contactFormValues?.phone)}
              onChange={(e) => handleInputChange(e?.target?.value, 'phone')}
              defaultValue={contactFormValues?.phone}
              error={errorFields.isPhoneError}
              helperText={errorFields.isPhoneError ? formFieldLabels.phoneErrorMsg : ''}
              InputProps={{
                endAdornment: errorFields.isPhoneError ? renderErrorInfoIcon() : <></>
              }}
              inputProps={{
                'data-testid': 'phone-number'
              }}
              placeholder="(___) ___-____"
            />
          </div>

          <div className={ContactStyles.promoWrapperDiv}>
            {false && (
              <>
                {promoCheckItem(formFieldLabels?.smsAlert, 'smsAlert')}
                {promoCheckItem(formFieldLabels?.emailAlert, 'emailAlert')}
              </>
            )}
          </div>

          <HlButton
            buttonTitle={formFieldLabels?.saveAndcontinue}
            parentDivClass={CheckoutStyles.submitWrapper}
            buttonClass={CheckoutStyles.submitButton}
            isDisabled={!isValidForm}
            dataTestId="guest-checkout-submit-button"
          />
        </form>
      </>
    );
  };

  switch (currentFormMode) {
    case 'VIEW':
      return <>{viewContactForm()}</>;
    case 'EDIT':
      return <>{editContactForm()}</>;
    default:
      return <>{formFieldLabels?.contactInfo}</>;
  }
}
