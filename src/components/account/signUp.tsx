import { useState, useEffect } from 'react';
import { generateRecaptchaToken } from '@Components/3rdPartyServices/googleRecaptcha';
import HLTextField from '@Components/common/hlTextField';
import HlButton from '@Components/common/button';
import HLCheckbox from '@Components/common/hlCheckBox';
import { Divider } from '@mui/material';
import TextFieldStyles from '@Components/common/styles/hlTextField.module.scss';
import SignupStyles from '@Styles/account/signUp.module.scss';
import {
  accountLabels,
  dialogLabels,
  accountFormFields,
  accountRule,
  defaultAccountValues
} from '@Constants/accountConstants';

import { createUserAccount } from '@Lib/cms/accountpage';
import { base64Encode, trimObjects } from '@Lib/common/utility';

import {
  SignUpValidator,
  isOnTypePhoneValid,
  cleanupPhoneNumber,
} from '@Components/common/accountValidator';
import WelcomeUserModal from '@Components/account/welcomeUserModal';
import AccountBenefit from '@Components/account/accountBenefit';
import { Ga4LoginDataLayer } from 'src/interfaces/ga4DataLayer';

let errorEmail = '';
let passwordErrorMessage = '';

export default function SignUp(props: any): JSX.Element {
  const { guestSignUpFieldValues, isGuestSignUp = false } = props;
  const [isValidForm, setIsValidForm] = useState(false);
  const [checkboxVisible, setCheckboxVisible] = useState(false);
  const [signUpFormValues, setSignUpFormValues] = useState(
    isGuestSignUp ? guestSignUpFieldValues : defaultAccountValues?.defaultSignUpFieldValues
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResponseFailed, setIsResponseFailed] = useState({
    emailError: false,
    passwordError: false
  });
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  useEffect(() => {
    validateFormfields();
  }, [signUpFormValues]);

  const validateFormfields = () => {
    // TODO: User Name field validation need to do//
    const isValid = SignUpValidator(signUpFormValues);
    setIsValidForm(isValid);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  };

  const handleCreateAccount = async () => {
    setIsSubmitButtonDisabled(true);
    signUpFormValues['confirmPassword'] = signUpFormValues.password;

    let createAccountResponse;

    const updatedSignUpFormValue = trimObjects(signUpFormValues);

    if (JSON.stringify(updatedSignUpFormValue) !== JSON.stringify(signUpFormValues)) {
      setSignUpFormValues(updatedSignUpFormValue);
    }

    try {
      const recaptchaToken = await generateRecaptchaToken('signUp');
      const createUserRequest = {
        ...signUpFormValues,
        password: base64Encode(signUpFormValues.password),
        confirmPassword: base64Encode(signUpFormValues.confirmPassword),
        recaptchaToken,
        phone: cleanupPhoneNumber(signUpFormValues?.['phone'])
      };
      createAccountResponse = (await createUserAccount({}, createUserRequest)) ?? {};
    } catch (err) {}

    setIsSubmitButtonDisabled(false);
    if (createAccountResponse?.status === '200') {
      handleSignupEvent(true);
      setIsModalOpen(true);
    } else {
      handleSignupEvent(false);
      processErrorMessage(createAccountResponse);
    }
  };

  const processErrorMessage = ({ status, invalidParameters, message }) => {
    if (status === '500') {
      alert('Something Error happened in our end !');
    } else {
      switch (invalidParameters?.[0]?.parameter) {
        case 'email':
          errorEmail = signUpFormValues?.email;
          setIsResponseFailed({ emailError: true, passwordError: false });
          break;

        case 'userCreateRequest':
        case 'password':
          passwordErrorMessage = invalidParameters?.[0]?.message;
          setIsResponseFailed({ emailError: false, passwordError: true });
          break;
        default:
          errorEmail = signUpFormValues?.email;
          passwordErrorMessage = message;
          const emailError = message?.includes('already');
          setIsResponseFailed({ emailError, passwordError: !emailError });
          break;
      }
    }
  };

  function handleSignupEvent(success: boolean): void {
    if (window) {
      const gtmData: Ga4LoginDataLayer = {
        anonymous_user_id: '',
        event: 'sign_up',
        user_id: ''
      };

      if (success) {
        gtmData.method = 'email';
      } else {
        gtmData.event = 'sign_up_attempt';
      }

      // TODO6786: populate appropriate user id
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
  }

  const renderTextField = ({ key, label, type = 'text', sibling = <></> }) => {
    return (
      <>
        <HLTextField
          handleInputChange={(e) => handleInputChange(e, key)}
          textFieldValue={signUpFormValues[key]}
          labelName={label}
          textFieldType={type}
        />
        {sibling}
      </>
    );
  };

  const handleInputChange = (event, type) => {
    if (type === 'phone' && !isOnTypePhoneValid(event?.target?.value)) {
      return;
    }
    setSignUpFormValues({
      ...signUpFormValues,
      [type]: event?.target?.value
    });
  };

  const handleWelcomeModalClose = () => {
    setIsModalOpen(false);
    setSignUpFormValues(defaultAccountValues?.defaultSignUpFieldValues);
    setIsResponseFailed({ emailError: false, passwordError: false });
  };

  return (
    <>
      <WelcomeUserModal
        isModalOpen={isModalOpen}
        handleWelcomeModalClose={handleWelcomeModalClose}
      />
      <h2 className={SignupStyles.accountTitle}>{accountLabels?.signUpLabels?.createAccount}</h2>

      <form onSubmit={handleFormSubmit} className={SignupStyles.signUpForm}>
        {isResponseFailed.emailError && (
          <div className={SignupStyles.errorSection}>
            <div>
              <b>{errorEmail}</b> {dialogLabels?.signedUpMessage}
              <a href="/forgot-password">{dialogLabels?.resetPassword}</a>
            </div>
          </div>
        )}

        {isResponseFailed.passwordError && (
          <div className={SignupStyles.errorSection}>{passwordErrorMessage}</div>
        )}
        <div className={TextFieldStyles.inputFieldWrapper}>
          {accountFormFields.section1.map((e) => renderTextField(e))}
        </div>
        {accountFormFields.section2.map((e) => renderTextField(e))}
        <label className={SignupStyles.fieldRule}>
          {accountLabels?.signUpLabels?.phoneNumberFieldRule}
        </label>
        {accountFormFields.section3.map((e) => renderTextField(e))}
        <label className={SignupStyles.fieldRule}>
          {accountLabels?.signUpLabels?.passwordFieldRule}
        </label>

        {/* TODO:Checkbox sectoin disabled and will be enable in future.
           if we set checkboxVisible is true checkbox will be enable. */}
        {checkboxVisible &&
          accountFormFields?.section4.map((e, i: number) => (
            <HLCheckbox checkBoxLabel={e?.label} key={i} />
          ))}
      </form>

      <HlButton
        buttonTitle={accountLabels?.signUpLabels?.signUp}
        isDisabled={!isValidForm || isSubmitButtonDisabled}
        callbackMethod={handleCreateAccount}
      />
      <div className={SignupStyles.buttonRuleWrapper}>
        <label className={SignupStyles.buttonRule}>
          {accountLabels?.signUpLabels?.createAccountRule}
        </label>
        {accountRule.anchorSection.map((e, i: number) => (
          <span key={i}>
            <a href={e?.href}>{e?.label}</a>
          </span>
        ))}
      </div>

      <Divider className={SignupStyles.benefitDivider} />

      <div className={SignupStyles.benefitSection}>
        <h3 className={SignupStyles.benefitTitle}>
          {accountLabels?.signUpLabels?.accountBenefitTitle}
        </h3>
        <AccountBenefit />
      </div>
      <Divider className={`${SignupStyles.benefitDivider} ${SignupStyles.benefitBottomDivider}`} />
    </>
  );
}
