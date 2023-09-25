import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Modal } from './modal';
import { useDispatch, useSelector } from '@Redux/store';
import {
  addItemToShoppingList,
  createShoppingList,
  deleteItemToShoppingList,
  getShoppingListsWithItems
} from '@Lib/cms/shoppingList';
import { imageUrlQuery, titleCase } from '@Lib/common/utility';
import { Attributes, PdpPageData, Variant } from '@Types/cms/schema/pdp/pdpData.schema';
import { ListResponse, ListsResponse } from '@Types/cms/shoppingList';
import { GlobalState } from '@Types/globalState';
import styles from '@Styles/components/common/productFavoriteComponent.module.scss';
import { Ga4ViewItemEcommerce } from 'src/interfaces/ga4Ecommerce';
import { Ga4EcommerceItem } from 'src/interfaces/ga4EcommerceItem';

type Props = {
  productData?: PdpPageData;
  variant?: Variant;
  imageUrl: string;
  imageSize?: number;
  additionalIconClass?: string;
  pageType?: string;
};

type VariantModalAttributes = {
  [index: string]: string | number | boolean;
};

export default function ProductFavoriteComponent({
  productData,
  variant,
  imageUrl,
  imageSize = 80,
  additionalIconClass = '',
  pageType = ''
}: Props): JSX.Element {
  const [showShoppingListModal, setShowShoppingListModal] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [variantAttributes, setVariantAttributes] = useState<VariantModalAttributes>({});
  const [productVariant, setProductVariant] = useState<Variant>(
    variant ?? productData?.variants.at(0)
  );

  const dispatch = useDispatch();
  const authState = useSelector((state: GlobalState) => state.auth);
  const shoppingListsState = useSelector((state: GlobalState) => state.list);

  useEffect(
    () => setProductVariant(variant ?? productData?.variants.at(0)),
    [variant, productData]
  );

  useEffect(() => {
    setVariantAttributes(() => {
      const newState = {} as VariantModalAttributes;
      productData?.variantPickerKeys?.forEach((key) => {
        const attribute = productVariant.attributes[key as keyof Attributes];
        switch (typeof attribute) {
          case 'object':
            if (attribute instanceof Date) return;
            newState[key] = attribute.label;
            break;
          case 'undefined':
            return;
          default:
            newState[key] = attribute;
            break;
        }
      });
      return newState;
    });
  }, [productData?.variantPickerKeys, productVariant?.attributes]);

  useEffect(() => {
    if (shoppingListsState?.shoppingLists?.length === 0) return;

    const allSkusOnAllLists = shoppingListsState?.shoppingLists?.flatMap((list: ListResponse) =>
      list?.items?.map((item) => item.skuId)
    );

    const skusOfCurrentProduct = productData?.variants?.flatMap((product) => product?.sku);

    const isPresent: boolean = variant
      ? allSkusOnAllLists.includes(variant.sku)
      : skusOfCurrentProduct?.some((sku) => allSkusOnAllLists.includes(sku));

    setIsFavorite(isPresent);
  }, [
    productVariant,
    productVariant?.key,
    productData?.variants,
    shoppingListsState?.shoppingLists,
    variant
  ]);

  async function updateGlobalListState(): Promise<void> {
    const response: ListsResponse = await getShoppingListsWithItems();
    dispatch({
      type: 'UPDATE_SHOPPING_LISTS',
      payload: response?.shoppingList ?? []
    });
  }

  async function handleProductFavorite(): Promise<void> {
    if (isFavorite) {
      // Temporary fix for favorote component on product cards since product cards are not variant specific
      // Delete a products variants from the list that they are on
      if (!variant) {
        productData?.variants?.forEach((variant) => {
          deleteItemFromList(variant.sku);
        });
        return;
      }
      await deleteItemFromList(productVariant?.sku);
      return;
    }
    if (authState?.heartBeatInfo?.isLoggedInUser) {
      setShowShoppingListModal(true);
      return;
    }

    const listId = shoppingListsState?.shoppingLists?.at(0)?.listId;
    await addItemToList(productVariant?.key, productVariant?.sku, listId);
  }

  async function handleListSelection(listId?: number): Promise<void> {
    if (!listId) {
      const newListNames = shoppingListsState?.shoppingLists?.filter((list) =>
        list.listName.includes('New List')
      );
      const createResponse = await createShoppingList(
        newListNames.length === 0 ? 'New List' : `New List (${newListNames.length})`
      );
      listId = createResponse?.listId;
    }

    await addItemToList(productVariant.key, productVariant.sku, listId);
    setShowShoppingListModal(false);
  }

  async function deleteItemFromList(sku: string): Promise<void> {
    const favoriteItemId = findFavoriteItemId(sku);
    const listId = findListId(sku);
    const deleteResponse = await deleteItemToShoppingList(favoriteItemId.toString(), listId);
    if (deleteResponse?.status) {
      setIsFavorite(false);
      updateGlobalListState();
    }
  }

  async function addItemToList(key: string, sku: string, listId: number): Promise<void> {
    const addResponse = await addItemToShoppingList(key, sku, listId?.toString());
    if (addResponse?.listId) {
      setIsFavorite(true);
      updateGlobalListState();
      if (window) {
        const gtmData: Ga4ViewItemEcommerce = {
          anonymous_user_id: '',
          currency: 'USD',
          ecommerce: {
            items: []
          },
          event: 'add_to_wishlist',
          value: 0,
          user_id: ''
        };

        const {
          heartBeatInfo: { isLoggedInUser, sessionId }
        } = authState;

        if (sessionId) {
          isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
        }

        let item: Ga4EcommerceItem = {
          affiliation: '',
          coupon: '',
          currency: 'USD',
          discount: 0,
          index: '',
          item_brand: '',
          item_category: '',
          item_category2: '',
          item_category3: '',
          item_category4: '',
          item_category5: '',
          item_id: sku,
          item_list_id: listId ? listId.toString() : '',
          item_list_name: pageType,
          item_name: productData.name,
          item_variant: key,
          price: 0,
          quantity: 1
        };

        if (productVariant) {
          if (productVariant.price) {
            item.discount = productVariant.price.discountedPrice?.discountedPrice
              ? productVariant.price.variantPrice -
                productVariant.price.discountedPrice.discountedPrice
              : 0;
            item.price =
              productVariant.price.discountedPrice?.discountedPrice ||
              productVariant.price.variantPrice;
            gtmData.value =
              productVariant.price.discountedPrice?.discountedPrice ||
              productVariant.price.variantPrice;
          }
          item.item_brand = productVariant.attributes.brand?.label ?? '';
        }

        gtmData.ecommerce.items.push(item);

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
        window.dataLayer.push(gtmData);
      }
    }
  }

  function findFavoriteItemId(sku: string): string {
    let favoriteItemId = 0;
    shoppingListsState?.shoppingLists?.forEach((list) => {
      list.items?.forEach((item) => {
        if (sku === item.skuId.toString()) {
          favoriteItemId = item.id;
        }
      });
    });
    return favoriteItemId.toString();
  }

  function findListId(sku: string): string {
    let listId = 0;
    shoppingListsState?.shoppingLists?.forEach((list) => {
      list.items?.forEach((item) => {
        if (sku === item.skuId.toString()) {
          listId = list.listId;
        }
      });
    });
    return listId.toString();
  }

  return (
    <>
      {showShoppingListModal && (
        <Modal closeModalHandler={setShowShoppingListModal}>
          <div className={styles.modalBody}>
            <div className={styles.modalBodyMiddle}>
              <img src={imageUrlQuery(imageUrl, imageSize)} alt="Product Image" />
              <div className={styles.modalBodyMiddleProduct}>
                <div className={styles.modalBodyMiddleProductName}>{productData?.name}</div>
                <div className={styles.modalBodyMiddleProductAttributes}>
                  {Object.entries(variantAttributes).map((attribute, index) => {
                    const [key, value] = attribute;
                    return (
                      <div key={index}>
                        <b>{titleCase(key)}:</b> {value}
                      </div>
                    );
                  })}
                  <div>
                    <b>SKU:</b> {productVariant?.sku}
                  </div>
                </div>
                {/* Price is not being passed from the product tile on the mini cart */}
                {productVariant?.price && (
                  <div className={styles.modalBodyMiddleProductPrice}>
                    {Boolean(productVariant.price.discountedPrice?.discountedPrice) && (
                      <div className={styles.modalBodyMiddleProductPriceSale}>
                        ${productVariant.price.discountedPrice.discountedPrice}
                      </div>
                    )}
                    <div
                      className={
                        Boolean(productVariant.price.discountedPrice?.discountedPrice)
                          ? styles.modalBodyMiddleProductPriceRegular
                          : undefined
                      }
                    >
                      ${productVariant.price.variantPrice}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.modalBodyBottom}>
              <div>Add product to a list</div>
              {shoppingListsState?.shoppingLists?.map((list, index) => (
                <button key={index} onClick={() => handleListSelection(list.listId)}>
                  {list.listName}
                </button>
              ))}
              <button onClick={() => handleListSelection()}>
                <AddIcon /> Create new list
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isFavorite ? (
        <Favorite
          style={{ color: styles.hlOrangeDark }}
          onClick={handleProductFavorite}
          className={additionalIconClass}
        />
      ) : (
        <FavoriteBorder onClick={handleProductFavorite} className={additionalIconClass} />
      )}
    </>
  );
}
