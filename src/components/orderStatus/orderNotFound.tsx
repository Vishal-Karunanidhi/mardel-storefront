import OrderlookupStyles from '@Styles/orderStatus/orderLookup.module.scss';

export default function OrderNotFound(): JSX.Element {
  return (
    <div className={OrderlookupStyles.orderNotFound}>
      <div className={OrderlookupStyles.orderNotFoundHeader}>We Couldn't find your order</div>
      <div className={OrderlookupStyles.orderNotFoundMessage}>
        Please check the order number/zip code and try again
      </div>
    </div>
  );
}
