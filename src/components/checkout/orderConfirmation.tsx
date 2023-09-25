import OrderConfirmationStyles from '@Styles/orderConfirmation/orderConfirmation.module.scss';
import CheckoutStyles from '@Styles/checkout/orderConfirmation.module.scss';
import { useSelector } from '@Redux/store';
import SignUp from '@Components/account/signUp';
import { Divider } from '@mui/material';
import { getOrderLookUp } from '@Lib/cms/orderDetails';
import { useEffect, useState } from 'react';
import { phoneFormatter } from '@Components/common/accountValidator';

export default function OrderConfirmation(props: any): JSX.Element {
  const { checkoutFormValue } = props;
  const { orderNumber, email, billingZipCode } = checkoutFormValue?.orderConfirmation;

  const [orderDetails, setOrderDetails] = useState({
    orderDate: '',
    orderNumber: orderNumber,
    orderTotal: '',
    email: email,
    billingZipCode: '',
    phone: '',
    shippingFirstName: '',
    shippingLastName: '',
    shippingLine1: '',
    shippingLine2: null,
    shippingCompany: null,
    shippingCity: '',
    shippingState: '',
    shippingPostalCode: '',
    shippingCountry: ''
  });
  const [guestSignUpFieldValues, setGuestSignUpFieldValues] = useState(null);

  const { heartBeatInfo } = useSelector((state) => state.auth);
  const orderLookupFormValue = {
    orderNumber: orderNumber,
    billingZipcode: billingZipCode,
    email: email
  };

  useEffect(() => {
    getOrderDetails(orderLookupFormValue);
  }, []);

  async function getOrderDetails(orderLookupFormValue: {
    orderNumber: string;
    billingZipcode: string;
    email: string;
  }) {
    const orderLookup = await getOrderLookUp(orderLookupFormValue);
    const orderDetails = orderLookup.order;
    const orderConfirmation = {
      orderDate: orderDetails.creationTime,
      orderNumber: orderDetails.orderNumber,
      orderTotal: orderDetails.totalPrice,
      email: orderDetails.customerEmail
        ? orderDetails.customerEmail
        : orderDetails.shippingAddress.email,
      billingZipCode: orderDetails.billingAddress.postalCode,
      phone: orderDetails.billingAddress.phone,
      shippingFirstName: orderDetails.shippingAddress.firstName,
      shippingLastName: orderDetails.shippingAddress.lastName,
      shippingLine1: orderDetails.shippingAddress.addressLineOne,
      shippingLine2: orderDetails.shippingAddress.addressLineTwo,
      shippingCompany: orderDetails.shippingAddress.company,
      shippingCity: orderDetails.shippingAddress.city,
      shippingState: orderDetails.shippingAddress.state,
      shippingPostalCode: orderDetails.shippingAddress.postalCode,
      shippingCountry: orderDetails.shippingAddress.country
    };
    const signUpFields = {
      firstName: orderDetails.shippingAddress.firstName,
      lastName: orderDetails.shippingAddress.lastName,
      email: orderDetails.shippingAddress.email,
      password: '',
      confirmPassword: '',
      phone: orderDetails.billingAddress.phone
    };
    setOrderDetails(orderConfirmation);
    setGuestSignUpFieldValues(signUpFields);
  }

  return (
    <div className={OrderConfirmationStyles.container}>
      <p className={OrderConfirmationStyles.image}>
        <img
          alt="A decorative seal containing the words 'Live a Creative Life!'"
          height={287}
          src={'/icons/checkout/orderConfirmation.png'}
          width={609}
        />
      </p>
      <h2 className={OrderConfirmationStyles.title}>Thank you for shopping with us!</h2>
      <p className={OrderConfirmationStyles.confirmation}>
        We have received your order, and you will receive a confirmation email shortly at:{' '}
        <strong>{orderDetails?.email}</strong>
      </p>
      <dl className={OrderConfirmationStyles.orderInformation}>
        <dt>Order number:</dt>
        <dd>{orderDetails?.orderNumber}</dd>
        <dt>Date:</dt>
        <dd>{orderDetails?.orderDate}</dd>
        <dt>Order total:</dt>
        <dd>${orderDetails?.orderTotal}</dd>
        <dt>Billing phone:</dt>
        <dd>{phoneFormatter(orderDetails?.phone)}</dd>
        <dt>Billing ZIP Code:</dt>
        <dd>{orderDetails?.billingZipCode}</dd>
      </dl>
      <h3 className={OrderConfirmationStyles.shippingTitle}>Shipping Address:</h3>
      <ul className={OrderConfirmationStyles.shippingAddress}>
        <li>{`${orderDetails.shippingFirstName} ${orderDetails.shippingLastName}`}</li>
        <li>{`${orderDetails.shippingLine1} ${orderDetails.shippingLine2 ?? ''}`}</li>
        {orderDetails.shippingCompany && <li>{`${orderDetails.shippingCompany}`}</li>}
        <li>{`${orderDetails.shippingCity} ${orderDetails.shippingState} ${orderDetails.shippingPostalCode}`}</li>
        <li>{`${orderDetails.shippingCountry}`}</li>
      </ul>
      <div className={OrderConfirmationStyles.shippingForm}>
        {!heartBeatInfo.isLoggedInUser && guestSignUpFieldValues && (
          <>
            <Divider className={CheckoutStyles.benefitDivider} />
            <SignUp guestSignUpFieldValues={guestSignUpFieldValues} isGuestSignUp />
          </>
        )}
      </div>
    </div>
  );
}
