import { useState } from 'react';
import HLTextField from '@Components/common/hlTextField';
import HlButton from '@Components/common/button';
import { isValidEmail } from '@Components/common/accountValidator';
import { signUpForEmails } from '@Lib/cms/globalHeaderFooter';
import EmailSubscriptionStyles from '@Styles/layout/emailSubscription.module.scss';

export default function EmailSubscription(): JSX.Element {
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState({
    isEmailError: false
  });
  const [emailAddress, setEmailAddress] = useState();

  const validateFieldError = () => {
    const email = emailAddress;

    const isEmailError = !isValidEmail(email);
    const fieldValidity = { isEmailError };
    setErrorFields(fieldValidity);
    return isEmailError;
  };

  const handleEmailInputChange = (event, type) => {
    setEmailAddress(event?.target?.value);
  };

  const renderErrorInfoIcon = () => {
    return (
      <img src={'/icons/infoIcon.svg'} alt={'Delete'} width={24} height={24} aria-label="delete" />
    );
  };

  const handleHeaderSignUp = async () => {
    let headerSignUpResponse;
    if (validateFieldError()) {
      return;
    } else {
      try {
        headerSignUpResponse = (await signUpForEmails({ email: emailAddress })) ?? {};
      } catch (err) {}

      if (headerSignUpResponse?.Status === 200) {
        setShowSuccessMessage(true);
      }
    }
  };

  return (
    <>
      {!showSuccessMessage ? (
        <div className={EmailSubscriptionStyles.emailSubWrapper}>
          <div className={EmailSubscriptionStyles.emailSubTitle}>
            Join our email list to receive our Weekly Ad, special promotions, fun project ideas and
            store news.
          </div>
          <div className={EmailSubscriptionStyles.emailCompWrapper}>
            <HLTextField
              labelName="Email"
              textFieldValue={emailAddress}
              handleInputChange={(e) => handleEmailInputChange(e, 'email')}
              additionalClassName={
                errorFields.isEmailError ? EmailSubscriptionStyles.errorInput : ''
              }
              error={errorFields.isEmailError}
              helperText={errorFields.isEmailError ? 'Invalid email format!' : ''}
              InputProps={{
                endAdornment: errorFields.isEmailError ? renderErrorInfoIcon() : <></>
              }}
              inputProps={{
                'data-testid': 'signup-email-address'
                }}
            />

            <div className={EmailSubscriptionStyles.signUpButtonWrapper}>
              <HlButton buttonTitle="Sign up" callbackMethod={handleHeaderSignUp} />
            </div>
          </div>
        </div>
      ) : (
        <div className={EmailSubscriptionStyles.sucessContentWrapper}>
          <label className={EmailSubscriptionStyles.thanksLabel}>
            Thank you! Your email has been submitted. Check your inbox.
          </label>
          <label className={EmailSubscriptionStyles.weeklyadLabel}>
            You will receive our Weekly Ad, special promotions, fun project ideas and store news.
          </label>
        </div>
      )}
    </>
  );
}
