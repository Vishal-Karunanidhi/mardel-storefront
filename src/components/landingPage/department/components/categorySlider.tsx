import Slider from '@Components/slider/slider';
import CategoryCard from '@Components/slider/cards/categoryCard';
import { imageURL, imageUrlQuery } from '@Lib/common/utility';
import Typography from '@mui/material/Typography';
import styles from '@Styles/landingPages/departmentLandingPage/departmentPage.module.scss';

function CategorySlider({
  cards,
  labels,
  styleOverride
}: {
  styleOverride?: string;
  cards: any;
  labels: any;
}) {
  if (cards) {
    return (
      <div className={styleOverride || styles.slider}>
        <Typography variant="h3" className={styles.categoryHeader}>
          {labels.categoryCarousel}
        </Typography>
        <Slider
          arrowPosition={'35%'}
          sliderStyle={{ paddingTop: 16 }}
          arrowSize={'small'}
          sliderTitle={labels.categoryCarousel}
        >
          {cards.map((card, index) => {
            const imageEndpoint = card?.image?.image?.url;
            return (
              <CategoryCard
                key={'CategoryCard-' + index}
                imageAltText={
                  card?.image?.imageAltText || card?.content?.title || card?.title || ''
                }
                link={`/${
                  card?.deliveryKey || card?.content?._meta.deliveryKey || card?.link || ''
                }`}
                title={card?.content?.title || card?.title || ''}
                image={
                  imageEndpoint
                    ? imageUrlQuery(imageEndpoint, 300)
                    : card?.content?.thumbnail
                    ? card?.content?.thumbnail?.url ??
                      imageUrlQuery(
                        imageURL(
                          card?.content?.thumbnail?.defaultHost,
                          card?.content?.thumbnail?.endpoint,
                          card?.content?.thumbnail?.name
                        ),
                        150
                      )
                    : card?.media?.image?.name
                    ? imageUrlQuery(
                        imageURL(
                          card?.media?.image?.defaultHost,
                          card?.media?.image?.endpoint,
                          card?.media?.image?.name
                        ),
                        300
                      )
                    : ''
                }
              />
            );
          })}
        </Slider>
      </div>
    );
  }
}

export default CategorySlider;
