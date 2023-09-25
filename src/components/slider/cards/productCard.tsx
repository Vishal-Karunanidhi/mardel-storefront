import { useState, useEffect } from 'react';
import ProductAvailable from '@Components/productDetailPage/productAvailable/productAvailable';
import ProductFavoriteComponent from '@Components/common/productFavoriteComponent';
import {
  productStatus,
  checkGiftCard,
  variantStatusLabel,
  fixForItemPricesWithoutChange,
  imageUrlQuery,
  handleProductSelectListItemEvent
} from '@Lib/common/utility';
import colors from '@Lib/common/colors';
import styles from '@Styles/components/slider/cards/featuredItemCard.module.scss';
import GiftCardPriceComp from '@Components/plp/giftCardPriceComp';
import RatingRatingSection from '@Components/common/productRatingSection';
import { Ga4EcommerceItem } from 'src/interfaces/ga4EcommerceItem';
import { useSelector } from '@Redux/store';

function ProductCard({ productData, pageType = '', productListName = '' }) {
  const [priceLow, setPriceLow] = useState<number | null>(null);
  const [discountedPriceLow, setDiscountedPriceLow] = useState<number | null>(null);

  const [price, setPrice] = useState<number | null>(null);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);

  const [masterVariant, setMasterVariant] = useState<any>();
  const [buttonProps, setButtonProps] = useState<{ availability: string; color: string }>({
    availability: '',
    color: ''
  });
  const [productOnlineDate, setProductOnlineDate] = useState<string | null>(null);
  const [daysSinceOnline, setDaysSinceOnline] = useState<number>();
  const isGiftCardSku = checkGiftCard(productData.variants);

  const {
    heartBeatInfo: { sessionId, isLoggedInUser }
  } = useSelector((state) => state.auth);

  const PriceRange = () => {
    if (priceLow && price && price != priceLow) {
      return (
        <span>
          {fixForItemPricesWithoutChange(priceLow)} - {fixForItemPricesWithoutChange(price)}
        </span>
      );
    } else if (price) {
      return <span>{`$${price}`}</span>;
    } else {
      <span></span>;
    }
  };

  const DiscountPriceRange = () => {
    if (!discountedPriceLow && !discountedPrice) {
      return <span>{''}</span>;
    } else if (discountedPrice && !discountedPriceLow) {
      return <span>{'$' + discountedPrice}</span>;
    } else if (discountedPrice === discountedPriceLow) {
      return <span>{'$' + discountedPrice}</span>;
    } else if (discountedPrice && discountedPriceLow) {
      return <span>{`$${discountedPriceLow} - $${discountedPrice}`}</span>;
    } else {
      return <span></span>;
    }
  };

  const Availability = (): void => {
    const status = productStatus(null, productData, true);
    setButtonProps(variantStatusLabel(status));
  };

  const Promo = () => {
    if (discountedPrice) {
      return <span>SALE</span>;
    } else if (daysSinceOnline < 60) {
      return <span>NEW</span>;
    } else {
      return <span></span>;
    }
  };

  useEffect(() => {
    if (masterVariant && masterVariant.attributes) {
      setProductOnlineDate(masterVariant.attributes.productOnlineDate);
    }
  }, [masterVariant]);

  useEffect(() => {
    if (productOnlineDate) {
      const today = new Date();
      const dateAdded = new Date(productOnlineDate);
      const timeDifference = today.getTime() - dateAdded.getTime();
      const differenceInDays = timeDifference / (1000 * 3600 * 24);
      setDaysSinceOnline(differenceInDays);
    }
  }, [productOnlineDate]);

  useEffect(() => {
    if (productData.variants) {
      Availability();
      let findMasterVariant = productData.variants.find((variant) => variant.isMasterVariant);
      setMasterVariant(findMasterVariant);
    }

    if (productData) {
      if (productData.variants.length === 1) {
        productData.variants[0].price && setPrice(productData.variants[0].price.variantPrice);
        productData.variants[0].price &&
          productData.variants[0].price.discountedPrice &&
          setDiscountedPrice(productData.variants[0].price.discountedPrice.discountedPrice);
      } else if (productData.variants.length > 1) {
        let prices = [];
        let discountedPrices = [];

        productData.variants.forEach((variant) => {
          if (variant.price) {
            let variantPrice = variant.price.variantPrice;
            let discountPrice =
              variant.price.discountedPrice && variant.price.discountedPrice.discountedPrice;
            if (variantPrice) {
              prices.push(variantPrice);
            }
            if (discountPrice) {
              discountedPrices.push(discountPrice);
            }
          }
        });

        if (prices.length > 0) {
          setPriceLow(Math.min(...prices));
          setPrice(Math.max(...prices));
        } else {
          setPriceLow(null);
          setPrice(null);
        }

        if (discountedPrices.length > 0) {
          setDiscountedPriceLow(Math.min(...discountedPrices));
          setDiscountedPrice(Math.max(...discountedPrices));
        } else {
          setDiscountedPriceLow(null);
          setDiscountedPrice(null);
        }
      }
    }
  }, [productData]);

  const variant = productData?.variants?.[0];
  const favouriteCompData = {
    productData,
    imageUrl: variant?.imageSet,
    imageSize: 110,
    pageType
  };

  const item: Ga4EcommerceItem = {
    affiliation: '',
    coupon: '',
    currency: 'USD',
    discount: discountedPrice ? price - discountedPrice : 0,
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
    item_name: productData.name,
    item_variant: '',
    price: discountedPrice ? discountedPrice : price,
    quantity: 1
  };

  return (
    <>
      <div className={styles.card}>
        <section
          className={styles.promoAlert}
          style={{
            backgroundColor: discountedPrice
              ? colors.hlRed
              : daysSinceOnline < 60
              ? colors.hlBlue
              : colors.hlWhite
          }}
        >
          <Promo />
        </section>

        <section className={styles.top}>
          <ProductFavoriteComponent
            {...favouriteCompData}
            additionalIconClass={styles.favoriteIcon}
          />
          <div className={styles.productImageContainer}>
            <a
              href={productData.pdpUrl}
              data-testid="productcard-image"
              onClick={() => {
                handleProductSelectListItemEvent(item, pageType, sessionId, isLoggedInUser);
              }}
            >
              <img
                alt="Product Image Thumbnail"
                className={styles.productImage}
                src={imageUrlQuery(masterVariant && masterVariant.imageSet, 300)}
              />
            </a>
          </div>
        </section>

        <section className={styles.middle}>
          <div className={styles.outOfStock}>
            <span style={{ color: buttonProps.color }}>{buttonProps.availability}</span>
          </div>
          <div className={styles.productDescription}>
            <a
              href={productData.pdpUrl}
              data-testid="productcard-description-link"
              onClick={() => {
                handleProductSelectListItemEvent(item, pageType, sessionId, isLoggedInUser);
              }}
            >
              {productData.name}
            </a>
          </div>
          <RatingRatingSection
            averageRating={productData.rating.averageRating}
            reviewCount={productData.rating.numberOfRatings}
            isGiftCardDetailPage={false}
          />
        </section>

        <section className={styles.bottom}>
          <div className={styles.productPrice}>
            <div className={styles.currentPrice}>
              <DiscountPriceRange />
            </div>
            <div
              className={!discountedPrice ? styles.currentPrice : styles.previousPrice}
              style={{ color: colors.hlBlack, textDecoration: discountedPrice && 'line-through' }}
            >
              <PriceRange />
            </div>
          </div>
          <GiftCardPriceComp isGiftCardSku={isGiftCardSku} />
          <div className={styles.addToCart}>
            <ProductAvailable
              product={productData}
              productName={productData.name}
              productListName={productListName}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default ProductCard;
