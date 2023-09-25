import ProductTile from '@Components/cartPage/productTile';
import OrderSummary from '@Components/cartPage/orderSummary';
import { ProductNotAvailableComp } from '@Pages/cart';
import OrderSummaryAccordionStyles from '@Styles/checkout/orderSummaryAccordion.module.scss';

export default function OrderSummaryAccordion(props): JSX.Element {
  const {
    cartInfo,
    freeShippingDetails,
    orderSummaryDetails,
    taxPrice,
    orderConfirmationMode,
    messageList = null
  } = props;

  return (
    <>
      <div className={OrderSummaryAccordionStyles.drawerOrderSummary}>
        {orderConfirmationMode && (
          <div className={OrderSummaryAccordionStyles.checkoutOrderSummaryMobileSection}>
            <label className={OrderSummaryAccordionStyles.checkoutOrderSummaryTitle}>
              ORDER SUMMARRY
            </label>
            <label className={OrderSummaryAccordionStyles.checkoutOrderSummaryContent}>
              Your order has not yet been placed. Verify your shipping address is correct and
              confirm elow to place your order.{' '}
            </label>
          </div>
        )}
        <OrderSummary
          isPlainSummary={true}
          freeShippingDetails={freeShippingDetails}
          orderSummaryDetails={orderSummaryDetails}
          isTaxAvailable={true}
          taxPrice={taxPrice}
          isRetailDeliveryFeeAvailable
        />
      </div>

      {!orderConfirmationMode && (
        <div className={OrderSummaryAccordionStyles.productTileTitle}>
          <label>CART SUMMARY</label>
        </div>
      )}
      {messageList && <ProductNotAvailableComp messageList={cartInfo?.inventoryMessages} />}
      {!orderConfirmationMode && (
        <div className={OrderSummaryAccordionStyles.productTileWrapper}>
          {cartInfo?.lineItems?.map((e, i: number) => (
            <ProductTile {...e} key={i} cmsData={orderSummaryDetails} isCheckoutPage />
          ))}
        </div>
      )}
    </>
  );
}
