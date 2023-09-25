import { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import { useSelector } from '@Redux/store';
import Spinner from '@Components/common/spinner';
import { getCyberSourcePublicKey } from '@Lib/cms/checkoutPage';
import CheckoutStyles from '@Styles/checkout/checkoutPage.module.scss';
import ShippingStyles from '@Styles/checkout/shippingAddress.module.scss';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';

import { billingAddressFormFieldLabels } from '@Constants/checkoutConstants';
import { paymentOptionFormFieldLabels } from '@Constants/checkoutConstants';

export default function EditPaymentForm(props: any): JSX.Element {
  const { flexTokenError, setSubmitDisabled, microFormCallBack, setCardType } = props;
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);

  const defaultFormValues = {
    cardHolderName: '',
    cardNumber: '',
    month: '',
    year: '',
    cvv: ''
  };

  const defaultFieldErrorStates = {
    cardHolderName: false,
    cardNumber: false,
    month: false,
    year: false,
    cvv: false
  };

  const {
    heartBeatInfo: { isLoggedInUser }
  } = useSelector((state) => state.auth);

  const [windowWidth, setWindowWidth] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);

  const [publicKeyToken, setPublicKeyToken] = useState(null);
  const [paymentFormValues, setPaymentFormValues] = useState(defaultFormValues);
  const [errorFields, setErrorFields] = useState(defaultFieldErrorStates);

  const [cardLabelShrink, setCardLabelShrink] = useState(false);
  const [securityLabelShrink, setSecurityLabelShrink] = useState(false);

  const [cardNumberForm, setCardNumberForm] = useState(null);
  const [securityCodeForm, setSecurityCodeForm] = useState(null);

  const [open, setOpen] = useState(false);
  const [flexErrorMessage, setFlexErrorMessage] = useState();

  const cardInputRef = useRef({ empty: true, valid: false, data: '' });
  const securityInputRef = useRef({ empty: true, valid: false, data: '' });
  const { currentResolution } = useSelector((state) => state.layout);

  const mobile = 700;
  const isMobile = windowWidth < mobile || screenWidth < mobile;

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
      setScreenWidth(window.screen.width);
    });
    setWindowWidth(window.innerWidth);
    setScreenWidth(window.screen.width);
  }, []);

  /* MicroForm Integration */
  const microFormStyles = {
    input: {
      'font-family':
        'MuseoSans300, "Museo Sans", -apple-system-body, -apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif',
      'font-stretch': 'normal',
      'font-style': 'normal',
      'font-size': '16px',
      'line-height': '24px',
      color: '#000000'
    },
    '::placeholder': {
      color: '#000000'
    },
    ':focus': {
      color: '#000000'
    },
    valid: {
      color: '#000000'
    },
    invalid: {
      color: '#000000'
    }
  };

  const flex = window['Flex'];

  const getPublicKey = async () => {
    setIsSpinnerVisible(true);
    try {
      const cyberSourcePublicKey = await getCyberSourcePublicKey();
      if (cyberSourcePublicKey) {
        const token = cyberSourcePublicKey;
        setPublicKeyToken(token);
        setOpen(false);
      }
    } catch (err) {
      // this might be dangerous.
      //`err` should be parsed and only known safe data be logged
      console.log('Error Retrieving CyberSource Public Key.', err);
    }
    setIsSpinnerVisible(false);
  };

  useEffect(() => {
    getPublicKey();
  }, [currentResolution]);

  useEffect(() => {
    let intervalId = null;
    if (publicKeyToken) {
      const config = new flex(publicKeyToken);
      const microform = config.microform({ styles: microFormStyles });

      const cardNumber = microform.createField('number');
      const securityCode = microform.createField('securityCode');

      cardNumber.load('#cardNumber');
      securityCode.load('#cvv');

      cardNumber.on('change', ({ empty, valid, card }) => {
        const cardType = card.length ? card[0].brandedName : '';
        cardInputRef.current = { empty, valid, data: cardType };
        setPaymentFormValues((state) => ({
          ...state,
          cardNumber: cardInputRef.current.data
        }));

        setErrorFields((state) => ({
          ...state,
          cardNumber: false
        }));

        setCardType(cardType);
      });

      cardNumber.on('focus', () => {
        setCardLabelShrink(true);
        setSecurityLabelShrink(!securityInputRef.current.empty);
      });

      cardNumber.on('blur', () => {
        const { empty, valid } = cardInputRef.current;
        setCardLabelShrink(!empty);
        setErrorFields((state) => ({
          ...state,
          cardNumber: !empty && !valid
        }));
      });

      securityCode.on('change', ({ empty, valid }) => {
        securityInputRef.current = { empty, valid, data: empty ? '' : 'updated' };
        setPaymentFormValues((state) => ({
          ...state,
          cvv: securityInputRef.current.data
        }));

        setErrorFields((state) => ({
          ...state,
          cvv: false
        }));
      });

      securityCode.on('focus', () => {
        setSecurityLabelShrink(true);
        setCardLabelShrink(!cardInputRef.current.empty);
      });

      securityCode.on('blur', () => {
        const { empty, valid } = securityInputRef.current;
        setSecurityLabelShrink(!empty);
        setErrorFields((state) => ({
          ...state,
          cvv: !empty && !valid
        }));
      });

      microFormCallBack(microform);

      setCardNumberForm(cardNumber);
      setSecurityCodeForm(securityCode);

      let count = 0;
      intervalId = setInterval(() => {
        console.log('public key expiry check ----->', ++count);
        if (Date.now() > JSON.parse(atob(publicKeyToken.split('.')[1])).exp * 1000) {
          console.log(
            'token expired....',
            JSON.parse(atob(publicKeyToken.split('.')[1])).exp * 1000
          );
          if (!open) {
            setOpen(true);
            clearInterval(intervalId);
          }
        }
      }, 60000);
    }

    return () => clearInterval(intervalId);
  }, [publicKeyToken]);

  useEffect(() => {
    if (flexTokenError) {
      const { message, details } = flexTokenError;

      let fieldErrorMessage;
      if (details) {
        fieldErrorMessage = details?.map((data) => data?.message).join(',');
      }

      const flexError = fieldErrorMessage
        ? fieldErrorMessage + 'Fix the error fields and try again.'
        : message;

      setFlexErrorMessage(flexError);
      setOpen(true);
    }
  }, [flexTokenError]);

  useEffect(() => {
    const filerFn = (key) => {
      let isInvalid = false;
      const length = paymentFormValues[key]?.length;
      if (key === 'year') {
        isInvalid = length !== 4;
      } else {
        isInvalid = length === 0;
      }
      return isInvalid || errorFields[key];
    };

    const hasError = Object.keys(paymentFormValues).filter(filerFn).length > 0;

    const disable = !cardInputRef.current.valid || !securityInputRef.current.valid || hasError;
    setSubmitDisabled(disable);

    return () => setSubmitDisabled(false);
  }, [paymentFormValues, errorFields]);

  const validateFormFields = (type) => {
    const { cardHolderName, year, month } = paymentFormValues;

    if (type === 'month' && month) {
      if (month?.length === 1 && month !== '0') {
        const expiryMonth = month.padStart(2, '0');

        setPaymentFormValues({
          ...paymentFormValues,
          month: expiryMonth
        });
      }

      setErrorFields({
        ...errorFields,
        month: Number(month) > 12 || Number(month) === 0
      });
    } else if (type === 'year' && year) {
      const today = new Date();
      setErrorFields({
        ...errorFields,
        year: Number(year) < today.getFullYear()
      });
    } else if (type === 'cardHolderName' && cardHolderName) {
      const cardHolderRegex = /^[a-zA-Z\s]+$/;
      setErrorFields({
        ...errorFields,
        cardHolderName: !cardHolderRegex.test(cardHolderName)
      });
    }

    if (year && month && type !== 'cardHolderName') {
      const ExpiryYear = Number(year);
      const ExpiryMonth = Number(month);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiryDate = new Date();
      expiryDate.setFullYear(ExpiryYear);
      expiryDate.setMonth(ExpiryMonth - 1);
      expiryDate.setHours(0, 0, 0, 0);

      setErrorFields({
        ...errorFields,
        month: ExpiryMonth <= 0 || ExpiryMonth > 12 || +expiryDate < +today,
        year: +expiryDate < +today
      });
    }
  };

  const handleInputChange = (event, type) => {
    if (type !== 'cardHolderName') {
      const inputVal = event?.target?.value.replace(/ /g, '');
      let inputNumbersOnly = inputVal.replace(/\D/g, '');

      setPaymentFormValues({
        ...paymentFormValues,
        [type]: inputNumbersOnly
      });
    } else {
      setPaymentFormValues({
        ...paymentFormValues,
        [type]: event?.target?.value
      });
    }

    if (type === 'month' || type === 'year') {
      setErrorFields({
        ...errorFields,
        month: false,
        year: false
      });
    } else {
      setErrorFields({
        ...errorFields,
        [type]: false
      });
    }
  };

  const handleClick = (event) => {
    const { id } = event?.target ?? {};
    if (id === 'cardNumber') {
      cardNumberForm?.focus();
    } else if (id === 'cvv') {
      securityCodeForm?.focus();
    } else {
      setCardLabelShrink(!cardInputRef.current.empty);
      setSecurityLabelShrink(!securityInputRef.current.empty);
    }
  };

  const renderErrorInfoIcon = () => {
    return (
      <img src={'/icons/infoIcon.svg'} alt="delete" width={24} height={24} aria-label="delete" />
    );
  };

  const renderTextField = (textProps) => {
    return (
      <TextField
        id={textProps?.key}
        variant="filled"
        className={
          !errorFields?.[textProps.key]
            ? CheckoutStyles.textInput
            : `${CheckoutStyles.textInput} ${CheckoutStyles.errorInput}`
        }
        onChange={(e) => handleInputChange(e, textProps.key)}
        onBlur={() => validateFormFields(textProps.key)}
        onClick={handleClick}
        value={textProps?.value}
        {...textProps}
        InputLabelProps={{
          shrink: textProps?.iframeLabelShrink
        }}
        inputProps={{
          maxLength: textProps?.maxNumber,
          'data-testid': 'payment-' + textProps?.key
        }}
        InputProps={{
          inputComponent: textProps?.inputComponent,
          endAdornment: errorFields?.[textProps.key] ? renderErrorInfoIcon() : <></>
        }}
        error={errorFields?.[textProps.key]}
        helperText={errorFields?.[textProps.key] ? textProps?.errorMsg : ''}
      />
    );
  };

  const handleModalClose = () => {
    setOpen(false);
    if (isLoggedInUser) {
      getPublicKey();
    } else {
      window.location.href = '/checkout';
    }
  };

  /* TODO: Move to amplience Richtext */
  const timeoutContent = (
    <div>
      <b>
        <h1>Checkout update.</h1>
      </b>
      <p>
        To protect your personal information, your session has automatically timed out.
        <br></br>
        <br></br>
        Please begin checkout again.
      </p>
    </div>
  );

  const timeoutDialog = () => {
    return (
      <div>
        <Dialog
          open={open}
          onClose={handleModalClose}
          maxWidth={'xs'}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              borderRadius: '10px 10px 20px 20px'
            }
          }}
        >
          <DialogTitle className={CheckoutStyles.timeoutModalTitle}>
            <CloseIcon className={CheckoutStyles.closeIconStyle} onClick={handleModalClose} />
          </DialogTitle>
          <DialogContent>{flexErrorMessage ?? timeoutContent}</DialogContent>
        </Dialog>
      </div>
    );
  };

  const renderCvvInfo = () => {
    return (
      <>
        {paymentOptionFormFieldLabels.section4.map(({ label, key, maxNumber, errorMsg }) =>
          renderTextField({
            label,
            key,
            value: paymentFormValues[key],
            maxNumber,
            errorMsg,
            iframeLabelShrink: securityLabelShrink,
            inputComponent: 'div'
          })
        )}
        <div className={CheckoutStyles.pinInfo}>
          <img src={'/icons/checkout/pinInfo.svg'} alt="CVV Info" />
        </div>
      </>
    );
  };

  return (
    <div className={CheckoutStyles.paymentSection}>
      {isSpinnerVisible && (
        <div className={CheckoutStyles.addressSpinner}>
          <Spinner spinnerVisible={true} />
        </div>
      )}
      <div className={CheckoutStyles.creditCardTitleSection}>
        <label>
          <b>{billingAddressFormFieldLabels?.creditcard}</b>
        </label>
        <img src={'/icons/checkout/cardTypes.svg'} alt="Card Types" />
      </div>
      <form
        className={`${CheckoutStyles.editContactForm} ${ShippingStyles.editContactForm} ${CheckoutStyles.editPaymentForm}`}
      >
        <div className={CheckoutStyles.inputFieldWrapper}>
          {paymentOptionFormFieldLabels.section1.map(({ label, key, maxNumber, errorMsg }) =>
            renderTextField({
              label,
              key,
              maxNumber,
              errorMsg,
              value: paymentFormValues[key],
              style: { width: '100%' },
              disabled: isSpinnerVisible
            })
          )}
        </div>

        <div className={CheckoutStyles.inputFieldWrapper}>
          {paymentOptionFormFieldLabels.section2.map(({ label, key, maxNumber, errorMsg }) =>
            renderTextField({
              label,
              key,
              value: paymentFormValues[key],
              style: { width: '100%' },
              maxNumber,
              errorMsg,
              iframeLabelShrink: cardLabelShrink,
              inputComponent: 'div',
              disabled: isSpinnerVisible
            })
          )}
        </div>

        <div
          className={`${CheckoutStyles.inputFieldWrapper} ${CheckoutStyles.paymentFieldWrapper}`}
        >
          {paymentOptionFormFieldLabels.section3.map(({ label, key, maxNumber, errorMsg }) =>
            renderTextField({
              label,
              key,
              value: paymentFormValues[key],
              maxNumber,
              errorMsg,
              disabled: isSpinnerVisible
            })
          )}

          {!isMobile && renderCvvInfo()}
        </div>

        {isMobile && (
          <div
            className={`${CheckoutStyles.inputFieldWrapper} ${CheckoutStyles.paymentFieldWrapper}`}
          >
            {renderCvvInfo()}
          </div>
        )}
      </form>
      {isLoggedInUser && props.children}
      {timeoutDialog()}
    </div>
  );
}
