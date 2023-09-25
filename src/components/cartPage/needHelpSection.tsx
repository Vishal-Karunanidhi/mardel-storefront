import OrderSummaryStyles from '@Styles/cartpage/orderSummary.module.scss';

export default function RenderHelpAndContact(props: any): JSX.Element {
  const { fullCartContent, cartNumber } = props;

  const { cartReferenceTitle, contactUs, needHelpTitle } = fullCartContent?.helpInfo;

  return (
    <div className={OrderSummaryStyles.infoSection}>
      <strong>{needHelpTitle}</strong>{' '}
      <a href={contactUs.value} className={OrderSummaryStyles.contact}>
        Contact us
      </a>{' '}
      {cartReferenceTitle} <strong>{cartNumber}</strong>
    </div>
  );
}
