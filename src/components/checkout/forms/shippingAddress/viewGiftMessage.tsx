import { useSelector } from '@Redux/store';
import { giftMessageFieldLabels, viewGiftMessageData } from '@Constants/checkoutConstants';
import ShippingStyles from '@Styles/checkout/shippingAddress.module.scss';

export default function ViewGiftMessage(props: any): JSX.Element {
  const { updateCurrentFormMode, giftMessageDetails, isChecked } = props;

  const { orderConfMode } = useSelector((state) => state.checkout);

  return (
    <>
      {isChecked ? (
        <>
          <div className={ShippingStyles.giftSection}>
            <div className={ShippingStyles.subSection}>
              <label className={ShippingStyles.giftMessage}>
                {giftMessageFieldLabels?.giftMessage}
              </label>
              {!orderConfMode && (
                <a className={ShippingStyles.editLabel} onClick={updateCurrentFormMode}>
                  {' '}
                  Edit
                </a>
              )}
            </div>
            <span className={ShippingStyles.orderGiftLabel}>
              {giftMessageFieldLabels?.giftCheckboxLabel}
            </span>
          </div>

          <div className={ShippingStyles.senderRecipientSection}>
            {viewGiftMessageData.map(({ key, label }) => (
              <>
                <div className={ShippingStyles.giftSection} key={key}>
                  <div className={ShippingStyles.giftLabel}>{label}</div>
                  <div className={ShippingStyles.giftValue}>{giftMessageDetails[key]}</div>
                </div>
              </>
            ))}
          </div>
        </>
      ) : (
        <div className={ShippingStyles.notAGiftSection}>
          <span className={ShippingStyles.giftMessageTitle}>
            {giftMessageFieldLabels?.giftMessage}
          </span>
          <span className={ShippingStyles.giftMessage}>
            {giftMessageFieldLabels?.notAGiftMessageLabel}
          </span>
        </div>
      )}
    </>
  );
}
