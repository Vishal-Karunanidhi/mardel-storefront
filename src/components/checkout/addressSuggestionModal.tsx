import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import HlButton, { HlAnchorButton } from '@Components/common/button';
import DialogContent from '@mui/material/DialogContent';
import ShippingStyles from '@Styles/checkout/shippingAddress.module.scss';

const USER_ENTERED = 'userEntered';
const defaultSelection = { [USER_ENTERED]: false };

const avsFieldLabels = {
  title: 'address verification',
  description: 'Your address was verified against the FedEx and we found a suggested address.',
  edit: 'Edit',
  entered: 'You entered',
  suggested: 'suggested address',
  saveAndcontinue: 'Save & Continue'
};

export default function AddressSuggestionModal(props: any): JSX.Element {
  const { openModal, handleModalClose, handleConfirmShippingAddress, adressEnteredInForm } = props;
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  const { CustomerAddress: customerAddress, CandidateAddresses: suggestedAddress } =
    props?.avsAddressSuggestions;
  suggestedAddress?.map((e, i) => (defaultSelection[i] = false));

  const [currentSelected, setCurrentSelected] = useState({
    ...defaultSelection,
    [USER_ENTERED]: true
  });

  const handleAddressSelectionChange = (type) => {
    Object.keys(currentSelected).forEach((e) => (defaultSelection[e] = false));
    setCurrentSelected({
      ...defaultSelection,
      [type]: true
    });
  };

  const addressSelectionRadio = (
    addressDetails: {
      addressLineOne: string;
      addressLineTwo: string;
      country: string;
      city: string;
      state: string;
      zipCode: string;
    },
    addressType: string | number,
    allowEdit = false
  ) => {
    const { addressLineOne, addressLineTwo, country, city, state, zipCode } = addressDetails;
    return (
      <section className={ShippingStyles.addressGroup}>
        <fieldset>
          <legend className={ShippingStyles.radioTitle}>
            {addressType === USER_ENTERED && avsFieldLabels.entered}
            {addressType != USER_ENTERED && avsFieldLabels.suggested}
          </legend>
          <label className={ShippingStyles.addressArea}>
            <input
              checked={currentSelected[addressType]}
              className={ShippingStyles.addressRadio}
              name="address"
              onChange={() => handleAddressSelectionChange(addressType)}
              type="radio"
            ></input>
            <span className={ShippingStyles.addressLines}>
              {addressLineOne}
              {addressLineTwo && <br />}
              {addressLineTwo}
              <br />
              {city} {state} {zipCode}
              <br />
              {country}
            </span>
          </label>
          {allowEdit && (
            <HlAnchorButton
              buttonClass={ShippingStyles.editButton}
              buttonTitle={avsFieldLabels?.edit}
              callbackMethod={handleModalClose}
              dataTestId="shipping-address-edit-button"
              parentDivClass={ShippingStyles.editButtonDiv}
            />
          )}
        </fieldset>
      </section>
    );
  };

  const handleShippingAddressConfirmSave = () => {
    const chosenAddressType = Object.keys(currentSelected).find((e) => currentSelected[e] === true);
    const selectedAddress =
      chosenAddressType === USER_ENTERED ? customerAddress : suggestedAddress[chosenAddressType];
    setIsSubmitButtonDisabled(true);
    handleConfirmShippingAddress({
      ...adressEnteredInForm,
      ...selectedAddress
    });
  };

  return (
    <>
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogContent className={ShippingStyles.avsSuggestionSpan}>
          <h3 className={ShippingStyles.title}>{avsFieldLabels.title}</h3>
          <p className={ShippingStyles.description}>{avsFieldLabels.description}</p>
          {addressSelectionRadio(customerAddress, USER_ENTERED, true)}
          <hr className={ShippingStyles.lineBreak}></hr>
          {suggestedAddress?.map(
            (
              e: {
                addressLineOne: string;
                addressLineTwo: string;
                country: string;
                city: string;
                state: string;
                zipCode: string;
              },
              i: number
            ) => addressSelectionRadio(e, i)
          )}
          <HlButton
            buttonTitle={avsFieldLabels?.saveAndcontinue}
            callbackMethod={handleShippingAddressConfirmSave}
            isDisabled={isSubmitButtonDisabled}
            dataTestId="shipping-address-save-button"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
