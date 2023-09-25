import { ArCardData } from '@Types/accountsReceivable';
import TransactionComponent from './transactionComponent';
import styles from '@Styles/accountsReceivable/accountsReceivable.module.scss';

export default function CardBalanceData({
  cardData,
  setCardData
}: {
  cardData: ArCardData;
  setCardData: any;
}) {
  return (
    <div className={styles.balancePage}>
      <div className={styles.balanceDisplay}>
        <h1 className={styles.balanceDisplayHeader}>Your card balance is:</h1>
        <div className={styles.balanceDisplayDollar}>
          {`$${Number(cardData.cardBalance).toFixed(2)}`}
        </div>
        <button onClick={() => setCardData(null)} className={styles.balanceDisplayButton}>
          Check another card
        </button>
      </div>
      <div className={styles.balanceTransactionSection}>
        <h2 className={styles.balanceTransactionHeader}>Transaction History</h2>
        <div className={styles.balanceTransactionContainer}>
          {cardData.transactionHistory.map((transaction, index) => {
            return (
              <TransactionComponent
                date={transaction.date}
                type={transaction.action}
                amount={transaction.amount}
                reference={transaction.transactionId}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
