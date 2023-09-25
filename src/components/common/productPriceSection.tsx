import PaypalPayLaterMsg from '@Components/3rdPartyServices/paypalPayLaterMsg';
import { productPrice } from '@Constants/generalConstants';
import { fixForItemPricesWithoutChange } from '@Lib/common/utility';
import styles from '@Styles/components/common/productPriceSection.module.scss';
import { Variant } from '@Types/cms/schema/pdp/pdpData.schema';

type Props = {
  variant: Variant;
  productName: string;
  isGiftCardDetailPage?: boolean;
};

export default function ProductPricingSection({
  variant,
  productName,
  isGiftCardDetailPage
}: Props): JSX.Element {
  const { marketPrice, discountedPrice, variantPrice } = variant?.price;
  const yourPrice = variant.attributes.yourPrice && !discountedPrice;
  const isNotRegularPrice = discountedPrice || yourPrice;
  let priceModificationDescription = '';

  if (discountedPrice?.discountedPrice) {
    priceModificationDescription = discountedPrice?.discountName;
  } else if (yourPrice && marketPrice !== 0) {
    priceModificationDescription = `${productName} Always ${variantPrice} - Marked Price ${marketPrice}*`;
  }

  const isInStoreOnlyProduct =
    variant?.attributes?.availability?.key?.toLowerCase() === 'in_store_only';
  let productPurchasePrice = 0;
  let productPurchasePriceFormatted = '0.00';
  if (!isInStoreOnlyProduct) {
    if (isNotRegularPrice) {
      productPurchasePrice = discountedPrice?.discountedPrice || variantPrice;
    } else if (yourPrice && marketPrice !== 0) {
      productPurchasePrice = marketPrice;
    } else {
      productPurchasePrice = variantPrice;
    }

    productPurchasePriceFormatted = fixForItemPricesWithoutChange(productPurchasePrice);
  }

  return (
    <>
      {!isGiftCardDetailPage && (
        <>
          {yourPrice && marketPrice === 0 && <p className={styles.yourPrice}>Your price*</p>}
          <div className={styles.price}>
            {isNotRegularPrice && (
              <div className={styles.priceSale}>
                ${discountedPrice?.discountedPrice.toFixed(2) || variantPrice}
              </div>
            )}
            <div className={isNotRegularPrice && styles.priceStrikeThrough}>
              {yourPrice && marketPrice !== 0 && `$${marketPrice.toFixed(2)}`}
              {!yourPrice && `$${variantPrice.toFixed(2)}`}
            </div>
          </div>
          <div className={styles.priceSaleDetails}>{priceModificationDescription}</div>
          {discountedPrice?.isAlwaysOn && (
            <div className={styles.priceSaleMessage}>{productPrice.isDiscountAlwaysOn}</div>
          )}
          {!isInStoreOnlyProduct && <PaypalPayLaterMsg price={productPurchasePriceFormatted} />}
        </>
      )}
    </>
  );
}
