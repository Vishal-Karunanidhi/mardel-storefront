import { SyntheticEvent, useState, useEffect } from 'react';
import {
  BrokenImage,
  DeleteOutline,
  EditOutlined,
  Favorite,
  MoreHoriz,
  PrintOutlined,
  ShareOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from '@Redux/store';
import { printBodyItems, productStatus, titleCase, variantStatusLabel } from '@Lib/common/utility';
import styles from '@Styles/account/list.module.scss';
import {
  deleteItemToShoppingList,
  deleteShoppingList,
  getShoppingList,
  getShoppingListsWithItems,
  reNameShoppingList
} from '@Lib/cms/shoppingList';
import { getFeaturedItems } from '@Lib/cms/checkoutPage';
import { accountListBreadCrumbs } from '@Constants/accountConstants';
import FeaturedItems from '@Components/homepage/featuredItems';
import ShareListModal from '@Components/lists/shareListModal';
import DeleteListModal from '@Components/lists/deleteListModal';
import MoveItemModal from './moveItemModal';
import { Item } from '@Types/cms/shoppingList';
import { Variant } from '@Types/cms/schema/pdp/pdpData.schema';
import ProductAvailable from '@Components/productDetailPage/productAvailable/productAvailable';
import AccountBenefit from './accountBenefit';

type Props = {
  itemCount: any;
  items: Item[];
  listName: any;
  listId: number;
  isShared: boolean;
  sortOrder: any;
};

type CheckedRecord = { itemId: number; variantSku: number; variantKey: number };

type VariantModalAttributes = {
  [index: string]: string | number | boolean;
};

/* need to refactor this ListProduct component on later */
const ListProduct = ({
  item,
  checked,
  setCheckedRecords,
  setIsCheckAll,
  items,
  setIsTileMoveItem,
  setIsMoveItem
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  const productDetails = {
    itemId: item?.id,
    variantSku: item?.skuId,
    variantKey: item?.productKey
  };

  const productVariant = item?.product?.variantPicker;
  const variantPicker: VariantModalAttributes = productVariant
    ? JSON.parse(productVariant)?.at(0)
    : [];

  const handleCheckboxProduct = (checked: boolean, payload: CheckedRecord) => {
    setCheckedRecords((prevState) => {
      if (!checked) {
        setIsCheckAll(false);
        return prevState?.filter((itemPayload) => itemPayload?.variantKey !== payload?.variantKey);
      }

      const newState = [...prevState, payload];
      const checkedSkus = newState?.map((record) => record?.variantSku);

      if (items.every((item) => checkedSkus?.includes(item?.skuId))) {
        setIsCheckAll(true);
      } else {
        setIsCheckAll(false);
      }

      return newState;
    });
  };

  const payload: CheckedRecord = {
    itemId: item?.id,
    variantSku: item?.skuId,
    variantKey: item?.productKey
  };

  const variant = item.product as Variant;
  const status = productStatus(variant, null, true);
  const { availability, color } = variantStatusLabel(status);

  return (
    <label className={styles.product}>
      <input
        checked={checked}
        className={styles.productCheckbox}
        id={item?.skuId?.toString()}
        name={item?.skuId?.toString()}
        onChange={(e: SyntheticEvent<HTMLInputElement>) => {
          handleCheckboxProduct(e?.currentTarget?.checked, payload);
        }}
        type="checkbox"
      />
      {item?.product?.imageSet && (
        <img
          alt={`${item?.product?.name} thumbnail`}
          aria-hidden="true"
          className={styles.productImage}
          height="100"
          src={item?.product?.imageSet}
          width="100"
        ></img>
      )}
      {!item?.product?.imageSet && (
        <BrokenImage aria-hidden="true" className={styles.productImageFail}></BrokenImage>
      )}
      <section className={styles.productDetailsContainer}>
        {item?.product?.name && (
          <h3 className={styles.productName}>
            <a href={item?.product?.url}>{item?.product?.name}</a>
          </h3>
        )}
        {!item?.product?.name && <h3 className={styles.productName}>This product has no name</h3>}
        <dl className={styles.productSpecs}>
          {variantPicker &&
            Object.entries(variantPicker).map((attribute, index) => {
              const [key, value] = attribute;
              if (key === 'variantKey') return;
              return (
                <>
                  <dt key={index}>{titleCase(key)}:</dt>
                  <dd>{typeof value === 'string' ? titleCase(value) : value}</dd>
                </>
              );
            })}
        </dl>
        <dl className={styles.productSpecs}>
          <dt>SKU:</dt>
          <dd>{item?.skuId}</dd>
        </dl>
        <p className={styles.productStockContainer}>
          <span className={styles.productOOS} style={{ color }}>
            {availability}
          </span>
        </p>
        <p className={styles.productPriceContainer}>
          {item?.product?.price?.discountedPrice?.discountedPrice && (
            <span aria-label="Sale Price" className={styles.productSalePrice}>
              {item?.product?.price && '$'}
              {item?.product?.price?.discountedPrice?.discountedPrice}
            </span>
          )}
          <span aria-label="Regular Price" className={styles.productRegularPrice}>
            {item?.product?.price && '$'}
            {item?.product?.price?.variantPrice}
          </span>
        </p>
      </section>
      <section className={styles.productToolsTop}>
        <a
          onClick={() => {
            setIsTileMoveItem([productDetails]);
            setIsMoveItem(true);
          }}
          className={styles.move}
        >
          Move Item
        </a>
        <Favorite className={styles.favorite}></Favorite>
      </section>
      <section className={styles.productToolsBottom}>
        {status === 'AddToCart' && (
          <div className={styles.quantity}>
            <button
              onClick={() =>
                setQuantity((prevQuantity) => {
                  let newQuantity = prevQuantity;
                  if (prevQuantity > 0) {
                    newQuantity = prevQuantity - 1;
                  }
                  return newQuantity;
                })
              }
              className={styles.quantitySubtract}
            >
              &minus;
            </button>
            <input
              className={styles.productQuantity}
              value={quantity}
              onChange={(e: SyntheticEvent<HTMLInputElement>) =>
                setQuantity(Number.parseInt(e.currentTarget.value))
              }
              id={item?.skuId.toString()}
              pattern="[0-9]*"
              type="number"
            />
            <button onClick={() => setQuantity(quantity + 1)} className={styles.quantityAdd}>
              +
            </button>
          </div>
        )}
        <ProductAvailable variant={variant} quantity={quantity} productName={item?.product?.name} />
        <div className={styles.addToCart}></div>
      </section>
    </label>
  );
};

export default function List(props: Props) {
  const { itemCount, items, listName, listId, isShared = false, sortOrder } = props;
  const [checkedRecords, setCheckedRecords] = useState<CheckedRecord[]>([]);
  const [isMoveItem, setIsMoveItem] = useState<boolean>(false);
  const [isTileMoveItem, setIsTileMoveItem] = useState<CheckedRecord[]>([]);
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  const [featuredItems, setFeaturedItems] = useState([]);
  const { myProfileInfo, heartBeatInfo } = useSelector((state) => state.auth);
  const { shoppingLists } = useSelector((state) => state.list);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getFeaturedItemsList() {
      const featuredItemsList = await getFeaturedItems();

      setFeaturedItems(featuredItemsList);
    }
    getFeaturedItemsList();
  }, []);

  // Return to List button
  const BackButton = () => {
    const handleReturnToMyList = async () => {
      const response = await getShoppingListsWithItems();
      dispatch({
        type: 'UPDATE_SHOPPING_LISTS',
        payload:
          sortOrder === 'Most Recent'
            ? response?.shoppingList
            : response?.shoppingList.reverse() ?? []
      });

      dispatch({
        type: 'UPDATE_CURRENT_LIST',
        payload: {}
      });

      dispatch({
        type: 'UPDATE_INDIVIDUAL_LIST_BREADCRUMBS',
        payload: {
          seeAllClicked: false,
          listName: '',
          updateIndividualListBreadCrumb: accountListBreadCrumbs
        }
      });
    };

    return (
      <section className={styles.backButton}>
        <button onClick={() => handleReturnToMyList()}>Return to My Lists</button>
      </section>
    );
  };
  // List name and tools
  const Toolbar = () => {
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isEditList, setIsEditList] = useState(false);
    const [newListName, setNewListName] = useState(listName);

    const handleListNameUpdate = async () => {
      const response = await reNameShoppingList(newListName, listId?.toString());
      dispatch({
        type: 'UPDATE_CURRENT_LIST',
        payload: response?.renameList ?? {}
      });
      setIsEditList(false);
    };

    const handleListDelete = async () => {
      const { data } = await deleteShoppingList(listId.toString());
      const isSuccess = data?.deleteList?.message === 'success';
      if (isSuccess) {
        const removeDeletedList = shoppingLists.filter((list) => list.listId !== listId);
        dispatch({
          type: 'UPDATE_SHOPPING_LISTS',
          payload: removeDeletedList ?? []
        });
      }
      dispatch({
        type: 'UPDATE_CURRENT_LIST',
        payload: {}
      });
      setDeleteModalOpen(false);
    };

    return (
      <section className={styles.toolbar}>
        {!isEditList && !isShared && <h2 className={styles.listName}>{listName}</h2>}
        {isEditList && (
          <input
            autoFocus
            className={styles.newListInput}
            onChange={(e) => setNewListName(e.target.value)}
            onBlur={handleListNameUpdate}
            value={newListName}
            type="text"
          />
        )}
        <DeleteListModal
          open={deleteModalOpen}
          handleOpen={() => setDeleteModalOpen(true)}
          handleClose={() => setDeleteModalOpen(false)}
          handleDelete={handleListDelete}
          title="Are you sure you want to delete the selected list?"
          description="Once you delete you list, you will not be able to bring it back."
          deleteButtonTitle="Delete list"
        />
        <ShareListModal
          open={shareModalOpen}
          handleOpen={() => setShareModalOpen(true)}
          handleClose={() => setShareModalOpen(false)}
          listId={listId}
          origin={origin}
          myProfileInfo={myProfileInfo}
        />
        <ul className={styles.toolbox}>
          <li className={styles.toggleToolMenu}>
            <MoreHoriz className={styles.more} tabIndex={0}></MoreHoriz>
            <ul className={styles.toolMenu}>
              {heartBeatInfo.isLoggedInUser === true && (
                <li className={styles.edit} onClick={() => setIsEditList(true)} tabIndex={0}>
                  <EditOutlined />
                  <span>Edit Name</span>
                </li>
              )}
              <li className={styles.print} onClick={printBodyItems} tabIndex={0}>
                <PrintOutlined />
                <span>Print List</span>
              </li>
              {heartBeatInfo.isLoggedInUser && (
                <li className={styles.share} onClick={() => setShareModalOpen(true)} tabIndex={0}>
                  <ShareOutlined />
                  <span>Share List</span>
                </li>
              )}
              {heartBeatInfo.isLoggedInUser === true && (
                <li className={styles.delete} onClick={() => setDeleteModalOpen(true)} tabIndex={0}>
                  <DeleteOutline />
                  <span>Delete List</span>
                </li>
              )}
            </ul>
          </li>
        </ul>
      </section>
    );
  };
  // Select All Checkbox
  const SelectAllCheckbox = () => {
    const handleSelectAll = () => {
      setIsCheckAll(!isCheckAll);
      setCheckedRecords(
        items.map((item: Item) => {
          return { itemId: item?.id, variantSku: item?.skuId, variantKey: item?.productKey };
        })
      );
      if (isCheckAll) {
        setCheckedRecords([]);
      }
    };

    return (
      <label className={styles.selectAll} htmlFor="selectAll">
        <input
          aria-controls="allItems"
          aria-label="All Items"
          checked={isCheckAll}
          id="selectAll"
          name="selectAll"
          onChange={() => handleSelectAll()}
          tabIndex={0}
          type="checkbox"
        />
        Items ({itemCount})
      </label>
    );
  };
  // Move and Delete Items
  const MoveAndDelete = () => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleDeleteItemFromList = async () => {
      await Promise.all(
        checkedRecords?.map(async (record) => {
          await deleteItemToShoppingList(record?.itemId.toString(), listId?.toString());
        })
      );
      const shoppingList = await getShoppingList(listId?.toString());
      dispatch({
        type: 'UPDATE_CURRENT_LIST',
        payload: shoppingList ?? {}
      });
      setDeleteModalOpen(false);
    };

    return (
      <>
        <div
          className={
            checkedRecords.length > 0 ? styles.showMoveAndDelete : styles.hideMoveAndDelete
          }
        >
          <button
            onClick={() => setIsMoveItem(true)}
            className={`${styles.moveItems} ${styles.buttonSmall}`}
          >
            Move Item{checkedRecords?.length > 1 && 's'}
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className={`${styles.deleteItems} ${styles.buttonSmall}`}
          >
            Delete Item{checkedRecords?.length > 1 && 's'}
          </button>
        </div>
        {isMoveItem && (
          <MoveItemModal
            setIsMoveItem={setIsMoveItem}
            currentListId={listId}
            recordToMove={isTileMoveItem?.length ? isTileMoveItem : checkedRecords}
          />
        )}
        <DeleteListModal
          open={deleteModalOpen}
          handleOpen={() => setDeleteModalOpen(true)}
          handleClose={() => setDeleteModalOpen(false)}
          handleDelete={handleDeleteItemFromList}
          title="Are you sure you want to delete the selected items?"
          description="Once you delete these items, you will not be able to bring them back."
          deleteButtonTitle="Delete items"
        />
      </>
    );
  };
  // Guest Benefits panel
  const guestBenefits = (
    <aside className={styles.guestPanel}>
      <h3 className={styles.guestTitle}>Enjoy these account benefits</h3>
      <AccountBenefit />
      <hr />
      <p>Sign in or register an account to save and manage your lists.</p>
      <a href="/login">
        <button className={styles.guestButton}>Create an account</button>
      </a>
      <p>
        Already registered?{' '}
        <a className={styles.guestLogin} href="/login">
          Log in
        </a>
      </p>
    </aside>
  );

  return (
    <div className={styles.listWrapper}>
      <div
        className={
          heartBeatInfo?.isLoggedInUser === false
            ? styles.container + ' ' + styles.guest
            : styles.container
        }
      >
        <BackButton />
        <Toolbar />
        <section className={styles.listContainer}>
          <div className={styles.selection}>
            <SelectAllCheckbox />
            <MoveAndDelete />
          </div>
          {items?.map((item: Item) => (
            <ListProduct
              key={item?.id}
              item={item}
              checked={checkedRecords?.some((record) => record?.variantSku === item?.skuId)}
              setCheckedRecords={setCheckedRecords}
              setIsCheckAll={setIsCheckAll}
              items={items}
              setIsTileMoveItem={setIsTileMoveItem}
              setIsMoveItem={setIsMoveItem}
            />
          ))}
        </section>
        {!heartBeatInfo?.isLoggedInUser && guestBenefits}
      </div>
      {!heartBeatInfo?.isLoggedInUser && (
        <span className={styles.featuredItems}>
          <FeaturedItems label="Featured items" products={featuredItems} />
        </span>
      )}
    </div>
  );
}
