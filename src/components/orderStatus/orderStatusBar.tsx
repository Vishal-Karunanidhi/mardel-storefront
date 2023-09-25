import { useState } from 'react';
import HlButton from '@Components/common/button';
import CancelOrderModal from '@Components/orderStatus/cancelOrder';
import OrderlookupStyles from '@Styles/orderStatus/orderLookup.module.scss';

export default function OrderStatusBar({
  orderNumber,
  orderState,
  creationTime,
  handleOrderCancel,
  handleOrderReturn,
  paymentState
}: any): JSX.Element {
  const [openCancelOrderModal, setOpenCancelOrderModal] = useState(false);

  const handleOrderAction = () => {
    if (orderState !== 'Shipped') {
      setOpenCancelOrderModal(true);
    } else {
      handleOrderReturn();
    }
  };

  return (
    <div className={OrderlookupStyles.orderStatusBarBox}>
      <div className={OrderlookupStyles.orderStatusBarInfo}>
        <div className={OrderlookupStyles.orderStatusBarHeader}>
          <div className={OrderlookupStyles.orderStatusBarNumber}>Order #{orderNumber}</div>
          <div className={OrderlookupStyles.orderStatusBarDate}>Date: <span className={OrderlookupStyles.orderStatusBarDateText}>{creationTime}</span></div>
        </div>

        <div className={OrderlookupStyles.orderStatusBarButton}>
          {orderState !== 'Cancelled' ? (
            <HlButton
              buttonTitle={orderState === 'Shipped' ? 'Return Order' : 'Cancel Order'}
              callbackMethod={handleOrderAction}
              isDisabled={orderState !== 'Shipped' && paymentState === 'Paid'}
            />
          ) : null}
        </div>
      </div>
      {openCancelOrderModal && (
        <CancelOrderModal
          setOpenCancelOrderModal={setOpenCancelOrderModal}
          orderNumber={orderNumber}
          handleOrderCancel={handleOrderCancel}
        />
      )}
    </div>
  );
}
