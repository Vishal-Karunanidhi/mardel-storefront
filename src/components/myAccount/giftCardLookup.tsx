import { useEffect, useRef, useState } from 'react';
import HlButton from '@Components/common/button';
import HLTextField from '@Components/common/hlTextField';
import { getGcLookUpContent } from '@Lib/cms/plp';
import { useDispatch, useSelector } from '@Redux/store';
import GiftCardBalance from '@Components/myAccount/giftCardBalance';
import { getGiftCardBalanceTransaction } from '@Lib/cms/myAccountPage';
import GcStyles from '@Styles/my-account/giftCardLookup.module.scss';

const GiftCardlabels = [
  {
    key: 'cardNumber',
    label: 'Gift Card Number'
  },
  {
    key: 'pinNumber',
    label: 'Gift Card PIN'
  }
];

const defaultFormValue = {
  cardNumber: '',
  pinNumber: '',
  showHistory: true
};

let giftCardTransactionDetails = { error: false };

export default function GiftCardLookup(props: any): JSX.Element {
  const fieldRefs = {};
  const { isGcPage = false } = props;
  GiftCardlabels.forEach((e) => {
    fieldRefs[e.key] = useRef(null);
  });
  const [isValidForm, setIsValidForm] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [showGiftCardBalance, setShowGiftCardBalance] = useState(false);
  const [giftCardFormValue, setGiftCardFormValue] = useState(defaultFormValue);
  const [isGiftCardError, setIsGiftCardError] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    async function getGclookUpCmsData() {
      try {
        const giftCardData = await getGcLookUpContent();
        if (giftCardData) {
          dispatch({
            type: 'GET_GC_LOOKUP_CMS_DATA',
            payload: giftCardData
          });
        }
      } catch (error) {}
    }
    getGclookUpCmsData();
  }, []);

  useEffect(() => {
    let isValid =
      GiftCardlabels.filter((e) => !giftCardFormValue[e.key]).length === 0 &&
      giftCardFormValue.cardNumber?.length === 17 &&
      giftCardFormValue.pinNumber?.length === 8;

    setIsValidForm(isValid);
  }, [giftCardFormValue]);

  const handleInputChange = (event, type) => {
    const { value } = event?.target;

    if (type === 'cardNumber' && (value.length > 17 || isNaN(value))) {
      return;
    }
    if (type === 'pinNumber' && value.length > 8) {
      return;
    }
    setGiftCardFormValue({
      ...giftCardFormValue,
      [type]: value
    });
  };

  const handleFetchGiftCardBalance = async () => {
    dispatch({
      type: 'LOAD_SPINNER',
      payload: {
        isVisible: true,
        className: '',
        isInitialLoading: false,
        isMenuClicked: false
      }
    });
    setIsSubmitDisabled(true);
    giftCardTransactionDetails = await getGiftCardBalanceTransaction(giftCardFormValue);
    if (giftCardTransactionDetails.error) {
      setIsGiftCardError(true);
      setGiftCardFormValue(defaultFormValue);
    } else {
      setIsGiftCardError(false);
      setShowGiftCardBalance(true);
    }
    setIsSubmitDisabled(false);
    dispatch({
      type: 'LOAD_SPINNER',
      payload: {
        isVisible: false,
        className: '',
        isInitialLoading: false,
        isMenuClicked: false
      }
    });
  };

  return (
    <>
      {!showGiftCardBalance && <div>{props.children}</div>}
      {showGiftCardBalance ? (
        <GiftCardBalance
          {...giftCardTransactionDetails}
          cardNumber={giftCardFormValue.cardNumber}
          closeBalanceCheck={() => {
            setShowGiftCardBalance(false);
            setGiftCardFormValue({ ...defaultFormValue });
          }}
        />
      ) : (
        <div className={GcStyles.parentGcWrapper}>
          <label className={GcStyles.gclookUpTitle}>Gift Card Lookup</label>
          {isGiftCardError && (
            <div className={GcStyles.errorSection}>
              <img
                src={'/icons/infoIcon.svg'}
                alt={'Delete'}
                width={24}
                height={24}
                aria-label="delete"
              />
              <label>Gift Card not found!</label>
            </div>
          )}
          <br />
          <div className={GcStyles.inputFields}>
            {isGcPage && (
              <>
                <img
                  src={'/icons/account/giftCard.svg'}
                  alt="Gift Cards"
                  className={GcStyles.gcImage}
                  width={628}
                  height={400}
                  aria-label="Gift Cards"
                />
              </>
            )}
            <span className={GcStyles.gcInputBox}>
              {GiftCardlabels.map((e) => (
                <HLTextField
                  ref={fieldRefs[e.key]}
                  key={e.key}
                  labelName={e.label}
                  textFieldValue={giftCardFormValue[e.key]}
                  handleInputChange={(event) => handleInputChange(event, e.key)}
                />
              ))}
            </span>
          </div>
          <HlButton
            buttonTitle={isGcPage ? 'Check balance' : 'Look up card balance'}
            isDisabled={!isValidForm || isSubmitDisabled}
            callbackMethod={handleFetchGiftCardBalance}
            openInNewTab={false}
          />
        </div>
      )}
    </>
  );
}
