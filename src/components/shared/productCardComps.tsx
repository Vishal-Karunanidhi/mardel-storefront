import Link from 'next/link';
import { useSelector } from '@Redux/store';
import colors from '@Lib/common/colors';
import AddToCart from '@Components/productDetailPage/productAvailable/addToCart';
import NotifyMeModal from '@Components/shared/notifyMeModal';
import styles from '@Styles/components/slider/cards/featuredItemCard.module.scss';
import HlButton from '@Components/common/button';
import {
  fixForItemPricesWithoutChange,
  handleProductSelectListItemEvent
} from '@Lib/common/utility';

const ADD_TO_CART = 'Add To Cart';
const OUT_OF_STOCK = 'Out Of Stock';
const IN_STORE_ONLY = 'In Store Only';
const NOTIFY_ME = 'Notify Me';
const SEE_MORE_OPTIONS = 'See More Options';

const validateStockAndAvailability = (productData, pageType) => {
  const {
    name,
    sku,
    productName,
    picker,
    isInStock,
    backInStockEligible,
    availability,
    productKey,
    pdpUrl: productUrl,
    [ 'product.isInStock']: variantsInStock 
  } = productData;

  let isSrpPage = pageType?.isSrpPage;

  const isMultiVariant = picker?.length > 0 && !isSrpPage;

  /*Business Confirmation to use productname for all PLP*/
  const displayName = isSrpPage ? name : productName;

  let daysSinceOnline = 1000;
  (() => {
    const productOnlineDate = productData['product-online-date'];
    if (productOnlineDate) {
      const today = new Date();
      const dateAdded = new Date(productOnlineDate);
      const timeDifference = today.getTime() - dateAdded.getTime();
      daysSinceOnline = timeDifference / (1000 * 3600 * 24);
    }
  })();

  let buttonDisabled = false,
    showActionButton = true,
    ctaName = '';
  if (isMultiVariant) {
    ctaName = SEE_MORE_OPTIONS;
  } else {
    if (isInStock || availability === 'IN_STORE_ONLY') {
      switch (availability) {
        case 'IN_STORE_ONLY':
        case 'IN STORE ONLY':
          ctaName = IN_STORE_ONLY;
          break;

        case 'OOS_ONLINE':
        case 'OOS ONLINE':
          ctaName = SEE_MORE_OPTIONS;
          break;

        case 'BOTH':
        case 'ONLINE_ONLY':
        case 'ONLINE ONLY':
        default:
          ctaName = ADD_TO_CART;
          break;
      }
    } else {
      if (backInStockEligible) {
        ctaName = NOTIFY_ME;
      } else {
        ctaName = OUT_OF_STOCK;
        buttonDisabled = true;
      }
    }
  }

  const pdpUrl = productUrl ?? `/product/${productKey}`;
  const variantUrl = productData['variantUrl'] ?? `/product/${productData['objectID']}`;
  const hrefToRender = isMultiVariant ? pdpUrl : variantUrl;

  return {
    displayName,
    isMultiVariant,
    daysSinceOnline,
    isInStock,

    ctaName,
    showActionButton,
    buttonDisabled,
    availability,
    pdpUrl,
    variantUrl,
    hrefToRender: isSrpPage ? variantUrl : hrefToRender,
    isGiftCardSku: sku?.indexOf('gc-') !== -1
  };
};

const PriceRange = (priceProps) => {
  const { original, low, high } = priceProps;
  let comp = <></>;
  if (low && high && low != high) {
    comp = (
      <span>
        {fixForItemPricesWithoutChange(low)}-{fixForItemPricesWithoutChange(high)}
      </span>
    );
  } else if (original) {
    comp = <span>{fixForItemPricesWithoutChange(original)}</span>;
  }

  return comp;
};

const AvailabilityComp = (availProps) => {
  const { availability, isInStock, isMultiVariant } = availProps;
  const defaultStyle = { color: colors.hlBlue };
  const ooSStyle = { color: colors.hlRed };

  let comp = (
    <span className={styles.stockNotice} style={ooSStyle}>
      OUT OF STOCK
    </span>
  );
  if (isInStock && !availability) {
    comp = (
      <span className={styles.stockNotice} style={defaultStyle}>
        IN STOCK
      </span>
    );
  }
  switch (availability) {
    case 'BOTH':
    case 'ONLINE_ONLY':
    case 'ONLINE ONLY':
      comp = !isMultiVariant && (
        <span className={styles.stockNotice} style={isInStock ? defaultStyle : ooSStyle}>
          {isInStock ? 'IN STOCK' : 'OUT OF STOCK'}
        </span>
      );
      break;

    case 'IN_STORE_ONLY':
    case 'IN STORE ONLY':
      comp = (
        <span className={styles.stockNotice} style={defaultStyle}>
          IN STORE ONLY
        </span>
      );
      break;

    case 'OOS_ONLINE':
    case 'OOS ONLINE':
      comp = (
        <span className={styles.stockNotice} style={ooSStyle}>
          OUT OF STOCK ONLINE
        </span>
      );
      break;
  }
  return <>{comp}</>;
};

const PromoComp = (promoProps) => {
  let comp = <></>;
  const { hlRed, hlBlue, transparent } = colors;
  const { original, discountedPrice, daysSinceOnline, isMobileView = false } = promoProps;
  if (discountedPrice && original !== discountedPrice) {
    comp = <span>SALE</span>;
  } else if (daysSinceOnline < 60) {
    comp = <span>NEW</span>;
  }

  return isMobileView ? (
    <>{comp}</>
  ) : (
    <section
      className={styles.promoAlert}
      style={{
        borderRadius: '10px 10px 0px 0px',
        margin: '-1px',
        backgroundColor:
          original !== discountedPrice ? hlRed : daysSinceOnline < 60 ? hlBlue : transparent
      }}
    >
      {comp}
    </section>
  );
};

const ActionButtonLabel = (actionButtonProps) => {
  const { color, ctaName } = actionButtonProps;
  const defStyle = { color };
  return <span style={defStyle}>{ctaName}</span>;
};

const ActionButton = (actionButtonProps) => {
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

  let { ctaName, productName, isInStock, [ 'product.isInStock']: variantsInStock } = actionButtonProps;
  const { sku, objectID, pdpUrl, isGiftCardSku, ga4EcommItem, listName } = actionButtonProps;
  let comp = <></>;

  if ((pageType?.isGiftCardsCategory || isGiftCardSku) && ctaName === ADD_TO_CART) {
    ctaName = SEE_MORE_OPTIONS;
  }
  if (ctaName == (SEE_MORE_OPTIONS || 'See More Options') && !isInStock && !variantsInStock) {
    ctaName = OUT_OF_STOCK;
  }
  switch (ctaName) {
    case ADD_TO_CART:
      comp = (
        <AddToCart
          {...actionButtonProps}
          buttonTitle={ctaName}
          nonPdpPage={true}
          variantDetails={{
            key: objectID,
            sku
          }}
          productName={productName}
        />
      );
      break;

    case NOTIFY_ME:
      comp = (
        <NotifyMeModal
          variantDetails={{
            key: objectID,
            sku
          }}
          productName={productName}
          ga4EcommItem={ga4EcommItem}
          listName={listName}
        />
      );
      break;

    case OUT_OF_STOCK:
      comp = <HlButton buttonTitle={OUT_OF_STOCK} isDisabled={true} />;
      break;

    case SEE_MORE_OPTIONS:
      comp = (
        <Link href={pdpUrl} passHref>
          <a
            onClick={() =>
              handleProductSelectListItemEvent(ga4EcommItem, listName, sessionId, isLoggedInUser)
            }
          >
            <HlButton buttonTitle={ctaName} />
          </a>
        </Link>
      );
      break;
    case IN_STORE_ONLY:
      comp = (
        <Link href={pdpUrl} passHref>
          <a
            onClick={() =>
              handleProductSelectListItemEvent(
                ga4EcommItem,
                listName,
                heartBeatInfo?.sessionId,
                heartBeatInfo?.isLoggedInUser
              )
            }
          >
            <HlButton buttonTitle={'View Product'} />
          </a>
        </Link>
      );
      break;
  }
  return <>{comp}</>;
};

export {
  validateStockAndAvailability,
  PriceRange,
  AvailabilityComp,
  PromoComp,
  ActionButtonLabel,
  ActionButton
};
