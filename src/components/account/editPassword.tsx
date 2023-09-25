import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import HlButton from '@Components/common/button';
import HLTextField from '@Components/common/hlTextField';
import { updateUserPassword } from '@Lib/cms/accountpage';
import EditPasswordStyles from '@Styles/account/editPassword.module.scss';
import { base64Encode } from '@Lib/common/utility';
import { isValidPassword } from '@Components/common/accountValidator';

const defaultFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
};

export default function EditPassword(props: any): JSX.Element {
  const [editPwdFormValues, setEditPwdFormValues] = useState(defaultFormValues);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSuccessModel, setShowSuccessModel] = useState(false);

  const handleEditPasswordSaveChanges = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = editPwdFormValues;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setErrorMessage('Please make sure all form fields are filled out');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Your new password doesn't match");
    } else if (confirmNewPassword && !isValidPassword(confirmNewPassword)) {
      setErrorMessage(
        "Your new Password doesn't meet the requirements (minimum 8 characters, and include 1 upper and lowercase letter, number and special character)"
      );
    } else {
      const request = {
        password: base64Encode(currentPassword),
        newPassword: base64Encode(confirmNewPassword)
      };

      const { status, invalidParameters } = await updateUserPassword(request);
      if (status === 'SUCCESS') {
        setShowSuccessModel(true);
      } else if (invalidParameters) {
        const errorMessage: string = invalidParameters?.[0]?.message;
        if (errorMessage.includes('username')) {
          setErrorMessage('Your current password is incorrect');
        } else {
          setErrorMessage(errorMessage);
        }
      } else {
        setErrorMessage('Error occurred at our end, Try again later!');
      }
    }
  };

  const handleInputChange = (event, type) => {
    setEditPwdFormValues({
      ...editPwdFormValues,
      [type]: event?.target?.value
    });
  };

  const handleDialogClose = () => {
    setShowSuccessModel(false);
    props?.editCallBack();
  };

  const renderTextField = (type, label) => {
    return (
      <HLTextField
        labelName={label}
        textFieldValue={editPwdFormValues[type]}
        textFieldType={'password'}
        handleInputChange={(e) => handleInputChange(e, type)}
      />
    );
  };

  const renderErrorLabel = () => {
    return (
      <div className={EditPasswordStyles.errorWrapper}>
        <div className={EditPasswordStyles.errorInfoImage}>
          <img
            src={'/icons/account/infoIcon.svg'}
            alt="delete"
            width={24}
            height={24}
            aria-label="delete"
          />
        </div>
        <label className={EditPasswordStyles.passwordErrorLabel}>{errorMessage}</label>
      </div>
    );
  };

  const renderSuccessDialog = () => {
    return (
      <Dialog
        open={showSuccessModel}
        onClose={handleDialogClose}
        maxWidth={'md'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            borderRadius: '10px 10px 20px 20px'
          }
        }}
      >
        <DialogTitle className={EditPasswordStyles.successModalTitle}>
          <CloseIcon className={EditPasswordStyles.closeIconStyle} onClick={handleDialogClose} />
        </DialogTitle>
        <DialogContent>
          <div>
            <b>
              <h1>Your password has been successfully modified!</h1>
            </b>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <label className={EditPasswordStyles.editPasswordTitle}>Edit Login Password</label>
      <div className={EditPasswordStyles.editPasswordContainer}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={EditPasswordStyles.editPasswordSection}>
            <>
              {renderTextField('currentPassword', 'Current Password')}
              <div className={EditPasswordStyles.newPasswordSection}>
                <>
                  {renderTextField('newPassword', 'New Password')}
                  {renderTextField('confirmNewPassword', 'Confirm New Password')}
                </>
              </div>
              {errorMessage && renderErrorLabel()}
              <div className={EditPasswordStyles.buttonsSection}>
                <HlButton
                  type="button"
                  callbackMethod={() => props?.editCallBack()}
                  buttonTitle={'Cancel'}
                  parentDivClass={EditPasswordStyles.cancelWrapper}
                  buttonClass={EditPasswordStyles.cancelButton}
                />
                <HlButton
                  type="submit"
                  callbackMethod={handleEditPasswordSaveChanges}
                  buttonTitle={'Save changes'}
                  parentDivClass={EditPasswordStyles.submitWrapper}
                  buttonClass={EditPasswordStyles.submitButton}
                  // isDisabled={isSubmitButtonDisabled}
                />
              </div>
            </>
          </div>
        </form>
      </div>
      {renderSuccessDialog()}
    </>
  );
}
