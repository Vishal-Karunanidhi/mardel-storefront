import { Tab, Tabs } from '@mui/material';
import { useMemo, useState } from 'react';
import AccordionSlot from '../accordianSlot';
// import Questions from './questions';
import Reviews from './reviews';
import styles from '@Styles/productDetailPage/reviewAndQA/reviewAndQA.module.scss';
import { PdpPageData } from '@Types/cms/compiled/pdp.compiled';
import { ProductRating, Review } from '@Types/cms/schema/pdp/pdpData.schema';
// import * as mockProps from '@Mocks/reviewAndQA.json';

type Props = {
  pdpPageData: PdpPageData;
  reviews: Review[];
  rating: ProductRating;
  productKey: string;
};

export default function ReviewAndQA({
  pdpPageData,
  reviews,
  rating,
  productKey
}: Props): JSX.Element {
  type buttonOptions = 'reviews' | 'questions';
  type showOptions = {
    selectedButton: buttonOptions;
    reviewStyle?: React.CSSProperties;
    questionStyle?: React.CSSProperties;
  };

  const REVIEWS: buttonOptions = 'reviews';
  // const QUESTIONS: buttonOptions = 'questions';
  const buttonStyle: React.CSSProperties = {
    color: styles.hlGreen,
    borderBottom: `2px solid ${styles.hlGreen}`
  };

  const [reviewOrQA, setReviewOrQA] = useState<showOptions>({
    selectedButton: 'reviews',
    reviewStyle: buttonStyle
  });
  const showReviewOrQA: JSX.Element = useMemo(() => {
    switch (reviewOrQA.selectedButton) {
      case REVIEWS:
        return (
          <Reviews
            pdpPageData={pdpPageData}
            reviews={reviews}
            rating={rating}
            productKey={productKey}
          />
        );
      // case QUESTIONS:
      //   return <Questions questions={mockProps.productQA} />;
    }
  }, [reviewOrQA, pdpPageData, reviews, rating, productKey]);

  return (
    <AccordionSlot
      title={
        <Tabs variant="fullWidth" value={'reviews'} className={styles.tabs}>
          <Tab
            className={styles.tabsButtons}
            onClick={() => setReviewOrQA({ selectedButton: REVIEWS, reviewStyle: buttonStyle })}
            label="Reviews"
            disableRipple={true}
            style={reviewOrQA.reviewStyle}
            value={'reviews'}
          />
          {/* <Tab
            className={styles.tabsButtons}
            onClick={() => setReviewOrQA({ selectedButton: QUESTIONS, questionStyle: buttonStyle })}
            label="Q&A"
            disableRipple={true}
            style={reviewOrQA.questionStyle}
          /> */}
        </Tabs>
      }
      content={showReviewOrQA}
      reviewAndQA={true}
      summaryStyle={{ minHeight: 0 }}
      contentStyle={{ maxWidth: '1173px', margin: '0' }}
    />
  );
}
