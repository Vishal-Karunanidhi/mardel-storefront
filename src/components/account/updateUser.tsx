import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import HlButton from '@Components/common/button';
import HLTextField from '@Components/common/hlTextField';
import {
  isValidAccountEmail,
  isValidAccountPhone,
  isOnTypePhoneValid,
  cleanupPhoneNumber
} from '@Components/common/accountValidator';
import { useDispatch, useSelector } from '@Redux/store';
import { updateUser, getMyProfileDetails } from '@Lib/cms/accountpage';
import { titleCase } from '@Lib/common/utility';
import UpdateUserStyles from '@Styles/account/editPassword.module.scss';

export default function UpdateUser(props: any): JSX.Element {
  const dispatch = useDispatch();
  const [editFormValue, setEditFormValues] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showSuccessModel, setShowSuccessModel] = useState(false);
  const { myProfileInfo } = useSelector((state) => state.auth);
  const { currentView } = props;

  const sessionResponseHeader = process.env.NEXT_PUBLIC_SESSION_RESPONSE_HEADER;
  useEffect(() => {
    switch (currentView) {
      case 'EMAIL':
        setEditFormValues(myProfileInfo?.email ?? '');
        break;
      case 'PHONE':
        setEditFormValues(myProfileInfo.phone ?? '');
        break;
      default:
        setEditFormValues('');
        break;
    }
  }, [currentView, myProfileInfo]);
  const isValidUserData = (userValue) => {
    let isValid = true;
    switch (currentView) {
      case 'PHONE':
        isValid = !isValidAccountPhone(userValue);
        break;
      case 'EMAIL':
        isValid = !isValidAccountEmail(userValue);
        break;
      default:
        isValid = true;
        break;
    }
    return isValid;
  };

  async function getCustomerProfile() {
    const payload = await getMyProfileDetails();
    dispatch({
      type: 'UPDATE_MY_PROFILE',
      payload
    });
  }

  const handleEditUserSaveChanges = async () => {
    try {
      if (isValidUserData(editFormValue)) {
        if (currentView === 'EMAIL') {
          setErrorMessage('Please enter a valid email address (email@example.com)');
        } else if (currentView === 'PHONE') {
          setErrorMessage('Please enter a valid phone number (10 digits including area code)');
        }
      } else {
        const request = {
          ...(currentView === 'PHONE' && { phone: cleanupPhoneNumber(editFormValue) }),
          ...(currentView === 'EMAIL' && { newUserName: editFormValue })
        };

        const { status, invalidParameters } = await updateUser(request);
        if (status === 'SUCCESS') {
          getCustomerProfile();
          setShowSuccessModel(true);
          window.localStorage.removeItem(sessionResponseHeader);
        } else {
          const errorMessage: string = invalidParameters?.[0]?.message;
          setErrorMessage(errorMessage ?? 'Error occurred at our end, Try again later!');
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (event) => {
    if (currentView === 'PHONE' && !isOnTypePhoneValid(event?.target?.value)) {
      return;
    }
    setEditFormValues(event?.target?.value);
    setPasswordMismatch(false);
  };

  const handleDialogClose = () => {
    setShowSuccessModel(false);
    props?.editCallBack();
  };

  const renderTextField = (label) => {
    return (
      <HLTextField
        labelName={label}
        textFieldValue={editFormValue}
        textFieldType={currentView === 'EMAIL' ? 'email' : 'phone'}
        handleInputChange={(e) => handleInputChange(e)}
        error={!setErrorMessage}
      />
    );
  };

  const renderErrorLabel = () => {
    return (
      <div className={UpdateUserStyles.errorWrapper}>
        <div className={UpdateUserStyles.errorInfoImage}>
          <img src="icons/infoIcon.svg" alt="delete" width={24} height={24} aria-label="delete" />
        </div>
        <label className={UpdateUserStyles.passwordErrorLabel}>{errorMessage}</label>
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
        <DialogTitle className={UpdateUserStyles.successModalTitle}>
          <CloseIcon className={UpdateUserStyles.closeIconStyle} onClick={handleDialogClose} />
        </DialogTitle>
        <DialogContent>
          <div>
            <b>
              <h1>Your {titleCase(currentView)} has been successfully modified!</h1>
            </b>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <div className={UpdateUserStyles.editPasswordTitle}>Update User {titleCase(currentView)}</div>
      <div className={UpdateUserStyles.editPasswordContainer}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={UpdateUserStyles.editPasswordSection}>
            <>
              {renderTextField(currentView)}
              {!passwordMismatch && errorMessage && renderErrorLabel()}
              <div className={UpdateUserStyles.buttonsSection}>
                <HlButton
                  callbackMethod={() => props?.editCallBack()}
                  buttonTitle={'Cancel'}
                  parentDivClass={UpdateUserStyles.cancelWrapper}
                  buttonClass={UpdateUserStyles.cancelButton}
                  type="button"
                />
                <HlButton
                  callbackMethod={handleEditUserSaveChanges}
                  buttonTitle={'Save changes'}
                  parentDivClass={UpdateUserStyles.submitWrapper}
                  buttonClass={UpdateUserStyles.submitButton}
                  type="submit"
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
