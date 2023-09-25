import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import { getContentPage } from '@Lib/cms/contentPage';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import {
  ContentComponent,
  ContentPage,
  ContentPageBreadcrumb,
  ContentRichText,
  HolidayMessagesCardList,
  HolidayMessagesCard
} from '@Types/cms/schema/contentPage.schema';
import { imageLoader, imageURL, imageUrlQuery } from '@Lib/common/utility';
import { contentToBreadcrumb } from '@Lib/common/utility';
import MarkdownView from 'react-showdown';
import { GetServerSideProps } from 'next';
import styles from '@Styles/contentPage/holidayMessages.module.scss';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { FacebookShareButton, TwitterShareButton, PinterestShareButton } from 'react-share';

import { sendHolidayMessageEmail } from '@Lib/cms/email';
import HLTextField from '@Components/common/hlTextField';
import EmailStyles from '@Styles/account/forgotPassword.module.scss';
import { InputAdornment } from '@mui/material';
import { isValidEmail } from '@Components/common/accountValidator';
import HlButton from '@Components/common/button';
import { Ga4ShareDataLayer } from 'src/interfaces/ga4DataLayer';
import { useSelector } from '@Redux/store';

type ModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cardData: HolidayMessagesCard;
};

type HolidayCardProps = {
  card: HolidayMessagesCard;
  onShare: (card: HolidayMessagesCard) => void;
};

type HolidayMessagesProps = {
  breadcrumbs: ContentPageBreadcrumb;
  holidayMessagesCardList: HolidayMessagesCardList;
  richText: ContentRichText;
};

function Modal({ open, setOpen, cardData }: ModalProps) {
  const {
    heartBeatInfo: { isLoggedInUser, sessionId }
  } = useSelector((state) => state.auth) ?? {};

  const [senderName, setSenderName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [senderNameError, setSenderNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState({
    isEmailError: false
  });

  const [senderNameErrorMessage, setSenderNameErrorMessage] = useState<string>('');
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');

  const [emailResponseMessage, setEmailResponseMessage] = useState<string>('');
  const [emailReponseStatus, setEmailResponseStatus] = useState<number>(0);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [isSumbitButtonDisabled, setIsSubmitButtonDisabled] = useState<boolean>(false);

  const image: string = imageURL(
    cardData.holidayMessagesImage.defaultHost,
    cardData.holidayMessagesImage.endpoint,
    cardData.holidayMessagesImage.name
  );

  const placeholderPDF =
    'https://hobbylobbydev.a.bigcontent.io/v1/static/AlgoliaIntegrationOverview';

  const inputValidation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const emailHolidayMessage: () => void = async () => {
    const response = await sendHolidayMessageEmail({
      emailAddress: email,
      senderName: senderName,
      holidayMessage: cardData.title,
      deliveryKey: 'about-us/holiday-messages'
    });
    setEmailResponseMessage(response.sendHolidayEmail.Message);
    setEmailResponseStatus(response.sendHolidayEmail.Status);
    setSenderName('');
    setEmail('');
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (open) {
      setEmailResponseMessage('');
      setIsSubmitButtonDisabled(true);
    }
  }, [open]);

  const validEmail = isValidEmail;

  const validateFieldError = () => {
    const fieldValidity = {
      isEmailError: !!email && !validEmail(email)
    };
    setEmailError(fieldValidity);
  };

  const renderErrorInfoIcon = () => {
    return (
      <img src={'/icons/infoIcon.svg'} alt={'Delete'} width={24} height={24} aria-label="delete" />
    );
  };
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
        item_name: cardData.title,
        method: shareMethod,
        event: 'share',
        user_id: ''
      };

      if (sessionId) {
        isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
  }

  return (
    <Dialog
      className={styles.modal}
      PaperProps={{ style: { borderRadius: '10px 10px 20px 20px' } }}
      style={{ borderRadius: 0 }}
      maxWidth={false}
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onClose={() => setOpen(false)}
    >
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert severity={emailReponseStatus == 200 ? 'success' : 'error'} sx={{ width: '100%' }}>
          {emailResponseMessage}
        </MuiAlert>
      </Snackbar>

      <DialogContent style={{ padding: 0 }}>
        <div className={styles.modalClose}>
          <CloseIcon onClick={() => setOpen(false)} className={styles.modalCloseIcon} />
        </div>
        <div className={styles.modalContent}>
          <div className={styles.modalContentInfo}>
            <div className={styles.modalImageContainer}>
              <img
                className={styles.modalImage}
                alt={cardData.altText}
                src={imageURL(
                  cardData.holidayMessagesImage.defaultHost,
                  cardData.holidayMessagesImage.endpoint,
                  cardData.holidayMessagesImage.name
                )}
              />
            </div>
            <div className={styles.modalContentInfoDetails}>
              <DialogContentText className={styles.modalContentInfoDetailsTitle}>
                {cardData.title}
              </DialogContentText>
              <DialogContentText className={styles.modalContentInfoDetailsOccasionAndYear}>
                <span className={styles.modalContentInfoDetailsOccasion}>{cardData.occasion}</span>
                <span className={styles.modalContentInfoDetailsYear}>{cardData.year}</span>
              </DialogContentText>
              <button className={styles.modalContentInfoDetailsButton}>
                <a target="_blank" href={cardData.holidayMessagesPdf?.url} rel="noreferrer">
                  Download PDF
                </a>
              </button>
            </div>
          </div>
          <button className={styles.modalContentInfoDetailsButtonMobile}>
            <a target="_blank" href={cardData.holidayMessagesPdf?.url} rel="noreferrer">
              Download PDF
            </a>
          </button>
          <form onSubmit={(e) => inputValidation(e)} className={styles.modalContentForm}>
            <h3 className={styles.modalContentFormHeader}>Send this message to a friend!</h3>
            <div className={styles.spacing}></div>
            <HLTextField
              textFieldValue={senderName}
              textFieldType="text"
              labelName="Sender's name"
              handleInputChange={(e) => setSenderName(e.target.value)}
            />
            <div className={styles.spacing}></div>
            <HLTextField
              textFieldValue={email}
              textFieldType="email"
              labelName="Recipient's email address"
              handleInputChange={(e) => setEmail(e.target.value)}
              additionalClassName={emailError.isEmailError ? EmailStyles.errorInput : ''}
              error={emailError.isEmailError}
              helperText={emailError.isEmailError ? 'Invalid email format!' : ''}
              InputProps={{
                endAdornment: (
                  <span className={styles.invalidEmailLogo}>
                    <InputAdornment position="end">
                      {emailError.isEmailError ? renderErrorInfoIcon() : <></>}
                    </InputAdornment>
                  </span>
                )
              }}
              onBlur={validateFieldError}
            />
            <HlButton
              buttonTitle="Send Email"
              isDisabled={!validEmail(email) && isSumbitButtonDisabled}
              callbackMethod={emailHolidayMessage}
            />
          </form>
          <hr className={styles.modalContentRule} />
          <h3 className={styles.modalContentFormHeader}>Share it!</h3>
          <div className={styles.modalIconContainer}>
            <PinterestShareButton
              url={'http://www.camperstribe.com'}
              media={placeholderPDF}
              description={cardData.title}
              onClick={shareEventHandler}
            >
              <div className={styles.socialIcon}>
                <img alt="Pinterest logo" src={imageLoader('/images/social/Pinterest.png')} />
              </div>
            </PinterestShareButton>
            <FacebookShareButton
              url={placeholderPDF}
              quote={cardData.title}
              hashtag="#holidaymessage"
              onClick={shareEventHandler}
            >
              <div className={styles.socialIcon}>
                <img alt="Facebook logo" src={imageLoader('/images/social/Facebook.png')} />
              </div>
            </FacebookShareButton>
            <TwitterShareButton
              url={placeholderPDF}
              hashtags={['#holidaymessage']}
              onClick={shareEventHandler}
            >
              <div className={styles.socialIcon}>
                <img alt="Twitter logo" src={imageLoader('/images/social/Twitter.png')} />
              </div>
            </TwitterShareButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HolidayCard({ card, onShare }: HolidayCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardImageContainer}>
        <img
          className={styles.cardImage}
          alt={card.altText}
          src={imageUrlQuery(
            imageURL(
              card.holidayMessagesImage.defaultHost,
              card.holidayMessagesImage.endpoint,
              card.holidayMessagesImage.name
            ),
            350,
            350
          )}
          onClick={() => onShare(card)}
        />
      </div>
      <div className={styles.cardDetails}>
        <div className={styles.cardTitle}>{card.title}</div>
        <div className={styles.cardOccasionAndYear}>
          <span className={styles.cardOccasion}>{card.occasion}</span>
          <span className={styles.cardYear}>{card.year}</span>
        </div>
        <button onClick={() => onShare(card)} className={styles.cardButton}>
          Share
        </button>
      </div>
    </div>
  );
}

export default function HolidayMessages({
  breadcrumbs,
  holidayMessagesCardList,
  richText
}: HolidayMessagesProps) {
  const [sort, setSort] = useState<string>('Newest');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<HolidayMessagesCard>();

  const onShare = (cardData: HolidayMessagesCard) => {
    setSelectedCard(cardData);
    setOpenModal(true);
  };

  const reverseCardList = () => {
    holidayMessagesCardList.cardList.reverse();
  };

  return (
    <div className={styles.holidayMessagesPage}>
      <Breadcrumb breadCrumbs={contentToBreadcrumb(breadcrumbs)} />
      <div className={styles.holidayMessagesContent}>
        <MarkdownView className={styles.richText} markdown={richText.richText} />
        <hr className={styles.horizontalRule} />
        <div className={styles.titleAndDropdown}>
          <h2 className={styles.title}>{holidayMessagesCardList.title}</h2>
          <div className={styles.dropdown}>
            <Select
              id="sort-selector"
              value={sort}
              onChange={(e) => {
                if (e.target.value != sort) {
                  setSort(e.target.value);
                  reverseCardList();
                }
              }}
              style={{ height: '45px' }}
            >
              <MenuItem className={styles.menuItem} value="Newest">
                Newest
              </MenuItem>
              <MenuItem className={styles.menuItem} value="Oldest">
                Oldest
              </MenuItem>
            </Select>
          </div>
        </div>

        {selectedCard && <Modal open={openModal} setOpen={setOpenModal} cardData={selectedCard} />}

        <div className={styles.cardContainer}>
          {holidayMessagesCardList.cardList.map((card, i: number) => {
            return <HolidayCard card={card} key={i} onShare={onShare} />;
          })}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { contentPage }: { contentPage: ContentPage } = await getContentPage(
    'about-us/holiday-messages'
  );
  let breadcrumbs: ContentPageBreadcrumb = null;
  let holidayMessagesCardList: HolidayMessagesCardList = null;
  let richText = null;

  contentPage.content.forEach((contentComponent: ContentComponent) => {
    switch (contentComponent.__typename) {
      case 'ContentPageBreadcrumb':
        breadcrumbs = contentComponent;
        break;
      case 'HolidayMessagesCardList':
        holidayMessagesCardList = contentComponent;
        break;
      case 'ContentRichText':
        richText = contentComponent;
        break;
      default:
        break;
    }
  });
  return {
    props: {
      breadcrumbs,
      holidayMessagesCardList,
      richText
    }
  };
};
