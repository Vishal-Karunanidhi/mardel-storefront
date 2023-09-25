import { Typography } from '@mui/material';
import { useSelector } from '@Redux/store';
import FreeShippingProgressBar from '@Components/cartPage/freeShippingProgressBar';
import OrderSummaryTooltip from '@Components/cartPage/orderSummaryTooltip';
import { HlPageLinkButton } from '@Components/common/button';
import RenderHelpAndContact from '@Components/cartPage/needHelpSection';
import { roundOfPriceValue } from '@Lib/common/utility';
import OrderSummaryStyles from '@Styles/cartpage/orderSummary.module.scss';

export default function OrderSummary(props: any): JSX.Element {
  const {
    freeShippingDetails,
    isPlainSummary,
    totalLineItems,
    isTaxAvailable,
    taxPrice,
    isRetailDeliveryFeeAvailable
  } = props;
  const { orderSummary, cartNumber, fullCartContent, cartSubTotalForFreeShippingEligibleItems } =
    props?.orderSummaryDetails;
  const { shippingPromoActive } = freeShippingDetails?.getFreeShippingPromoState ?? false;

  const { cartTotalPrice, orderSummaryFromRedux, cartDeatilsFromRedux } = useSelector(
    (state) => state.checkout
  );

  const { countryStateList } = useSelector((state) => state.myAccount);

  const retailState = countryStateList?.shippingCountries?.[0]?.stateList?.find(
    (state) => state?.code === cartDeatilsFromRedux?.shippingAddress?.state
  );

  const { labels, noticeAndWarnings, shippingTooltips, bulkOrderThreshold } =
    fullCartContent?.orderSummary;
  if (!freeShippingDetails) {
    return null;
  }

  const renderCheckoutButton = (parentDivClass, buttonClass) => {
    const { checkoutCta } = fullCartContent?.helpInfo;
    return (
      <HlPageLinkButton
        href={checkoutCta.value}
        isDisabled={!totalLineItems}
        parentDivClass={parentDivClass}
        buttonClass={buttonClass}
        buttonTitle={checkoutCta.label}
        anchorProps={{ tabIndex: -1 }}
        dataTestId="checkout-button"
      />
    );
  };

  const RenderAmountSectionContent = (props) => {
    const { amountLabelClass, amount, amountLabel, isDiscount = false } = props;
    return (
      <div className={OrderSummaryStyles.amountSectionContent}>
        <label className={amountLabelClass}>{amountLabel}</label>
        <label className={amountLabelClass}>
          {orderSummary && isDiscount && amount !== 0 && '—'}{' '}
          {orderSummary ? roundOfPriceValue(amount) : '—'}
        </label>
      </div>
    );
  };

  const RenderShippingSectionContent = (props) => {
    const { shippingTitle, tooltipData, shippingPrice, shippingFlag } = props;
    return (
      <div className={OrderSummaryStyles.shippingSectionContent}>
        <div className={OrderSummaryStyles.shippingSectionSubContent}>
          <label>{shippingTitle}</label>

          {orderSummary && tooltipData && <OrderSummaryTooltip tooltipData={tooltipData} />}
        </div>
        <label>{orderSummary ? roundOfPriceValue(!!shippingFlag && shippingPrice) : '—'}</label>
      </div>
    );
  };

  const renderShippingSection = () => {
    return (
      <div className={OrderSummaryStyles.shippingSection}>
        {isTaxAvailable && (
          <RenderAmountSectionContent
            amountLabel={labels?.tax ?? 'Tax:'}
            amountLabelClass={''}
            amount={taxPrice}
          />
        )}
        {isRetailDeliveryFeeAvailable && (
          <RenderShippingSectionContent
            shippingTitle="Retail Delivery Fee"
            tooltipData={
              retailState?.name
                ? {
                    tooltip: `The retail delivery fee is applicable for the state ${retailState?.name} `
                  }
                : ''
            }
            shippingPrice={
              orderSummaryFromRedux?.retailDeliveryFee ?? orderSummary?.retailDeliveryFee
            }
            shippingFlag="true"
          />
        )}

        <RenderShippingSectionContent
          shippingTitle={shippingTooltips.standard.title}
          tooltipData={shippingTooltips?.standard}
          shippingPrice={orderSummaryFromRedux?.standardShipping ?? orderSummary?.standardShipping}
          shippingFlag={orderSummaryFromRedux?.standardShipping ?? orderSummary?.standardShipping}
        />

        <RenderShippingSectionContent
          shippingTitle={shippingTooltips.shipping.title}
          tooltipData={shippingTooltips?.shipping}
          shippingPrice={orderSummaryFromRedux?.shippingDiscount ?? orderSummary?.shippingDiscount}
          shippingFlag={orderSummaryFromRedux?.shippingDiscount ?? orderSummary?.shippingDiscount}
        />

        <RenderShippingSectionContent
          shippingTitle={shippingTooltips.additional.title}
          tooltipData={shippingTooltips?.additional}
          shippingPrice={
            orderSummaryFromRedux?.additionalShipping ?? orderSummary?.additionalShipping
          }
          shippingFlag={
            orderSummaryFromRedux?.additionalShipping ?? orderSummary?.additionalShipping
          }
        />

        {orderSummary?.giftCardProcessingFee !== 0 && (
          <span className={OrderSummaryStyles.giftCardfee}>
            <RenderAmountSectionContent
              amountLabel={labels.giftCardFee}
              amountLabelClass={''}
              amount={orderSummary?.giftCardProcessingFee}
            />
            <span className={OrderSummaryStyles.giftCardPriceInfo}>$1 per card</span>
          </span>
        )}

        <RenderShippingSectionContent
          shippingTitle={shippingTooltips.carrier.title}
          tooltipData={shippingTooltips?.carrier}
          shippingPrice={orderSummaryFromRedux?.carrierSurCharge ?? orderSummary?.carrierSurCharge}
          shippingFlag={orderSummaryFromRedux?.carrierSurCharge ?? orderSummary?.carrierSurCharge}
        />

        <div className={OrderSummaryStyles.shippingSectionContent}>
          <label className={OrderSummaryStyles.shippingTotal}>{labels.subtotal}</label>
          <label className={OrderSummaryStyles.shippingTotal}>
            {orderSummary
              ? roundOfPriceValue(
                  orderSummaryFromRedux?.shippingSubTotal ?? orderSummary?.shippingSubTotal
                )
              : '—'}
          </label>
        </div>
      </div>
    );
  };

  return (
    <>
      <>
        {!isPlainSummary && (
          <div className={OrderSummaryStyles.progressBar}>
            <FreeShippingProgressBar
              freeShippingContent={freeShippingDetails}
              cartSubTotalForFreeShippingEligibleItems={
                cartSubTotalForFreeShippingEligibleItems ?? 0
              }
            />
          </div>
        )}
        <div
          className={`${OrderSummaryStyles.orderSummarySection} ${
            shippingPromoActive ? '' : OrderSummaryStyles.orderSummaryMarginFix
          }`}
        >
          <div className={OrderSummaryStyles.summaryBorder}>
            {/* Order Summary title section  */}

            <Typography className={OrderSummaryStyles.summaryTitle}>{labels.title}</Typography>

            {/* Order Summary Amount section  */}
            <div className={OrderSummaryStyles.amountSection}>
              <RenderAmountSectionContent
                amountLabel={labels.merchandiseTotal}
                amountLabelClass={''}
                amount={orderSummary?.merchandisePrice}
              />

              <RenderAmountSectionContent
                amountLabel={labels.discounts}
                amountLabelClass={''}
                isDiscount
                amount={orderSummary?.merchandiseDiscount}
              />

              <RenderAmountSectionContent
                amountLabel={labels.subtotal}
                amountLabelClass={OrderSummaryStyles.subTotal}
                amount={orderSummary?.merchandiseSubTotal}
              />
              {!isTaxAvailable && (
                <div className={OrderSummaryStyles.amountSectionContent}>
                  <label className={OrderSummaryStyles.taxTitle}>
                    {noticeAndWarnings?.taxCalculation}
                  </label>
                </div>
              )}
            </div>

            {/* Order Summary Shipping section  */}
            {renderShippingSection()}

            {/* Order Summary Total amount section  */}
            <div className={OrderSummaryStyles.totalShippingStyles}>
              <label className={OrderSummaryStyles.orderSummaryTotal}>{labels.total}</label>
              <label className={OrderSummaryStyles.orderSummaryTotal}>
                {orderSummary
                  ? roundOfPriceValue(cartTotalPrice ? cartTotalPrice : orderSummary?.totalPrice)
                  : '—'}
              </label>
            </div>

            {/* Order Summary Save amount section  */}
            <div className={OrderSummaryStyles.saveShippingStyles}>
              <label className={OrderSummaryStyles.saveTitle}>{labels.saved}</label>
              <label className={OrderSummaryStyles.saveTitle}>
                {orderSummary ? roundOfPriceValue(orderSummary?.totalSaved) : '—'}
              </label>
            </div>

            {orderSummary?.merchandisePrice >= bulkOrderThreshold ? (
              <div className={OrderSummaryStyles.warningNotice}>
                <label>{noticeAndWarnings.bulkOrderThreshold}</label>
              </div>
            ) : (
              ''
            )}
          </div>

          {/* Order Summary Contact section  */}
          <RenderHelpAndContact
            isMobile={false}
            cartNumber={cartNumber}
            fullCartContent={fullCartContent}
          />

          {/* Order Summary Checkout Button  */}
          {!isPlainSummary && (
            <>
              <div className={OrderSummaryStyles.checkoutDesktopView}>
                {renderCheckoutButton(
                  OrderSummaryStyles.orderSummaryContentInfoOutline,
                  OrderSummaryStyles.orderSummaryContentInfoOutlineLink
                )}
              </div>

              <div className={OrderSummaryStyles.checkoutMobileView}>
                {renderCheckoutButton(
                  OrderSummaryStyles.orderSummaryContentInfoOutlineMobile,
                  OrderSummaryStyles.orderSummaryContentInfoOutlineLinkMobile
                )}
                <RenderHelpAndContact
                  isMobile={true}
                  cartNumber={cartNumber}
                  fullCartContent={fullCartContent}
                />
              </div>
            </>
          )}
        </div>
      </>
    </>
  );
}
