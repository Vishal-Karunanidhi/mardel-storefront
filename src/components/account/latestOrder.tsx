import { useDispatch, useSelector } from '@Redux/store';
import { Divider } from '@mui/material';
import HlButton from '@Components/common/button';
import ImageWithFallback from '@Components/common/imageWithFallback';
import { DateMonthYearConverter } from '@Components/common/accountValidator';
import latestOrderStyles from '@Styles/account/latestOrder.module.scss';

const OrderBasicDetails = (props) => {
  const { creationTime, orderNumber, orderState } = props;
  const dispatch = useDispatch();
  const { day, month, year } = DateMonthYearConverter(creationTime);

  const handleViewOrder = () => {
    dispatch({
      type: 'ACCOUNT_VIEW_ORDER_FLAG',
      payload: {
        showOrderFullDetails: true,
        orderDetails: props
      }
    });
  };

  return (
    <span className={latestOrderStyles.orderWrapper} key={orderNumber}>
      <span className={latestOrderStyles.orderDetails}>
        <span className={latestOrderStyles.addressTitle}>
          <b>{`Order ${orderNumber} • `}</b>
          {`${month} ${day}, ${year}`}
        </span>
        <span className={latestOrderStyles.defaultAddress}>
          <b>Latest status: </b> {` ${orderState}`}
        </span>
      </span>
      <span className={latestOrderStyles.viewOrderBtnDesktop}>
        <HlButton
          buttonTitle={'View Order'}
          parentDivClass={latestOrderStyles.cancelWrapper}
          buttonClass={latestOrderStyles.cancelButton}
          callbackMethod={handleViewOrder}
        />
      </span>
    </span>
  );
};

export default function LatestOrder(): JSX.Element {
  const { myProfileInfo } = useSelector((state) => state.auth);

  const lastThree = myProfileInfo?.order?.lineItems?.slice(-3);
  const dispatch = useDispatch();
  const handleViewOrder = () => {
    dispatch({
      type: 'ACCOUNT_VIEW_ORDER_FLAG',
      payload: {
        showOrderFullDetails: true,
        orderDetails: myProfileInfo?.order
      }
    });
  };

  if (!myProfileInfo.order) {
    return <></>;
  }

  return (
    <>
      <div className={latestOrderStyles.lastOrderSection}>
        <span className={latestOrderStyles.lastOrderTitle}>Your latest order</span>
        <OrderBasicDetails {...myProfileInfo.order} />
        <span
          className={latestOrderStyles.imageItems}
        >{`${myProfileInfo?.order?.lineItems?.length} Items`}</span>
        <span className={latestOrderStyles.imageList}>
          {lastThree?.map((image) => (
            <ImageWithFallback
              src={`${image?.variant?.image?.url}?w=75&h=75`}
              width={64}
              height={64}
              layout="responsive"
              key={image?.variant?.image?.url}
            />
          ))}
        </span>
        <span className={latestOrderStyles.viewOrderBtnMobile}>
          <HlButton
            buttonTitle={'View Order'}
            parentDivClass={latestOrderStyles.cancelWrapper}
            buttonClass={latestOrderStyles.cancelButton}
            callbackMethod={handleViewOrder}
          />
        </span>
      </div>
      <Divider className={latestOrderStyles.sectionDivider} />
    </>
  );
}

export { OrderBasicDetails };
