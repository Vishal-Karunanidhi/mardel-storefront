import { useSelector } from '@Redux/store';
import { shippingFieldLabels } from '@Constants/checkoutConstants';
import CheckoutStyles from '@Styles/checkout/checkoutPage.module.scss';

export default function ViewShippingAddress(props: any): JSX.Element {
  const { updateCurrentFormMode, shipping } = props;
  const {
    firstName,
    lastName,
    addressLineOne,
    addressLineTwo,
    country,
    city,
    state,
    zipCode,
    company
  } = shipping;

  const { orderConfMode } = useSelector((state) => state.checkout);
  return (
    <>
      <div className={CheckoutStyles.viewContactForm}>
        <label>{shippingFieldLabels?.shippingAddress}</label>
        {!orderConfMode && <a onClick={updateCurrentFormMode}>{shippingFieldLabels?.editForm}</a>}
      </div>

      <div className={CheckoutStyles.shippingSection}>
        <label className={CheckoutStyles.viewLabels}>{`${firstName} ${lastName}`}</label>
        <label className={CheckoutStyles.viewLabels}>{`${addressLineOne} ${
          addressLineTwo ?? ''
        }`}</label>
        {company && <label className={CheckoutStyles.viewLabels}>{`${company}`}</label>}
        <label className={CheckoutStyles.viewLabels}>{`${city} ${state} ${zipCode}`}</label>
        <label className={CheckoutStyles.viewLabels}>{`${country}`}</label>
      </div>

      {props.children}
    </>
  );
}
