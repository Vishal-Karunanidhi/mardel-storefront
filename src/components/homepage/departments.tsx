// import Slider from '@Components/carousel/carousel';
import DepartmentCard from '@Components/slider/cards/departmentCard';
import Slider from '@Components/slider/slider';
import { imageURL } from '@Lib/common/utility';
import { Typography } from '@mui/material';
import styles from '@Styles/components/slider/slider.module.scss';
import departmentStyles from '@Styles/components/departments.module.scss';
import { useEffect, useState } from 'react';

function Departments({ Cards, Title }: any) {
  return (
    <>
      <Typography variant="h2" className={styles.header}>
        {Title}
      </Typography>
      <Slider arrowPosition={'40%'} sliderTitle={Title}>
        {Cards.map((item, index) => {
          return (
            <DepartmentCard
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

export default Departments;
