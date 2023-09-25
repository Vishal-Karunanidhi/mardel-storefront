import { Dispatch, SetStateAction, SyntheticEvent, useContext, useEffect, useState } from 'react';
import { LinearProgress, Rating, SxProps } from '@mui/material';
import styles from '@Styles/productDetailPage/reviewAndQA/reviews.module.scss';
import ReviewSlot from './reviewSlot';
import { PdpPageData, ProductRating, Review, Variant } from '@Types/cms/schema/pdp/pdpData.schema';
import { createProductReview, getReviewsForProducts } from '@Lib/cms/productDetailsPage';
import { ProductContext } from '@Pages/product/[...product_key]';
import { MultiResolutionImageWithFallback } from '@Components/common/imageWithFallback';
import { imageUrlQuery } from '@Lib/common/utility';
import { Modal } from '@Components/common/modal';
import HLTextField from '@Components/common/hlTextField';
import { Ga4ItemReviewDataLayer } from 'src/interfaces/ga4DataLayer';
import { useSelector } from '@Redux/store';

type Props = {
  pdpPageData: PdpPageData;
  reviews: Review[];
  rating: ProductRating;
  productKey: string;
};

const progressStyle: SxProps = {
  width: '65%',
  height: '8px',
  borderRadius: '8px',
  backgroundColor: styles.hlGrayShadow,
  span: {
    backgroundColor: styles.hlBlue
  }
};

const characterLimit: number = 250;

export default function Reviews({
  pdpPageData,
  reviews,
  rating = {} as ProductRating,
  productKey
}: Props): JSX.Element {
  const [selectedVariant] =
    useContext<[Variant, Dispatch<SetStateAction<Variant>>]>(ProductContext);

  const blankForm = {
    name: '',
    productKey,
    title: '',
    text: '',
    rating: 0
    // email: '' commenting this out for now it will be added back later
  };
  const blankError = { showError: false, errorMessage: '' };

  const [productReviews, setProductReviews] = useState<Review[]>(reviews ?? []);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState<boolean>(false);
  const [showCreateReview, setShowCreateReview] = useState<boolean>(false);
  const [showCreateReviewConfirmation, setShowCreateReviewConfirmation] = useState<boolean>(false);
  const [charactersRemaining, setCharactersRemaining] = useState<number>(characterLimit);
  const [review, setReview] = useState(blankForm);
  const [error, setError] = useState<{ showError: boolean; errorMessage: string }>(blankError);

  const {
    averageRating,
    numberOfRatings,
    ratingsDistribution: {
      fiveStarReviews,
      fourStarReviews,
      threeStarReviews,
      twoStarReviews,
      oneStarReviews
    }
  } = rating;
  const {
    heartBeatInfo: { isLoggedInUser, sessionId }
  } = useSelector((state) => state.auth) ?? {};

  useEffect(() => {
    async function getMoreProductReviews() {
      const nextPageOfReviews = await getReviewsForProducts(productKey, pageNumber);

      setProductReviews((currentReviews) => {
        if (!nextPageOfReviews) return currentReviews;
        return currentReviews.concat(nextPageOfReviews.reviews);
      });
    }
    if (pageNumber > 1) getMoreProductReviews();
  }, [productKey, pageNumber]);

  function handleLoadReviews(): void {
    setPageNumber((currentPageNumber) => currentPageNumber + 1);
  }
  function handleReviewUpdate(
    e: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldChanging: string
  ): void {
    setReview({ ...review, [fieldChanging]: e.currentTarget.value });
    if (fieldChanging === 'text') {
      setCharactersRemaining(characterLimit - e.currentTarget.value.length);
    }
  }
  async function handleCreateReview(e: SyntheticEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    let request = { ...review };
    //delete request.email;
    const response = await createProductReview(request);

    if (response.status === 400) {
      setError({ showError: true, errorMessage: response.message });
      return;
    }

    setError(blankError);
    setShowCreateReviewConfirmation(true);
    setReview(blankForm);

    if (window) {
      const gtmData: Ga4ItemReviewDataLayer = {
        anonymous_user_id: '',
        item_id: productKey,
        item_name: pdpPageData?.name ?? '',
        event: 'item_review_submit',
        user_id: ''
      };

      if (sessionId) {
        isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
    setIsReviewSubmitted(true);
  }

  function handleFormReset() {
    setReview(blankForm);
    setError(blankError);
    setShowCreateReview(false);
    setShowCreateReviewConfirmation(false);

    if (window && !isReviewSubmitted) {
      const gtmData: Ga4ItemReviewDataLayer = {
        anonymous_user_id: '',
        event: 'item_review_abandon',
        item_id: productKey,
        item_name: pdpPageData?.name ?? '',
        user_id: ''
      };

      if (sessionId) {
        isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
    setIsReviewSubmitted(false);
  }

  function ratingPercentageLine(ratingCount: number): JSX.Element {
    return (
      <LinearProgress
        value={(ratingCount / numberOfRatings || 0) * 100}
        variant="determinate"
        sx={progressStyle}
      />
    );
  }

  function calculateAverageRating() {
    if (numberOfRatings > 0) {
      if (averageRating < 1) {
        return 1;
      } else if (averageRating > 5) {
        return 5;
      } else {
        return averageRating.toFixed(1);
      }
    } else {
      return 'No reviews yet';
    }
  }

  const sourceImageArray = [
    {
      media: '(min-width:425px)',
      srcSet: imageUrlQuery(selectedVariant.imageSet, 250)
    }
  ];

  const createReviewForm: JSX.Element = (
    <Modal closeModalHandler={handleFormReset}>
      <div className={styles.reviewsSlotsCreate}>
        <>
          <figure className={styles.reviewsSlotsCreateInfo}>
            <MultiResolutionImageWithFallback
              sourceArray={sourceImageArray}
              src={imageUrlQuery(selectedVariant.imageSet, 70)}
            />
            <figcaption>{pdpPageData.name}</figcaption>
          </figure>
          {showCreateReviewConfirmation ? (
            <div className={styles.reviewsSlotsCreateConfirmation}>
              <h3>Thanks for your review!</h3>
              <p>
                Your feedback helps others find the perfect product for their home and helps to
                improve our products. Your review will typically be reviewed and shared within 72
                hours.
              </p>
              <button className={styles.weeklyAd}>
                <a href="/weekly-ad">Shop the Weekly Ad</a>
              </button>
            </div>
          ) : (
            <div className={styles.reviewsSlotsCreateForm}>
              <h3>My Review</h3>
              <p>
                Thank you, your feedback is valuable, and helps us to serve you and our community
                better.{' '}
              </p>
              <h5>Please do not include:</h5>
              <ul>
                <li>Profanity or obscenities</li>
                <li>Advertisements</li>
                <li>Links to other websites</li>
              </ul>
              <h5>OVERALL RATING</h5>
              <div className={styles.reviewsSlotsCreateFormInputs}>
                <Rating
                  size="large"
                  className={styles.reviewsSlotsCreateFormInputsRating}
                  onChange={(_, ratingValue: number) =>
                    setReview({ ...review, rating: ratingValue })
                  }
                />
                <HLTextField
                  handleInputChange={(e: SyntheticEvent<HTMLInputElement>) =>
                    handleReviewUpdate(e, 'name')
                  }
                  textFieldValue={review.name}
                  labelName={'Name'}
                  textFieldType={'text'}
                  containerClassName={styles.reviewsSlotsCreateFormInputsName}
                />
                {/* commenting this out for now it will be added back later */}
                {/* <HLTextField
                  handleInputChange={(e: SyntheticEvent<HTMLInputElement>) =>
                    handleReviewUpdate(e, 'email')
                  }
                  textFieldValue={review.email}
                  labelName={'Email'}
                  textFieldType={'text'}
                  containerClassName={styles.reviewsSlotsCreateFormInputsEmail}
                /> */}
                <HLTextField
                  handleInputChange={(e: SyntheticEvent<HTMLInputElement>) =>
                    handleReviewUpdate(e, 'title')
                  }
                  textFieldValue={review.title}
                  labelName={'Title'}
                  textFieldType={'text'}
                  containerClassName={styles.reviewsSlotsCreateFormInputsTitle}
                />
                <div className={styles.reviewsSlotsCreateFormInputsText}>
                  <textarea
                    className={styles.reviewsSlotsCreateFormInputsText}
                    value={review.text}
                    maxLength={characterLimit}
                    onChange={(e: SyntheticEvent<HTMLTextAreaElement>) =>
                      handleReviewUpdate(e, 'text')
                    }
                  />
                  <div className={styles.reviewsSlotsCreateFormInputsCharacters}>
                    {charactersRemaining} characters remaining
                  </div>
                </div>
                <button className={styles.submitReview} type="submit" onClick={handleCreateReview}>
                  Submit
                </button>
                {error.showError && (
                  <div className={styles.reviewsSlotsCreateFormInputsError}>
                    {error.errorMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      </div>
    </Modal>
  );

  return (
    <div id="ProductReviews" className={styles.reviews}>
      <div className={styles.reviewsOverall}>
        <div className={styles.reviewsOverallRating}>
          <div className={styles.reviewsOverallRatingNumber}>{calculateAverageRating()}</div>
          <Rating
            defaultValue={0}
            precision={0.5}
            value={averageRating}
            size="small"
            readOnly={true}
            className={styles.reviewsOverallRatingStars}
          />
        </div>
        <div className={styles.reviewsOverallDisplay}>
          <div>5 Star {ratingPercentageLine(fiveStarReviews)}</div>
          <div>4 Star {ratingPercentageLine(fourStarReviews)}</div>
          <div>3 Star {ratingPercentageLine(threeStarReviews)}</div>
          <div>2 Star {ratingPercentageLine(twoStarReviews)}</div>
          <div>1 Star {ratingPercentageLine(oneStarReviews)}</div>
        </div>
      </div>
      <div className={styles.reviewsSlots}>
        {productReviews.map(
          (review: Review, index: number) => review && <ReviewSlot review={review} key={index} />
        )}
        <div className={styles.reviewsSlotsButtons}>
          {numberOfRatings > productReviews.length && (
            <button className={styles.loadMoreReviews} onClick={handleLoadReviews}>
              Load More Reviews
            </button>
          )}
          {showCreateReview ? (
            createReviewForm
          ) : (
            <button className={styles.addReview} onClick={() => setShowCreateReview(true)}>
              Add a Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
