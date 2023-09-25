import { useState } from 'react';
import HLTextField from '@Components/common/hlTextField';
import HlButton from '@Components/common/button';
import { HlPageLinkButton } from '@Components/common/button';
import { isValidAccountEmail } from '@Components/common/accountValidator';
import { forgotPassword } from '@Lib/cms/accountpage';

import EmailStyles from '@Styles/account/forgotPassword.module.scss';
import { Ga4LoginDataLayer } from 'src/interfaces/ga4DataLayer';
import { useSelector } from '@Redux/store';

let errorEmail = '';

export default function EmailComponent(): JSX.Element {
  const [errorFields, setErrorFields] = useState({
    isEmailError: false
  });
  const [emailAddress, setEmailAddress] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);
  const [isResponseFailed, setIsResponseFailed] = useState<boolean>(false);
  const {
    heartBeatInfo: { isLoggedInUser, sessionId }
  } = useSelector((state) => state.auth) ?? {};
  const validateFieldError = () => {
    const email = emailAddress;

    const isEmailError = !isValidAccountEmail(email);
    const fieldValidity = { isEmailError };
    setErrorFields(fieldValidity);

    return isEmailError;
  };

  const handleEmailInputChange = (event, type) => {
    setEmailAddress(event?.target?.value);
  };

  const renderErrorInfoIcon = () => {
    return <img src="icons/infoIcon.svg" alt="Delete" width={24} height={24} aria-label="delete" />;
  };

  const handleSendEmail = async () => {
    let paswordResponse;
    setIsSubmitButtonDisabled(true);
    if (validateFieldError()) {
      setIsSubmitButtonDisabled(false);
      return;
    } else {
      try {
        paswordResponse = await forgotPassword(emailAddress);
        setIsSubmitButtonDisabled(false);
      } catch (err) {}

      handlePasswordResetEvent();

      if (paswordResponse?.forgotPassword?.status === 'SUCCESS') {
        setShowSuccessMessage(true);
      } else {
        errorEmail = emailAddress;
        setIsResponseFailed(true);
      }
    }
  };

  function handlePasswordResetEvent(): void {
    if (window) {
      const gtmData: Ga4LoginDataLayer = {
        anonymous_user_id: '',
        event: 'reset_password',
        user_id: ''
      };

      if (sessionId) {
        isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
  }

  return (
    <>
      {isResponseFailed && !showSuccessMessage && (
        <div className={EmailStyles.errorSection}>
          <img src="icons/infoIcon.svg" alt="Delete" width={24} height={24} aria-label="delete" />
          <span>User {errorEmail} not found.</span>
        </div>
      )}

      {!showSuccessMessage ? (
        <div className={EmailStyles.emailCompWrapper}>
          <span className={EmailStyles.emailInfo}>
            Enter the email address associated to your account and we’ll send you an email to create
            a new password.
          </span>
          <HLTextField
            labelName="Email"
            textFieldValue={emailAddress}
            handleInputChange={(e) => handleEmailInputChange(e, 'email')}
            additionalClassName={errorFields.isEmailError ? EmailStyles.errorInput : ''}
            error={errorFields.isEmailError}
            helperText={errorFields.isEmailError ? 'Invalid email format!' : ''}
            InputProps={{
              endAdornment: errorFields.isEmailError ? renderErrorInfoIcon() : <></>
            }}
            inputProps={{
              'data-testid': 'forgot-password-address'
            }}
          />

          <div className={EmailStyles.signUpButtonWrapper}>
            <HlPageLinkButton
              buttonTitle="Cancel"
              parentDivClass={EmailStyles.cancelWrapper}
              buttonClass={EmailStyles.cancelButton}
              href="/login"
            />

            <HlButton
              buttonTitle="Send email"
              callbackMethod={handleSendEmail}
              parentDivClass={EmailStyles.submitWrapper}
              buttonClass={EmailStyles.submitButton}
              isDisabled={isSubmitButtonDisabled}
            />
          </div>
        </div>
      ) : (
        <div className={EmailStyles.forgotPasswordSuccess}>
          <span className={EmailStyles.description}>
            We have sent you an email with a link to create a new password. Please notice that you
            will only receive a link if the email address is associated with a real account. If you do not receive a link,
            please proceed with creating a new account.
          </span>
          <HlPageLinkButton buttonTitle="Back to home" href="/" />
        </div>
      )}
    </>
  );
}
