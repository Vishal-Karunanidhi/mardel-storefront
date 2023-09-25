import { useState, useEffect, useRef } from 'react';
import MarkdownView from 'react-showdown';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import HLTextField from '@Components/common/hlTextField';
import HlButton from '@Components/common/button';
import { isValidEmail } from '@Components/common/accountValidator';
import OrderNotFound from '@Components/orderStatus/orderNotFound';
import OrderStatusBar from '@Components/orderStatus/orderStatusBar';
import ShippingAddress from '@Components/orderStatus/shippingAddress';
import GiftMessage from '@Components/orderStatus/giftMessage';
import BillingAddress from '@Components/orderStatus/billingAddress';
import PaymentMethod from '@Components/orderStatus/paymentMethod';
import ReOrderItems from '@Components/account/reOrderItems';
import OrderSummary from '@Components/cartPage/orderSummary';
import ShipmentStatus from '@Components/orderStatus/ShipmentStatus';
import { getOrderLookUp, getOrderReturn } from '@Lib/cms/orderDetails';
import { contentToBreadcrumb } from '@Lib/common/utility';
import { getFreeShippingMessages } from '@Lib/cms/cartpage';
import { getMiniCartContentGql } from '@Lib/cms/cartpage';
import {
  olBreadCrumbs,
  defaultFormValue,
  defaultErrorMessage,
  formFields,
  dialogContent
} from '@Constants/orderStatus';
import OrderlookupStyles from '@Styles/orderStatus/orderLookup.module.scss';

export default function OrderStatus(): JSX.Element {
  const fieldRefs = {};
  Object.entries(defaultFormValue).forEach(([e]) => {
    fieldRefs[e] = useRef(null);
  });

  const [isValidForm, setIsValidForm] = useState(false);
  const [orderLookupInfo, setOrderLookupInfo] = useState(null);
  const [isOrderNotfound, setIsOrderNotfound] = useState(false);
  const [errorFields, setErrorFields] = useState(defaultErrorMessage);
  const [orderLookupFormValue, setOrderLookupFormValue] = useState(defaultFormValue);

  useEffect(() => {
    validateFormfields();
  }, [orderLookupFormValue]);

  const validateFormfields = () => {
    const { orderNumber, billingZipcode, email } = orderLookupFormValue;
    const isValid =
      orderNumber &&
      orderNumber.length == 8 &&
      billingZipcode &&
      billingZipcode.length <= 10 &&
      email &&
      isValidEmail(email);
    setIsValidForm(isValid);
  };

  const handleOrderLookup = async () => {
    const [orderLookup] = await Promise.all([getOrderLookUp(orderLookupFormValue)]);
    setOrderLookupInfo(orderLookup);
    setIsOrderNotfound(!!orderLookup.errorMessage);
  };

  const handleInputChange = (event, type) => {
    const { value } = event?.target;
    if (type === 'orderNumber' && value.length > 8) {
      return;
    }
    if (type === 'billingZipcode' && value.length > 10) {
      return;
    }
    setOrderLookupFormValue({
      ...orderLookupFormValue,
      [type]: value
    });
  };

  const cropZipCode = () => {
    orderLookupFormValue.billingZipcode = orderLookupFormValue.billingZipcode.match(
      /^\d{5}(-\d*)?$/
    )
      ? orderLookupFormValue.billingZipcode.slice(0, 5)
      : orderLookupFormValue.billingZipcode;
  };

  const validateFieldError = (e) => {
    const { orderNumber, billingZipcode, email } = orderLookupFormValue;
    const { name } = e.target;

    const fieldValidity = {
      isOrderNumberError:
        name === 'orderNumber'
          ? !(orderNumber && orderNumber.length === 8)
          : errorFields.isOrderNumberError,
      isBillingZipCodeError:
        name === 'billingZipcode'
          ? !billingZipcode || billingZipcode.length > 10
          : errorFields.isBillingZipCodeError,
      isEmailError: !!email && !isValidEmail(email)
    };

    setErrorFields(fieldValidity);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  };

  const renderLookup = () => {
    return (
      <div className={OrderlookupStyles.orderLookUpBox}>
        <h2 className={OrderlookupStyles.orderLookUpHeader}>Check Your Order</h2>
        <form onSubmit={handleFormSubmit} className={OrderlookupStyles.orderLookUpForm}>
          <div className={OrderlookupStyles.orderLookUpInputs}>
            {formFields.map((formItem) => (
              <HLTextField
                labelName={formItem.label}
                type={formItem.type}
                ref={fieldRefs[formItem.key]}
                key={formItem.key}
                name={formItem.key}
                onBlur={(e) => {
                  validateFieldError(e);
                  formItem.key == 'billingZipcode' && cropZipCode();
                }}
                error={errorFields[formItem.error]}
                helperText={errorFields[formItem.error] ? formItem.errorMessage : ''}
                textFieldValue={orderLookupFormValue[formItem.key]}
                handleInputChange={(event) => handleInputChange(event, formItem.key)}
              />
            ))}
            <div className={OrderlookupStyles.lookUpButton}>
              <HlButton
                buttonTitle="Look Up Order"
                callbackMethod={handleOrderLookup}
                isDisabled={!isValidForm}
              />
            </div>
          </div>
        </form>
      </div>
    );
  };

  const nextGenDetailsProps = {
    orderLookup: orderLookupInfo,
    handleOrderLookup
  };

  return (
    <div className={OrderlookupStyles.orderStatusContainer}>
      <Breadcrumb breadCrumbs={contentToBreadcrumb(olBreadCrumbs)} />
      <div className={OrderlookupStyles.orderLookUp}>{renderLookup()}</div>
      {isOrderNotfound ? (
        <OrderNotFound />
      ) : (
        <>
          {orderLookupInfo && Object.keys(orderLookupInfo)?.length && (
            <NextGenOrderDetails {...nextGenDetailsProps} />
          )}
        </>
      )}
    </div>
  );
}

export const NextGenOrderDetails = (props) => {
  const { orderLookup, handleOrderLookup } = props;
  const [fullCartContent, setFullCartContent] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderReturn, setOrderReturn] = useState(null);

  useEffect(() => {
    fetchCmsContents();
  }, [orderLookup]);

  useEffect(() => {
    if (orderDetails) setOrderReturn(null);
  }, [orderDetails]);

  const handleOrderReturn = async () => {
    const deliveryKey = 'order-return';
    const orderReturn = await getOrderReturn(deliveryKey);
    setOrderReturn(orderReturn);
    setOrderDetails(null);
  };

  async function fetchCmsContents() {
    const [{ fullCartContent: fcCmsData }, { freeShippingDetails }] = await Promise.all([
      getMiniCartContentGql(),
      getFreeShippingMessages()
    ]);

    const {
      shippingCost: standardShipping,
      shippingSurcharge: additionalShipping,
      carrierSurcharge: carrierSurCharge,
      subTotal: shippingSubTotal
    } = orderLookup?.order;

    setOrderDetails({ ...orderLookup.order, freeShippingDetails });
    setFullCartContent({
      fullCartContent: fcCmsData,
      cartNumber: orderLookup?.order?.cartNumber,
      orderSummary: {
        ...orderLookup?.order,
        standardShipping,
        additionalShipping,
        carrierSurCharge,
        shippingSubTotal
      }
    });
  }

  if (!orderDetails && !orderReturn) {
    return <></>;
  }

  return (
    <>
      {orderReturn ? (
        <div className={OrderlookupStyles.orderReturn}>
          <span>{dialogContent.returnConfirmation}</span>
          <a
            href={orderReturn?.pageDescriptionLink?.value}
            rel="noreferrer"
            className={OrderlookupStyles.link}
          >
            {orderReturn?.pageDescriptionLink?.label}
          </a>
          <MarkdownView
            options={{ tables: true, emoji: true }}
            markdown={orderReturn?.pageDescriptionText}
          />
        </div>
      ) : (
        <div className={OrderlookupStyles.orderStatusBar}>
          <OrderStatusBar
            {...orderDetails}
            handleOrderCancel={handleOrderLookup}
            handleOrderReturn={handleOrderReturn}
          />
          <ShipmentStatus {...orderDetails} className={OrderlookupStyles.shipmentStatus} />

          <div className={OrderlookupStyles.orderDetails}>
            <div className={OrderlookupStyles.leftBar}>
              <ShippingAddress shippingAddress={orderDetails?.shippingAddress} />
              <>{orderDetails?.giftOption && <GiftMessage {...orderDetails} />}</>
              <BillingAddress billingAddress={orderDetails?.billingAddress} />
              {orderDetails?.payments?.map((payments, index) => (
                <PaymentMethod key={index} payments={payments} paymentIndex={index + 1} />
              ))}
            </div>
            <div>
              <OrderSummary
                totalLineItems=""
                isPlainSummary={true}
                freeShippingDetails={true}
                taxPrice={orderDetails?.totalTax}
                orderSummaryDetails={fullCartContent}
                isTaxAvailable={!orderDetails?.taxExempt}
                isRetailDeliveryFeeAvailable
              />
            </div>
          </div>
          <div className={OrderlookupStyles.orderedItems}>
            <ReOrderItems lineItems={orderDetails?.lineItems} />
          </div>
        </div>
      )}
    </>
  );
};
