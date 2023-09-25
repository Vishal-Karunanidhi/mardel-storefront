import { useState } from 'react';
import { useRouter } from 'next/router';
import HLTextField from '@Components/common/hlTextField';
import HlButton from '@Components/common/button';
import { HlPageLinkButton } from '@Components/common/button';
import { isValidPassword } from '@Components/common/accountValidator';
import { createNewPassword } from '@Lib/cms/accountpage';
import { base64Encode } from '@Lib/common/utility';

import NewPwStyles from '@Styles/account/account.module.scss';

let passwordErrorMessage = '';

export default function CreateNewPassword(): JSX.Element {
  const [errorFields, setErrorFields] = useState({
    pwdMisMatch: false,
    criteriaFail: false
  });

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmNewPassword] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [isResponseFailed, setIsResponseFailed] = useState<boolean>(false);

  const router = useRouter();

  const { token } = router.query;

  const email = router.query['email'];

  const { pwdMisMatch, criteriaFail } = errorFields;

  const handleCreateNewPassword = async () => {
    let paswordResponse;
    if (newPassword !== confirmPassword) {
      setErrorFields({ pwdMisMatch: true, criteriaFail: false });
      setIsResponseFailed(false);
    } else if (confirmPassword && !isValidPassword(confirmPassword)) {
      setErrorFields({ pwdMisMatch: false, criteriaFail: true });
      setIsResponseFailed(false);
    } else {
      const UpdateForgotPasswordRequest = {
        confirmPassword: base64Encode(confirmPassword),
        confirmationCode: token,
        email,
        password: base64Encode(newPassword)
      };
      try {
        paswordResponse = (await createNewPassword(UpdateForgotPasswordRequest)) ?? {};
      } catch (err) {}

      if (paswordResponse?.data?.updateForgotPassword?.status === 'SUCCESS') {
        setShowSuccessMessage(true);
        setIsResponseFailed(false);
      } else {
        processErrorMessage(paswordResponse?.errors[0]?.extensions?.error);
      }
    }
  };

  const processErrorMessage = ({ status, invalidParameters }) => {
    if (status === '500') {
      alert('Something Error happened in our end !');
    } else {
      passwordErrorMessage = invalidParameters?.[0]?.message;
      setIsResponseFailed(true);
      setErrorFields({ pwdMisMatch: false, criteriaFail: false });
    }
  };

  const handlePasswordInputChange = (event, type) => {
    const password = event?.target?.value;
    if (type === 'newPassword') {
      setNewPassword(password);
    } else {
      setConfirmNewPassword(password);
    }
  };

  return (
    <>
      {!showSuccessMessage && (
        <div className={NewPwStyles.newPwWrapper}>
          <span className={NewPwStyles.title}>Create new password</span>
          {isResponseFailed && (
            <div className={NewPwStyles.errorSection}>{passwordErrorMessage}</div>
          )}
          <HLTextField
            labelName="New password"
            textFieldType={'password'}
            textFieldValue={newPassword}
            additionalClassName={pwdMisMatch || criteriaFail ? NewPwStyles.errorInput : ''}
            error={pwdMisMatch || criteriaFail}
            handleInputChange={(e) => handlePasswordInputChange(e, 'newPassword')}
            inputProps={{
              'data-testid': 'new-password'
            }}
            helperText={criteriaFail ? `Password does not meet minimum criteria` : ''}
          />
          <HLTextField
            labelName="Confirm new password"
            textFieldType={'password'}
            textFieldValue={confirmPassword}
            additionalClassName={pwdMisMatch || criteriaFail ? NewPwStyles.errorInput : ''}
            error={pwdMisMatch || criteriaFail}
            handleInputChange={(e) => handlePasswordInputChange(e, 'confirmPassword')}
            helperText={pwdMisMatch ? `Passwords don't match` : ''}
            inputProps={{
              'data-testid': 'confirm-password'
            }}
          />
          <span className={NewPwStyles.pwCriteria}>
            Passwords must be minimum 8 characters, and include 1 upper and lowercase letter, number
            and special character.
          </span>
          <HlButton
            buttonTitle={'Save & Continue'}
            callbackMethod={handleCreateNewPassword}
            dataTestId="password-submit-button"
            isDisabled={!newPassword || !confirmPassword}
          />
        </div>
      )}

      {showSuccessMessage && (
        <div className={NewPwStyles.newPwUpdated}>
          <span className={NewPwStyles.title}>Your password has been updated!</span>

          <span className={NewPwStyles.pwSuccessMsg}>
            You’ve successfully updated your password. Please log in with your new credentials and
            continue shopping!
          </span>
          <HlPageLinkButton buttonTitle={'Back to login'} href="/login" />
        </div>
      )}
    </>
  );
}
