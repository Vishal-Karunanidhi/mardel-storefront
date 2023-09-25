import Link from 'next/link';
import ImageWithFallback from '@Components/common/imageWithFallback';
import { dialogContent } from '@Constants/quickOrder';
import styles from '@Styles/quickOrder/productTile.module.scss';

export default function ProductTile(props: any): JSX.Element {
  const {
    name: productName,
    variant,
    cmsData,
    isPlainSummary,
    pdpUrl,
    removeLineItem,
    maxStock
  } = props;

  const { sku, imageSet, attributes, price } = variant;
  const { color, dimensions, size } = attributes;
  const {
    variantPrice,
    discountedPrice: discountPrice
  } = price;
  const discountedPrice = discountPrice?.discountedPrice??variantPrice
  const isDiscountApplicable = parseFloat(variantPrice) !== parseFloat(discountedPrice);
  const { isMaximumStockAdded, maxCount: isStockUnavailable, availability } = maxStock[sku] ?? {};
  let productNotice = [];
  (() => {
    const {
      productWarnings,
      productHazards,
      excludeFreeShipping,
      additionalShipping,
      excludedStates
    } = attributes;
    const { warningNotices } = cmsData ?? {};

    const parseNotices = (inputData) => {
      const msgArray = inputData?.split(':') ?? ['', ''];
      return `<b>${msgArray?.[0] ?? ''}</b>: ${msgArray?.[1] ?? ''}`;
    };

    if (productWarnings) {
      productNotice.push({
        icon: 'warning',
        value: productWarnings.label
      });
    }
    if (productHazards) {
      productNotice.push({
        icon: 'hazard',
        value: productHazards.label
      });
    }
    if (excludedStates?.length) {
      const states = excludedStates.map((e) => e.label).join(', ');
      productNotice.push({
        icon: 'notice',
        value: `${parseNotices(warningNotices?.noAirShipping)}: ${states}`
      });
    }
    if (additionalShipping) {
      productNotice.push({
        icon: 'notice',
        value: `${parseNotices(warningNotices?.additionalShipping)}${parseFloat(
          additionalShipping
        ).toFixed(2)}`
      });
    }
    if (excludeFreeShipping) {
      productNotice.push({
        icon: 'notice',
        value: parseNotices(warningNotices?.excludeFreeShipping)
      });
    }
    if (isMaximumStockAdded) {
      productNotice.push({
        value: `<b style="color:${styles.hlError};">${warningNotices?.maximumStockLimit}</b>`
      });
    }

    if (!isStockUnavailable) {
      productNotice.push({
        value: `<b style="color:${styles.hlError};">${dialogContent.outofstock}</b>`
      });
    }

    if (availability === 'in_store_only') {
      productNotice.push({
        value: `<b style="color:${styles.hlError};">${dialogContent.instore}</b>`
      });
    }
  })();

  const getPriceLabel = () => {
    return !isDiscountApplicable ? (
      <label className={styles.amount}>${parseFloat(variantPrice).toFixed(2)}</label>
    ) : (
      <label className={styles.amount}>
        <label style={{ color: '#B40000' }}>${parseFloat(discountedPrice).toFixed(2)} </label>
        <label style={{ textDecoration: 'line-through', fontWeight: 'normal', marginLeft: 4 }}>
          ${parseFloat(variantPrice).toFixed(2)}
        </label>
      </label>
    );
  };

  const renderNoticesAndWarnings = () => {
    return productNotice.map((e, i: number) => (
      <div style={{ display: 'flex', flexDirection: 'row' }} key={i}>
        <div className={styles.notice} style={{ marginLeft: 0 }}>
          <label
            className={styles.badgeTitle}
            dangerouslySetInnerHTML={{ __html: e.value }}
          ></label>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className={styles.cartItems}>
        <div className={styles.productMainSection}>
          <div className={styles.imageSection}>
            <Link href={pdpUrl}>
              <a>
                <ImageWithFallback
                  src={`${imageSet}?w=85&h=85`}
                  width={85}
                  height={85}
                  layout="fixed"
                />
              </a>
            </Link>
          </div>

          <div className={styles.cartSection}>
            <div className={styles.cartDescription}>
              <div className={styles.cartTitleDiv}>
                <Link href={pdpUrl}>
                  <a>
                    <label className={styles.cartTitle}> {productName} </label>
                  </a>
                </Link>
              </div>
            </div>

            <div className={styles.cartProperty}>
              <div className={styles.flexRow}>
                {color?.label ? (
                  <span className={styles.colorSpan}>
                    <label className={styles.colorTitle}> Color:</label>
                    <label className={styles.colorValue}>&nbsp;{color?.label}</label>
                  </span>
                ) : (
                  <></>
                )}

                {dimensions?.label ? (
                  <span className={styles.colorSpan}>
                    <label className={styles.colorTitle}> Dimensions:</label>
                    <label className={styles.colorValue}>&nbsp;{dimensions?.label}</label>
                  </span>
                ) : (
                  <></>
                )}

                {size?.label ? (
                  <span className={styles.colorSpan}>
                    <label className={styles.colorTitle}> Size::</label>
                    <label className={styles.colorValue}>&nbsp;{size?.label}</label>
                  </span>
                ) : (
                  <></>
                )}

                <span className={styles.colorSpan}>
                  <label className={styles.colorTitle}> {cmsData?.labels?.sku}:</label>
                  <label className={styles.colorValue}>&nbsp;{sku}</label>
                </span>
              </div>
            </div>

            <div className={styles.cartAmountSection}>
              <div className={styles.cartAmountWrap}>{getPriceLabel()}</div>
              {!isPlainSummary && (
                <>
                  <span className={styles.deleteButtonSpan}>
                    <button className={styles.deleteButton}>
                      <img
                        src="/icons/deleteIcon.svg"
                        alt={'Delete'}
                        width={20}
                        height={20}
                        aria-label="delete"
                        onClick={removeLineItem}
                      />
                    </button>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        {productNotice?.length > 0 && renderNoticesAndWarnings()}
      </div>
    </>
  );
}
