import { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import HlButton from '@Components/common/button';
import NotifySuccessModal from '@Components/productDetailPage/productAvailable/notifySuccessModal';
import NotifyMe from '@Components/productDetailPage/productAvailable/notifyMe';

import { InventoryInfo } from '@Types/cms/schema/pdp/pdpContent.schema';
import CategoryStyles from '@Styles/plp/categoryListingPages.module.scss';
import { handleProductSelectListItemEvent } from '@Lib/common/utility';
import { useSelector } from '@Redux/store';

const NOTIFY_ME = 'Notify Me';

export default function NotifyMeModal(props: any): JSX.Element {
  const { variantDetails, productName, ga4EcommItem, listName } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const {
    heartBeatInfo: { sessionId, isLoggedInUser }
  } = useSelector((state) => state.auth);

  const actionButtonProps: InventoryInfo = {
    nonPdpPage: false,
    emailNotifyButton: 'Notify me',
    emailPlaceholder: 'Email address',
    inStockNotificationMessage: 'Send me an email when this product is back in stock.',
    outOfStockMessage: 'This product is out of stock.',
    variantDetails,
    productName
  };

  return (
    <>
      <HlButton
        isDisabled={false}
        buttonTitle={NOTIFY_ME}
        callbackMethod={() => {
          setIsModalOpen(true);
          handleProductSelectListItemEvent(ga4EcommItem, listName, sessionId, isLoggedInUser);
        }}
        dataTestId={'featured-items-notify-me'}
      />
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          className: CategoryStyles.notifyMedialog
        }}
      >
        <DialogTitle className={CategoryStyles.modalTitle}>
          <CloseIcon className={CategoryStyles.closeIcon} onClick={() => setIsModalOpen(false)} />
        </DialogTitle>
        <DialogContent>
          <NotifyMe
            closeNotifyMe={(val) => {
              setIsModalOpen(false);
              setShowSuccessModal(val);
            }}
            {...actionButtonProps}
          />
        </DialogContent>
      </Dialog>

      <NotifySuccessModal
        showSuccessModal={showSuccessModal}
        closeSuccessModal={() => setShowSuccessModal(false)}
      />
    </>
  );
}
