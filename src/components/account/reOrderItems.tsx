import { useState, useEffect } from 'react';
import { useDispatch } from '@Redux/store';
import { Divider } from '@mui/material';
import ProductTile from '@Components/cartPage/productTile';
import HLCheckbox from '@Components/common/hlCheckBox';
import HlButton from '@Components/common/button';
import { getVariantInventoryDetails } from '@Lib/cms/productDetailsPage';
import { addMultipleItemsToCart, getProductsByKeys } from '@Lib/cms/orderDetails';
import { productType } from '@Constants/generalConstants';
import OrderedItemStyles from '@Styles/orderDetails/orderedItem.module.scss';

const HLDisableCheckbox = () => {
  return (
    <div className={OrderedItemStyles.disableCheckboxWrapper}>
      <span className={OrderedItemStyles.disableCheckbox}>
        <hr className={OrderedItemStyles.divider} />
      </span>
    </div>
  );
};

let reOrderItems = [];
let skuList = [];

export default function ReOrderItems(props: any): JSX.Element {
  const { lineItems } = props;
  const [isReorderDisabled, setIsReorderDisabled] = useState(false);
  lineItems?.forEach((element) => {
    element.variant['imageSet'] = element?.variant?.image?.url;
  });

  const [productNotFoundList, setProductNotFoundList] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isOrderChecked, setIsOrderChecked] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getInventoryDetails() {
      const variantSkus = lineItems?.map((product) => product?.variant?.key?.toString());
      const productKeys = lineItems?.map((product) => product?.productKey.toString());
      const { getInventoryDetails } = await getVariantInventoryDetails(variantSkus);
      const productDetails = await getProductsByKeys(productKeys);

      const inStoreProducts = productDetails
        ?.filter(
          (product) => product?.variants[0]?.attributes?.availability?.label === 'IN_STORE_ONLY'
        )
        .map((product) => product?.variants[0]?.key?.toString());
      setProductNotFoundList([...getInventoryDetails?.productsNotFound, ...inStoreProducts]);
    }
    getInventoryDetails();
  }, []);

  const addMultipleItems = async () => {
    setIsReorderDisabled(true);
    const multpleItemResponse = await addMultipleItemsToCart(reOrderItems ?? []);
    dispatch({
      type: 'UPDATE_LINE_ITEM_COUNT',
      payload: { lineItemCount: multpleItemResponse?.addMultipleItemsToCart?.lineItemCount }
    });
    dispatch({
      type: 'BOOT_MINI_CART',
      payload: true
    });
    setIsReorderDisabled(false);
  };

  const reOrderItemData = (item: any) => {
    const { sku, key, price: amount } = item?.variant;
    return {
      sku: sku,
      variantKey: key,
      quantity: 1,
      ...(item?.productType === productType.GIFT_CARD_ORDER && { amount })
    };
  };

  const handleOrderCheckBoxChange = (event, e) => {
    const { checked } = event?.target;
    setIsOrderChecked(checked);
    const { sku } = e?.variant;
    if (checked) {
      skuList.push(sku);
      reOrderItems.push(reOrderItemData(e));
    } else {
      const unCheckedItem = selectedOrders?.findIndex((data) => data === sku);
      skuList.splice(unCheckedItem, 1);
      const position = reOrderItems?.findIndex((data) => data?.sku === sku);
      reOrderItems.splice(position, 1);
    }
    setSelectedOrders([...skuList]);
  };

  const handleAllItemChecked = (event) => {
    const { checked } = event?.target;
    if (!checked) {
      reOrderItems = [];
      skuList = [];
      setSelectedOrders([]);
      return;
    }
    reOrderItems = lineItems.map((e) => {
      return reOrderItemData(e);
    });
    skuList = lineItems?.map((e) => e?.variant?.sku);

    setSelectedOrders([...skuList]);
    setIsAllChecked(checked);
  };

  return (
    <div className={OrderedItemStyles.orderDetails}>
      <span className={OrderedItemStyles.orderesItemsTitle}>Ordered Items</span>
      <span className={OrderedItemStyles.reOrderButtonMobile}>
        <HlButton buttonTitle="Reorder Selected Items" callbackMethod={addMultipleItems} />
      </span>
      <span className={OrderedItemStyles.itemsWrapper}>
        <HLCheckbox handleCheckBoxChange={(event) => handleAllItemChecked(event)} />{' '}
        {`Items (${lineItems?.length})`}
      </span>

      <div className={OrderedItemStyles.mainWrapper}>
        {lineItems?.map((e, i) => {
          const selectionInfo = selectedOrders?.indexOf(e?.variant?.sku) !== -1;
          return (
            <div
              className={OrderedItemStyles.tileMainWrapper}
              id={`${i}-${e?.variant?.sku}`}
              key={i}
            >
              <div className={OrderedItemStyles.tileCheckboxWrapper}>
                <div className={OrderedItemStyles.tileWrapper}>
                  {productNotFoundList.findIndex(
                    (productCode) => productCode === e?.variant?.key
                  ) !== -1 ? (
                    <HLDisableCheckbox />
                  ) : (
                    <HLCheckbox
                      handleCheckBoxChange={(event) => handleOrderCheckBoxChange(event, e)}
                      isChecked={selectionInfo}
                      id={`${i}-${e?.variant?.sku}`}
                    />
                  )}
                  <ProductTile {...e} key={i} />
                </div>
              </div>

              <Divider className={OrderedItemStyles.orderSectionDivider} />
            </div>
          );
        })}
      </div>
      <span className={OrderedItemStyles.reOrderButtonDesktop}>
        <HlButton
          isDisabled={!selectedOrders.length || isReorderDisabled}
          buttonTitle="Reorder Selected Items"
          callbackMethod={addMultipleItems}
        />
      </span>
    </div>
  );
}
