import FavoriteIcon from '@Icons/productCard/favoriteIcon';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Rating from '@mui/material/Rating';
import ImageWithFallback from '@Components/common/imageWithFallback';

import colors from '@Lib/common/colors';
import styles from '@Styles/components/slider/cards/mobileProductCard.module.scss';

function MobileProductCard({
  DiscountPriceRange,
  Availability,
  Promo,
  ButtonLabel,
  PriceRange,
  isFavorited,
  setIsFavorited,
  productName,
  isMobile,
  discountedPrice,
  daysSinceOnline,
  availability,
  imageSet,
  pdpUrl,
  buttonDisabled
}) {
  return (
    <div className={styles.card}>
      <section
        className={styles.top}
        style={{
          backgroundColor: discountedPrice
            ? colors.hlRed
            : daysSinceOnline < 60
            ? colors.hlBlue
            : colors.hlWhite
        }}
      >
        <Promo />
      </section>
      <section className={styles.middle}>
        <div className={styles.flexWrapper}>
          <div className={styles.imageContainer}>
            <a href={pdpUrl}>
              <ImageWithFallback src={imageSet} className={styles.image} />
            </a>
          </div>
          <div className={styles.body}>
            <FavoriteIcon
              style={styles.favoriteIcon}
              toggled={isFavorited}
              onClick={() => setIsFavorited((prev) => !prev)}
            />
            <div className={styles.availability}>
              <Availability />
            </div>
            <div className={styles.nameRatingWrapper}>
              <div className={styles.name}>
                <a href={pdpUrl}>{productName}</a>
              </div>
              <div className={styles.ratingReviews}>
                <Rating
                  readOnly
                  style={{ color: colors.hlRed }}
                  size={isMobile ? 'small' : 'medium'}
                  emptyIcon={<StarBorderIcon fontSize="inherit" style={{ color: colors.hlRed }} />}
                />
                <div className={styles.totalReviews}>
                  <a href="#">
                    (<span style={{ textDecoration: 'underline' }}>0</span>)
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.productPrice}>
              <div className={styles.discountPrice}>
                <DiscountPriceRange />
              </div>
              <div
                className={!discountedPrice ? styles.discountPrice : styles.regularPrice}
                style={{ textDecoration: discountedPrice && 'line-through' }}
              >
                <PriceRange />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.bottom}>
        <button
          disabled={availability === 'OOS_ONLINE' ? true : false}
          className={styles.button}
          style={{
            backgroundColor: buttonDisabled && colors.hlGrayLight,
            cursor: buttonDisabled && 'default'
          }}
        >
          <ButtonLabel color={buttonDisabled && colors.hlGray} />
        </button>
      </section>
    </div>
  );
}

export default MobileProductCard;
