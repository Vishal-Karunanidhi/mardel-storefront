import { useRouter } from 'next/router';
import OrderConfirmation from '@Components/checkout/orderConfirmation';
import styles from '@Styles/orderConfirmation/orderConfirmation.module.scss';
import { Grid } from '@mui/material';

export default function OrderConfirmationPage(): JSX.Element {
  const router = useRouter();
  const data = Array.isArray(router.query.state) ? router.query.state[0] : router.query.state;
  const decodedOrderData = decodeURIComponent(data);
  const orderDetails = JSON.parse(decodedOrderData);

  return (
    <>
      <div className={styles.orderConfirmationContainer}>
        <Grid className={styles.orderConfirmationParentGrid}>
          <Grid className={styles.orderDetailsGrid}>
            <div>
              <OrderConfirmation checkoutFormValue={orderDetails} />
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
