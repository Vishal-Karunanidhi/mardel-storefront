import Slider from '@Components/slider/slider';
import ShopByCategoryCard from '@Components/slider/cards/shopByCategoryCard';
import { imageURL } from '@Lib/common/utility';
import styles from '@Styles/components/slider/slider.module.scss';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

function ShopByCategory({ Cards, Title }: any) {
  // const { header, card, image, text } = styles;

  return (
    <>
      <Typography variant="h2" className={styles.header}>
        {Title}
      </Typography>
      {/* <Slider
        data={Cards}
        cardStyles={{
          card: card,
          image: image,
          text: text,
        }}
        initialCardsPerPage={6}
      /> */}
      <Slider arrowPosition={'40%'} sliderTitle={Title}>
        {Cards.map((item, index) => {
          return (
            <ShopByCategoryCard
              key={index}
              title={item.title}
              link={item.link}
              image={imageURL(
                item.media.image.defaultHost,
                item.media.image.endpoint,
                item.media.image.name
              )}
              imageAltText={item.media.imageAltText ? item.media.imageAltText : item.title}
            />
          );
        })}
      </Slider>
    </>
  );
}

export default ShopByCategory;
