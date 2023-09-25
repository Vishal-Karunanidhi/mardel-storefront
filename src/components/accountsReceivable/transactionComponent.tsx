import styles from '@Styles/accountsReceivable/accountsReceivable.module.scss';

export default function TransactionComponent({ date, type, reference, amount }) {
  const stringToDate = new Date(date);
  return (
    <div className={styles.balanceTransaction}>
      <div className={styles.balanceTransactionDate + ' ' + styles.balanceTransactionGroup}>
        <div className={styles.balanceTransactionGroupLabel}>
          Date<span className={styles.balanceTransactionGroupLabelColon}>:</span>
        </div>
        <div className={styles.balanceTransactionGroupValue}>
          {stringToDate.toLocaleString(undefined, { dateStyle: 'short' })}
        </div>
      </div>
      <div className={styles.balanceTransactionType + ' ' + styles.balanceTransactionGroup}>
        <div className={styles.balanceTransactionGroupLabel}>
          Type<span className={styles.balanceTransactionGroupLabelColon}>:</span>
        </div>
        <div className={styles.balanceTransactionGroupValue}>{type}</div>
      </div>
      <div className={styles.balanceTransactionReference + ' ' + styles.balanceTransactionGroup}>
        <div className={styles.balanceTransactionGroupLabel}>
          Reference<span className={styles.balanceTransactionGroupLabelColon}>:</span>
        </div>
        <div className={styles.balanceTransactionGroupValue}>{reference}</div>
      </div>
      <div className={styles.balanceTransactionAmount + ' ' + styles.balanceTransactionGroup}>
        <div className={styles.balanceTransactionGroupLabel}>
          Amount<span className={styles.balanceTransactionGroupLabelColon}>:</span>
        </div>
        <div className={styles.balanceTransactionGroupValue}>
          {amount >= 0 ? `$${amount.toFixed(2)}` : `-$${Math.abs(amount).toFixed(2)}`}
        </div>
      </div>
    </div>
  );
}
