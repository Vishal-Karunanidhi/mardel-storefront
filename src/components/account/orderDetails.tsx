import { NextGenOrderDetails } from '@Pages/customer-service/order-status';
import OrderedItemStyles from '@Styles/orderDetails/orderedItem.module.scss';

export default function OrderDetails(order: any): JSX.Element {
  return (
    <div className={OrderedItemStyles.orderDetails}>
      <NextGenOrderDetails orderLookup={{ order }} handleOrderLookup={console.log} />
    </div>
  );
}
