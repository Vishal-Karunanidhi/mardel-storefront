import IconButton from '@mui/material/IconButton';
import ProductFavoriteComponent from '@Components/common/productFavoriteComponent';
import ProductTileStyles from '@Styles/cartpage/productTileMain.module.scss';

export default function ProductTileFavComponent(props: any): JSX.Element {
  const { promoBadge, favouriteCompData } = props;

  return (
    <div className={ProductTileStyles.favButtonDiv}>
      <IconButton
        disableRipple
        className={
          promoBadge ? ProductTileStyles.favoriteBadgeButton : ProductTileStyles.favouriteButton
        }
      >
        <ProductFavoriteComponent {...favouriteCompData} />
      </IconButton>
    </div>
  );
}
