import { useState, useEffect } from 'react';
import { useSelector } from '@Redux/store';
import ViewShippingAddress from '@Components/checkout/forms/shippingAddress/viewShippingAddress';
import ViewGiftMessage from '@Components/checkout/forms/shippingAddress/viewGiftMessage';
import EditLoggedInShippingAddress from '@Components/checkout/forms/shippingAddress/editLoggedInShippingAddress';
import AddEditShippingAddress from '@Components/checkout/forms/shippingAddress/addEditShippingAddress';
import { getCustomerAddress } from '@Lib/cms/myAccountPage';
import { resetCart, addPaypalPaymentToCart } from '@Lib/cms/cartpage';

export default function ShippingAddressForm(props: any): JSX.Element {
  const {
    checkoutFormValue,
    currentFormMode,
    countryStateData,
    updateCurrentFormMode,
    shippingInfoGtmData
  } = props;
  const [isChecked, setIsChecked] = useState(checkoutFormValue.shipping.isGiftMsgAdded);
  const [shippingAddressList, setShippingAddressList] = useState([]);
  const {
    heartBeatInfo: { isLoggedInUser }
  } = useSelector((state) => state.auth);

  useEffect(() => {
    async function getCustomerShipping() {
      const shippingAddressResponse = await getCustomerAddress();
      const shippingList = shippingAddressResponse
        .filter((e) => e.country === 'US')
        .sort((a, b) => b.defaultAddress - a.defaultAddress);

      setShippingAddressList(shippingList);
    }
    if (isLoggedInUser) {
      getCustomerShipping();
    }
  }, [isLoggedInUser]);

  const addressCrudProps = {
    contact: checkoutFormValue?.contact,
    countryStateData: countryStateData,
    defaultFormValues: checkoutFormValue.shipping,
    updateCheckoutFormUpdateClean: props.updateCheckoutFormUpdateClean,
    shippingInfoGtmData: shippingInfoGtmData
  };
  const RenderEditAddressForm = () => {
    return (
      <>
        <AddEditShippingAddress {...addressCrudProps} />
      </>
    );
  };

  switch (currentFormMode) {
    case 'VIEW':
      return (
        <>
          {
            <ViewShippingAddress
              shipping={checkoutFormValue?.shipping}
              updateCurrentFormMode={updateCurrentFormMode}
            >
              <ViewGiftMessage
                giftMessageDetails={checkoutFormValue?.shipping?.giftMessageDetails}
                updateCurrentFormMode={updateCurrentFormMode}
                isChecked={isChecked}
              />
            </ViewShippingAddress>
          }
        </>
      );
    case 'EDIT':
      return (
        <>
          {isLoggedInUser && shippingAddressList.length > 0 ? (
            <EditLoggedInShippingAddress
              prevSelectedAddress={addressCrudProps?.defaultFormValues?.addressId}
              addressCrudProps={addressCrudProps}
              shippingAddressList={shippingAddressList}
              isAddressBookExists={shippingAddressList.length > 0}
            />
          ) : (
            RenderEditAddressForm()
          )}
        </>
      );
    default:
      return <>SHIPPING ADDRESS</>;
  }
}
