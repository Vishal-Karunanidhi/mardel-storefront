import { useSelector, useDispatch } from '@Redux/store';
import AddIcon from '@mui/icons-material/Add';

import {
  addItemToShoppingList,
  createShoppingList,
  deleteItemToShoppingList,
  getShoppingList
} from '@Lib/cms/shoppingList';
import styles from '@Styles/components/common/productFavoriteComponent.module.scss';
import { Modal } from '@Components/common/modal';

export default function MoveItemModal(props: any): JSX.Element {
  const { setIsMoveItem, currentListId, recordToMove } = props;
  const { shoppingLists } = useSelector((state) => state.list);
  const dispatch = useDispatch();
  const moveItemList = shoppingLists.filter((item) => item.listId !== currentListId);

  async function handleListSelection(listIdToMove: number) {
    await Promise.all(
      recordToMove?.map(async (record) => {
        const { itemId, variantSku, variantKey } = record;
        await deleteItemToShoppingList(itemId, currentListId);
        await addItemToShoppingList(variantKey, variantSku, listIdToMove.toString());
      })
    );

    const shoppingList = await getShoppingList(currentListId?.toString());
    dispatch({
      type: 'UPDATE_CURRENT_LIST',
      payload: shoppingList ?? {}
    });
    setIsMoveItem(false);
  }

  async function handleCreateNewList(): Promise<void> {
    const newListNames = shoppingLists.filter((list) => list.listName.includes('New List'));
    const createResponse = await createShoppingList(
      newListNames.length === 0 ? 'New List' : `New List (${newListNames.length})`
    );
    const LID = createResponse?.listId;

    await handleListSelection(LID);
  }

  return (
    <>
      <Modal closeModalHandler={setIsMoveItem}>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyBottom}>
            <div>Move items to a different list</div>
            <div>Select the list you want to move the items to.</div>
            {moveItemList?.map((list, index) => (
              <button key={index} onClick={() => handleListSelection(list?.listId)}>
                {list?.listName}
              </button>
            ))}
            <button onClick={handleCreateNewList}>
              <AddIcon /> Create new list
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
