import { titleCase } from '@Lib/common/utility';
import { billingAddress } from '@Types/cms/orderStatus';
import BillingAddressStyles from '@Styles/orderStatus/nextGenOrderDetails.module.scss';

export default function BillingAddress({ billingAddress }: billingAddress): JSX.Element {
  return (
    <div className={BillingAddressStyles.billingAddress}>
      <div className={BillingAddressStyles.billingAddressHeader}>
        <span className={BillingAddressStyles.billingAddressHeadline}>BILLING ADDRESS</span>
        <span className={BillingAddressStyles.tickIcon}>&#10003;</span>
      </div>
      <div className={BillingAddressStyles.billingAddressBody}>
        <div className={BillingAddressStyles.billingAddressKey}>{titleCase(billingAddress?.key??'')}</div>
        <div>{`${billingAddress.firstName} ${billingAddress.lastName}`}</div>
        <div>
          {billingAddress.addressLineOne} {billingAddress.addressLineTwo}
        </div>
        <div>{`${billingAddress.city}, ${billingAddress.state} ${billingAddress.postalCode}`}</div>
        <div>{billingAddress.country}</div>
      </div>
    </div>
  );
}
