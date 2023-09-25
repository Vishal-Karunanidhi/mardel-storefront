import { useState, useEffect } from 'react';
import { useDispatch } from '@Redux/store';
import HlButton from '@Components/common/button';
import { addToCart as addProductToCart } from '@Lib/cms/cartpage';
import { productStatus, titleCase } from '@Lib/common/utility';
import { availabilityCheck } from '@Constants/cartConstants';
import { ActionButton } from '@Components/shared/productCardComps';
import ProductTileStyles from '@Styles/cartpage/productTileMain.module.scss';

export default function ProductTileAddCartComponent(props: any): JSX.Element {
  const { variant, pdpUrl } = props;

  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [availableProducts, setAvailableproducts] = useState({ title: '', isDisable: false });

  useEffect(() => {
    const Availability = (): void => {
      const status = productStatus(variant, null, true);

      setAvailableproducts(availabilityCheck[status]);
    };
    Availability();
  }, []);

  // ButtonGroup Items in the cart Increment method
  const handleIncrement = () => {
    const incrementedQty = itemQuantity + 1;
    setItemQuantity(incrementedQty);
  };

  // ButtonGroup Items in the cart decrement method
  const handleDecrement = () => {
    const decrementedQty = itemQuantity - 1;
    setItemQuantity(decrementedQty);
  };

  async function handleAddToCart(e) {
    e.preventDefault();
    setIsDisabled(true);
    const addToCartRequest = {
      quantity: itemQuantity,
      sku: variant?.sku?.toString(),
      variantKey: variant?.key?.toString()
    };

    const addToCartResponse: any = await addProductToCart({}, addToCartRequest);

    if (addToCartResponse) {
      const { addToCart } = addToCartResponse;
      dispatch({
        type: 'UPDATE_LINE_ITEM_COUNT',
        payload: { lineItemCount: addToCart.lineItemCount }
      });
      dispatch({
        type: 'BOOT_MINI_CART',
        payload: true
      });
    }
    setIsDisabled(false);
  }

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

  return (
    <>
      <div className={ProductTileStyles.wishListActionButton}>
        {!availableProducts?.isDisable && (
          <div className={ProductTileStyles.buttonGroup}>
            <button className={ProductTileStyles.decrement} onClick={handleDecrement}>
              {' '}
              -{' '}
            </button>
            <input
              className={ProductTileStyles.itemQuantity}
              value={itemQuantity}
              onChange={handleLineItemInputChange}
            ></input>
            <button className={ProductTileStyles.increment} onClick={handleIncrement}>
              {' '}
              +{' '}
            </button>
          </div>
        )}
        {availableProducts?.title &&
        (availableProducts?.title === 'Notify Me' ||
          availableProducts?.title === 'In store only') ? (
          <ActionButton ctaName={titleCase(availableProducts?.title)} pdpUrl={pdpUrl} />
        ) : (
          <HlButton
            buttonTitle={availableProducts?.title}
            callbackMethod={handleAddToCart}
            isDisabled={isDisabled || availableProducts?.isDisable}
          />
        )}
      </div>
    </>
  );
}
