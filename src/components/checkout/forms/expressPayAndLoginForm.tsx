import {
  addPaypalShippingAddressToCart,
  authorizeApplePayGql,
  getApplePayMerchantSession
} from '@Lib/cms/checkoutPage';
import { Divider } from '@mui/material';
import { executeFnLastInEventQueue } from '@Lib/common/utility';
import { renderPaypalContainerItems } from '@Components/3rdPartyServices/paypalPaymentOption';
import { useRouter } from 'next/router';
import { useSelector } from '@Redux/store';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CheckoutStyles from '@Styles/checkout/checkoutPage.module.scss';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpressLoginStyles from '@Styles/checkout/expressPayAndLogin.module.scss';
import PaypalPayLaterMsg from '@Components/3rdPartyServices/paypalPayLaterMsg';
import React, { useEffect, useState, useRef } from 'react';
import SignIn from '@Components/account/signIn';

const ExpressPayComp = React.memo(() => {
  const { cartDeatilsFromRedux, cartTotalPrice } = useSelector((state) => state.checkout);
  const router = useRouter();
  const applePayButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const props = {
      containerId: 'paypal-button-container',
      cartDetails: cartDeatilsFromRedux,
      buttonAlign: 'horizontal'
    };
    executeFnLastInEventQueue(renderPaypalContainerItems, props, 1000);
    displayApplePayButtons();
  }, [cartDeatilsFromRedux]);

  const displayApplePayButtons = () => {
    const applePayButton = applePayButtonRef.current;
    // @ts-ignore */
    if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
      applePayButton.style.display = 'inline-block';
    }
  };

  const configureApplePay = () => {
    // @ts-ignore */
    if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
      var request = {
        countryCode: 'US',
        currencyCode: 'USD',
        supportedNetworks: ['visa', 'masterCard', 'amex'],
        merchantCapabilities: ['supports3DS'],
        requiredBillingContactFields: ['postalAddress', 'phone', 'email'],
        requiredShippingContactFields: ['postalAddress', 'phone', 'email'],
        total: {
          label: 'Hobby Lobby',
          amount: cartTotalPrice
        }
      };

      // @ts-ignore */
      const session = new window.ApplePaySession(3, request);

      session.onvalidatemerchant = async (event: any) => {
        const validationURL = encodeURIComponent(event.validationURL);
        const domainName = encodeURIComponent(window.location.hostname);

        const merchantSession = await handleFetchAppleMerchantSession(validationURL, domainName);
        if (merchantSession.token) {
          session.completeMerchantValidation(JSON.parse(merchantSession.token));
        } else {
          session.abort();
        }
      };

      session.onshippingcontactselected = async (event: any) => {
        const {
          countryCode: country,
          locality: city,
          postalCode: zipCode,
          administrativeArea: state
        } = event.shippingContact;
        const cartDetails = await addPaypalShippingAddressToCart({
          country,
          city,
          zipCode,
          state
        });

        const {
          merchandiseSubTotal,
          totalTax,
          shippingSubTotal,
          shippingDiscount,
          totalPrice,
          carrierSurcharge
        } = cartDetails?.orderSummary;

        if (cartDetails) {
          if (carrierSurcharge > 0) {
            session.completeShippingContactSelection(
              [],
              [],
              { label: 'Hobby Lobby', amount: totalPrice },
              [
                { label: 'Subtotal', amount: merchandiseSubTotal },
                { label: 'Shipping', amount: shippingSubTotal - shippingDiscount },
                { label: 'Shipping Surcharge', amount: carrierSurcharge },
                { label: 'Estimated Tax', amount: totalTax }
              ]
            );
          } else {
            session.completeShippingContactSelection(
              [],
              [],
              { label: 'Hobby Lobby', amount: totalPrice },
              [
                { label: 'Subtotal', amount: merchandiseSubTotal },
                { label: 'Shipping', amount: shippingSubTotal - shippingDiscount },
                { label: 'Estimated Tax', amount: totalTax }
              ]
            );
          }
        } else {
          session.abort();
        }
      };

      session.onpaymentauthorized = async (event: any) => {
        const billingContact = event.payment.billingContact;
        const shippingContact = event.payment.shippingContact;
        const billingAddress = {
          addressLineOne: billingContact.addressLines[0],
          addressLineTwo: billingContact.addressLines[1],
          city: billingContact.locality,
          country: billingContact.countryCode,
          firstName: billingContact.givenName,
          lastName: billingContact.familyName,
          state: billingContact.administrativeArea,
          zipCode: billingContact.postalCode,
          phone: shippingContact.phoneNumber,
          addressVerified: false
        };
        const shippingAddress = {
          addressLineOne: shippingContact.addressLines[0],
          addressLineTwo: shippingContact.addressLines[1],
          city: shippingContact.locality,
          country: shippingContact.countryCode,
          firstName: shippingContact.givenName,
          lastName: shippingContact.familyName,
          state: shippingContact.administrativeArea,
          zipCode: shippingContact.postalCode,
          phone: shippingContact.phoneNumber,
          emailAddress: shippingContact.emailAddress
        };

        const paymentToken = event.payment.token;
        const paymentDataString = JSON.stringify(paymentToken.paymentData);
        const paymentDataBase64 = btoa(paymentDataString);

        const payment = {
          applePay: {
            customerToken: paymentDataBase64,
            cardDetailsNetwork: paymentToken.paymentMethod.network
          },
          type: 'applePay'
        };

        const response = await authorizeApplePayGql({
          billingAddress,
          shippingAddress,
          payment
        });

        if (response.data && response.data?.authorizeApplePay.status === 'SUCCESS') {
          // @ts-ignore */
          session.completePayment(window.ApplePaySession.STATUS_SUCCESS, []);

          const applePayOrder = response.data.authorizeApplePay.order;
          const checkoutFormValue = {
            orderConfirmation: {
              orderNumber: applePayOrder.orderNumber,
              email: applePayOrder?.customerEmail
                ? applePayOrder?.customerEmail
                : applePayOrder?.shippingAddress.email,
              billingZipCode: applePayOrder.billingAddress.postalCode
            }
          };
          const encodedOrderData = encodeURIComponent(JSON.stringify(checkoutFormValue));
          router.push({
            pathname: '/orderConfirmation',
            query: { state: encodedOrderData }
          } as any);
        } else if (response.errors) {
          const responseError = response.errors[0]?.extensions?.error.status;

          if (responseError === 'BILLING_ERROR') {
            session.completePayment(
              // @ts-ignore */
              window.ApplePaySession.STATUS_INVALID_BILLING_POSTAL_ADDRESS,
              []
            );
          } else if (responseError === 'SHIPPING_ERROR') {
            session.completePayment(
              // @ts-ignore */
              window.ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS,
              []
            );
          } else {
            // @ts-ignore */
            session.completePayment(window.ApplePaySession.STATUS_FAILURE, []);
          }
        }
      };

      session.oncancel = (event: any) => {
        console.info(event);
      };

      session.begin();
    }
  };

  const handleFetchAppleMerchantSession = async (validationUrl, domainName) => {
    const merchantSession = await getApplePayMerchantSession({ validationUrl, domainName });
    return merchantSession;
  };

  return (
    <>
      <h2 className={ExpressLoginStyles.expressPayTitle}>Express Checkout</h2>
      <div className={ExpressLoginStyles.expressPayWrapper}>
        <span className={ExpressLoginStyles.applePayspan}>
          <button
            title="Pay"
            data-testid="apple-pay-button"
            ref={applePayButtonRef}
            onClick={configureApplePay}
            className={ExpressLoginStyles.applePayButton}
            aria-label="Apple Pay"
          ></button>
        </span>
        <span className={ExpressLoginStyles.payPalspan}>
          {/* <HlButton buttonTitle={'PayPal'} dataTestId="paypal-button" /> */}
          <div className={ExpressLoginStyles.payPalBtn}>
            <div id="paypal-button-container"></div>
            <PaypalPayLaterMsg price={cartTotalPrice} />
          </div>
        </span>
      </div>
    </>
  );
});

ExpressPayComp.displayName = 'ExpressPayComp';

/*Default Exporter function*/
function ExpressPayAndLogin(props: any): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const { heartBeatInfo } = useSelector((state) => state.auth);

  return (
    <div className={CheckoutStyles.individualFormBoxes}>
      <div className={ExpressLoginStyles.expressPayLoginWrapper}>
        <ExpressPayComp />
        {Object.keys(heartBeatInfo).length && !heartBeatInfo.isLoggedInUser && (
          <>
            <Divider className={ExpressLoginStyles.divider} />
            <div className={ExpressLoginStyles.loginWrapper}>
              <Accordion expanded={expanded} onChange={() => setExpanded((prev) => !prev)}>
                <AccordionSummary
                  aria-controls="panel1a-content"
                  expandIcon={<ExpandMoreIcon />}
                  id="panel1a-header"
                >
                  <AccountCircleOutlinedIcon />
                  <u>
                    <label>Returning Customers Login</label>
                  </u>
                </AccordionSummary>
                <AccordionDetails>
                  <SignIn
                    parentDivClass={ExpressLoginStyles.signInButton}
                    buttonTitle="Save & Continue"
                    isNonLoginPage
                    callbackSignInReponse={() => window?.location?.reload()}
                  ></SignIn>
                </AccordionDetails>
              </Accordion>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default ExpressPayAndLogin;
