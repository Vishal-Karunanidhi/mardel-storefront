import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import AccountStyles from '@Styles/account/account.module.scss';

const successLabelConstants = {
  title: 'Your address has been successfully added to your profile.'
};

export default function AddressUpdateSuccessModal(props: any): JSX.Element {
  const { isModalOpen, handleSuccessModalClose } = props;

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleSuccessModalClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={'xs'}
      PaperProps={{
        style: {
          borderRadius: '20px'
        }
      }}
    >
      <DialogTitle className={AccountStyles.signUpModalTitle}>
        <CloseIcon className={AccountStyles.closeIconStyle} onClick={handleSuccessModalClose} />
      </DialogTitle>
      <DialogTitle id="alert-dialog-title" className={AccountStyles.dialogTitleStyle}>
        {successLabelConstants?.title}
      </DialogTitle>
      <br />
    </Dialog>
  );
}
