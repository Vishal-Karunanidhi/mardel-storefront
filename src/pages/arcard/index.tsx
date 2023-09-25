import { useState } from 'react';
import { useDispatch } from '@Redux/store';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { ArCardData } from '@Types/accountsReceivable';
import { getAccountsReceivableCardBalance } from '@Lib/cms/accountsReceivable';
import CardBalanceForm from '@Components/accountsReceivable/cardBalanceForm';
import CardBalanceData from '@Components/accountsReceivable/cardBalanceData';
import styles from '@Styles/accountsReceivable/accountsReceivable.module.scss';
import DataLayer from '@Utils/DataLayer';
import { GtmDataLayer } from 'src/interfaces/gtmDataLayer';
import { getCookie } from 'cookies-next';

export default function AccountsReceivable(props) {
  const [cardData, setCardData] = useState<ArCardData | null>(null);
  const dispatch = useDispatch();
  const gtmData: GtmDataLayer = {
    anonymousUserId: getCookie('hl-anon-id') ? getCookie('hl-anon-id').toString() : '',
    event: 'page_view',
    pageType: 'accountsReceivableCheck'
  };

  const handleFormSubmission = async (
    cardNumber: string,
    customerNumber: string,
    zipCode: string
  ) => {
    const response = await getAccountsReceivableCardBalance(cardNumber, customerNumber, zipCode);
    if (
      response?.getAccountsReceivableCardBalance?.paymentTransactionResponse?.transactionStatus ===
      'SUCCESS'
    ) {
      setCardData(response.getAccountsReceivableCardBalance);
    } else {
      dispatch({
        type: 'UPDATE_SNACKBAR_WITH_DATA',
        payload: {
          open: true,
          message: 'Failed to retrieve card balance. Please make sure your information is correct.',
          severity: 'error'
        }
      });
    }
  };

  return (
    <>
      <Breadcrumb
        breadCrumbs={[
          {
            __typename: 'Breadcrumb',
            name: 'Home',
            key: '/',
            slug: '/',
            openInNewTab: false
          },
          {
            __typename: 'Breadcrumb',
            name: 'Accounts Receivable Card',
            key: '/',
            slug: '/',
            openInNewTab: false
          }
        ]}
      />
      <div className={styles.accountsReceivablePage}>
        {cardData ? (
          <CardBalanceData setCardData={setCardData} cardData={cardData} />
        ) : (
          <CardBalanceForm handleFormSubmission={handleFormSubmission} />
        )}
      </div>
      <DataLayer pageData={gtmData} />
    </>
  );
}
