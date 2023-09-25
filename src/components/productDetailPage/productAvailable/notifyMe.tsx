import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Close from '@mui/icons-material/Close';
import HLTextField from '@Components/common/hlTextField';
import styles from '@Styles/productDetailPage/productAvailable/notifyMe.module.scss';
import { notifyMeMutation } from '@Lib/cms/notifyMe';
import { NotifyMeResponse } from '@Types/cms/notifyMe';
import { notifyMe } from '@Constants/productAvailablity';
import NotifyMeModal from '@Components/shared/notifyMeModal';
import { Ga4ItemReviewDataLayer } from 'src/interfaces/ga4DataLayer';
import { useSelector } from '@Redux/store';

const VALIDATE_EMAIL_FORMAT = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export default function NotifyMe(inventoryInfo): JSX.Element {
  const [emailFormatError, setEmailFormatError] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [emailName, setEmailName] = useState<string>('');
  const {
    heartBeatInfo: { isLoggedInUser, sessionId }
  } = useSelector((state) => state.auth) ?? {};

  const nonPdpPage = inventoryInfo.nonPdpPage;
  const selectedVariant = inventoryInfo.variantDetails;
  const productName = inventoryInfo?.productName;

  const validateEmail = (input: string) => {
    if (input) {
      const result = VALIDATE_EMAIL_FORMAT.test(input);
      setEmailFormatError(!result);
      return result;
    }
  };

  const handleInput = (e) => {
    const email = e.target.value;
    if (!email) {
      setEmailFormatError(false);
    }
    if (emailFormatError) {
      validateEmail(email);
    }
    setEmailName(email);
  };

  const handleNotifyMe = async (e) => {
    e.preventDefault();
    const isValidMail = validateEmail(emailName);
    if (!isValidMail) {
      setEmailFormatError(true);
      return;
    }

    const payload = { productCode: `${selectedVariant.key}`, emailAddress: emailName };

    const {
      notifyMe: { status, message }
    }: NotifyMeResponse = await notifyMeMutation(payload);

    if (status == 200) {
      setEmailName('');
      if (inventoryInfo?.closeNotifyMe) {
        inventoryInfo?.closeNotifyMe(true);
      } else {
        setShowSuccessModal(true);
      }

      if (window) {
        const gtmData: Ga4ItemReviewDataLayer = {
          anonymous_user_id: '',
          event: 'notify_when_in_stock',
          item_id: selectedVariant.sku,
          item_name: productName || '',
          user_id: ''
        };

        if (sessionId) {
          isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(gtmData);
      }
    } else if (status == 400) {
      console.log(status, message);
    } else {
      console.log(status, message);
    }
  };

  return (
    <>
      {nonPdpPage ? (
        <NotifyMeModal {...{ variantDetails: selectedVariant, productName }} />
      ) : (
        <section className={styles.notifyMe}>
          {showSuccessModal && (
            <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
              <div className={styles.notifyMeModal}>
                <div className={styles.notifyMeModalClose}>
                  <Close onClick={() => setShowSuccessModal(false)} />
                </div>
                <div className={styles.notifyMeModalContainer}>
                  <div className={styles.notifyMeModalContainerTitle}>We’ll be in touch soon!</div>
                  <div className={styles.notifyMeModalContainerText}>
                    Thank you! We will notify you when this item is back in stock. You can also
                    check your local store for availability.
                  </div>
                </div>
              </div>
            </Modal>
          )}
          <text className={styles.notifyMeText}>
            <b>{notifyMe.outOfStockMessage}</b> {notifyMe.inStockNotificationMessage}
          </text>
          <form onSubmit={handleNotifyMe} className={styles.notifyMeInputs}>
            <HLTextField
              labelName={'Email'}
              value={emailName}
              onChange={handleInput}
              error={emailFormatError}
            />
            <div aria-label="Submit Button" className={styles.notifyMeInputsSubmit}>
              <button type="submit">{notifyMe.emailNotifyButton}</button>
            </div>
          </form>
          <p>{emailFormatError ? 'Email format is incorrect!' : ''}</p>
        </section>
      )}
    </>
  );
}
