import { useSelector } from '@Redux/store';
import { Divider } from '@mui/material';
import HlButton from '@Components/common/button';
import GcStyles from '@Styles/my-account/giftCardLookup.module.scss';

const tableRecords = [
  {
    key: 'date',
    label: 'Date'
  },
  {
    key: 'action',
    label: 'Type'
  },
  {
    key: 'transactionId',
    label: 'Reference'
  },
  {
    key: 'amount',
    label: 'Amount'
  }
];

const GiftBalanceView = ({ cardBalance, cardNumber, closeBalanceCheck }) => {
  return (
    <div className={GcStyles.balanceView}>
      <h1>
        <b>Your Gift Card balance is:</b>
      </h1>
      <h2>
        <b>${parseFloat(cardBalance)?.toFixed(2)}</b>
      </h2>
      <h3>Gift Card ending in {cardNumber?.substr(cardNumber?.length - 4)}</h3>

      <HlButton
        buttonTitle={' Check another Gift Card '}
        callbackMethod={() => closeBalanceCheck()}
      />
    </div>
  );
};

const TransactionHistory = ({ transactions }) => {
  return (
    <>
      <h2>
        <b>Transaction History</b>
      </h2>

      <div className={GcStyles.transactionWrapper}>
        {transactions.map((transactionRecord) => (
          <>
            <div className={GcStyles.individualRecord}>
              {tableRecords.map(({ key, label }, index) => {
                let value = '';
                switch (key) {
                  case 'amount':
                    value = '$' + transactionRecord[key].toFixed(2);
                    break;
                  case 'date':
                    value = new Date(transactionRecord[key]).toLocaleDateString();
                    break;
                  default:
                    value = transactionRecord[key];
                    break;
                }
                return (
                  <span key={index}>
                    <b>
                      {label} <b className={GcStyles.labelSeparator}>: </b>
                    </b>
                    <label>{value}</label>
                  </span>
                );
              })}
            </div>
            <Divider className={GcStyles.divider} />
          </>
        ))}
      </div>
    </>
  );
};

export default function GiftCardBalance({
  cardBalance,
  cardNumber,
  transactions,
  closeBalanceCheck
}: any): JSX.Element {
  const { description, email } = useSelector((state) => state.myAccount.giftCardBalanceContent);

  return (
    <div className={GcStyles.giftCardBalance}>
      <label className={GcStyles.gcBalanceTitle}>Gift Card Balance</label>
      <Divider className={GcStyles.divider} />
      <GiftBalanceView
        cardBalance={cardBalance}
        cardNumber={cardNumber}
        closeBalanceCheck={closeBalanceCheck}
      />
      <TransactionHistory transactions={transactions} />
    </div>
  );
}
