import { useState, useEffect } from 'react';
import { getShoppingListUrl, shareShoppingList } from '@Lib/cms/shoppingList';
import HLTextField from '@Components/common/hlTextField';
import { Dialog, DialogContent } from '@mui/material';
import styles from '@Styles/account/lists.module.scss';
import { Close } from '@mui/icons-material';
import { FacebookShareButton, PinterestShareButton, TwitterShareButton } from 'react-share';
import { useDispatch } from '@Redux/store';
import { imageLoader } from '@Lib/common/utility';

export default function ShareListModal({
  open,
  handleOpen,
  handleClose,
  origin,
  listData = null,
  listId,
  myProfileInfo
}) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [sharedListUrl, setSharedListUrl] = useState<string>('');
  const dispatch = useDispatch();

  const handleShare = async (email: string) => {
    const response = await shareShoppingList({
      firstName: myProfileInfo?.firstName || '',
      lastName: myProfileInfo?.lastName || '',
      sharedUrl: `${origin}/wishlist/view-shared/${sharedListUrl}`,
      senderName: myProfileInfo?.firstName || '',
      email
    });
    const isSuccess = response?.Status === 200;
    dispatch({
      type: 'UPDATE_SNACKBAR_WITH_DATA',
      payload: {
        open: true,
        message: `${isSuccess ? 'List shared successfully' : 'List failed to be shared'}`,
        severity: isSuccess ? 'success' : 'error'
      }
    });
  };

  const getListUrl = async () => {
    const { sharedListUrl } = await getShoppingListUrl(listId.toString());
    setSharedListUrl(sharedListUrl);
  };

  useEffect(() => {
    if (listId && open) {
      getListUrl();
    }
  }, [listId, open]);

  const Form = () => {
    const [email, setEmail] = useState('');
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleShare(email);
        }}
      >
        <div className={styles.shareModalInput}>
          <HLTextField
            labelName="email"
            textFieldValue={email}
            handleInputChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className={styles.shareModalButton} type="submit">
          Share list
        </button>
      </form>
    );
  };

  const Icons = () => {
    return (
      <div className={styles.shareModalIconContainer}>
        <PinterestShareButton
          url={`${origin}/wishlist/view-shared/${sharedListUrl}`}
          media={`${origin}/wishlist/view-shared/${sharedListUrl}`}
          description="wishlist"
        >
          <div className={styles.shareModalIcon}>
            <img alt="Pinterest logo" src={imageLoader('/images/social/Pinterest.png')} />
          </div>
        </PinterestShareButton>
        <FacebookShareButton
          url={`${origin}/wishlist/view-shared/${sharedListUrl}`}
          quote=""
          hashtag="#wishlist"
        >
          <div className={styles.shareModalIcon}>
            <img
              alt="Facebook logo"
              className={styles.socialIcon}
              src={imageLoader('/images/social/Facebook.png')}
            />
          </div>
        </FacebookShareButton>
        <TwitterShareButton
          url={`${origin}/wishlist/view-shared/${sharedListUrl}`}
          hashtags={['#wishlist']}
        >
          <div className={styles.shareModalIcon}>
            <img
              alt="Twitter logo"
              className={styles.socialIcon}
              src={imageLoader('/images/social/Twitter.png')}
            />
          </div>
        </TwitterShareButton>
        <div className={styles.shareModalIcon} onClick={() => setShowForm(!showForm)}>
          <img alt="Email Share Button" src={imageLoader('/images/social/Email.png')} />
        </div>
      </div>
    );
  };

  return (
    <Dialog
      PaperProps={{
        style: { borderRadius: '10px 10px 20px 20px' }
      }}
      open={open}
      onClose={handleClose}
    >
      <DialogContent className={styles.shareModal}>
        <div className={styles.deleteModalTop}>
          <Close onClick={handleClose} className={styles.deleteModalTopClose} />
        </div>
        <div className={styles.deleteModalContent}>
          <h3 className={styles.shareModalHeader}>Share your list!</h3>
          {showForm && <Form />}
          <Icons />
        </div>
      </DialogContent>
    </Dialog>
  );
}
