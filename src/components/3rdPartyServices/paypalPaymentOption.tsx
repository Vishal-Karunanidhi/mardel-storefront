import Script from 'next/script';
import { useSelector } from '@Redux/store';
import { useDispatch } from '@Redux/store';
import { addPaypalShippingAddressToCart } from '@Lib/cms/checkoutPage';
import { resetCart, addPaypalPaymentToCart } from '@Lib/cms/cartpage';

const currency = process.env.NEXT_PUBLIC_PAYPAL_CURRENCY ?? 'USD';
const intent = process.env.NEXT_PUBLIC_PAYPAL_INTENT ?? 'authorize';
const paypalSdkSrc = process.env.NEXT_PUBLIC_PAYPAL_SDK_LIB ?? 'https://www.paypal.com/sdk/js';
const clientId =
  process.env.NEXT_PUBLIC_PAYPAL_SDK_CLIENT_ID ??
  'AeVA19y3VRyBCTuNg1Cs3s12_vAaFpcvaZ6-2Z55Wv7koOoTtUVJrmB2zH2x1HVKjYySqsSxw9DMj8dd';
let dispatch;

const PaypalPaymentOption = () => {
  dispatch = useDispatch();
  const {
    pageType: { isCheckoutPage, isPdpPage }
  } = useSelector((state) => state.layout);
  if (!isCheckoutPage && !isPdpPage) {
    return <></>;
  }

  return (
    <>
      <Script
        src={`${paypalSdkSrc}?client-id=${clientId}&currency=${currency}&intent=${intent}&disable-funding=card&commit=false&components=messages,buttons`}
      />
    </>
  );
};

const currency_code = currency;

function renderPaypalContainerItems(propArgs) {
  const { intent = 'AUTHORIZE', containerId = 'paypal-button-container' } = propArgs;
  let { cartDetails } = propArgs;
  try {
    const { totalPrice } = cartDetails.orderSummary;
    const containerElement = document?.getElementById(containerId);
    if (!containerElement || !!containerElement?.childNodes?.length || !totalPrice) {
      return;
    }

    const style = {
      tagline: false,
      shape: 'pill',
      label: 'paypal',
      layout: 'vertical'
    };

    window?.['paypal']
      ?.Buttons({
        style,
        createOrder: createPaypalOrder,
        onShippingChange: paypalShippingChange,

        onError: async function (err) {
          await resetCart();
          window.location.href = '/checkout?redirectFrom=paypal';
        },
        // Finalize the transaction after payer approval
        onApprove: async (data, actions) => {
          const { orderID } = data;
          cartDetails = await addPaypalPaymentToCart(orderID);
          if (dispatch) {
            dispatch({
              type: 'UPDATE_TOTAL_PRICE',
              payload: cartDetails?.orderSummary?.totalPrice
            });

            dispatch({
              type: 'UPDATE_ORDERSUMMARY',
              payload: cartDetails?.orderSummary
            });
          }
          window.location.href = '/checkout?redirectFrom=paypal';
        }
      })
      .render(`#${containerId}`);
  } catch (err) {
    console.log('Failure happened at the Paypal button render', err);
  }
}

const createPaypalOrder = async (_, actions) => {
  const cartDetails = await resetCart();
  const { shippingAddress, orderSummary } = cartDetails;

  let constructSubsidaryProps = {};
  let applicationContextProps = {};
  if (Object.keys(shippingAddress).length && !!shippingAddress.streetName) {
    constructSubsidaryProps['shipping'] = {
      name: {
        full_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`
      },
      address: {
        address_line_1: `${shippingAddress.streetName}`,
        address_line_2: `${shippingAddress.additionalStreetInfo}`,
        country_code: `${shippingAddress.country}`,
        admin_area_1: `${shippingAddress.state}`,
        admin_area_2: `${shippingAddress.city}`,
        postal_code: `${shippingAddress.postalCode}`
      }
    };

    applicationContextProps['application_context'] = {
      shipping_preference: 'SET_PROVIDED_ADDRESS'
    };
  }

  const orderId = await actions.order.create({
    intent,
    ...applicationContextProps,
    purchase_units: [
      {
        custom_id: cartDetails?.id,
        amount: {
          currency_code,
          value: orderSummary?.totalPrice
        },
        invoice_id: cartDetails?.cartNumber,
        ...constructSubsidaryProps
      }
    ]
  });
  return orderId;
};

const paypalShippingChange = async (data, actions) => {
  if (data.shipping_address.country_code !== 'US') {
    return actions.reject();
  }

  const { country_code: country, city, postal_code: zipCode, state } = data?.shipping_address;
  const cartDetails = await addPaypalShippingAddressToCart({ country, city, zipCode, state });

  const { merchandiseSubTotal, totalTax, shippingSubTotal, shippingDiscount } =
    cartDetails?.orderSummary;

  const shippingValue = `${shippingSubTotal - totalTax}`;

  return actions.order
    .patch([
      {
        op: 'replace',
        path: "/purchase_units/@reference_id=='default'/amount",
        value: {
          currency_code,
          value: (
            parseFloat(merchandiseSubTotal + '') +
            parseFloat(shippingValue) +
            parseFloat(totalTax + '')
          ).toFixed(2),
          breakdown: {
            item_total: {
              currency_code,
              value: merchandiseSubTotal
            },
            shipping: {
              currency_code,
              value: parseFloat(shippingValue).toFixed(2)
            },
            tax_total: {
              currency_code,
              value: totalTax
            }
          }
        }
      }
    ])
    .then(console.log);
};

export default PaypalPaymentOption;
export { renderPaypalContainerItems };
