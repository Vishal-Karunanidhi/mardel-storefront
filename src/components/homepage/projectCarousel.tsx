import { useState } from 'react';
import Link from 'next/link';
import { Typography } from '@mui/material';
import Slider from '@Components/slider/slider';
import { HlAnchorWrapper } from '@Components/common/button';
import { RatingDivComp } from '@Components/plp/productCard';
import ImageWithFallback from '@Components/common/imageWithFallback';
import BlackArrow from '@Icons/carousel/blackArrow';
import FavoriteIcon from '@Icons/productCard/favoriteIcon';
import styles from '@Styles/homepage/featuredItems.module.scss';
import ProjectCarouselStyles from '@Styles/homepage/projectCarousel.module.scss';

const ProjectProductCard = ({ deliveryKey, hasVideo, projectCard }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { urlSlug, name, summary } = projectCard;
  const { image, imageAltText } = projectCard?.thumbnail ?? {};

  const navUrl = `/${urlSlug}/p/${deliveryKey}`;

  return (
    <>
      <div className={ProjectCarouselStyles.parentCard}>
        <span className={ProjectCarouselStyles.favoriteIconWrapper}>
          <FavoriteIcon
            style={ProjectCarouselStyles.favoriteIcon}
            toggled={isFavorited}
            onClick={() => setIsFavorited((prev) => !prev)}
          />
        </span>
        <HlAnchorWrapper href={navUrl}>
          <ImageWithFallback
            className={ProjectCarouselStyles.projectImage}
            src={image?.url}
            alt={imageAltText}
          />
        </HlAnchorWrapper>

        <HlAnchorWrapper href={navUrl}>
          <span className={ProjectCarouselStyles.titleCards}>{name}</span>
        </HlAnchorWrapper>

        <span className={ProjectCarouselStyles.titleCards}>{summary}</span>

        <span className={ProjectCarouselStyles.ratingComp}>
          <RatingDivComp />
          {hasVideo && (
            <span className={ProjectCarouselStyles.videoIcon}>
              <HlAnchorWrapper href={navUrl}>
                <img
                  src={'/icons/productCard/videoIcon.svg'}
                  alt={'Has Video'}
                  width={24}
                  height={24}
                  aria-label="video"
                />
              </HlAnchorWrapper>
            </span>
          )}
        </span>
      </div>
    </>
  );
};

function ProjectCarousel({ label, productDetails, showViewAll = true }) {
  return (
    <span className={ProjectCarouselStyles.carouselWrapper}>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <Typography className={styles.header} variant="h2">
            {label}
          </Typography>
          {showViewAll ? (
            <div className={styles.viewAllWrapper}>
              <Link href="#">
                <a data-testid="productcard-viewall">
                  <span className={styles.viewAll}>View All</span>
                  <BlackArrow className={styles.viewAllArrow} />
                </a>
              </Link>
            </div>
          ) : (
            <></>
          )}
        </div>

        {productDetails?.length > 0 && (
          <Slider
            arrowPosition="50%"
            arrowSize="large"
            sliderStyle={{
              display: 'flex',
              alignContent: 'stretch',
              alignItems: 'stretch',
              gap: '24px'
            }}
            sliderTitle={label}
          >
            {productDetails.map((item: any, index: string | number) => (
              <ProjectProductCard {...item} key={index} />
            ))}
          </Slider>
        )}
      </div>
    </span>
  );
}

export default ProjectCarousel;
export { ProjectProductCard };
