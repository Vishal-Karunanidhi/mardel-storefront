import Grid from '@mui/material/Grid';
import FreeShipping from '@Components/homepage/freeShipping';
import { getHomePageData } from '@Lib/cms/homepage';
import { GetServerSidePropsResult } from 'next/types';
import { HomePageIndexProps, PageBlockData } from 'src/types/homepage';
import HeroBanner from '@Components/homepage/heroBanner';
import Departments from '@Components/homepage/departments';
import VideoComponent from '@Components/homepage/videoComponent';
import SecondaryPromotion from '@Components/homepage/secondaryPromotion';
import ShopByCategory from '@Components/homepage/shopByCategory';
import WhatsOnSaleSlider from '@Components/homepage/whatsOnSaleSlider';
import CurrentSeasons from '@Components/homepage/currentSeasons';
import FeaturedItems from '@Components/homepage/featuredItems';
import { NextSeo } from 'next-seo';
import SeoHead from '@Components/common/seoHead';
import DataLayer from '@Utils/DataLayer';
import { Fragment } from 'react';
import { GtmDataLayer } from 'src/interfaces/gtmDataLayer';
import { getCookie, getCookieData } from '@Lib/common/serverUtility';

/*Run time Execution*/
export default function Index(props: HomePageIndexProps) {
  const { homePageCmsData, homePageMetaData } = props;

  const homePageComponents =
    homePageCmsData &&
    homePageCmsData?.map((dataProps: PageBlockData) => {
      let currentComponent: JSX.Element = <Fragment></Fragment>;
      switch (dataProps.key) {
        case 'HeroSlot':
          currentComponent = <HeroBanner {...dataProps} />;
          break;

        // eslint-disable-next-line prettier/prettier
        case 'WhatsOnSaleContent':
          currentComponent = <WhatsOnSaleSlider {...dataProps} />;
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
          currentComponent = <SecondaryPromotion {...dataProps} />;
          break;

        case 'ShopByCategory':
          currentComponent = <ShopByCategory {...dataProps} />;
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
      <h1 className="visuallyhidden">Home Page</h1>
      {homePageMetaData.title ? <SeoHead title={homePageMetaData.title}></SeoHead> : <></>}{' '}
      <NextSeo
        description={homePageMetaData.description}
        openGraph={{ images: [{ url: homePageMetaData.ogImageUrl }] }}
        additionalMetaTags={[{ content: homePageMetaData.keywords, property: 'keywords' }]}
      />
      {homePageComponents}
      <DataLayer pageData={props.gtmData} />
    </>
  );
}

/*
 * Retreive & process the HomePage CMS data at runtime on-request.
 */
export async function getServerSideProps(ctx: {
  req: any;
  res: any;
}): Promise<GetServerSidePropsResult<HomePageIndexProps>> {
  const headers = getCookie(ctx);
  // TODO: ideally, the page type is a parameter set so that the following logic could be set more globally.
  const gtmData: GtmDataLayer = {
    anonymousUserId: getCookieData('hl-anon-id', ctx).toString(),
    event: 'page_view',
    pageType: 'home'
  };
  const homePageCmsData = await getHomePageData(headers);

  return {
    props: {
      homePageMetaData: homePageCmsData.pageMetaData,
      homePageCmsData: homePageCmsData.pageBlockData,
      gtmData
    }
  };
}
