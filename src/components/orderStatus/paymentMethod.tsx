import { paymentsMethod } from '@Types/cms/orderStatus';
import PaymentMethodStyles from '@Styles/orderStatus/nextGenOrderDetails.module.scss';

export default function PaymentMethod({ paymentIndex, payments }: paymentsMethod): JSX.Element {
  const { method } = payments;
  const isPaypal = method?.toLowerCase() === 'paypal';
  const isGiftCard = method?.toLowerCase() === 'giftcard';
  const paymentAddonStyle = paymentIndex !== 1 ? { paddingTop: 0 } : {};

  return (
    <div className={PaymentMethodStyles.paymentMethod} style={paymentAddonStyle}>
      {paymentIndex === 1 && (
        <div className={PaymentMethodStyles.paymentMethodHeader}>
          <span className={PaymentMethodStyles.paymentMethodHeadline}>PAYMENT OPTION</span>
          <span className={PaymentMethodStyles.tickIcon}>&#10003;</span>
        </div>
      )}
      <div className={PaymentMethodStyles.paymentMethodBody}>
        {isPaypal ? (
          <img src={'/icons/checkout/paypalBlue.svg'} alt="paypal_logo" width={94} height={22} />
        ) : (
          <span>{`${isGiftCard ? 'Gift Card' : payments.cardType} X-${payments.last4Digits}`}</span>
        )}
        <span style={{ float: 'right' }}>${payments.amount}</span>
      </div>
    </div>
  );
}
