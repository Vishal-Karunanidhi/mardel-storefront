import { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@Redux/store';

import { Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import FreeShippingProgressBar from '@Components/cartPage/freeShippingProgressBar';
import { HlPageLinkButton } from '@Components/common/button';
import HlButton from '@Components/common/button';
import CartProductTile from '@Components/cartPage/cartProductTile';
import { addToCart as addProductToCart, getAddToCartToasterContent } from '@Lib/cms/cartpage';

import { addToCart as addToCartConstants } from '@Constants/productAvailablity';
import { algoliaClickEvents } from '@Constants/generalConstants';
import { AddToCartRequest } from '@Types/cms/addToCart';
import styles from '@Styles/productDetailPage/productAvailable/addToCart.module.scss';
import { Ga4ViewItemEcommerce } from 'src/interfaces/ga4Ecommerce';

const componentMaterialStyle = {
  papersx: {
    height: '32px',
    width: '100%',
    color: '#FFFFFF',
    backgroundColor: '#003087',
    fontWeight: '600px',
    fontSize: '12px',
    outline: '#003087',
    outlineOffset: '-3px',
    outlineColor: '#003087',
    outlineStyle: 'solid',
    outlineWidth: '8px',
    borderRadius: '17px 17px 0px 0px'
  },
  iconsx: {
    float: 'right',
    cursor: 'pointer',
    color: '#FFFFFF',
    width: '16px',
    height: '16px'
  }
};

export default function AddToCart(props): JSX.Element {
  const dispatch = useDispatch();
  const { selctedGiftCardPrice, recipientEmail } = useSelector((state) => state.plp) ?? {};
  const { heartBeatInfo } = useSelector((state) => state.auth) ?? {};
  const { iconsx, papersx } = componentMaterialStyle;
  const [quantity, setQuantity] = useState<number>(props.quantity ?? 1);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [toasterContent, setToasterContent] = useState<{ [k: string]: any }>({});
  const [cartResponse, setCartResponse] = useState<{ [k: string]: any }>({});
  const [lineItem, setLineItem] = useState<{ [k: string]: any }>({});
  const [toasterContentLoaded, setToasterContentLoaded] = useState<boolean>(false);

  let selectedVariant = props.variantDetails;
  let { algoliaClickEvent } = props;
  const { key: productUnitKey } = selectedVariant?.attributes?.productUnit ?? {};
  const isFabricProducts = productUnitKey?.toLowerCase() === 'yd';

  const buttonInactiveStyle = {
    background: '#EDEDED',
    color: '#5F5F5F'
  };

  useEffect(() => setQuantity(props?.quantity), [props?.quantity]);

  useEffect(() => setQuantity(1), [selectedVariant]);

  async function handleAddToCart(e: SyntheticEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    setIsDisabled(true);
    const addToCartRequest: AddToCartRequest = {
      quantity,
      amount: selctedGiftCardPrice,
      sku: selectedVariant?.sku?.toString(),
      variantKey: selectedVariant?.key?.toString(),
      ...(recipientEmail && { recipientEmail: recipientEmail })
    };

    const addToCartResponse: any = await addProductToCart({}, addToCartRequest);

    if (addToCartResponse && addToCartResponse?.addToCart?.lineItems?.length) {
      const { addToCart } = addToCartResponse;
      if (typeof algoliaClickEvent === 'function') {
        algoliaClickEvent(algoliaClickEvents.PRODUCT_ADDED_TO_CART);
      }

      if (!toasterContentLoaded) {
        const toasterContentResponse = await getAddToCartToasterContent();
        setToasterContent(toasterContentResponse);
        setToasterContentLoaded(true);
      }
      addToCart?.lineItems?.forEach((lineItem: { [k: string]: any }) => {
        const { variant } = lineItem;
        if (variant?.sku == addToCartRequest?.sku && variant?.key == addToCartRequest?.variantKey) {
          setLineItem(lineItem);
        }
      });
      dispatch({
        type: 'UPDATE_LINE_ITEM_COUNT',
        payload: { lineItemCount: addToCart?.lineItemCount }
      });
      dispatch({
        type: 'UPDATE_CART_DETAILS',
        payload: addToCartResponse?.addToCart
      });
      setCartResponse(addToCart);
      setIsDialogOpen(true);

      setQuantity(1);

      if (window) {
        // ASSUMPTION: add to cart only adds one product.
        //  however the `addToCart` object above has an array of `lineItems`
        const gtmData: Ga4ViewItemEcommerce = {
          anonymous_user_id: '',
          currency: 'USD',
          ecommerce: {
            items: [
              {
                affiliation: '',
                coupon: '',
                currency: 'USD',
                discount: selectedVariant.price?.discountedPrice?.discountedPrice
                  ? selectedVariant.price?.variantPrice -
                    selectedVariant.price?.discountedPrice?.discountedPrice
                  : 0,
                index: '',
                item_brand: selectedVariant.attributes?.brand?.label || '',
                item_category: '',
                item_category2: '',
                item_category3: '',
                item_category4: '',
                item_category5: '',
                item_id: selectedVariant.sku,
                item_list_id: '',
                item_list_name: props.productListName || '',
                item_name: props.productName,
                item_variant: '',
                price:
                  selectedVariant.price?.discountedPrice?.discountedPrice ||
                  selectedVariant.price?.variantPrice,
                quantity: quantity
              }
            ]
          },
          event: 'add_to_cart',
          value:
            selectedVariant.price?.discountedPrice?.discountedPrice ||
            selectedVariant.price?.variantPrice,
          user_id: ''
        };

        if (heartBeatInfo && heartBeatInfo.sessionId) {
          heartBeatInfo.isLoggedInUser
            ? (gtmData.user_id = heartBeatInfo.sessionId)
            : (gtmData.anonymous_user_id = heartBeatInfo.sessionId);
        }

        // TODO: iterate over the items and add them to gtmData
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
        window.dataLayer.push(gtmData);
      }
    } else {
      setIsDisabled(false);
      dispatch({
        type: 'UPDATE_SNACKBAR_WITH_DATA',
        payload: {
          open: true,
          message:
            'Unable to add a product to cart at this time. Please refresh the page and try again.',
          severity: 'error'
        }
      });
    }
  }

  const handleToasterClose = () => {
    setIsDialogOpen(false);
    setIsDisabled(false);
  };

  function AddToCartToaster(): JSX.Element {
    const { orderSummary } = cartResponse;
    const { yourCart, items, merchandiseTotal, discounts, shipping, estimatedTotal, taxInfo } =
      toasterContent?.addToCartToasterContent?.orderSummaryInfo ?? {};
    const { checkoutCta } = toasterContent?.addToCartToasterContent ?? {};
    const { addToCartToasterContent } = toasterContent;
    const { continueShoppingCta } = addToCartToasterContent ?? {};

    return (
      <Dialog
        maxWidth="lg"
        open={isDialogOpen}
        onClose={handleToasterClose}
        aria-labelledby="toaster-title"
        aria-describedby="toaster-description"
        PaperProps={{
          style: {
            borderRadius: '10px',
            maxHeight: '100%'
          }
        }}
      >
        <DialogTitle sx={papersx} className={styles.toasterTitle}>
          {toasterContent?.addToCartToasterContent?.toasterTitle}
          <button
            className={styles.toasterCloseButton}
            onClick={handleToasterClose}
            data-testid="addToCart-modal-close"
          >
            <CloseIcon sx={iconsx} />
          </button>
        </DialogTitle>
        <DialogContent sx={{ marginTop: '5px', padding: '0px' }}>
          <div className={styles.toasterContent}>
            <div className={styles.leftPanel}>
              <div className={styles.progressBarMobileAndTabletView}>
                <FreeShippingProgressBar
                  freeShippingContent={toasterContent}
                  cartSubTotalForFreeShippingEligibleItems={
                    cartResponse?.cartSubTotalForFreeShippingEligibleItems ?? 0
                  }
                />
              </div>
              <div className={styles.productTile}>
                <CartProductTile
                  isPlainSummary={true}
                  {...lineItem}
                  cmsData={toasterContent?.fullCartContent?.productTile}
                  inventoryMessages={cartResponse?.inventoryMessages}
                />
              </div>
              <div className={styles.frequentlyBought}></div>
            </div>
            <div className={styles.rightPanel}>
              <div className={styles.progressBarDesktopView}>
                <FreeShippingProgressBar
                  freeShippingContent={toasterContent}
                  cartSubTotalForFreeShippingEligibleItems={
                    cartResponse?.cartSubTotalForFreeShippingEligibleItems ?? 0
                  }
                />
              </div>
              <div className={styles.orderSummary}>
                <Typography className={styles.summaryTitle}>
                  {yourCart}&nbsp;{cartResponse?.lineItems?.length}&nbsp;{items}
                </Typography>
                <div className={styles.merchandiseTotal}>
                  <label>{merchandiseTotal}</label>
                  <label>{`$${parseFloat(orderSummary?.merchandisePrice).toFixed(2)}`}</label>
                </div>
                <div className={styles.discounts}>
                  <label>{discounts}</label>
                  <label>{`-$${parseFloat(orderSummary?.merchandiseDiscount).toFixed(2)}`}</label>
                </div>
                <div className={styles.shipping}>
                  <label>{shipping}</label>
                  <label>{`$${parseFloat(orderSummary?.shippingSubTotal).toFixed(2)}`}</label>
                </div>
                <div className={styles.estimatedTotal}>
                  <label>
                    <strong>{estimatedTotal}</strong>
                  </label>
                  <label>&nbsp;{`$${parseFloat(orderSummary?.totalPrice).toFixed(2)}`}</label>
                </div>
                <label className={styles.taxInfo}>{taxInfo}</label>

                <HlPageLinkButton
                  href={checkoutCta?.value}
                  openInNewTab={checkoutCta?.openInNewTab}
                  buttonTitle={checkoutCta?.label}
                  callbackMethod={handleToasterClose}
                  dataTestId="checkout-button"
                />

                <HlButton
                  buttonTitle={continueShoppingCta?.label}
                  callbackMethod={handleToasterClose}
                  parentDivClass={styles.shoppingLinkDiv}
                  buttonClass={styles.shoppingLink}
                  data-testid="continue-shopping-button"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      {props.nonPdpPage ? (
        <HlButton
          buttonTitle={addToCartConstants?.buttonTitle}
          callbackMethod={handleAddToCart}
          isDisabled={isDisabled}
          dataTestId={'featured-items-add-to-cart'}
        />
      ) : (
        <div className={styles.addToCart}>
          {isFabricProducts && <span className={styles.fabricProductTitle}>YDS</span>}
          <span className={styles.addToCartComp}>
            <input
              type="number"
              placeholder={addToCartConstants.cartCountPlaceholder}
              value={quantity ?? 1}
              min="1"
              max="9999"
              onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                const validityProp: any = e?.currentTarget?.['validity'];
                if (validityProp.valid) {
                  setQuantity(parseInt(e.currentTarget.value));
                }
              }}
              onBlur={(e) => {
                const quantity = e?.currentTarget?.value;
                if (!quantity) {
                  setQuantity(1);
                }
              }}
              data-testid="add-to-cart-quantity"
            />
            <div className={styles.addToCartButtonOutline}>
              <button
                onClick={handleAddToCart}
                style={isDisabled ? buttonInactiveStyle : {}}
                disabled={isDisabled}
                data-testid="add-to-cart-button"
              >
                <ShoppingCartIcon /> {addToCartConstants.buttonTitle}
              </button>
            </div>
          </span>
        </div>
      )}
      <AddToCartToaster />
    </>
  );
}
