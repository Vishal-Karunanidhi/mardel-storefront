import { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import List from '@Components/account/list';
import ListComponent from '@Components/lists/listComponent';
import CreateNewList from '@Components/lists/createNewList';
import HLAnchorTag from '@Components/common/hlAnchorTag';
import { CircularProgress } from '@mui/material';
import Select from '@mui/material/Select';

import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { accountListBreadCrumbs, listBreadCrumbs } from '@Constants/accountConstants';
import { contentToBreadcrumb } from '@Lib/common/utility';

import { useDispatch, useSelector } from '@Redux/store';
import { getShoppingListsWithItems } from '@Lib/cms/shoppingList';
import styles from '@Styles/account/lists.module.scss';
import MyAccountStyles from '@Styles/my-account/myAccount.module.scss';

import { individualListBreadCrumbs } from '@Constants/accountConstants';

export default function ShoppingLists() {
  const [print, setPrint] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<string>('Most Recent');
  const [guestBreadcrumbs, setGuestBreadcrumbs] = useState(accountListBreadCrumbs);
  const { isInitialLoading } = useSelector((state) => state.layout.spinnerData);

  const dispatch = useDispatch();
  const { shoppingLists, currentList } = useSelector((state) => state.list);

  const { isLoggedInUser } = useSelector((state: { auth: any }) => state.auth.heartBeatInfo);

  const handleSort = (event) => {
    if (event.target.value !== sortOrder) {
      shoppingLists.reverse();
      setSortOrder(event.target.value);
    }
  };

  const getShoppingListsWithItemDetails = async () => {
    const response = await getShoppingListsWithItems();
    dispatch({
      type: 'UPDATE_SHOPPING_LISTS',
      payload:
        sortOrder === 'Most Recent'
          ? response?.shoppingList
          : response?.shoppingList.reverse() ?? []
    });
    dispatch({
      type: 'LOAD_SPINNER',
      payload: {
        isVisible: false,
        className: '',
        isInitialLoading: false
      }
    });
  };

  useEffect(() => {
    getShoppingListsWithItemDetails();
  }, []);

  useEffect(() => {
    if (currentList) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      if (print) {
        document.querySelector('body').classList.add('print');
        window.print();
        document.querySelector('body').classList.remove('print');
      }
    }
    if (!currentList || print) {
      setPrint(false);
    }
  }, [currentList]);

  if (isInitialLoading) {
    return <div className={MyAccountStyles.divIsInitialLoading} />;
  }

  const handleCurrentList = async (list) => {
    dispatch({
      type: 'UPDATE_CURRENT_LIST',
      payload: list ?? {}
    });

    if (list?.listName) {
      const isListPresent = individualListBreadCrumbs?.links?.some((obj) =>
        shoppingLists.some((list) => list.listName === obj.label)
      );

      if (isListPresent) {
        const updatedLists = individualListBreadCrumbs.links.filter(
          (list) => !shoppingLists.some((item) => item.listName === list.label)
        );

        const currentUpdatedList = {
          links: []
        };
        currentUpdatedList.links = updatedLists;

        currentUpdatedList.links.push({
          label: `${list?.listName}`,
          value: null,
          openInNewTab: false
        });

        dispatch({
          type: 'UPDATE_INDIVIDUAL_LIST_BREADCRUMBS',
          payload: {
            seeAllClicked: true,
            listName: `${list?.listName}`,
            updateIndividualListBreadCrumb: currentUpdatedList
          }
        });
      } else {
        individualListBreadCrumbs.links.push({
          label: `${list?.listName}`,
          value: null,
          openInNewTab: false
        });

        dispatch({
          type: 'UPDATE_INDIVIDUAL_LIST_BREADCRUMBS',
          payload: {
            seeAllClicked: true,
            listName: `${list?.listName}`,
            individualListBC: individualListBreadCrumbs
          }
        });
      }
    } else {
      if (!isLoggedInUser) {
        setGuestBreadcrumbs(listBreadCrumbs);
      }
    }
  };

  return (
    <>
      {!isLoggedInUser && <Breadcrumb breadCrumbs={contentToBreadcrumb(guestBreadcrumbs)} />}
      {Object.keys(currentList).length !== 0 ? (
        <List {...currentList} shoppingLists={shoppingLists} sortOrder={sortOrder} />
      ) : (
        <div className={isLoggedInUser ? styles.lists : styles.guestlists}>
          {!isLoggedInUser && (
            <div className={styles.guestList}>
              <span>
                Do you want to save and create new lists? {''}
                <HLAnchorTag value="/login" label="Sign in" anchorTheme="LinkType2" /> {''}
                or{' '}
                <HLAnchorTag
                  value="/login"
                  label="register an account"
                  anchorTheme="LinkType2"
                />{' '}
                to enjoy the benefits!
              </span>
            </div>
          )}

          <h3 className={styles.header}>
            My Lists
            {isLoggedInUser && (
              <Select className={styles.dropDownSelect} value={sortOrder} onChange={handleSort}>
                <MenuItem value={'Most Recent'}>Most Recent</MenuItem>
                <MenuItem value={'Oldest'}>Oldest</MenuItem>
              </Select>
            )}
          </h3>
          <div className={styles.listsContainer}>
            {isLoggedInUser && (
              <CreateNewList getMyAllShoppingLists={getShoppingListsWithItemDetails} />
            )}

            {Array.isArray(shoppingLists) ? (
              shoppingLists.map((list, index) => (
                <ListComponent
                  onClick={() => handleCurrentList(list)}
                  key={index}
                  index={index}
                  listData={list}
                  setPrint={setPrint}
                  shoppingLists={shoppingLists}
                />
              ))
            ) : (
              <div className={styles.spinnerContainer}>
                <CircularProgress className={styles.spinner} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
