import { useState, useEffect } from 'react';
import { GetServerSidePropsResult } from 'next/types';
import { useDispatch, useSelector } from '@Redux/store';
import { getCart, getFreeShippingMessages, getOrderSummaryData } from '@Lib/cms/cartpage';
import OrderSummary from '@Components/cartPage/orderSummary';
import CartProductTile from '@Components/cartPage/cartProductTile';
import { getCookie } from '@Lib/common/serverUtility';
import styles from '@Styles/cartpage/orderSummary.module.scss';
import FeaturedItems from '@Components/homepage/featuredItems';
import { executeFnLastInEventQueue } from '@Lib/common/utility';
import { spinnerStart, spinnerEnd } from '@Utils/spinnerUtil';
import { Ga4ViewItemEcommerce } from 'src/interfaces/ga4Ecommerce';
import { Ga4EcommerceItem } from 'src/interfaces/ga4EcommerceItem';
import { AuthState, CheckoutState, LayoutState } from '@Types/globalState';

declare global {
  interface Window {
    dataLayer: any;
  }
}

const defaultCartDetails: any = null;

const ProductNotAvailableComp = (props) => {
  const messageList =
    props?.messageList?.filter((e) => {
      return e?.indexOf('no longer available') !== -1 || e?.indexOf('Item has been removed') !== -1;
    }) ?? [];
  const isInventoryErrorMsgExist = !!messageList?.length;
  const [showInventoryMsg, setShowInventoryMsg] = useState(false);

  useEffect(() => {
    if (!showInventoryMsg) {
      handleInventoryMsgUpdate();
    }
    // TODO: React Hook useEffect has a complex expression in the dependency array.
    // Extract it to a separate variable so it can be statically checked.
  }, [JSON.stringify(messageList)]);

  const handleInventoryMsgUpdate = () => {
    setShowInventoryMsg(isInventoryErrorMsgExist);
    executeFnLastInEventQueue(setShowInventoryMsg, false, 5000);
  };

  if (!showInventoryMsg) {
    return <></>;
  }
  return (
    <div className={styles.errorSection}>
      <img
        alt="info Icon"
        aria-hidden="true"
        height="16"
        src="/icons/account/infoIcon.svg"
        width="16"
      />
      <div>
        <b> Following items have been removed from your Cart, as they are no longer available</b>
        {messageList?.map((message) => (
          <>
            <br />
            <span key={message} className={styles.errorSectionMessage}>
              <b>&#x2022; </b>
              {message?.replace(/no longer available/g, '')}
            </span>
          </>
        ))}
      </div>
    </div>
  );
};

export default function Cart(props: any): JSX.Element {
  const { freeShippingDetails, orderSummaryDetails } = props || {};
  const dispatch = useDispatch();
  const [cartDetails, setCartDetails] = useState(defaultCartDetails);

  const { heartBeatInfo, myProfileInfo } =
    useSelector((state: { auth: AuthState }) => state.auth) ?? {};
  const { recentlyViewedKeys } = useSelector((state: { layout: LayoutState }) => state.layout);
  const { cartDeatilsFromRedux } = useSelector(
    (state: { checkout: CheckoutState }) => state.checkout
  );
  useEffect(() => {
    dispatch(spinnerStart);
    async function getCartData() {
      const cartInfo = await getCart({}, true, true);
      setCartDetails(cartInfo);

      if (window && cartInfo) {
        let gtmData: Ga4ViewItemEcommerce = {
          anonymous_user_id: '',
          currency: 'USD',
          ecommerce: {
            items: []
          },
          email: '',
          event: 'view_cart',
          user_id: '',
          value: cartInfo.orderSummary.merchandiseSubTotal
        };

        const { isLoggedInUser, sessionId } = heartBeatInfo;

        if (sessionId) {
          isLoggedInUser
            ? (gtmData.user_id = sessionId)
            : (gtmData.anonymous_user_id = cartInfo.anonymousId);
        }

        if (myProfileInfo && myProfileInfo.email) {
          gtmData.email = myProfileInfo.email;
        }
        cartInfo.lineItems.forEach((lineItem) => {
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

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
        window.dataLayer.push(gtmData);
      }

      dispatch(spinnerEnd);
    }
    if (heartBeatInfo?.isExistingSession) {
      getCartData();
    }
  }, [heartBeatInfo, cartDeatilsFromRedux?.totalLineItemQuantity]);

  orderSummaryDetails['cartNumber'] = cartDetails?.cartNumber;
  orderSummaryDetails['orderSummary'] = cartDetails?.orderSummary;
  orderSummaryDetails['cartSubTotalForFreeShippingEligibleItems'] =
    cartDetails?.cartSubTotalForFreeShippingEligibleItems;

  const { productTile: productTileCmsData } = orderSummaryDetails?.fullCartContent;

  const orderSummaryProps = {
    freeShippingDetails,
    orderSummaryDetails,
    totalLineItems: cartDetails?.lineItems?.length ?? 0
  };

  const CartPage = () => {
    return (
      <>
        <div className={styles.desktoptabletView}>
          <div className={styles.cartView}>
            <h1 className={styles.cartTitle}>
              {productTileCmsData?.labels?.myCart} ({cartDetails?.lineItems?.length ?? 0} items)
            </h1>
            <ProductNotAvailableComp messageList={cartDetails?.inventoryMessages} />
            {cartDetails?.lineItems?.map((e: any, i: number) => (
              <CartProductTile
                {...e}
                refetchCart={(e: any) => setCartDetails(e)}
                cmsData={productTileCmsData}
                inventoryMessages={cartDetails.inventoryMessages}
                key={i}
              />
            ))}
          </div>
          <div className={styles.orderView}>
            <OrderSummary {...orderSummaryProps} />
          </div>
        </div>

        <div className={styles.mobileView}>
          <div className={styles.cartMobileView}>
            <OrderSummary {...orderSummaryProps} />
          </div>
          <div>
            <div className={styles.cartMobView}>
              <h1 className={styles.cartMobTitle}>
                {productTileCmsData?.labels?.myCart} ({cartDetails?.lineItems?.length} items)
              </h1>
              <ProductNotAvailableComp messageList={cartDetails?.inventoryMessages} />
              {cartDetails?.lineItems?.map((e: any, i: number) => (
                <CartProductTile
                  {...e}
                  refetchCart={(e: any) => setCartDetails(e)}
                  cmsData={productTileCmsData}
                  inventoryMessages={cartDetails.inventoryMessages}
                  key={i}
                />
              ))}
            </div>
          </div>
        </div>
        {cartDetails && recentlyViewedKeys?.length > 0 ? (
          <FeaturedItems
            label="Recently Viewed" //{pdpPageContent.recentlyViewed.label}
            products={recentlyViewedKeys}
          />
        ) : (
          <></>
        )}
      </>
    );
  };
  return (
    <>
      <CartPage />
    </>
  );
}

export async function getServerSideProps(ctx): Promise<GetServerSidePropsResult<any>> {
  const headers = getCookie(ctx);
  const [freeShippingDetails, orderSummaryDetails] = await Promise.all([
    getFreeShippingMessages(headers),
    getOrderSummaryData(headers)
  ]);

  return {
    props: {
      freeShippingDetails,
      orderSummaryDetails
    }
  };
}

export { ProductNotAvailableComp };
