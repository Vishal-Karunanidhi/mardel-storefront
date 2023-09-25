import { useState } from 'react';
import { GetServerSidePropsResult } from 'next/types';
import { useDispatch } from '@Redux/store';
import ProductTile from '@Components/quickOrder/productTile';
import HlButton from '@Components/common/button';
import FormItem from '@Components/quickOrder/formItem';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { getFreeShippingMessages, getOrderSummaryData } from '@Lib/cms/cartpage';
import { addMultipleItemsToCart } from '@Lib/cms/orderDetails';
import { contentToBreadcrumb } from '@Lib/common/utility';
import {
  formItem,
  itemInstance,
  quickOrderBreadCrumbs,
  dialogContent
} from '@Constants/quickOrder';
import quickOrderStyles from '@Styles/quickOrder/quickOrder.module.scss';

export default function QuickOrder(props: any): JSX.Element {
  const { orderSummaryDetails } = props;
  const [orderItems, setOrderItems] = useState([...formItem]);
  const [maxStock, setMaxStock] = useState(null);
  const [enableAddtoCart, setEnableAddtoCart] = useState(false);
  const dispatch = useDispatch();

  const removeLineItem = (i) => {
    const items = orderItems;
    items.splice(i, 1);
    if (items.length === 0) {
      items.push({
        ...itemInstance
      });
    }
    setOrderItems([...items]);
  };

  const addMultipleItems = async () => {
    let items = orderItems
      .filter((item) => item.quantity)
      .map((item) => {
        return { sku: item.sku, variantKey: item.variantKey, quantity: parseInt(item.quantity) };
      });
    const multpleItemResponse = await addMultipleItemsToCart(items ?? []);
    if (multpleItemResponse) {
      formItem.forEach((lineItem) => (lineItem.sku = ''));
      setOrderItems([...formItem]);
      setEnableAddtoCart(false);
      dispatch({
        type: 'UPDATE_LINE_ITEM_COUNT',
        payload: { lineItemCount: multpleItemResponse?.addMultipleItemsToCart?.lineItemCount }
      });
      dispatch({
        type: 'BOOT_MINI_CART',
        payload: true
      });
    }
  };
  return (
    <>
      <Breadcrumb breadCrumbs={contentToBreadcrumb(quickOrderBreadCrumbs)} />
      <div className={quickOrderStyles.quickOrderContainer}>
        <div className={quickOrderStyles.quickOrderHeader}>
          <span className={quickOrderStyles.quickOrderHeaderBlock}>
            <span className={quickOrderStyles.quickOrderHeaderSKU}>SKU Number</span>
            <span className={quickOrderStyles.quickOrderHeaderQuantity}>Quantity</span>
          </span>
        </div>
        <span className={quickOrderStyles.quickOrderHeaderProduct}>Product</span>
        <div>
          {orderItems.map((item, index) => {
            return (
              <div className={quickOrderStyles.quickOrderItem}>
                <FormItem
                  item={item}
                  lineId={index}
                  orderItems={orderItems}
                  setOrderItems={setOrderItems}
                  maxStock={maxStock}
                  setMaxStock={setMaxStock}
                  setEnableAddtoCart={setEnableAddtoCart}
                />
                <div className={quickOrderStyles.quickOrderProduct}>
                  {item?.pdpPageData && (
                    <ProductTile
                      removeLineItem={() => removeLineItem(index)}
                      {...item.pdpPageData}
                      cmsData={orderSummaryDetails?.fullCartContent.productTile}
                      variant={item?.pdpPageData?.variants[0]}
                      maxStock={maxStock}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <span className={quickOrderStyles.newField}>{dialogContent.newFieldLine}</span>
        <div className={quickOrderStyles.cartButton}>
          <HlButton
            buttonTitle="Add Items To Cart"
            callbackMethod={addMultipleItems}
            disabled={!enableAddtoCart}
          />
        </div>
      </div>
      <div className={quickOrderStyles.bulkOrder}>{dialogContent.bulkOrder}</div>
    </>
  );
}

export async function getServerSideProps({ req, res }): Promise<GetServerSidePropsResult<any>> {
  const [freeShippingDetails, orderSummaryDetails] = await Promise.all([
    getFreeShippingMessages(),
    getOrderSummaryData()
  ]);
  return {
    props: {
      freeShippingDetails,
      orderSummaryDetails
    }
  };
}
