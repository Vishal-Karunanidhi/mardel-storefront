import { titleCase } from '@Lib/common/utility';
import { shippingAddress } from '@Types/cms/orderStatus';
import shippingAddressStyles from '@Styles/orderStatus/nextGenOrderDetails.module.scss';

export default function ShippingAddress({ shippingAddress }: shippingAddress): JSX.Element {
  return (
    <div className={shippingAddressStyles.shippingAddress}>
      <div className={shippingAddressStyles.shippingAddressHeader}>
        <span className={shippingAddressStyles.shippingAddressHeadline}>SHIPPING ADDRESS</span>
        <span className={shippingAddressStyles.tickIcon}>&#10003;</span>
      </div>
      <div className={shippingAddressStyles.shippingAddressBody}>
        <div className={shippingAddressStyles.shippingAddressBodyKey}>
          {titleCase(shippingAddress?.key ?? '')}
        </div>
        <div>{`${shippingAddress.firstName} ${shippingAddress.lastName}`}</div>
        <div>
          {shippingAddress.addressLineOne} {shippingAddress.addressLineTwo}
        </div>
        <div>{`${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}`}</div>
        <div>{shippingAddress.country}</div>
      </div>
    </div>
  );
}
