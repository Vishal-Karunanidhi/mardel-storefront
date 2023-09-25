import Rating from '@mui/material/Rating';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import styles from '@Styles/components/common/productRatingSection.module.scss';

type Props = {
  averageRating: number;
  reviewCount: number;
  isGiftCardDetailPage?: boolean;
};

export default function RatingRatingSection({
  averageRating,
  reviewCount,
  isGiftCardDetailPage
}: Props) {
  return (
    !isGiftCardDetailPage && (
      <div className={styles.ratings}>
        <Rating
          precision={0.5}
          value={averageRating}
          readOnly={true}
          size="small"
          className={styles.ratingsStars}
          emptyIcon={<StarBorderOutlinedIcon fontSize="inherit" className={styles.ratingsStars} />}
        />
        <>{reviewCount}</>
      </div>
    )
  );
}
