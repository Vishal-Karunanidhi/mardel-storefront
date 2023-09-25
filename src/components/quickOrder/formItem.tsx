import { useState } from 'react';
import HLTextField from '@Components/common/hlTextField';
import { getVariantInventoryDetails } from '@Lib/cms/productDetailsPage';
import { getProductPageContentAndDatabySKU } from '@Lib/cms/productDetailsPage';
import { formatQuantity } from '@Lib/common/utility';
import { formFields, itemInstance, formErrorMessage } from '@Constants/quickOrder';
import quickOrderStyles from '@Styles/quickOrder/quickOrder.module.scss';
import { productType } from '@Constants/generalConstants';

export default function FormItem(props: any): JSX.Element {
  const { setOrderItems, orderItems, item, lineId, maxStock, setMaxStock, setEnableAddtoCart } =
    props;

  const [errorMessage, setErrorMessage] = useState(null);

  const handleEmptyForm = () => {
    let isenable = orderItems.find((item) => {
      if (!!item.quantity) return true;
    });
    return isenable;
  };

  const handleSKUChange = async (e, i) => {
    const sku = e.target.value;
    const item = orderItems;
    let isDuplicate = item.find((lineItem, j) => {
      if (lineItem.sku === sku && i != j) return true;
    });
    if (isDuplicate && sku) {
      setErrorMessage(formErrorMessage.duplicateSku);
      item[i] = { ...item[i], error: true };
      setOrderItems([...item]);
      return;
    }

    if (!sku) {
      item[i] = { ...item[i], pdpPageData: null, quantity: '', disable: true, error: false };
      setOrderItems([...item]);
      if (!handleEmptyForm()) setEnableAddtoCart(false);
      return;
    }

    const productDetailPageData = await getProductPageContentAndDatabySKU({
      sku,
      isActiveVariants: false,
      isStaged: false
    });

    if (productDetailPageData?.pdpPageData?.productType === productType.GIFT_CARD) {
      setErrorMessage(formErrorMessage.giftCardError);
      item[i] = { ...item[i], error: true };
      setOrderItems([...item]);
      return;
    }

    if (productDetailPageData) {
      setErrorMessage(null);
      let disable: any;

      const {
        getInventoryDetails: { inventoryItems, productsNotFound }
      } = await getVariantInventoryDetails([productDetailPageData.pdpPageData.variants[0].key]);
      const key = productDetailPageData.pdpPageData.variants[0].attributes?.availability?.key;
      if (!!productsNotFound.length || inventoryItems?.[0]?.totalCount === 0) {
        setMaxStock({ ...maxStock, [sku]: { maxCount: 0, isMaximumStockAdded: false } });
        disable = true;
      } else {
        setMaxStock({
          ...maxStock,
          [sku]: {
            maxCount: inventoryItems[0]?.totalCount,
            isMaximumStockAdded: false,
            availability: key
          }
        });
        disable = key === 'in_store_only' ? true : false;
      }
      item[i] = {
        ...item[i],
        pdpPageData: productDetailPageData?.pdpPageData,
        sku: productDetailPageData?.pdpPageData?.variants[0]?.sku,
        variantKey: productDetailPageData?.pdpPageData?.variants[0]?.key,
        disable,
        error: false,
        quantity: ''
      };
    } else {
      item[i] = { ...item[i], pdpPageData: null, quantity: '', disable: true, error: true };
      setErrorMessage(formErrorMessage.skuNotFound);
      if (!handleEmptyForm()) setEnableAddtoCart(false);
    }
    setOrderItems([...item]);
  };

  const handleQuantityChange = async (e, i) => {
    const { name, value } = e.target;
    const { sku } = orderItems[i];
    if (value) {
      setEnableAddtoCart(true);
    } else {
      if (!handleEmptyForm()) setEnableAddtoCart(false);
    }
    if (value >= maxStock[sku].maxCount) {
      const items = [...orderItems];
      const stock = { ...maxStock };
      items[i][name] = maxStock[sku].maxCount;
      stock[sku].isMaximumStockAdded = true;
      setMaxStock({ ...stock });
      setOrderItems([...items]);
    } else {
      const stock = { ...maxStock };
      stock[sku].isMaximumStockAdded = false;
      setMaxStock({ ...stock });
    }
  };

  const handleChange = (e, i) => {
    const items = [...orderItems];
    const { name, value } = e.target;
    items[i][name] = value;
    items[i].error = false;
    if (name === 'quantity' && !formatQuantity(value)) return;
    if (name === 'quantity' && i >= orderItems.length - 1) {
      setOrderItems([
        ...items,
        {
          ...itemInstance
        }
      ]);
    } else {
      setOrderItems([...items]);
    }
  };

  return (
    <form className={quickOrderStyles.quickOrderForm}>
      <div className={quickOrderStyles.quickOrderFormBlock}>
        <span className={quickOrderStyles.quickOrderFormSKU}>
          <HLTextField
            onBlur={(e) => handleSKUChange(e, lineId)}
            labelName={formFields.sku.label}
            name={formFields.sku.name}
            key={formFields.sku.key}
            textFieldValue={item?.sku}
            handleInputChange={(e) => handleChange(e, lineId)}
            error={item?.error}
            helperText={item?.error ? errorMessage : null}
          />
        </span>
        <span className={quickOrderStyles.quickOrderFormQuantity}>
          <HLTextField
            name={formFields.quantity.name}
            key={formFields.quantity.key}
            labelName={formFields.quantity.label}
            disabled={item?.disable}
            textFieldValue={item?.quantity}
            handleInputChange={(e) => handleChange(e, lineId)}
            onBlur={(e) => handleQuantityChange(e, lineId)}
          />
        </span>
      </div>
    </form>
  );
}
