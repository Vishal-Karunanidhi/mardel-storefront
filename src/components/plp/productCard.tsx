import { useSelector } from '@Redux/store';
import Rating from '@mui/material/Rating';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ImageWithFallback from '@Components/common/imageWithFallback';
import ProductFavoriteComponent from '@Components/common/productFavoriteComponent';
import GiftCardPriceComp from '@Components/plp/giftCardPriceComp';
import {
  PriceRange,
  AvailabilityComp,
  PromoComp,
  ActionButton,
  validateStockAndAvailability
} from '@Components/shared/productCardComps';
import { productClickEvent } from '@Lib/cms/plp';
import {
  fixForItemPricesWithoutChange,
  handleProductSelectListItemEvent,
  imageUrlQuery
} from '@Lib/common/utility';
import colors from '@Lib/common/colors';
import { algoliaClickEvents } from '@Constants/generalConstants';
import styles from '@Styles/components/slider/cards/featuredItemCard.module.scss';
import CatStyles from '@Styles/plp/categoryListingPages.module.scss';
import { PdpPageData } from '@Types/cms/compiled/pdp.compiled';
import { Variant } from '@Types/cms/schema/pdp/pdpData.schema';
import { Ga4EcommerceItem } from 'src/interfaces/ga4EcommerceItem';

const RatingDivComp = ({
  isMobile = false,
  isGiftCardSku = false,
  reviewCount = 0,
  averageRating = 0
}) => {
  const { pageType } = useSelector((state) => state.layout) ?? {};

  if (pageType?.isGiftCardsCategory || isGiftCardSku) {
    return <></>;
  }
  return (
    <>
      <Rating
        readOnly
        precision={0.5}
        value={averageRating}
        style={{ color: colors.hlRed }}
        size={isMobile ? 'small' : 'medium'}
        emptyIcon={<StarBorderIcon fontSize="inherit" style={{ color: colors.hlRed }} />}
      />
      <div style={{ margin: '0 0 0 0.25rem' }}>
        <a href="#">
          (<span style={{ textDecoration: 'underline' }}>{reviewCount ?? 0}</span>)
        </a>
      </div>
    </>
  );
};

function ProductCard({ isMobile, productData, listName = '' }) {
  const { pageType } = useSelector((state) => state.layout) ?? {};
  const { heartBeatInfo } = useSelector((state) => state.auth) ?? {};

  let sessionId: string = '';
  let isLoggedInUser: boolean = false;

  if (heartBeatInfo) {
    if (heartBeatInfo.sessionId) {
      sessionId = heartBeatInfo.sessionId;
    }
    if (heartBeatInfo.isLoggedInUser) {
      isLoggedInUser = heartBeatInfo.isLoggedInUser;
    }
  }

  const {
    ['variant.price']: original,
    ['product.lowestOriginalPrice']: originalLow,
    ['product.highestOriginalPrice']: originalHigh,

    ['sku.discountedPrice']: discountedPrice,
    ['product.lowestDiscountedPrice']: discountLow,
    ['product.highestDiscountedPrice']: discountHigh,
    ['ratings.count']: reviewCount,
    ['ratings.average']: averageRating,
    ['product.isInStock']: variantsInStock
  } = productData;

  /*Compute Data based on props*/
  const {
    displayName,
    daysSinceOnline,
    availability,
    isInStock,
    showActionButton,
    ctaName,
    isMultiVariant,
    hrefToRender,
    isGiftCardSku
  } = validateStockAndAvailability(productData, pageType);

  const item: Ga4EcommerceItem = {
    affiliation: '',
    coupon: '',
    currency: 'USD',
    discount: discountedPrice ? original - discountedPrice : 0,
    index: '',
    item_brand: '',
    item_category: '',
    item_category2: '',
    item_category3: '',
    item_category4: '',
    item_category5: '',
    item_id: productData.sku,
    item_list_id: '',
    item_list_name: '',
    item_name: displayName,
    item_variant: '',
    price: discountedPrice ? discountedPrice : original,
    quantity: 1
  };

  const DisplayNameComp = ({ hrefToRender, displayName, isGiftCardSku }) => {
    const { pageType } = useSelector((state) => state.layout) ?? {};

    let nameItem = <>{displayName}</>;
    if (pageType?.isGiftCardsCategory || isGiftCardSku) {
      nameItem = <b>{displayName}</b>;
    }

    return (
      <div>
        <a
          href={hrefToRender}
          onClick={() =>
            handleProductSelectListItemEvent(item, listName, sessionId, isLoggedInUser)
          }
        >
          {nameItem}
        </a>
      </div>
    );
  };

  const algoliaClickEvent = async (eventName: String) => {
    if (pageType?.isPlpPage || pageType?.isSrpPage) {
      const variantIds = [productData?.objectID];
      const payload = {
        positions: productData?.__position,
        queryId: productData?.__queryID,
        variantIds,
        eventName
      };
      await productClickEvent(payload);
    }
  };

  const OrignalPriceRangeComp = (
    <div
      className={!discountedPrice ? styles.currentPrice : styles.previousPrice}
      style={{ color: colors.hlBlack, textDecoration: discountedPrice && 'line-through' }}
    >
      <PriceRange original={original} low={originalLow} high={originalHigh} />
    </div>
  );
  const DiscountPriceRangeComp = (
    <div className={styles.currentPrice}>
      <PriceRange original={discountedPrice} low={discountLow} high={discountHigh} />
    </div>
  );

  const getVariantPriceSection = () => {
    if (!discountedPrice && !original) {
      return <></>;
    }

    if (!discountedPrice || discountedPrice === original) {
      return (
        <div
          className={!discountedPrice ? styles.currentPrice : styles.previousPrice}
          style={{ color: colors.hlBlack, textDecoration: discountedPrice && 'line-through' }}
        >
          {fixForItemPricesWithoutChange(original)}
        </div>
      );
    }
    return (
      <>
        <div className={styles.currentPrice}>{fixForItemPricesWithoutChange(discountedPrice)}</div>
        <div
          className={!discountedPrice ? styles.currentPrice : styles.previousPrice}
          style={{ color: colors.hlBlack, textDecoration: discountedPrice && 'line-through' }}
        >
          {fixForItemPricesWithoutChange(original)}
        </div>
      </>
    );
  };

  const favouriteCompData = {
    imageUrl: productData?.images?.[0]?.url,
    productData: {
      name: productData?.productName,
      variantPickerKeys: []
    } as PdpPageData,
    variant: {
      attributes: {},
      key: productData?.productKey,
      sku: productData?.sku,
      price: {
        discountedPrice: { discountedPrice: productData?.['sku.discountedPrice'] },
        variantPrice: productData?.['variant.price']
      }
    } as Variant
  };

  const cumulativePriceSection = pageType?.isSrpPage ? (
    getVariantPriceSection()
  ) : (
    <>
      {DiscountPriceRangeComp} {OrignalPriceRangeComp}
    </>
  );

  return (
    <div>
      <div className={CatStyles.mobileParentCard}>
        <PromoComp
          original={original}
          discountedPrice={discountedPrice}
          daysSinceOnline={daysSinceOnline}
        />
        <div className={CatStyles.favIconWrapper}>
          <ProductFavoriteComponent
            {...favouriteCompData}
            additionalIconClass={styles.favoriteIcon}
            pageType="product listing page"
          />
        </div>

        <div className={CatStyles.mobileParentDiv}>
          <a href={hrefToRender}>
            <ImageWithFallback src={imageUrlQuery(productData?.images?.[0]?.url, 120, 120)} />
          </a>

          <section>
            <AvailabilityComp
              availability={availability}
              isInStock={isInStock}
              isMultiVariant={variantsInStock ? isMultiVariant : isInStock}
            />

            <DisplayNameComp
              hrefToRender={hrefToRender}
              displayName={displayName}
              isGiftCardSku={isGiftCardSku}
            />

            <div className={CatStyles.ratingDiv}>
              <RatingDivComp
                isMobile={isMobile}
                isGiftCardSku={isGiftCardSku}
                averageRating={averageRating}
                reviewCount={reviewCount}
              />
            </div>

            {cumulativePriceSection}
          </section>
        </div>

        <GiftCardPriceComp isGiftCardSku={isGiftCardSku} />

        <section className={CatStyles.priceAndCtaSection}>
          {showActionButton && (
            <ActionButton
              {...productData}
              ctaName={ctaName}
              pdpUrl={hrefToRender}
              isGiftCardSku={isGiftCardSku}
              algoliaClickEvent={algoliaClickEvent}
              ga4EcommItem={item}
              listName={listName}
            />
          )}
        </section>
      </div>

      <div className={CatStyles.parentCard}>
        <PromoComp
          original={original}
          discountedPrice={discountedPrice}
          daysSinceOnline={daysSinceOnline}
        />

        <section className={CatStyles.imageSection}>
          <ProductFavoriteComponent
            {...favouriteCompData}
            additionalIconClass={styles.favoriteIcon}
            pageType="product listing page"
          />
          <div onClick={() => algoliaClickEvent(algoliaClickEvents.PRODUCT_CLICKED)}>
            <a
              href={hrefToRender}
              onClick={() =>
                handleProductSelectListItemEvent(
                  item,
                  listName,
                  heartBeatInfo?.sessionId,
                  heartBeatInfo?.isLoggedInUser
                )
              }
            >
              <ImageWithFallback src={imageUrlQuery(productData?.images?.[0]?.url, 300, 300)} />
            </a>
          </div>
        </section>

        <section className={CatStyles.ratingAvailabilitySection}>
          <AvailabilityComp
            availability={availability}
            isInStock={isInStock}
            isMultiVariant={variantsInStock ? isMultiVariant : isInStock}
            className={CatStyles.outOfStock}
          />

          <DisplayNameComp
            hrefToRender={hrefToRender}
            displayName={displayName}
            isGiftCardSku={isGiftCardSku}
          />

          <div className={CatStyles.ratingDiv}>
            <RatingDivComp
              isMobile={isMobile}
              isGiftCardSku={isGiftCardSku}
              averageRating={averageRating}
              reviewCount={reviewCount}
            />
          </div>
        </section>

        <section className={CatStyles.priceAndCtaSection}>
          {cumulativePriceSection}
          <GiftCardPriceComp isGiftCardSku={isGiftCardSku} />
          {/* TODO: Remove once OutOfStock and Notify me is tested and done */}
          {showActionButton && (
            <ActionButton
              {...productData}
              ctaName={ctaName}
              pdpUrl={hrefToRender}
              isGiftCardSku={isGiftCardSku}
              algoliaClickEvent={algoliaClickEvent}
              ga4EcommItem={item}
              listName={listName}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default ProductCard;

export { RatingDivComp };
