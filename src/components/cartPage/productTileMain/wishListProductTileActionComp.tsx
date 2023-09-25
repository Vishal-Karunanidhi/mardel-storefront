import { useState } from 'react';
import { useDispatch } from '@Redux/store';
import IconButton from '@mui/material/IconButton';
import HLAnchorTag from '@Components/common/hlAnchorTag';
import { deleteItemToShoppingList } from '@Lib/cms/shoppingList';
import { Favorite } from '@mui/icons-material';
import MoveItemModal from '@Components/account/moveItemModal';
import ProductTileStyles from '@Styles/cartpage/productTileMain.module.scss';
import { getShoppingList } from '@Lib/cms/shoppingList';

export default function WishListProductTileActionComp(props: any): JSX.Element {
  const { recordToMove, listId, itemId } = props;
  const [isMoveItem, setIsMoveItem] = useState(false);
  const dispatch = useDispatch();
  const handleMoveItem = () => {
    setIsMoveItem(true);
  };

  const handleFavUncheck = async () => {
    await deleteItemToShoppingList(itemId?.toString(), listId?.toString());
    const shoppingList = await getShoppingList(listId);
    dispatch({
      type: 'UPDATE_CURRENT_LIST',
      payload: shoppingList ?? {}
    });
  };
  return (
    <span className={ProductTileStyles.wishListMoveFavContent}>
      <HLAnchorTag callbackMethod={handleMoveItem} label="Move item" anchorTheme="LinkType1" />

      {isMoveItem && (
        <MoveItemModal
          setIsMoveItem={setIsMoveItem}
          currentListId={listId}
          recordToMove={recordToMove}
        />
      )}

      <IconButton disableRipple className={ProductTileStyles.favButton}>
        <Favorite
          onClick={handleFavUncheck}
          className={ProductTileStyles.productImagesHeart}
          style={{ color: ProductTileStyles.hlOrangeDark }}
        />
      </IconButton>
    </span>
  );
}
