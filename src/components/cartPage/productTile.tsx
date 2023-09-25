import { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageWithFallback from '@Components/common/imageWithFallback';
import RenderNoticesAndWarnings from '@Components/cartPage/productTileMain/renderNoticesAndWarnings';
import { getPromoBadge, roundOfPriceValue } from '@Lib/common/utility';
import ProductTileStyles from '@Styles/cartpage/productTile.module.scss';

export default function CartProductTile(props: any): JSX.Element {
  const {
    name: productName,
    variant,
    totalPrice,
    quantity,
    originalPricePerQuantity,
    pdpUrl,
    cmsData,
    discountedPricePerQuantity,
    inventoryMessages,
    isCheckoutPage
  } = props;

  const { sku, imageSet, attributes } = variant;
  const { color, dimensions, productOnlineDate, size } = attributes;
  const [promoBadge, setPromoBadge] = useState('');

  let modifiedStrikeoutPrice = originalPricePerQuantity * quantity + '';
  const strikeoutPrice = parseFloat(modifiedStrikeoutPrice).toFixed(2);
  const isDiscountApplicable = parseFloat(strikeoutPrice) === parseFloat(totalPrice);

  useEffect(() => {
    let badgeData = {
      discountedPricePerQuantity,
      productOnlineDate
    };
    const promoBadgeValue = getPromoBadge(badgeData);
    setPromoBadge(promoBadgeValue);
  }, []);

  const getPriceLabel = () => {
    return isDiscountApplicable ? (
      <span className={ProductTileStyles.amount}>
        {roundOfPriceValue(originalPricePerQuantity)}
      </span>
    ) : (
      <span className={ProductTileStyles.amount}>
        {discountedPricePerQuantity ? (
          <span className={ProductTileStyles.discountAmount}>
            {roundOfPriceValue(discountedPricePerQuantity ?? totalPrice)}{' '}
          </span>
        ) : (
          <></>
        )}
        {originalPricePerQuantity ? (
          <span className={ProductTileStyles.strikeAmount}>
            {roundOfPriceValue(originalPricePerQuantity)}
          </span>
        ) : (
          <span className={ProductTileStyles.amount}>{roundOfPriceValue(totalPrice)}</span>
        )}
      </span>
    );
  };

  return (
    <>
      {promoBadge && (
        <div
          className={ProductTileStyles.badgeCartItems}
          style={
            promoBadge === 'NEW'
              ? { background: '#003087', marginTop: -18 }
              : { background: '#B53315', marginTop: -18 }
          }
        >
          <span className={ProductTileStyles.badgeTitle}> {promoBadge} </span>
        </div>
      )}

      <div
        className={
          promoBadge
            ? ProductTileStyles.productTileBadgeWrapper
            : ProductTileStyles.productTileMainWrapper
        }
      >
        <div className={ProductTileStyles.productTileImageAndContent}>
          <div>
            <Link href={pdpUrl}>
              <a>
                <ImageWithFallback
                  src={`${imageSet}?w=75&h=75`}
                  width={75}
                  height={75}
                  layout="fixed"
                />
              </a>
            </Link>
          </div>

          <div className={ProductTileStyles.productTileContent}>
            <span className={ProductTileStyles.productName}>{productName}</span>
            <span className={ProductTileStyles.productTileAttribute}>
              {color?.label || color ? (
                <span>
                  <b>Color:</b> <span>{color?.label ?? color}</span>
                </span>
              ) : (
                <></>
              )}{' '}
              {dimensions?.label || dimensions ? (
                <span>
                  <b>Dimensions:</b> <span>{dimensions?.label ?? dimensions}</span>
                </span>
              ) : (
                <></>
              )}{' '}
              {size?.label || size ? (
                <span>
                  <b>Size:</b> <span>{size?.label ?? size}</span>
                </span>
              ) : (
                <></>
              )}{' '}
              <span>
                <b>SKU:</b> <span>{variant?.sku}</span>
              </span>
            </span>
            {isCheckoutPage && (
              <span className={ProductTileStyles.quantity}>
                <b>Quantity:</b>
                <span>{quantity}</span>
              </span>
            )}
            <span className={ProductTileStyles.productPrice}> {getPriceLabel()}</span>
          </div>
        </div>
        <div className={ProductTileStyles.productTileNoticesWarnings}>
          {cmsData && (
            <RenderNoticesAndWarnings
              attributes={attributes}
              cmsData={cmsData}
              inventoryMessages={inventoryMessages}
              productName={productName}
            />
          )}
        </div>
      </div>
    </>
  );
}
