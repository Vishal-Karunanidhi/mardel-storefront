import Modal from '@mui/material/Modal';
import Close from '@mui/icons-material/Close';
import styles from '@Styles/productDetailPage/productAvailable/notifyMe.module.scss';

const NOTIFY_SUCCESS_TITLE = 'We’ll be in touch soon!';
const NOTIFY_SUCCESS_DESCRIPTION = `Thank you! We will notify you when this item is back in stock. You can also check your
local store for availability.`;

export default function NotifySuccessModal(props): JSX.Element {
  const { showSuccessModal, closeSuccessModal } = props;

  return (
    <Modal open={showSuccessModal} onClose={closeSuccessModal}>
      <div className={styles.notifyMeModal}>
        <div className={styles.notifyMeModalClose}>
          <Close onClick={closeSuccessModal} />
        </div>
        <div className={styles.notifyMeModalContainer}>
          <div className={styles.notifyMeModalContainerTitle}>{NOTIFY_SUCCESS_TITLE}</div>
          <div className={styles.notifyMeModalContainerText}>{NOTIFY_SUCCESS_DESCRIPTION}</div>
        </div>
      </div>
    </Modal>
  );
}
