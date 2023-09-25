import { useState } from 'react';
import { Divider } from '@mui/material';
import HLTextField from '@Components/common/hlTextField';
import { giftOrderLabelConstants, editGiftMessageForm } from '@Constants/checkoutConstants';
import CheckoutStyles from '@Styles/checkout/checkoutPage.module.scss';
import ShippingStyles from '@Styles/checkout/shippingAddress.module.scss';

const emptyGiftMessageForm = {
  isGiftMsgAdded: false,
  giftSenderName: '',
  giftReceiverName: '',
  giftMessage: ''
};

export default function AddEditGiftMessage(props: any): JSX.Element {
  const { defaultFormValues } = props;
  const [giftMessageFormValue, setGiftMessageFormValue] = useState(
    defaultFormValues ?? emptyGiftMessageForm
  );
  const maxNameLength = 25;

  const handleInputChange = (e, type) => {
    const formValue = { ...giftMessageFormValue };
    if (type === 'isGiftMsgAdded') {
      formValue[type] = e?.target?.checked;
    } else {
      formValue[type] = e?.target?.value;
    }
    setGiftMessageFormValue(formValue);
    props.handleGiftMessageChange(formValue);
  };

  const maxLength = 90;
  const giftMessageThreshold = () => {
    if (
      giftMessageFormValue &&
      giftMessageFormValue.giftMessage &&
      giftMessageFormValue.giftMessage.length
    ) {
      return maxLength - giftMessageFormValue.giftMessage.length;
    } else return maxLength;
  };

  return (
    <>
      <GiftOrderCheckboxComp
        handleInputChange={handleInputChange}
        isChecked={giftMessageFormValue.isGiftMsgAdded}
      />

      {giftMessageFormValue?.isGiftMsgAdded && (
        <>
          <div className={CheckoutStyles.inputFieldWrapper}>
            {editGiftMessageForm?.fromToSection.map(({ key, label }) => (
              <HLTextField
                key={key}
                labelName={label}
                textFieldValue={giftMessageFormValue[key]}
                handleInputChange={(e) => handleInputChange(e, key)}
                inputProps={{
                  maxLength: maxNameLength,
                  'data-testid': key
                }}
              />
            ))}
          </div>

          <div className={CheckoutStyles.inputTextAreaWrap}>
            {editGiftMessageForm?.messageSection.map(({ key, label }) => (
              <HLTextField
                key={key}
                multiline
                minRows={5}
                maxRows={12}
                labelName={label}
                inputProps={{ maxLength: maxLength, 'data-testid': key }}
                className={CheckoutStyles.textInput}
                textFieldValue={giftMessageFormValue[key]}
                style={{ width: '100%', height: '100%', borderRadius: 5 }}
                handleInputChange={(e) => handleInputChange(e, key)}
              />
            ))}
          </div>

          <label className={CheckoutStyles.textAreaInfoLabel}>
            {giftMessageThreshold()}&nbsp;
            {giftOrderLabelConstants?.messageCharacterBalanceLabel}
          </label>
        </>
      )}
    </>
  );
}

const GiftOrderCheckboxComp = (props) => {
  const { title, giftCheckboxLabel, infoLabel } = giftOrderLabelConstants;

  return (
    <div className={ShippingStyles.giftSectionWrapper}>
      <Divider className={ShippingStyles.divider} />
      <label className={ShippingStyles.giftMessageTitle}>{title}</label>
      <span className={ShippingStyles.checkboxWrapper}>
        <input
          type="checkbox"
          checked={props.isChecked}
          className={ShippingStyles.giftCheckbox}
          onChange={(e) => props.handleInputChange(e, 'isGiftMsgAdded')}
          data-testid="gift-order-checkbox"
        />
        <label className={ShippingStyles.giftCheckboxLabel}>{giftCheckboxLabel}</label>
      </span>
      <span className={ShippingStyles.giftInfoLabel}>{infoLabel}</span>
    </div>
  );
};
