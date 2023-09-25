import ShopByCategoryCard from '@Components/slider/cards/shopByCategoryCard';
import Slider from '@Components/slider/slider';
import { imageURL } from '@Lib/common/utility';
import Typography from '@mui/material/Typography';
import styles from '@Styles/landingPages/departmentLandingPage/departmentPage.module.scss';

function ShopSale({ cards, labels }) {
  return (
    <div className={styles.slider}>
      <Typography
        variant="h3"
        className={styles.header}
        style={{ marginTop: 80, marginBottom: 30 }}
      >
        {labels.shopSaleCarousel}
      </Typography>
      <Slider
        arrowPosition={'40%'}
        containerStyle={{ padding: 0, maxWidth: '100%' }}
        sliderTitle={labels.shopSaleCarousel}
      >
        {cards.map((card, index) => {
          return (
            <ShopByCategoryCard
              key={index}
              imageAltText={card.title}
              link={card._meta.deliveryKey}
              title={card.title}
              image={
                card.thumbnail &&
                imageURL(card.thumbnail.defaultHost, card.thumbnail.endpoint, card.thumbnail.name)
              }
            />
          );
        })}
      </Slider>
    </div>
  );
}

export default ShopSale;
