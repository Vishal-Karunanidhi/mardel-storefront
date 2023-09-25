import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductTileAddCartComponent from '@Components/cartPage/productTileMain/productTileAddCartComponent';
import WishListProductTileActionComp from '@Components/cartPage/productTileMain/wishListProductTileActionComp';
import ImageWithFallback from '@Components/common/imageWithFallback';
import { roundOfPriceValue } from '@Lib/common/utility';
import ProductTileStyles from '@Styles/cartpage/productTileMain.module.scss';
import colors from '@Lib/common/colors';
import { productStatus } from '@Lib/common/utility';

export default function ProductTileContentComponent(props: any): JSX.Element {
  const {
    pdpUrl,
    variant,
    productName,
    originalPricePerQuantity,
    discountedPricePerQuantity,
    totalPrice,
    quantity,
    isCartAddition = false,
    listId,
    itemId
  } = props;

  const { imageSet, attributes } = variant;
  const { color, dimensions, size } = attributes;
  const [productAvailabilty, setProductAvailabilty] = useState<{
    availability: string;
    color: string;
  }>({
    availability: '',
    color: ''
  });

  let modifiedStrikeoutPrice = originalPricePerQuantity * quantity + '';
  const strikeoutPrice = parseFloat(modifiedStrikeoutPrice).toFixed(2);
  const isDiscountApplicable = parseFloat(strikeoutPrice) === parseFloat(totalPrice);

  const recordToMove = [
    {
      itemId: itemId,
      variantSku: variant?.sku,
      variantKey: variant?.key
    }
  ];

  useEffect(() => {
    const productAvailability = async () => {
      const status = productStatus(variant, null, true);

      switch (status) {
        case 'See Options':
        case 'AddToCart':
          setProductAvailabilty({ availability: 'IN STOCK', color: colors.hlBlue });
          break;
        case 'In store only':
          setProductAvailabilty({ availability: 'ONLY IN STORE', color: colors.hlBlue });
          break;
        case 'Online only':
          setProductAvailabilty({ availability: 'ONLINE ONLY', color: colors.hlBlue });
          break;
        case 'Out of stock':
        case 'NotifyMe':
          setProductAvailabilty({ availability: 'OUT OF STOCK', color: colors.hlRed });
          break;
        default:
          setProductAvailabilty({ availability: '', color: '' });
          break;
      }
    };
    productAvailability();
  }, []);

  // Original and discount Price label component
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
    <div className={ProductTileStyles.productTileAllCompWrapper}>
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
          <Link href={pdpUrl}>
            <a>
              <span className={ProductTileStyles.productName}>{productName}</span>
            </a>
          </Link>
          <span className={ProductTileStyles.productTileAttribute}>
            {(color?.label || color) && (
              <span>
                <b>Color:</b> <span>{color?.label ?? color}</span>
              </span>
            )}{' '}
            {(dimensions?.label || dimensions) && (
              <span>
                <b>Dimensions:</b> <span>{dimensions?.label ?? dimensions}</span>
              </span>
            )}{' '}
            {(size?.label || size) && (
              <span>
                <b>Size:</b> <span>{size?.label ?? size}</span>
              </span>
            )}{' '}
            <span>
              <b>SKU:</b> <span>{variant?.sku}</span>
            </span>
          </span>
          {isCartAddition && (
            <span
              className={ProductTileStyles.productTileAttribute}
              style={{ color: productAvailabilty?.color }}
            >
              {productAvailabilty?.availability}
            </span>
          )}
          <span className={ProductTileStyles.productPrice}>{getPriceLabel()}</span>
        </div>
      </div>

      {/* Wishlist Additional component in product tile
        1.AddToCart
        2.MoveItem
        3.Fav item
        */}

      {isCartAddition && (
        <div className={ProductTileStyles.wishListMoveFavCartContent}>
          <WishListProductTileActionComp
            recordToMove={recordToMove}
            listId={listId}
            itemId={itemId}
          />
          <ProductTileAddCartComponent variant={variant} pdpUrl={pdpUrl} />
        </div>
      )}
    </div>
  );
}
