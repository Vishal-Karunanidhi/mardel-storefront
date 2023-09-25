import { Dialog, DialogContent } from '@mui/material';
import styles from '@Styles/account/lists.module.scss';
import { Close } from '@mui/icons-material';

export default function DeleteListModal({
  open,
  handleOpen,
  handleClose,
  handleDelete,
  title = '',
  description = '',
  deleteButtonTitle = ''
}) {
  return (
    <Dialog
      PaperProps={{
        style: { borderRadius: '10px 10px 20px 20px' }
      }}
      open={open}
      onClose={handleClose}
    >
      <DialogContent className={styles.deleteModal}>
        <div className={styles.deleteModalTop}>
          <Close onClick={handleClose} className={styles.deleteModalTopClose} />
        </div>
        <div className={styles.deleteModalContent}>
          <h2 className={styles.deleteModalContentHeader}>{title}</h2>
          <p className={styles.deleteModalContentText}>{description}</p>
          <button onClick={handleDelete} className={styles.deleteModalContentDelete}>
            {deleteButtonTitle}
          </button>
          <button onClick={handleClose} className={styles.deleteModalContentCancel}>
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
