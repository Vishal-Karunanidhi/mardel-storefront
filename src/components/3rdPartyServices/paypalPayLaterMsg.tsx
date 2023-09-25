import PayLaterStyles from '@Styles/components/common/productPriceSection.module.scss';

export default function PaypalPayLaterMessage({ price }): JSX.Element {
  const payLaterThresholdPrice = parseFloat(process.env.NEXT_PUBLIC_PAYPAL_PAYLATER_THRESHOLD);
  const showPayLaterMessage = price >= payLaterThresholdPrice;

  if (!showPayLaterMessage) {
    return <div className={PayLaterStyles.payLaterMessage} data-pp-message></div>;
  }

  return <div className={PayLaterStyles.payLaterMessage} data-pp-message data-pp-amount={price}></div>;
}
