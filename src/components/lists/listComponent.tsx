import { useState, useEffect } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import DeleteListModal from './deleteListModal';
import { deleteShoppingList, shareShoppingList, getShoppingListUrl } from '@Lib/cms/shoppingList';
import styles from '@Styles/account/lists.module.scss';
import { useDispatch, useSelector } from '@Redux/store';
import ShareListModal from './shareListModal';

export default function ListComponent({ onClick, listData, index, setPrint, shoppingLists }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [truncatedItems, setTruncatedItems] = useState<any[]>([]);
  const [numberOfHiddenItems, setNumberOfHiddenItems] = useState(0);
  const [origin, setOrigin] = useState('');

  const { sessionState, isLoggedInUser } = useSelector(
    (state: { auth: any }) => state.auth.heartBeatInfo
  );
  const { myProfileInfo } = useSelector((state) => state.auth);

  const deleteList = async (listData) => {
    setOpenDeleteModal(false);
    const { data } = await deleteShoppingList(listData.listId.toString());

    const isSuccess = data?.deleteList?.message === 'success';
    if (isSuccess) {
      const removeDeletedList = shoppingLists.filter((list) => list.listId !== listData.listId);
      dispatch({
        type: 'UPDATE_SHOPPING_LISTS',
        payload: removeDeletedList ?? []
      });
    }

    dispatch({
      type: 'UPDATE_SNACKBAR_WITH_DATA',
      payload: {
        open: true,
        message: `${isSuccess ? 'List deleted successfully' : 'List failed to be deleted'}`,
        severity: isSuccess ? 'success' : 'error'
      }
    });
  };

  const handlePopoverClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => setAnchorEl(null);

  const handleModalOpen = async (type) => {
    if (type === 'delete') {
      setOpenDeleteModal(true);
    } else if (type === 'share') {
      setOpenShareModal(true);
    }
    handlePopoverClose();
  };

  const handleModalClose = (type) => {
    if (type === 'delete') {
      setOpenDeleteModal(false);
    } else if (type === 'share') {
      setOpenShareModal(false);
    }
  };

  const handlePrint = () => {
    onClick();
    handlePopoverClose();
    setPrint(true);
  };

  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? 'simple-popover' : undefined;

  useEffect(() => {
    if (listData?.items) {
      setTruncatedItems(listData?.items.slice(0, 3));
    }
  }, [listData]);

  useEffect(() => {
    if (listData?.items?.length > truncatedItems.length) {
      setNumberOfHiddenItems(listData?.items.length - truncatedItems.length);
    } else {
      setNumberOfHiddenItems(0);
    }
  }, [listData?.items?.length, truncatedItems]);

  useEffect(() => {
    if (window) {
      setOrigin(window?.location?.origin);
    }
  }, [window]);

  const ProductImages = () => {
    return (
      <>
        {truncatedItems.map((item, index) => {
          return (
            <div key={index} className={styles.productImageContainer}>
              <img
                alt={item?.product?.name}
                aria-hidden="true"
                className={styles.productImage}
                src={item?.product?.imageSet}
              />
            </div>
          );
        })}

        <div className={styles.seeAllContainer}>
          <div className={styles.productImageContainerSeeAll}>
            {numberOfHiddenItems >= 0 && (
              <div className={styles.productImageContainerSeeAllNumber}>
                +{numberOfHiddenItems} more
              </div>
            )}
            <div onClick={onClick} className={styles.productImageContainerSeeAllText}>
              (see all)
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={styles.listComponentContainer}>
      <DeleteListModal
        open={openDeleteModal}
        handleOpen={() => handleModalOpen('delete')}
        handleClose={() => handleModalClose('delete')}
        title="Are you sure you want to delete the selected list?"
        description="Once you delete you list, you will not be able to bring it back."
        deleteButtonTitle="Delete list"
        handleDelete={() => deleteList(listData)}
      />
      <ShareListModal
        open={openShareModal}
        handleOpen={() => handleModalOpen('share')}
        handleClose={() => handleModalClose('share')}
        origin={origin}
        listData={listData}
        listId={listData?.listId}
        myProfileInfo={myProfileInfo}
      />
      <h3 className={styles.listComponentHeader}>
        <span className={styles.listComponentHeaderContainer}>
          {listData?.listName}{' '}
          <span className={styles.listComponentHeaderItems}>
            ({listData?.items ? listData?.items?.length : 0}{' '}
            {listData?.items?.length === 1 ? 'item' : 'items'})
          </span>
        </span>
        <IconButton
          style={{ position: 'absolute', right: 0 }}
          size={'small'}
          onClick={handlePopoverClick}
        >
          <MoreHorizIcon className={styles.listComponentHeaderIcon} />
        </IconButton>
        <Popover
          id={popoverId}
          open={popoverOpen}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{
            className: styles.listComponentHeaderIconPopover
          }}
        >
          {isLoggedInUser && (
            <div
              className={styles.listComponentHeaderIconPopoverShare}
              onClick={() => handleModalOpen('share')}
            >
              <ShareOutlinedIcon />
              <span>Share</span>
            </div>
          )}
          <div className={styles.listComponentHeaderIconPopoverPrint} onClick={handlePrint}>
            <LocalPrintshopOutlinedIcon />
            <span>Print</span>
          </div>
          {sessionState !== 'GUEST' && (
            <div
              className={styles.listComponentHeaderIconPopoverPrint}
              onClick={() => handleModalOpen('delete')}
            >
              <DeleteOutlinedIcon />
              <span>Delete</span>
            </div>
          )}
        </Popover>
      </h3>

      <div className={styles.listComponent} key={index}>
        {listData?.items ? (
          <ProductImages />
        ) : (
          <span className={styles.listComponentEmptyMessage}>
            Oops! Your list is empty. Explore and add new products!
          </span>
        )}
      </div>
    </div>
  );
}
