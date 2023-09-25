import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@Redux/store';
import { updateCart, removeCartItem } from '@Lib/cms/cartpage';
import ProductTileStyles from '@Styles/cartpage/productTileMain.module.scss';
import { Ga4ViewItemEcommerce } from 'src/interfaces/ga4Ecommerce';

let gtmData: Ga4ViewItemEcommerce;
export default function ProductTileActionComponent(props: any): JSX.Element {
  const { quantity, discountedPricePerQuantity, originalPricePerQuantity, lineItemId, variantKey } =
    props;
  const dispatch = useDispatch();
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [isItemModified, setIsItemModified] = useState(false);

  const {
    heartBeatInfo: { sessionId, isLoggedInUser }
  } = useSelector((state) => state.auth);

  useEffect(() => {
    (() => {
      gtmData = {
        anonymous_user_id: '',
        currency: 'USD',
        ecommerce: {
          items: [
            {
              affiliation: '',
              coupon: '',
              currency: 'USD',
              discount: discountedPricePerQuantity
                ? originalPricePerQuantity - discountedPricePerQuantity
                : 0,
              index: '',
              item_brand: props?.variant?.attributes?.brand?.label || '',
              item_category: '',
              item_category2: '',
              item_category3: '',
              item_category4: '',
              item_category5: '',
              item_id: props?.variant?.sku,
              item_list_id: '',
              item_list_name: '',
              item_name: props?.name,
              item_variant: '',
              price: originalPricePerQuantity,
              quantity
            }
          ]
        },
        event: 'add_to_cart',
        value: originalPricePerQuantity,
        user_id: ''
      };

      if (sessionId) {
        isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
      }
    })();
  }, []);

  const fireCartActionEvent = (modifiedQuantity) => {
    const quantDifference = modifiedQuantity - quantity;
    if (window) {
      gtmData['ecommerce']['items'][0]['quantity'] = Math?.abs(quantDifference);
      gtmData['event'] = Math?.sign(quantDifference) === -1 ? 'remove_from_cart' : 'add_to_cart';
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      window.dataLayer.push(gtmData);
    }
  };

  // Update cart items method
  const updateCartItems = async (modifiedQuantity) => {
    const originalQuantity = quantity;
    if (modifiedQuantity === 0) {
      return handleRemoveLineItem();
    }
    setIsItemModified(true);
    let updateCartResponse;

    const updateCartRequest: any = {
      lineItemId,
      variantKey,
      amount: parseInt(originalPricePerQuantity)
    };
    updateCartRequest['quantity'] = modifiedQuantity;
    try {
      updateCartResponse = (await updateCart({}, updateCartRequest)) ?? {};
    } catch (err) {}

    if (!updateCartResponse) {
      alert('Sorry, some error occurred at our End');
      setItemQuantity(originalQuantity);
    } else {
      dispatch({
        type: 'UPDATE_CART_DETAILS',
        payload: updateCartResponse?.updateCart
      });
      fireCartActionEvent(modifiedQuantity);
    }
    setIsItemModified(false);
  };

  // Remove cart items Method
  const handleRemoveLineItem = async () => {
    let updateCartResponse;
    setIsItemModified(true);
    try {
      updateCartResponse = (await removeCartItem({}, lineItemId)) ?? {};
    } catch (err) {}

    if (!updateCartResponse) {
      alert('Sorry, some error occurred at our End');
    } else {
      dispatch({
        type: 'UPDATE_CART_DETAILS',
        payload: updateCartResponse?.removeFromCart
      });
      dispatch({
        type: 'UPDATE_LINE_ITEM_COUNT',
        payload: { lineItemCount: updateCartResponse?.removeFromCart?.lineItemCount }
      });
    }
    setIsItemModified(false);
    fireCartActionEvent(0);
  };

  // ButtonGroup Items in the cart Increment method
  const handleIncrement = () => {
    const incrementedQty = itemQuantity + 1;
    setItemQuantity(incrementedQty);
    updateCartItems(incrementedQty);
  };

  // ButtonGroup Items in the cart decrement method
  const handleDecrement = () => {
    const decrementedQty = itemQuantity - 1;
    setItemQuantity(decrementedQty);
    updateCartItems(decrementedQty);
  };

  // ButtonGroup input box quantity change method
  const handleLineItemInputChange = (e) => {
    let value = e?.target?.value.trim();
    if (isNaN(value)) {
      return;
    }
    value = parseInt(value);
    if (!value || value < 0) {
      if (value === 0) {
        setItemQuantity(value);
      }
    }
    setItemQuantity(isNaN(value) ? '' : value);
  };

  const handleQuantityChange = (e) => {
    let { value } = e?.target;
    if (isNaN(value)) {
      return;
    }
    value = parseInt(value);
    if (!value || value < 0) {
      if (value === 0) {
        setItemQuantity(value);
        handleRemoveLineItem();
      }
      setItemQuantity(quantity);
      return;
    }
    if (value === quantity) {
      return;
    }
    setItemQuantity(value);
    updateCartItems(value);
  };

  return (
    <div className={ProductTileStyles.cartActionButton}>
      <div className={ProductTileStyles.buttonGroup}>
        <button
          className={ProductTileStyles.decrement}
          onClick={handleDecrement}
          disabled={isItemModified}
        >
          {' '}
          -{' '}
        </button>
        <input
          className={ProductTileStyles.itemQuantity}
          value={itemQuantity}
          onChange={handleLineItemInputChange}
          onBlur={handleQuantityChange}
          disabled={isItemModified}
        ></input>
        <button
          className={ProductTileStyles.increment}
          onClick={handleIncrement}
          disabled={isItemModified}
        >
          {' '}
          +{' '}
        </button>
      </div>
      <span className={ProductTileStyles.deleteButtonSpan}>
        <button
          className={ProductTileStyles.deleteButton}
          disabled={isItemModified}
          onClick={handleRemoveLineItem}
        >
          <img
            src="/icons/deleteIcon.svg"
            alt="Delete"
            width={20}
            height={20}
            aria-label="delete"
            className={ProductTileStyles.deleteImageButton}
          />
        </button>
      </span>
    </div>
  );
}
