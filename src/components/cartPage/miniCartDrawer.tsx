import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from '@Redux/store';

import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';

import ProductTile from '@Components/cartPage/productTileMain';
import { ProductNotAvailableComp } from '@Pages/cart';
import FreeShippingProgressBar from '@Components/cartPage/freeShippingProgressBar';
import FeaturedItems from '@Components/homepage/featuredItems';
import { HlPageLinkButton } from '@Components/common/button';
import HlButton from '@Components/common/button';
import HLAnchorTag from '@Components/common/hlAnchorTag';

import { getCart } from '@Lib/cms/cartpage';
import { getMiniCartContentGql } from '@Lib/cms/cartpage';
import { DEFAULT_MINI_CART_DATA } from '@Constants/cartConstants';

import { spinnerStart, spinnerEnd } from '@Utils/spinnerUtil';

import MiniCartStyles from '@Styles/cartpage/miniCartDrawer.module.scss';
import { Ga4ViewItemEcommerce } from 'src/interfaces/ga4Ecommerce';
import { Ga4EcommerceItem } from 'src/interfaces/ga4EcommerceItem';
import { AuthState } from '@Types/globalState';

type AnchorType = 'top' | 'left' | 'bottom' | 'right';
const drawerAnchor: AnchorType = 'right';

const cartDependentPages = ['/cart', '/checkout'];

export default function MiniCartDrawer(props: any): JSX.Element {
  const { heartBeatInfo, myProfileInfo } =
    useSelector((state: { auth: AuthState }) => state.auth) ?? {};
  const { recentlyViewedKeys, openMiniCartDrawer: onDrawerOpen } = useSelector(
    (state) => state.layout
  );

  const router = useRouter();
  const dispatch = useDispatch();
  const isCartBasedPage = cartDependentPages.includes(router.asPath);
  const { cartDeatilsFromRedux } = useSelector((state) => state.checkout);
  const [freeShippingData, setFreeShippingData] = useState({});
  // TODO: initialize this with an empty object instead of null
  const [orderSummaryDetails, setorderSummaryDetails] = useState(null);
  const [miniCartCmsData, setMiniCartCmsData] = useState(DEFAULT_MINI_CART_DATA);

  const { checkoutCtaLabel, continueShoppingCtaLabel, shopWeeklyAdCtaLabel } =
    miniCartCmsData?.miniCartCta;
  const { registerLink, signInCtaLabel } = miniCartCmsData?.signIn;
  const { page } = useSelector((state) => state.layout.spinnerData);

  useEffect(() => {
    async function getCartData() {
      const cartResponse = await getCart({}, false, false);
      if (cartResponse?.totalLineItemQuantity !== cartDeatilsFromRedux?.totalLineItemQuantity) {
        dispatch({
          type: 'UPDATE_LINE_ITEM_COUNT',
          payload: { lineItemCount: cartResponse?.lineItemCount }
        });
        dispatch({
          type: 'UPDATE_CART_DETAILS',
          payload: cartResponse
        });
      }

      if (window && cartResponse) {
        let gtmData: Ga4ViewItemEcommerce = {
          anonymous_user_id: '',
          currency: 'USD',
          ecommerce: {
            items: []
          },
          email: '',
          event: 'view_cart',
          value: cartResponse.orderSummary ? cartResponse.orderSummary.merchandiseSubTotal : 0,
          user_id: ''
        };

        if (myProfileInfo && myProfileInfo.email) {
          gtmData.email = myProfileInfo.email;
        }

        const { isLoggedInUser, sessionId } = heartBeatInfo;

        if (sessionId) {
          isLoggedInUser
            ? (gtmData.user_id = sessionId)
            : (gtmData.anonymous_user_id = cartResponse.anonymousId);
        }

        if (cartResponse.lineItems && cartResponse.lineItems.length > 0) {
          cartResponse.lineItems.forEach((lineItem) => {
            let newItem: Ga4EcommerceItem = {
              affiliation: '',
              coupon: '',
              currency: 'USD',
              discount: lineItem.discountedPricePerQuantity
                ? lineItem.originalPricePerQuantity - lineItem.discountedPricePerQuantity
                : 0,
              index: '',
              item_brand: lineItem.variant.attributes.brand?.label ?? '',
              item_category: '',
              item_category2: '',
              item_category3: '',
              item_category4: '',
              item_category5: '',
              item_id: lineItem.variant.sku,
              item_list_id: '',
              item_list_name: '',
              item_name: lineItem.name,
              item_variant: '',
              price: lineItem.discountedPricePerQuantity
                ? lineItem.discountedPricePerQuantity
                : lineItem.originalPricePerQuantity,
              quantity: lineItem.quantity
            };
            gtmData.ecommerce.items.push(newItem);
          });
        }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
        window.dataLayer.push(gtmData);
      }

      dispatch(spinnerEnd);
    }
    if (!isCartBasedPage && heartBeatInfo?.isExistingSession && onDrawerOpen) {
      getCartData();
    }
  }, [onDrawerOpen]);

  useEffect(() => {
    async function getContentAndCartData() {
      const { fullCartContent, getFreeShippingPromoState, miniCartContent } =
        await getMiniCartContentGql();

      setFreeShippingData({ fullCartContent, getFreeShippingPromoState });
      setorderSummaryDetails({ fullCartContent });
      setMiniCartCmsData(miniCartContent);
    }
    if (!isCartBasedPage && heartBeatInfo?.isExistingSession) {
      getContentAndCartData();
    }
  }, [heartBeatInfo?.isExistingSession]);

  const MiniCartFooter = () => {
    return (
      <>
        {cartDeatilsFromRedux && cartDeatilsFromRedux?.lineItems?.length > 0 && (
          <div className={MiniCartStyles.grayBorderBox}>
            <span className={MiniCartStyles.totalEstimation}>
              <b> {miniCartCmsData?.estimatedTotal}</b>
              {`$${parseFloat(cartDeatilsFromRedux?.orderSummary?.merchandiseSubTotal).toFixed(2)}`}
            </span>

            <HlPageLinkButton
              parentDivClass={MiniCartStyles.miniCartCheckoutContentInfoOutline}
              buttonClass={MiniCartStyles.miniCartCheckoutContentInfoOutlineLink}
              buttonTitle={checkoutCtaLabel?.label}
              href={checkoutCtaLabel?.value}
              openInNewTab={checkoutCtaLabel?.openInNewTab}
              callbackMethod={handleMiniCartCheckout}
              data-testid="minicart-checkout-button"
            />

            <HlButton
              parentDivClass={MiniCartStyles.miniCartShoppingContentInfoOutline}
              buttonClass={MiniCartStyles.miniCartShoppingContentInfoOutlineLink}
              buttonTitle={continueShoppingCtaLabel?.label}
              callbackMethod={handleMiniCartCheckout}
              data-testid="minicart-continue-shopping-button"
            />
          </div>
        )}
      </>
    );
  };

  const EmptyMiniCart = () => {
    return (
      <>
        {!cartDeatilsFromRedux?.lineItems?.length && (
          <span className={MiniCartStyles.drawerBody}>
            <span className={MiniCartStyles.cartEmptyMessage}>
              {miniCartCmsData?.emptyCartMessage?.highlightTitle}
            </span>
            <span className={MiniCartStyles.startShoppingMessage}>
              {miniCartCmsData?.emptyCartMessage?.description}
            </span>

            {!heartBeatInfo?.isLoggedInUser && (
              <>
                <HlPageLinkButton
                  parentDivClass={MiniCartStyles.miniCartSignInContentInfoOutline}
                  buttonClass={MiniCartStyles.miniCartSignInContentInfoOutlineLink}
                  buttonTitle={signInCtaLabel?.label}
                  href={signInCtaLabel?.value}
                  callbackMethod={handleMiniCartCheckout}
                />

                <span className={MiniCartStyles.infoSection}>
                  <span className={MiniCartStyles.accountTitle}>
                    {miniCartCmsData?.signIn?.registerMessage}
                  </span>
                  <HLAnchorTag {...registerLink} anchorTheme="LinkType2" />
                </span>
              </>
            )}

            <hr className={MiniCartStyles.divider}></hr>

            <HlPageLinkButton
              parentDivClass={MiniCartStyles.miniCartShoppingContentInfoOutline}
              buttonClass={MiniCartStyles.miniCartShoppingContentInfoOutlineLink}
              buttonTitle={continueShoppingCtaLabel?.label}
              href={continueShoppingCtaLabel?.value}
              openInNewTab={continueShoppingCtaLabel?.openInNewTab}
              callbackMethod={handleMiniCartCheckout}
            />

            <HlPageLinkButton
              parentDivClass={MiniCartStyles.miniCartWeeklyAdContentInfoOutline}
              buttonClass={MiniCartStyles.miniCartWeeklyAdContentInfoOutlineLink}
              buttonTitle={shopWeeklyAdCtaLabel?.label}
              href={shopWeeklyAdCtaLabel?.value}
              openInNewTab={shopWeeklyAdCtaLabel?.openInNewTab}
              callbackMethod={handleMiniCartCheckout}
            />
          </span>
        )}

        {/*  Featured items in Minicart */}
        {!cartDeatilsFromRedux?.lineItems?.length && recentlyViewedKeys?.length > 0 ? (
          <FeaturedItems label="Recently Viewed" products={recentlyViewedKeys} />
        ) : (
          <></>
        )}
      </>
    );
  };

  const handleMiniCartCheckout = () => {
    dispatch({
      type: 'BOOT_MINI_CART',
      payload: false
    });
  };

  if (page?.type === 'minicart' && page?.isInitialLoading) {
    return <></>;
  }

  return (
    <>
      <Drawer anchor={drawerAnchor} open={onDrawerOpen} onClose={props.closeMinicartDrawer}>
        <div className={MiniCartStyles.miniCartDrawerBox}>
          {/* MiniCartHeader Component */}
          <DrawerHeader
            title={miniCartCmsData?.cartTitle}
            closeHandler={props.closeMinicartDrawer}
          />
          <ProductNotAvailableComp messageList={cartDeatilsFromRedux?.inventoryMessages} />

          {/* Freeshipping Component & ProductTile Component */}
          {cartDeatilsFromRedux?.lineItems?.length > 0 && (
            <div className={MiniCartStyles.miniCartBody}>
              <span className={MiniCartStyles.miniCartProgressBarStyles}>
                {freeShippingData && cartDeatilsFromRedux && (
                  <FreeShippingProgressBar
                    freeShippingContent={freeShippingData}
                    cartSubTotalForFreeShippingEligibleItems={
                      cartDeatilsFromRedux?.cartSubTotalForFreeShippingEligibleItems ?? 0
                    }
                  />
                )}
              </span>
              <span className={MiniCartStyles.productCardSection}>
                {cartDeatilsFromRedux?.lineItems?.map((event) => (
                  <ProductTile
                    {...event}
                    drawerClose={props.closeMinicartDrawer}
                    key={event?.id}
                    cmsData={orderSummaryDetails?.fullCartContent?.productTile}
                  />
                ))}
              </span>
            </div>
          )}

          {/* Empty Minicart for User     */}
          <EmptyMiniCart />
          {/* Drawer Footer section   */}
          <MiniCartFooter />
        </div>
      </Drawer>
    </>
  );
}

export const DrawerHeader = ({ title, closeHandler }) => {
  return (
    <div className={MiniCartStyles.miniCartHeaderSection}>
      <span className={MiniCartStyles.minicartTitle}>{title}</span>
      <span className={MiniCartStyles.closeButton}>
        <CloseIcon className={MiniCartStyles.closeIcon} onClick={closeHandler} />
      </span>
    </div>
  );
};
