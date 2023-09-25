import AddToCart from './addToCart';
import NotifyMe from './notifyMe';
import HlButton from '@Components/common/button';
import { Variant } from '@Types/cms/schema/pdp/pdpData.schema';
import { productStatus } from '@Lib/common/utility';
import styles from '@Styles/productDetailPage/productAvailable/productAvailable.module.scss';

type props = {
  variant?: Variant;
  product?: any;
  nonPdpPage?: boolean;
  quantity?: number;
  productType?: string;
  productName?: string;
  productListName?: string;
};

export default function ProductAvailable({
  variant,
  product,
  nonPdpPage = true,
  quantity = 1,
  productType,
  productName,
  productListName
}: props): JSX.Element {
  const status = productStatus(variant, product, nonPdpPage);
  switch (status) {
    case 'See Options':
      return (
        <a href={product.pdpUrl}>
          <HlButton buttonTitle={status} dataTestId={'featured-items-see-options'} />
        </a>
      );
    case 'Out of stock':
      return <HlButton buttonTitle={status} isDisabled={true} />;
    case 'OOS Online':
      const buttonTitle = 'Out of stock online';
      return (
        <>
          <HlButton buttonTitle={buttonTitle} isDisabled={true} />
          <div className={styles.oosOnline}>
            Contact your local store to check for in-store availability. Use{' '}
            <a href="/stores/search" target="_blank">
              Store Locator
            </a>
            .
          </div>
        </>
      );
    case 'NotifyMe':
    case 'AddToCart':
      if (product) {
        variant = product.variants[0] as Variant;
      }
      const buttonProps = {
        nonPdpPage,
        variantDetails: variant,
        quantity,
        productName,
        productListName
      };

      if (status === 'NotifyMe') {
        return <NotifyMe {...buttonProps} />;
      }
      return <AddToCart {...buttonProps} />;
    case 'In store only':
    case 'View Product':
      if (!nonPdpPage) {
        return <HlButton buttonTitle={status} isDisabled={true} />;
      }
      let url = '';
      if (variant) {
        url = variant.url;
      }
      if (product) {
        url = product.pdpUrl;
      }
      return (
        <a href={url}>
          <HlButton buttonTitle={'View Product'} />
        </a>
      );
    default:
      return <></>;
  }
}
