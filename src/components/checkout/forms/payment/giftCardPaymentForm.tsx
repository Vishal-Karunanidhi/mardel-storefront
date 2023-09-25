import { useState, useEffect } from 'react';
import { useSelector } from '@Redux/store';
import HLTextField from '@Components/common/hlTextField';
import HlButton from '@Components/common/button';
import HLCheckbox from '@Components/common/hlCheckBox';
import { giftCardLabels } from '@Constants/checkoutConstants';
import { addGcPaymentToCart, deletePaymentFromCart } from '@Lib/cms/cartpage';
import { getGiftCardsFromSession, fixForItemPricesWithoutChange } from '@Lib/common/utility';
import GcPaymentStyles from '@Styles/checkout/giftCardPayment.module.scss';
import GcStyles from '@Styles/my-account/giftCardLookup.module.scss';

const defaultFormValue = {
  cardNumber: '',
  pinNumber: ''
};
let errorMessage = 'Error with GiftCard. Please check your details or try again later';

const ViewGiftCardPaymentForm = () => {
  const { cartDeatilsFromRedux } = useSelector((state) => state.checkout);

  const cartGiftCardPayment =
    cartDeatilsFromRedux?.paymentDetails?.paymentClassification?.['giftCard'] ?? [];
  const isGcAlreadyAdded = !!cartGiftCardPayment?.length;
  const isMaxGCAdded = cartGiftCardPayment?.length > 2;

  if (!isGcAlreadyAdded) {
    return <></>;
  }

  return (
    <>
      {isMaxGCAdded && <label>{giftCardLabels?.maxGcAdded}</label>}
      <div className={GcPaymentStyles.viewGCPayment}>
        {cartGiftCardPayment?.map((e) => (
          <span className={GcPaymentStyles.viewGCPayment}>
            <span>Gift card *{e.last4digits}</span>
            <span className={GcPaymentStyles.amountSpan}>
              {fixForItemPricesWithoutChange(e?.amount)}{' '}
            </span>
          </span>
        ))}
      </div>
    </>
  );
};

export default function GiftCardPaymentForm(props: any): JSX.Element {
  const { cartDeatilsFromRedux } = useSelector((state) => state.checkout);

  const cartTotalPrice = cartDeatilsFromRedux?.orderSummary?.totalPrice ?? 0;
  const cartGiftCardPayment =
    cartDeatilsFromRedux?.paymentDetails?.paymentClassification?.['giftCard'] ?? [];
  const gcPaymentAddedSoFar = cartGiftCardPayment.reduce(
    (acc, currVal) => acc + currVal?.amount,
    0
  );

  const isGcAlreadyAdded = !!cartGiftCardPayment?.length;
  const isMaxGCAdded = gcPaymentAddedSoFar === cartTotalPrice || cartGiftCardPayment?.length > 2;

  const [isValidForm, setIsValidForm] = useState(false);
  const [gcAddError, setGcAddError] = useState(false);
  const [showAddOnGcForm, setShowAddOnGcForm] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [giftCardFormValue, setGiftCardFormValue] = useState(defaultFormValue);
  const [isGiftCardChecked, setIsGiftCardChecked] = useState(isGcAlreadyAdded);

  useEffect(() => {
    let isValid =
      giftCardLabels?.inputFields.filter((e) => !giftCardFormValue[e.key]).length === 0 &&
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

  const handleGcPaymentAddition = async () => {
    setGcAddError(false);
    setIsSubmitDisabled(true);
    const { cardNumber, pinNumber } = giftCardFormValue;
    const {
      data: gcResponse,
      isError,
      bffErrorMessage
    } = await addGcPaymentToCart(cardNumber, pinNumber);

    if (isError) {
      errorMessage = bffErrorMessage;
      setGcAddError(true);
    } else {
      const existingGiftCards = getGiftCardsFromSession();
      const updatedGiftCards = [...existingGiftCards, giftCardFormValue];

      sessionStorage.removeItem('giftCards');
      sessionStorage.setItem('giftCards', JSON.stringify(updatedGiftCards));

      props.updateCheckoutFormUpdateClean(gcResponse, '', true);
    }
    setIsSubmitDisabled(false);
  };

  const handleGCRemovalFromCart = async (paymentId) => {
    setGcAddError(false);
    const gcResponse = await deletePaymentFromCart(paymentId);
    if (!gcResponse) {
      setGcAddError(true);
    } else {
      props.updateCheckoutFormUpdateClean(gcResponse, '', true);
    }
  };

  const onCheckBoxChange = (e) => {
    setIsGiftCardChecked(e.target.checked);
  };

  const handleAddAnotherGc = () => {
    setShowAddOnGcForm(isGiftCardChecked && true);
  };

  return (
    <>
      {cartDeatilsFromRedux?.displayGiftCardPayment && (
        <div className={GcPaymentStyles.editGcPayment}>
          <HLCheckbox
            disabled={isGcAlreadyAdded}
            isChecked={isGiftCardChecked}
            handleCheckBoxChange={onCheckBoxChange}
            checkBoxLabel={giftCardLabels?.giftcard}
          />

          {isMaxGCAdded && <label>{giftCardLabels?.maxGcAdded}</label>}

          {cartGiftCardPayment?.map((e) => (
            <span className={GcPaymentStyles.gcAlreadyAdded}>
              <span>Gift card *{e.last4digits}</span>
              <span>
                {fixForItemPricesWithoutChange(e?.amount)}
                <button className={GcPaymentStyles.deleteButton}>
                  <img
                    alt="Delete"
                    aria-hidden="true"
                    width={20}
                    height={20}
                    src="/icons/deleteIcon.svg"
                    onClick={() => handleGCRemovalFromCart(e.paymentId)}
                  />
                </button>
              </span>
            </span>
          ))}

          {/*OnlyOneGC allowed per Checkout - Restrict the component rendering to avoid any regression defects(launch) incase we need to revert back
          remove the false &&*/}
          {false && isGiftCardChecked && isGcAlreadyAdded && !showAddOnGcForm && !isMaxGCAdded && (
            <span className={GcPaymentStyles.addAnotherGc}>
              <HlButton buttonTitle={giftCardLabels.newGc} callbackMethod={handleAddAnotherGc} />
            </span>
          )}

          {gcAddError && <span className={GcPaymentStyles.errorMsg}>{errorMessage}</span>}

          {(showAddOnGcForm || (isGiftCardChecked && !isGcAlreadyAdded)) && (
            <>
              <span className={`${GcStyles.gcInputBox} ${GcPaymentStyles.gcInputFields}`}>
                {giftCardLabels?.inputFields?.map((e) => (
                  <HLTextField
                    key={e.key}
                    labelName={e.label}
                    textFieldValue={giftCardFormValue[e.key]}
                    handleInputChange={(event) => handleInputChange(event, e.key)}
                  />
                ))}
              </span>

              <span className={GcPaymentStyles.applyGCButton}>
                <HlButton
                  buttonTitle={giftCardLabels?.cta}
                  callbackMethod={handleGcPaymentAddition}
                  isDisabled={!isValidForm || isSubmitDisabled}
                />
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
}

export { ViewGiftCardPaymentForm };
