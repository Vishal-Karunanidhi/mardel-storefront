import { useState, useEffect } from 'react';

import RenderNoticesAndWarnings from '@Components/cartPage/productTileMain/renderNoticesAndWarnings';
import ProductTileFavComponent from '@Components/cartPage/productTileMain/productTileFavComponent';
import ProductTileActionComponent from '@Components/cartPage/productTileMain/productTileActionComponent';
import ProductTileContentComponent from '@Components/cartPage/productTileMain/productTileContentComponent';

import { getPromoBadge } from '@Lib/common/utility';

import ProductTileStyles from '@Styles/cartpage/productTileMain.module.scss';

export default function ProductTile(props: any): JSX.Element {
  const {
    name: productName,
    id: lineItemId,
    variant,
    totalPrice,
    quantity,
    originalPricePerQuantity,
    pdpUrl,
    cmsData,
    discountedPricePerQuantity,
    inventoryMessages,
    isCheckoutPage = false,
    isCartAddition = false,
    listId = '',
    itemId = ''
  } = props;

  const isShowActionComponent = !isCheckoutPage;

  const { attributes, key } = variant;
  const { productOnlineDate } = attributes;
  const [promoBadge, setPromoBadge] = useState('');

  if (totalPrice) {
    variant.price = { variantPrice: totalPrice };
  }

  const favouriteCompData = {
    productData: {
      name: productName,
      variantPickerKeys: []
    },
    variant,
    imageUrl: variant?.imageSet,
    pageType: 'cart page'
  };

  useEffect(() => {
    let badgeData = {
      discountedPricePerQuantity,
      productOnlineDate
    };
    const promoBadgeValue = getPromoBadge(badgeData);
    setPromoBadge(promoBadgeValue);
  }, []);

  const productTileContentProps = {
    pdpUrl,
    productName,
    discountedPricePerQuantity,
    originalPricePerQuantity,
    totalPrice,
    quantity,
    variant
  };

  const productTileActionProps = {
    quantity,
    originalPricePerQuantity,
    lineItemId,
    variantKey: key
  };

  const noticesWarningsProps = {
    attributes,
    cmsData,
    inventoryMessages,
    productName
  };

  const newPromoClass = promoBadge === 'NEW' ? ProductTileStyles.promoBadgeNew : '';

  return (
    <div className={ProductTileStyles.productWrapper}>
      {promoBadge && (
        <div className={`${ProductTileStyles.badgeCartItems} ${newPromoClass}`}>
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
        {isShowActionComponent && (
          <ProductTileFavComponent promoBadge={promoBadge} favouriteCompData={favouriteCompData} />
        )}

        <ProductTileContentComponent
          {...productTileContentProps}
          isCartAddition={isCartAddition}
          listId={listId}
          itemId={itemId}
        />

        {isShowActionComponent && (
          <ProductTileActionComponent key={lineItemId} {...props} {...productTileActionProps} />
        )}

        <div className={ProductTileStyles.productTileNoticesWarnings}>
          {cmsData && <RenderNoticesAndWarnings {...noticesWarningsProps} />}
        </div>
      </div>
    </div>
  );
}
