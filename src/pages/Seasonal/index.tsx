import { getSeasonalPageData } from '@Lib/cms/seasonal';
import { GetServerSidePropsResult } from 'next/types';
import { SeasonalPageIndexProps, PageBlockData } from 'src/types/cms/seasonal';
import CurrentSeasons from '@Components/homepage/currentSeasons';
import Departments from '@Components/homepage/departments';
import FeaturedItems from '@Components/homepage/featuredItems';
import FreeShipping from '@Components/homepage/freeShipping';
import Grid from '@mui/material/Grid';
import HeroBanner from '@Components/homepage/heroBanner';
import SecondaryPromotion from '@Components/homepage/secondaryPromotion';
import SecondaryPromotion3x from '@Components/seasonalPage/secondaryPromotion3x';
import ShopByCategory from '@Components/homepage/shopByCategory';
import styles from '@Styles/seasonalPage/seasonal.module.scss';
import VideoComponent from '@Components/homepage/videoComponent';
import WhatsOnSaleSlider from '@Components/homepage/whatsOnSaleSlider';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { contentToBreadcrumb } from '@Lib/common/utility';
import { breadCrumbs } from '@Constants/seasonalConstants';

/*Run time Execution*/
export default function Index(props: SeasonalPageIndexProps) {
  const { seasonalPageCmsData } = props;

  const seasonalPageComponents =
    seasonalPageCmsData &&
    seasonalPageCmsData?.map((dataProps: PageBlockData) => {
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
          currentComponent = <FeaturedItems {...dataProps} />;
          break;
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
    <>
      <Breadcrumb breadCrumbs={contentToBreadcrumb(breadCrumbs)} />
      {seasonalPageComponents}
    </>
  );
}

/*
 * Retreive & process the SeasonalPage CMS data at runtime on-request.
 */
export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<SeasonalPageIndexProps>
> {
  const seasonalPageCmsData = await getSeasonalPageData();

  return {
    props: {
      seasonalPageCmsData
    }
  };
}
function useEffect(arg0: () => void, arg1: any[]) {
  throw new Error('Function not implemented.');
}
