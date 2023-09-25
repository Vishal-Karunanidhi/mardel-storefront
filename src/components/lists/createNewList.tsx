import { useState } from 'react';
import { useDispatch, useSelector } from '@Redux/store';
import AddIcon from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { createShoppingList } from '@Lib/cms/shoppingList';
import { GlobalState } from '@Types/globalState';
import styles from '@Styles/account/lists.module.scss';

export default function CreateNewList({ getMyAllShoppingLists }) {
  const dispatch = useDispatch();
  const [newListName, setNewListName] = useState('');
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { shoppingLists } = useSelector((state: GlobalState) => state.list);

  const createNewList = async () => {
    const LIST_IDENTIFIER = 'New List';

    let newListNameCount = shoppingLists?.filter(({ listName }) =>
      listName?.includes(LIST_IDENTIFIER)
    )?.length;
    const NEW_LIST_NAME = `New List ${newListNameCount ? '(' + newListNameCount++ + ')' : ''}`;
    const response = await createShoppingList(newListName.length > 0 ? newListName : NEW_LIST_NAME);
    if (response) {
      getMyAllShoppingLists();
    }

    dispatch({
      type: 'UPDATE_SNACKBAR_WITH_DATA',
      payload: {
        open: true,
        message: `${response ? 'Successfully created' : 'Failed to create'} new list`,
        severity: response ? 'success' : 'error'
      }
    });

    setNewListName('');
    setShowNewListForm(false);
  };

  return (
    <>
      <div className={styles.createNewList}>
        {showNewListForm ? (
          <div className={styles.createNewListCta}>
            <Remove className={styles.createNewListCtaIcon} />
            <span
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => {
                setNewListName('');
                setShowNewListForm(false);
              }}
              className={styles.createNewListCtaText}
            >
              Cancel new list
            </span>
          </div>
        ) : (
          <div className={styles.createNewListCta}>
            <AddIcon className={styles.createNewListCtaIcon} />
            <span onClick={() => setShowNewListForm(true)} className={styles.createNewListCtaText}>
              Create new list
            </span>
          </div>
        )}
      </div>
      {showNewListForm && (
        <div className={styles.newListContainer}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createNewList();
            }}
          >
            <input
              autoFocus
              className={styles.newListInput}
              onChange={(e) => e.target.value.length <= 27 && setNewListName(e.target.value)}
              onBlur={!hovered ? createNewList : () => ''}
              value={newListName}
              type="text"
            />
          </form>

          <div className={styles.newList}>
            <span className={styles.newListEmpty}>
              Oops! Your list is empty. Explore and add new products!
            </span>
          </div>
        </div>
      )}
    </>
  );
}
