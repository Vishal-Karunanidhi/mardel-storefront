import { Dialog, DialogContent } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from '@Styles/components/common/shareButton.module.scss';
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
  EmailShareButton
} from 'react-share';
import { Close, ContentCopy, Share, CheckCircleOutline } from '@mui/icons-material';
import { Ga4ShareDataLayer } from 'src/interfaces/ga4DataLayer';
import { imageLoader } from '@Lib/common/utility';
import { useSelector } from '@Redux/store';

type ModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  shareType: 'Store' | 'Product';
  header: string;
  subHeader?: string;
  productSku?: string;
};

function ShareModal({
  open,
  setOpen,
  header,
  subHeader,
  shareType,
  productSku
}: ModalProps): JSX.Element {
  const [url, setUrl] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const {
    heartBeatInfo: { isLoggedInUser, sessionId }
  } = useSelector((state) => state.auth) ?? {};

  useEffect(() => {
    if (window) {
      setUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    setSnackbarOpen(false);
  }, [open]);

  function shareEventHandler(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    link: string
  ): void {
    if (window) {
      let shareMethod: string = 'unknown';

      // TODO: optimize; may want a static list of known share methods
      if (link.includes('facebook.com')) {
        shareMethod = 'facebook';
      } else if (link.includes('pinterest.com')) {
        shareMethod = 'pinterest';
      } else if (link.includes('twitter.com')) {
        shareMethod = 'x (formerly twitter)';
      } else if (link.includes('mailto:')) {
        shareMethod = 'email';
      }

      const gtmData: Ga4ShareDataLayer = {
        anonymous_user_id: '',
        content_name: '',
        item_id: '',
        item_name: '',
        method: shareMethod,
        event: 'share',
        user_id: ''
      };

      if (shareType === 'Product') {
        gtmData.item_id = productSku;
        gtmData.item_name = header;
      } else {
        gtmData.content_name = header;
      }

      if (sessionId) {
        isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
  }

  return (
    <Dialog
      PaperProps={{ style: { borderRadius: '10px 10px 20px 20px' } }}
      onClose={() => {
        setOpen(false);
      }}
      open={open}
    >
      <DialogContent className={styles.modal}>
        <div className={styles.modalClose}>
          <Close onClick={() => setOpen(false)} className={styles.modalCloseIcon} />
        </div>
        <div className={styles.modalShareStore}>
          <h1 className={styles.modalShareStoreHeader}>{`Share ${shareType}`}</h1>
          <div className={styles.modalShareStoreName}>
            <div className={styles.modalShareStoreNameImage}>
              <img
                alt="Hobby Lobby Avatar Icon"
                style={{ borderRadius: '100%' }}
                src={imageLoader('/images/social/Hobby.png')}
              />
            </div>
            <div className={styles.modalShareStoreNameText}>
              <span>{header}</span>
              <span>{subHeader}</span>
            </div>
          </div>
          <div className={styles.modalShareStoreLinkContainer}>
            <div className={styles.modalShareStoreLinkContainerRow}>
              <div className={styles.modalShareStoreLink}>{url}</div>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  setSnackbarOpen(true);
                }}
                className={styles.modalShareStoreCopy}
              >
                <ContentCopy fontSize="small" /> <span>Copy link</span>
              </div>
            </div>
            {snackbarOpen && (
              <div className={styles.modalShareStoreLinkMessage}>
                <CheckCircleOutline />
                <span className={styles.modalShareStoreLinkMessageText}>
                  Link copied to clipboard
                </span>
              </div>
            )}
          </div>
          <div className={styles.modalShareStoreSocialMedia}>
            <FacebookShareButton
              hashtag="#HobbyLobby"
              onClick={shareEventHandler}
              quote={'Hobby Lobby Store'}
              url={url}
            >
              <div className={styles.modalShareStoreSocialMediaIcon}>
                <img alt="Facebook Share Button" src={imageLoader('/images/social/Facebook.png')} />
              </div>
            </FacebookShareButton>
            <PinterestShareButton
              description={'Hobby Lobby Store'}
              media={url}
              onClick={shareEventHandler}
              url={url}
            >
              <div className={styles.modalShareStoreSocialMediaIcon}>
                <img
                  alt="Pinterest Share Button"
                  src={imageLoader('/images/social/Pinterest.png')}
                />
              </div>
            </PinterestShareButton>
            <TwitterShareButton url={url} hashtags={['#HobbyLobby']} onClick={shareEventHandler}>
              <div className={styles.modalShareStoreSocialMediaIcon}>
                <img alt="Twitter Share Button" src={imageLoader('/images/social/Twitter.png')} />
              </div>
            </TwitterShareButton>
            <EmailShareButton url={url} beforeOnClick={() => shareEventHandler(null, 'mailto:')}>
              <div className={styles.modalShareStoreSocialMediaIcon}>
                <img alt="Email Share Button" src={imageLoader('/images/social/Email.png')} />
              </div>
            </EmailShareButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Provides a ShareButton with modal functionality. All parameters will be displayed to the user on the modal.
 * @param shareType - Label that indicates what you are sharing.
 * If you are placing the button in on new page; you may need to add a new type to the shareType.
 * @param header - The title of the item that you are sharing.
 * @param subHeader - The additional details for the item shared. Optional parameter.
 * @returns - A ShareButton with modal functionality
 */

type ButtonProps = {
  shareType: 'Store' | 'Product';
  header: string;
  subHeader?: string;
  className?: string;
  dataTestId?: string;
  productSku?: string;
};

export default function ShareButton({
  shareType,
  header,
  subHeader,
  className,
  dataTestId,
  productSku
}: ButtonProps): JSX.Element {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      <button
        className={className || styles.shareButton}
        data-testid={dataTestId}
        onClick={() => setOpenModal(true)}
      >
        Share <Share fontSize="small" />
      </button>
      <ShareModal
        open={openModal}
        setOpen={setOpenModal}
        shareType={shareType}
        header={header}
        subHeader={subHeader}
        productSku={productSku}
      />
    </>
  );
}
