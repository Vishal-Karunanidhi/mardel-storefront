import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import AccountStyles from '@Styles/account/account.module.scss';
import { dialogLabels } from '@Constants/accountConstants';
import AccountBenefit from '@Components/account/accountBenefit';

export default function WelcomeUserModal(props: any): JSX.Element {
  const { isModalOpen, handleWelcomeModalClose } = props;

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleWelcomeModalClose}
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
        <CloseIcon className={AccountStyles.closeIconStyle} onClick={handleWelcomeModalClose} />
      </DialogTitle>
      <DialogTitle id="alert-dialog-title" className={AccountStyles.dialogTitleStyle}>
        {dialogLabels?.dialogTitle}
      </DialogTitle>
      <DialogContent>
        <div className={AccountStyles.dialogContentTitle}>{dialogLabels?.dialogContent}</div>
        <AccountBenefit wrapperProps={{ style: { flexDirection: 'column', gap: 20 } }} />
      </DialogContent>
    </Dialog>
  );
}
