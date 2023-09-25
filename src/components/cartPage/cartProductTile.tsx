import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from '@Redux/store';
import ImageWithFallback from '@Components/common/imageWithFallback';
import ProductFavoriteComponent from '@Components/common/productFavoriteComponent';
import { updateCart, removeCartItem } from '@Lib/cms/cartpage';
import { PdpPageData } from '@Types/cms/compiled/pdp.compiled';
import { Variant } from '@Types/cms/schema/pdp/pdpData.schema';
import warningAndDisclaimer from '@Styles/components/common/warningAndDisclaimer.module.scss';
import styles from '@Styles/cartpage/cartProductTile.module.scss';
import { Ga4ViewItemEcommerce } from 'src/interfaces/ga4Ecommerce';

let gtmData: Ga4ViewItemEcommerce;
export default function CartProductTile(props: any): JSX.Element {
  const {
    name: productName,
    variant,
    totalPrice,
    quantity,
    id: lineItemId,
    refetchCart,
    originalPricePerQuantity,
    discountedPricePerQuantity,
    cmsData,
    inventoryMessages,
    isPlainSummary,
    addToCartToasterCallBack,
    pdpUrl
  } = props;

  let isMaximumStockAdded = false;
  const dispatch = useDispatch();
  const { sku, key: variantKey, imageSet, attributes } = variant;
  const { color, dimensions, productOnlineDate, size } = attributes;
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [isItemModified, setIsItemModified] = useState(false);

  let modifiedStrikeoutPrice = originalPricePerQuantity * quantity + '';
  const strikeoutPrice = parseFloat(modifiedStrikeoutPrice).toFixed(2);
  const isDiscountApplicable = parseFloat(strikeoutPrice) === parseFloat(totalPrice);

  const {
    heartBeatInfo: { sessionId, isLoggedInUser }
  } = useSelector((state) => state.auth);

  useEffect(() => {
    (() => {
      gtmData = {
        anonymous_user_id: '',
        currency: 'USD',
        ecommerce: {
          items: [
            {
              affiliation: '',
              coupon: '',
              currency: 'USD',
              discount: discountedPricePerQuantity
                ? originalPricePerQuantity - discountedPricePerQuantity
                : 0,
              index: '',
              item_brand: props?.variant?.attributes?.brand?.label || '',
              item_category: '',
              item_category2: '',
              item_category3: '',
              item_category4: '',
              item_category5: '',
              item_id: props?.variant?.sku,
              item_list_id: '',
              item_list_name: '',
              item_name: productName,
              item_variant: '',
              price: originalPricePerQuantity,
              quantity
            }
          ]
        },
        event: 'add_to_cart',
        value: originalPricePerQuantity,
        user_id: ''
      };

      if (sessionId) {
        isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
      }
    })();
  }, []);

  const fireCartActionEvent = (modifiedQuantity) => {
    const quantDifference = modifiedQuantity - quantity;
    if (window) {
      gtmData['ecommerce']['items'][0]['quantity'] = Math?.abs(quantDifference);
      gtmData['event'] = Math?.sign(quantDifference) === -1 ? 'remove_from_cart' : 'add_to_cart';
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      window.dataLayer.push(gtmData);
    }
  };

  const favouriteCompData = {
    imageUrl: imageSet,
    pageType: 'cart page',
    productData: {
      name: productName,
      variantPickerKeys: []
    } as PdpPageData,
    variant: {
      attributes: {},
      key: variantKey,
      sku: sku,
      price: {
        discountedPrice: { discountedPrice: discountedPricePerQuantity },
        variantPrice: originalPricePerQuantity
      }
    } as Variant
  };

  const updateCartItems = async (modifiedQuantity) => {
    const originalQuantity = quantity;
    if (modifiedQuantity === 0) {
      return handleRemoveLineItem();
    }

    setIsItemModified(true);
    let updateCartResponse;
    const updateCartRequest: any = {
      lineItemId,
      variantKey,
      amount: parseInt(originalPricePerQuantity)
    };
    updateCartRequest['quantity'] = modifiedQuantity;
    try {
      updateCartResponse = (await updateCart({}, updateCartRequest)) ?? {};
    } catch (err) {}

    if (!updateCartResponse) {
      alert('Sorry, some error occurred at our End');
      setItemQuantity(originalQuantity);
    } else {
      fireCartActionEvent(modifiedQuantity);
      refetchCart(updateCartResponse.updateCart);
    }
    setIsItemModified(false);
  };

  (() => {
    if (inventoryMessages?.length) {
      const inventoryLimitReachedProduct = inventoryMessages[0].split('-')[0]?.trim();
      isMaximumStockAdded = sku === inventoryLimitReachedProduct;
    }
  })();

  const handleIncrement = () => {
    const incrementedQty = itemQuantity + 1;
    setItemQuantity(incrementedQty);
    updateCartItems(incrementedQty);
  };

  const handleDecrement = () => {
    const decrementedQty = itemQuantity - 1;
    setItemQuantity(decrementedQty);
    updateCartItems(decrementedQty);
  };

  const handleLineItemInputChange = (e) => {
    let value = e?.target?.value.trim();
    if (isNaN(value)) {
      return;
    }
    value = parseInt(value);
    if (!value || value < 0) {
      if (value === 0) {
        setItemQuantity(value);
      }
    }
    setItemQuantity(isNaN(value) ? '' : value);
  };

  const handleQuantityChange = (e) => {
    let { value } = e?.target;
    if (isNaN(value)) {
      return;
    }
    value = parseInt(value);
    if (!value || value < 0) {
      if (value === 0) {
        setItemQuantity(value);
        handleRemoveLineItem();
      }
      setItemQuantity(quantity);
      return;
    }
    if (value === quantity) {
      return;
    }
    setItemQuantity(value);
    updateCartItems(value);
  };

  const handleRemoveLineItem = async () => {
    let updateCartResponse;
    setIsItemModified(true);
    try {
      updateCartResponse = (await removeCartItem({}, lineItemId)) ?? {};
    } catch (err) {}

    if (!updateCartResponse) {
      alert('Sorry, some error occurred at our End');
    } else {
      refetchCart(updateCartResponse?.removeFromCart);
      // setLineItemCount(updateCartResponse.removeFromCart.lineItemCount);
      dispatch({
        type: 'UPDATE_LINE_ITEM_COUNT',
        payload: { lineItemCount: updateCartResponse?.removeFromCart?.lineItemCount }
      });
      dispatch({
        type: 'UPDATE_CART_DETAILS',
        payload: updateCartResponse?.addToCart
      });
    }
    setIsItemModified(false);
    fireCartActionEvent(0);
  };

  let daysSinceOnline = -1;
  if (productOnlineDate) {
    const today = new Date();
    const dateAdded = new Date(productOnlineDate);
    const timeDifference = today.getTime() - dateAdded.getTime();
    daysSinceOnline = timeDifference / (1000 * 3600 * 24);
  }
  let promoBadge = '';
  (() => {
    if (!isPlainSummary) {
      if (discountedPricePerQuantity) {
        promoBadge = 'SALE';
      } else if (daysSinceOnline >= 0 && daysSinceOnline < 60) {
        promoBadge = 'NEW';
      }
    }
  })();

  let productNotice = [];
  (() => {
    const {
      productWarnings,
      productHazards,
      excludeFreeShipping,
      additionalShipping,
      excludedStates,
      assorted
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
    if (assorted) {
      productNotice.push({
        icon: 'warning',
        value: '<span><b>Style/Color:</b> Assorted - You May Not Receive What Is Pictured</span>'
      });
    }
  })();

  const getPriceLabel = () => {
    return isDiscountApplicable ? (
      <label className={styles.amount}>${parseFloat(originalPricePerQuantity).toFixed(2)}</label>
    ) : (
      <label className={styles.amount}>
        <label style={{ color: '#B40000' }}>
          ${parseFloat(discountedPricePerQuantity).toFixed(2)}{' '}
        </label>
        <label style={{ textDecoration: 'line-through', fontWeight: 'normal', marginLeft: 4 }}>
          ${parseFloat(originalPricePerQuantity).toFixed(2)}
        </label>
      </label>
    );
  };

  const renderNoticesAndWarnings = () => {
    return productNotice.map((e, i: number) => (
      <div className={warningAndDisclaimer.warning} key={i}>
        <p className={warningAndDisclaimer.warningIcon}>
          {!isMaximumStockAdded && e.icon === 'hazard' && (
            <img
              alt={'Prop 65 Warning'}
              aria-label="Prop 65 Warning"
              className={styles.imageDimension}
              height={12}
              src={'/icons/prop-65-small.png'}
              width={15}
            />
          )}
          {!isMaximumStockAdded && e.icon != 'hazard' && (
            <img
              alt={'Notice'}
              aria-label="Notice"
              className={styles.imageDimension}
              height={12}
              src={`/icons/${e.icon}.svg`}
              width={14}
            />
          )}
        </p>
        <p
          className={warningAndDisclaimer.warningText}
          dangerouslySetInnerHTML={{ __html: e.value }}
        ></p>
      </div>
    ));
  };

  return (
    <>
      <div className={styles.desktop}>
        {promoBadge && (
          <div
            className={styles.badgeCartItems}
            style={
              promoBadge === 'NEW'
                ? { background: '#003087', marginTop: -26 }
                : { background: '#B53315', marginTop: -26 }
            }
          >
            <label className={styles.badgeTitle}> {promoBadge} </label>
          </div>
        )}
        <div className={styles.cartItems} style={{ marginBottom: 16 }}>
          <div className={styles.productMainSection}>
            <div
              className={styles.imageSection}
              style={promoBadge ? { marginTop: 45 } : { marginTop: isPlainSummary ? 4 : 16 }}
            >
              {isPlainSummary ? (
                <ImageWithFallback
                  src={`${imageSet}?w=75&h=75`}
                  width={75}
                  height={75}
                  layout="fixed"
                  handleImageClick={addToCartToasterCallBack}
                />
              ) : (
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
              )}
            </div>

            <div className={styles.cartSection}>
              <div
                className={styles.cartDescription}
                style={promoBadge ? { marginTop: 31 } : { marginTop: 4 }}
              >
                {isPlainSummary ? (
                  <label onClick={addToCartToasterCallBack} className={styles.cartTitle}>
                    {' '}
                    {productName}{' '}
                  </label>
                ) : (
                  <div className={styles.cartTitleDiv}>
                    <Link href={pdpUrl}>
                      <a>
                        <label className={styles.cartTitle}> {productName} </label>
                      </a>
                    </Link>
                  </div>
                )}
                {!isPlainSummary && (
                  <div className={styles.desktopFavButton}>
                    <ProductFavoriteComponent
                      {...favouriteCompData}
                      additionalIconClass={styles.favouriteButton}
                    />
                  </div>
                )}
              </div>

              <div className={styles.cartProperty}>
                <div className={styles.flexRow}>
                  {color?.label ? (
                    <span className={styles.colorSpan}>
                      <label className={styles.colorTitle}>Color:</label>
                      <label className={styles.colorValue}>&nbsp;{color?.label}</label>
                    </span>
                  ) : (
                    <></>
                  )}

                  {dimensions?.label ? (
                    <span className={styles.colorSpan}>
                      <label className={styles.colorTitle}>Dimensions:</label>
                      <label className={styles.colorValue}>&nbsp;{dimensions?.label}</label>
                    </span>
                  ) : (
                    <></>
                  )}

                  {size?.label ? (
                    <span className={styles.colorSpan}>
                      <label className={styles.colorTitle}>Size:</label>
                      <label className={styles.colorValue}>&nbsp;{size?.label}</label>
                    </span>
                  ) : (
                    <></>
                  )}

                  <span className={styles.colorSpan}>
                    <label className={styles.colorTitle}>{cmsData?.labels?.sku}:</label>
                    <label className={styles.colorValue}>&nbsp;{variant?.sku}</label>
                  </span>
                </div>
                {isPlainSummary && (
                  <div className={styles.flexRow}>
                    <span className={styles.quantitySpan}>
                      <label className={styles.colorTitle}>{cmsData?.labels?.quantity}:</label>
                      <label className={styles.colorValue}>&nbsp;{quantity}</label>
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.cartAmountSection}>
                <div className={styles.cartAmountWrap}>
                  {getPriceLabel()}

                  {/*  Temporarily removing the "Save for Later" link component from the cart page by using a false condition.
                  When we decide to re-enable the feature in the future, simply need to remove the false condition from the code. */}
                  {false && !isPlainSummary && (
                    <div className={styles.saveForLaterTitle}>
                      <Link href="#">
                        <a>
                          <span>{cmsData?.labels?.saveForLater}</span>
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
                {!isPlainSummary && (
                  <>
                    <div className={styles.buttonGroup}>
                      <button
                        className={styles.decrement}
                        onClick={handleDecrement}
                        disabled={isItemModified}
                      >
                        {' '}
                        -{' '}
                      </button>
                      <input
                        value={itemQuantity}
                        className={styles.itemQuantity}
                        onChange={handleLineItemInputChange}
                        onBlur={handleQuantityChange}
                        disabled={isItemModified}
                      />
                      <button
                        className={styles.increment}
                        onClick={handleIncrement}
                        disabled={isItemModified}
                      >
                        {' '}
                        +{' '}
                      </button>
                    </div>
                    <span className={styles.deleteButtonSpan}>
                      <button className={styles.deleteButton}>
                        <img
                          alt="Delete"
                          aria-hidden="true"
                          width={20}
                          height={20}
                          src="/icons/deleteIcon.svg"
                          onClick={handleRemoveLineItem}
                        ></img>
                      </button>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          {productNotice?.length > 0 && renderNoticesAndWarnings()}
        </div>
      </div>

      {/* CartIems Mobile Section  */}
      <div className={styles.mobile}>
        {promoBadge && (
          <div
            className={styles.badgeMobileCartItems}
            style={
              promoBadge === 'NEW'
                ? { background: '#003087', marginTop: -26 }
                : { background: '#B53315', marginTop: -26 }
            }
          >
            <label className={styles.badgeTitle}> {promoBadge} </label>
          </div>
        )}
        <div className={styles.mobilecartItems}>
          {!isPlainSummary && (
            <div className={styles.mobFavButton}>
              <ProductFavoriteComponent
                {...favouriteCompData}
                additionalIconClass={styles.favouriteButton}
              />
            </div>
          )}
          <div className={styles.mobileImgDescSection}>
            <div className={styles.imageSection}>
              {isPlainSummary ? (
                <ImageWithFallback
                  src={`${imageSet}?w=75&h=75`}
                  width={75}
                  height={75}
                  layout="fixed"
                  handleImageClick={addToCartToasterCallBack}
                />
              ) : (
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
              )}
            </div>
            <div className={styles.cartSection}>
              <div className={styles.cartDescription}>
                {isPlainSummary ? (
                  <label onClick={addToCartToasterCallBack} className={styles.cartTitle}>
                    {' '}
                    {productName}{' '}
                  </label>
                ) : (
                  <div className={styles.cartTitleDiv}>
                    <Link href={pdpUrl}>
                      <a>
                        <label className={styles.cartTitle}> {productName} </label>
                      </a>
                    </Link>
                  </div>
                )}
              </div>
              <div className={styles.cartProperty}>
                <div className={styles.flexRow}>
                  {color?.label ? (
                    <span className={styles.colorSpan}>
                      <label className={styles.colorTitle}>Color:</label>
                      <label className={styles.colorValue}>&nbsp;{color?.label}</label>
                    </span>
                  ) : (
                    <></>
                  )}

                  {dimensions?.label ? (
                    <span className={styles.colorSpan}>
                      <label className={styles.colorTitle}>Dimensions:</label>
                      <label className={styles.colorValue}>&nbsp;{dimensions?.label}</label>
                    </span>
                  ) : (
                    <></>
                  )}
                  {size?.label ? (
                    <span className={styles.colorSpan}>
                      <label className={styles.colorTitle}>Size:</label>
                      <label className={styles.colorValue}>&nbsp;{size?.label}</label>
                    </span>
                  ) : (
                    <></>
                  )}
                  <span className={styles.colorSpan}>
                    <label className={styles.colorTitle}>{cmsData?.labels?.sku}:</label>
                    <label className={styles.colorValue}>&nbsp;{variant?.sku}</label>
                  </span>
                </div>
                {isPlainSummary && (
                  <div className={styles.flexRow}>
                    <span className={styles.quantitySpan}>
                      <label className={styles.colorTitle}>{cmsData?.labels?.quantity}:</label>
                      <label className={styles.colorValue}>&nbsp;{quantity}</label>
                    </span>
                  </div>
                )}
              </div>
              <div className={styles.cartAmountSection}>{getPriceLabel()}</div>
            </div>
          </div>
          {!isPlainSummary && (
            <div className={styles.mobileCartDesSection}>
              {false && (
                <div className={styles.saveForLaterTitle}>
                  <Link href="#">
                    <a>
                      <span>{cmsData?.labels?.saveForLater}</span>
                    </a>
                  </Link>
                </div>
              )}
              <div className={styles.mobileButtonGroup}>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.decrement}
                    onClick={handleDecrement}
                    disabled={isItemModified}
                  >
                    {' '}
                    -{' '}
                  </button>
                  <input
                    value={itemQuantity}
                    className={styles.itemQuantity}
                    onChange={handleLineItemInputChange}
                    onBlur={handleQuantityChange}
                    disabled={isItemModified}
                  ></input>
                  <button
                    className={styles.increment}
                    onClick={handleIncrement}
                    disabled={isItemModified}
                  >
                    {' '}
                    +{' '}
                  </button>
                </div>
                <span className={styles.deleteButtonSpan}>
                  <button className={styles.deleteButton}>
                    <img
                      alt="Delete"
                      aria-hidden="true"
                      width={20}
                      height={20}
                      src="/icons/deleteIcon.svg"
                      aria-label="delete"
                      onClick={handleRemoveLineItem}
                    />
                  </button>
                </span>
              </div>
            </div>
          )}
          {productNotice?.length > 0 && renderNoticesAndWarnings()}
        </div>
      </div>
    </>
  );
}
