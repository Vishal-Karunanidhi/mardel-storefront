import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import styles from '@Styles/homepage/featuredItems.module.scss';
import Slider from '@Components/slider/slider';
import ProductCard from '@Components/plp/productCard';
import CatStyles from '@Styles/plp/categoryListingPages.module.scss';
import SliderStyles from '@Styles/plp/productListPageSlider.module.scss';
import { Ga4EcommerceItem } from 'src/interfaces/ga4EcommerceItem';
import { algoliaProductsToGtmItems, handleProductViewListEvent } from '@Lib/common/utility';
import { useSelector } from '@Redux/store';

function AlgoliaFeaturedItems({ label, products }) {
  const mobile = 1024;
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [screenWidth, setScreenWidth] = useState<number>(0);

  const {
    heartBeatInfo: { sessionId, isLoggedInUser }
  } = useSelector((state) => state.auth);

  /*Use during Responsive Fixes*/
  useEffect(() => setIsMobile(windowWidth < mobile || screenWidth < mobile), [windowWidth]);
  useEffect(() => {
    window.addEventListener('resize', captureWindowAndScreenWidth);
    captureWindowAndScreenWidth();
  }, []);
  function captureWindowAndScreenWidth() {
    setWindowWidth(window.innerWidth);
    setScreenWidth(window.screen.width);
  }
  if (!products?.length) {
    <></>;
  }

  useEffect(() => {
    if (window) {
      const items: Ga4EcommerceItem[] = algoliaProductsToGtmItems(products);
      handleProductViewListEvent(items, 'items to consider', sessionId, isLoggedInUser);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <Typography className={styles.header} variant="h2">
          {label}
        </Typography>
      </div>

      {products?.length && (
        <div className={SliderStyles.wrapper}>
          <div className={CatStyles.widgetAndHitsWrapper}>
            <div className={`${CatStyles.hitsDivision}`}>
              <div className={CatStyles.customHits}>
                <div className={CatStyles.customProdCard}>
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
                    {products.map((item: any, index: string | number) => (
                      <ProductCard
                        key={index}
                        productData={item}
                        isMobile={isMobile}
                        listName={'items to consider'}
                      />
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlgoliaFeaturedItems;
