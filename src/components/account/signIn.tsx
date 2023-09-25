import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from '@Redux/store';
import HLTextField from '@Components/common/hlTextField';
import HlButton from '@Components/common/button';
import HLCheckbox from '@Components/common/hlCheckBox';
import { generateRecaptchaToken } from '@Components/3rdPartyServices/googleRecaptcha';
import {
  accountLabels,
  defaultAccountValues,
  signInRememberFieldKey
} from '@Constants/accountConstants';

import {
  SignInValidator,
  isValidAccountEmail,
  isSignInPasswordValid
} from '@Components/common/accountValidator';
import { sigInUserAccount } from '@Lib/cms/accountpage';

import SignInStyles from '@Styles/account/signIn.module.scss';
import { base64Encode } from '@Lib/common/utility';
import { Ga4LoginDataLayer } from 'src/interfaces/ga4DataLayer';

const defaultSignInErrorMsg =
  'We were not able to login with the email address and password combination provided. Too many failed attempts will result in your account being locked out. If you have an account, please proceed with the forgot password link below.';

export default function SignIn(props: any): JSX.Element {
  const dispatch = useDispatch();
  const { isNonLoginPage = false } = props;
  const [isValidForm, setIsValidForm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorFields, setErrorFields] = useState({
    isEmailError: false,
    isPasswordError: false
  });
  const [isResponseFailed, setIsResponseFailed] = useState(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
  const [signInFormValues, setSignInFormValues] = useState(
    defaultAccountValues?.defaultSignInFieldValues
  );
  const [signInErrorMsg, setSignInErrorMsg] = useState<string>(defaultSignInErrorMsg);
  const {
    heartBeatInfo: { isLoggedInUser, sessionId }
  } = useSelector((state) => state.auth) ?? {};

  const invalidEmailMessage = (
    <span className={SignInStyles.inputFields}>{'Invalid email format'}</span>
  );

  useEffect(() => {
    validateFormfields();
  }, [signInFormValues]);

  useEffect(() => {
    const { REMEMBER_ME, REMEMBER_EMAIL } = signInRememberFieldKey;
    const isRemeberMeSet = JSON.parse(localStorage.getItem(REMEMBER_ME) ?? 'false');
    if (isRemeberMeSet) {
      const username = localStorage.getItem(REMEMBER_EMAIL);
      setRememberMe(true);
      setSignInFormValues((prev) => ({
        ...prev,
        username
      }));
    }
  }, []);
  const handleCheckBoxChange = ({ target }) => {
    setRememberMe(target?.checked);
    localStorage.setItem(signInRememberFieldKey.REMEMBER_ME, target?.checked);
  };
  const handleRememberMePersistence = () => {
    const { REMEMBER_ME, REMEMBER_EMAIL } = signInRememberFieldKey;
    const isRemeberMeSet = JSON.parse(localStorage.getItem(REMEMBER_ME) ?? 'false');
    if (isRemeberMeSet) {
      localStorage.setItem(REMEMBER_EMAIL, signInFormValues['username']);
    } else {
      localStorage.removeItem(REMEMBER_EMAIL);
    }
  };

  const validateFormfields = () => {
    const isValid = SignInValidator(signInFormValues);
    setIsValidForm(isValid);
  };

  const validateFieldError = () => {
    const { username, password } = signInFormValues;

    const fieldValidity = {
      isEmailError: !!username && !isValidAccountEmail(username),
      isPasswordError: !!password && !isSignInPasswordValid(password)
    };
    setErrorFields(fieldValidity);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  };
  const handleInputChange = (event, type) => {
    setSignInFormValues({
      ...signInFormValues,
      [type]: event?.target?.value
    });
  };

  const handleSignInAccount = async () => {
    let signInAccountResponse;
    setIsSubmitButtonDisabled(true);
    spinnerVisible(true, SignInStyles.spinner);
    try {
      setIsResponseFailed(false);
      const recaptchaToken = await generateRecaptchaToken('signIn');
      const signInRequest = {
        ...signInFormValues,
        recaptchaToken,
        password: base64Encode(signInFormValues.password)
      };
      signInAccountResponse = (await sigInUserAccount(signInRequest)) ?? {};
    } catch (err) {}
    handleRememberMePersistence();

    handleLoginRedirect(signInAccountResponse);
  };

  const handleLoginRedirect = (response) => {
    const { status, errorType } = response;
    if (status === '200') {
      handleSigninEvent(true);
      if (isNonLoginPage) {
        spinnerVisible(false);
        props?.callbackSignInReponse(response);
        return;
      }

      window.location.href = '/my-account#accountOverview';
    } else {
      if (status === '409') {
        setSignInErrorMsg(
          'We cannot locate an account with your email address.  Please create a new account and let us know when your account is set up and we’ll be happy to migrate your order history.'
        );
      } else if (errorType === 'PasswordResetRequiredException') {
        setSignInErrorMsg(`As a part of our ongoing commitment to improving security, we've changed the password requirements to access hobbylobby.com.
        A password reset email has been sent to the email address entered. Please follow the instructions to reset your password using the new password requirements.`);
      } else {
        setSignInErrorMsg(defaultSignInErrorMsg);
      }
      handleSigninError();
    }
  };

  function handleSigninError() {
    handleSigninEvent(false);
    setIsResponseFailed(true);
    spinnerVisible(false);
    setIsSubmitButtonDisabled(false);
  }

  function handleSigninEvent(success: boolean): void {
    if (window) {
      const gtmData: Ga4LoginDataLayer = {
        anonymous_user_id: '',
        event: 'login',
        user_id: ''
      };

      if (success) {
        gtmData.method = 'email';
      } else {
        gtmData.event = 'login_attempt';
      }

      if (sessionId) {
        isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
  }

  const spinnerVisible = (isVisible: boolean, className = '') => {
    if (isNonLoginPage) {
      return;
    }
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

  return (
    <>
      <h2 className={SignInStyles.signInTitle}>{accountLabels?.signInLabels?.signInTitle}</h2>
      {isResponseFailed && (
        <div className={SignInStyles.errorSection}>
          <img
            src={'/icons/account/infoIcon.svg'}
            alt={'Delete'}
            width={24}
            height={24}
            aria-label="delete"
          />
          <label>{signInErrorMsg}</label>
        </div>
      )}
      <form onSubmit={handleFormSubmit} className={SignInStyles.signInFormWrapper}>
        <div className={SignInStyles.inputFields}>
          <HLTextField
            labelName={accountLabels?.signInLabels?.email}
            textFieldValue={signInFormValues?.username}
            handleInputChange={(e) => handleInputChange(e, 'username')}
            onBlur={validateFieldError}
            additionalClassName={errorFields.isEmailError ? SignInStyles.errorInput : ''}
            error={errorFields.isEmailError}
            helperText={errorFields.isEmailError ? invalidEmailMessage : ''}
            InputProps={{
              endAdornment: errorFields.isEmailError ? renderErrorInfoIcon() : <></>
            }}
            inputProps={{
              'data-testid': 'signin-email-address'
            }}
          />
          <HLTextField
            labelName={accountLabels?.signInLabels?.password}
            textFieldValue={signInFormValues?.password}
            textFieldType={'password'}
            handleInputChange={(e) => handleInputChange(e, 'password')}
            inputProps={{
              'data-testid': 'signin-password'
            }}
          />
        </div>
        {isNonLoginPage && (
          <label className={SignInStyles.fieldRule}>
            {accountLabels?.signUpLabels?.passwordFieldRule}
          </label>
        )}
        <div className={SignInStyles.checkBoxSection}>
          <HLCheckbox
            checkBoxLabel={accountLabels?.signInLabels?.rememberMe}
            handleCheckBoxChange={handleCheckBoxChange}
            isChecked={rememberMe}
            dataTestId="signin-rememberme-checkbox"
          />
          <a href="/forgot-password">{accountLabels?.signInLabels?.forgotPassword}</a>
        </div>
        {props.children}
        <div className={SignInStyles.signInButton}>
          <HlButton
            callbackMethod={handleSignInAccount}
            buttonTitle={
              props.buttonTitle ? props.buttonTitle : accountLabels?.signInLabels?.signInButton
            }
            parentDivClass={SignInStyles.signInButtonWrapper}
            isDisabled={!isValidForm || isSubmitButtonDisabled}
            dataTestId="signin-submit-button"
          />
        </div>
      </form>
    </>
  );
}
