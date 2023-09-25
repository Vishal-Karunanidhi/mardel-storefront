import GiftMessageStyles from '@Styles/orderStatus/nextGenOrderDetails.module.scss';

export default function GiftMessage({
  giftMessage,
  giftReceiverName,
  giftSenderName
}: any): JSX.Element {
  return (
    <div className={GiftMessageStyles.giftMessage}>
      <div className={GiftMessageStyles.giftMessageHeader}>
        <span className={GiftMessageStyles.giftMessageHeadline}>GIFT MESSAGE</span>
        <span className={GiftMessageStyles.tickIcon}>&#10003;</span>
      </div>
      <div className={GiftMessageStyles.giftMessageBody}>this order is a gift</div>
      <div className={GiftMessageStyles.giftMessageBody}>
        <div>
          <span className={GiftMessageStyles.giftMessageBodyKey}>Sender’s Name:</span>
          {giftSenderName}
        </div>
        <div>
          <span className={GiftMessageStyles.giftMessageBodyKey}>Recipient’s Name:</span>
          {giftReceiverName}
        </div>
        <div>
          <span className={GiftMessageStyles.giftMessageBodyKey}>Message: </span>
          {giftMessage}
        </div>
      </div>
    </div>
  );
}
