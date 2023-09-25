import { useState, useEffect } from 'react';
import styles from '@Styles/accountsReceivable/accountsReceivable.module.scss';
import HLTextField from '@Components/common/hlTextField';

export default function CardBalanceForm({ handleFormSubmission }) {
  const [cardNumber, setCardNumber] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const setTextFieldValue = (e, setFunction) => {
    const regex = /^[0-9\b]+$/;
    (e.target.value === '' || regex.test(e.target.value)) && setFunction(e.target.value);
  };

  useEffect(() => {
    setIsFormValid(Boolean(cardNumber && customerNumber && zipCode));
  }, [cardNumber, customerNumber, zipCode]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        isFormValid && handleFormSubmission(cardNumber, customerNumber, zipCode);
      }}
      className={styles.balanceForm}
    >
      <h2 className={styles.balanceFormHeader}>Check your card balance</h2>
      <div className={styles.balanceFormInputs}>
        <HLTextField
          handleInputChange={(e) => setTextFieldValue(e, setCardNumber)}
          textFieldValue={cardNumber}
          labelName="Card number"
        />
        <HLTextField
          handleInputChange={(e) => setTextFieldValue(e, setCustomerNumber)}
          textFieldValue={customerNumber}
          labelName="Customer number"
        />
        <HLTextField
          handleInputChange={(e) => setTextFieldValue(e, setZipCode)}
          textFieldValue={zipCode}
          labelName="Billing ZIP Code"
        />
        <button
          type="submit"
          className={isFormValid ? styles.balanceFormButton : styles.balanceFormButtonDisabled}
        >
          Check balance
        </button>
      </div>
    </form>
  );
}
