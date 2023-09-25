import Grid from '@mui/material/Grid';
import DepartmentPage from '@Components/landingPage/department';
import CategoryPage from '@Components/landingPage/category';
import SubCategoryPage from '@Components/landingPage/subCategory';
import { middleware } from '../../middleware';
import { GetServerSidePropsResult } from 'next/types';
import { getSeasonalDepartmentPageContent } from '@Lib/cms/productLandingPage';
import { getIndividualSeasonalPageData } from '@Lib/cms/seasonal';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';

import styles from '@Styles/seasonalPage/individualSeasonal.module.scss';

import { DepartmentCategoriesAndPageContent } from '@Types/cms/schema/plp/plpContent.schema';
import { PageBlockData } from '@Types/cms/seasonal';
import HeroBanner from '@Components/homepage/heroBanner';
import WhatsOnSaleSlider from '@Components/homepage/whatsOnSaleSlider';
import FreeShipping from '@Components/homepage/freeShipping';
import VideoComponent from '@Components/homepage/videoComponent';
import Departments from '@Components/homepage/departments';
import SecondaryPromotion from '@Components/homepage/secondaryPromotion';
import SecondaryPromotion3x from '@Components/seasonalPage/secondaryPromotion3x';
import ShopByCategory from '@Components/homepage/shopByCategory';
import CurrentSeasons from '@Components/homepage/currentSeasons';
import FeaturedItems from '@Components/homepage/featuredItems';
import ThemeTilePair from '@Components/seasonalPage/themeTilePair';
import TopCategories from '@Components/landingPage/department/components/topCategories';
import CategorySlider from '@Components/landingPage/department/components/categorySlider';
import { contentToBreadcrumb, imageURL } from '@Lib/common/utility';

export default function IndividualSeasonalPage(props) {
  const { seasonalData } = props;
  const { breadcrumbs, bannerImage, featuredItems } = seasonalData;

  const seasonalPageComponents =
    seasonalData &&
    seasonalData?.content.map((dataProps: PageBlockData) => {
      let currentComponent: JSX.Element = <></>;
      switch (dataProps.key) {
        case 'HeroSlot':
          currentComponent = (
            <div className={`${styles.container} ${styles.marginTop} ${styles.heroNoMask}`}>
              <HeroBanner {...dataProps} />
            </div>
          );
          break;

        // eslint-disable-next-line prettier/prettier
        case 'WhatsOnSaleContent':
          currentComponent = (
            <div className={styles.container}>
              <WhatsOnSaleSlider {...dataProps} />
            </div>
          );
          break;

        case 'FreeShippingContent':
          currentComponent = <FreeShipping {...dataProps} />;
          break;

        case 'Categories':
          currentComponent = (
            <CategorySlider
              styleOverride={styles.categories}
              cards={dataProps.Cards}
              labels={{ categoryCarousel: dataProps.Title }}
            />
          );
          break;

        case 'VideoComponent':
          currentComponent = <VideoComponent {...dataProps} />;
          break;

        case 'Departments':
          currentComponent = <Departments {...dataProps} />;
          break;

        case 'SecondaryPromoComponent':
          currentComponent = (
            <div className={styles.secondaryPromotion}>
              <SecondaryPromotion {...dataProps} />
            </div>
          );
          break;

        case 'SecondaryPromoComponent3x':
          currentComponent = (
            <div className={styles.secondaryPromotion3x}>
              <SecondaryPromotion3x {...dataProps} />
            </div>
          );
          break;

        case 'ShopByCategory':
          currentComponent = (
            <div className={styles.shopByCategory}>
              <ShopByCategory {...dataProps} />;
            </div>
          );
          break;

        case 'Seasons':
          currentComponent = <CurrentSeasons {...dataProps} />;
          break;

        case 'ProductSelector':
          currentComponent = (
            <div className={styles.featuredItems}>
              <FeaturedItems {...dataProps} />
            </div>
          );
          break;

        case 'ThemeTilePair':
          currentComponent = <ThemeTilePair {...dataProps} />;
      }
      return currentComponent ? (
        <Grid item xs={12} md={12} key={dataProps.key}>
          {currentComponent}
        </Grid>
      ) : (
        <></>
      );
    });

  return (
    <div>
      <Breadcrumb breadCrumbs={contentToBreadcrumb(breadcrumbs)} />
      {/* <HeroBanner image={bannerImage} /> */}
      <div className={styles.bannerImageContainer}>
        <img
          className={styles.bannerImage}
          src={imageURL(bannerImage.defaultHost, bannerImage.endpoint, bannerImage.name)}
        />
      </div>
      {seasonalPageComponents}
      <div className={styles.featuredItems}>
        <FeaturedItems {...featuredItems} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context): Promise<any> {
  /* TODO: please use request url path here */

  const { req, res, query, resolvedUrl } = context;
  // const deliveryKey = 'Home-Decor-Frames/c/3';
  const deliveryKey: string = Array.isArray(query.name) && query.name.join('/');

  const seasonalData = await getIndividualSeasonalPageData(deliveryKey);

  return {
    props: {
      seasonalData: seasonalData || null,
      currentUrl: deliveryKey
    }
  };
}
