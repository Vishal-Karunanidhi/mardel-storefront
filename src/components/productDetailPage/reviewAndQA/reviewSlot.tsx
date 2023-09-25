// import { useState } from 'react';
import styles from '@Styles/productDetailPage/reviewAndQA/reviewSlot.module.scss';
import Rating from '@mui/material/Rating';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Review } from '@Types/cms/schema/pdp/pdpData.schema';
import MarkdownView from 'react-showdown';

type Props = {
  review: Review;
};

export default function ReviewSlot({ review }: Props): JSX.Element {
  // const [numHelpful, setNumHelpful] = useState<number>(review.numHelpful);

  // function markHelpful(): void {
  //   setNumHelpful(numHelpful + 1);
  // }
  const formattedDate = new Date(review?.createdAt).toLocaleDateString('en-US', {
    dateStyle: 'long'
  });

  return (
    <div className={styles.review}>
      <div className={styles.reviewUser}>
        <AccountCircleOutlinedIcon />
        <div>
          <div className={styles.reviewUserName}>{review?.authorName}</div>
          <div className={styles.reviewUserDate}>{formattedDate}</div>
        </div>
      </div>
      <Rating
        precision={0.5}
        value={review?.rating}
        size="small"
        readOnly={true}
        className={styles.reviewRating}
      />
      <MarkdownView className={styles.reviewTitle} markdown={review?.title}></MarkdownView>
      <MarkdownView className={styles.reviewText} markdown={review?.text}></MarkdownView>
      {/* <div
        className={styles.reviewNumHelpful}
      >{`${numHelpful} people thought this review was helpful`}</div>
      <a className={styles.reviewNumHelpfulLink} onClick={markHelpful}>
        Mark review as helpful
      </a> */}
    </div>
  );
}
