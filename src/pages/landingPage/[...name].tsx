import Grid from '@mui/material/Grid';
import DepartmentPage from '@Components/landingPage/department';
import { GetServerSidePropsResult } from 'next/types';
import { getDepartmentData } from '@Lib/cms/productLandingPage';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';

import { DepartmentCategoriesAndPageContent } from '@Types/cms/schema/plp/plpContent.schema';
import DataLayer from '@Utils/DataLayer';
import { DepartmentGtmDataLayer } from 'src/interfaces/gtmDataLayer';
import { getCookie, getCookieData } from '@Lib/common/serverUtility';
import SeoHead from '@Components/common/seoHead';

type Props = {
  departmentData: { getDepartmentData: DepartmentCategoriesAndPageContent };
  currentUrl: string;
  gtmData: DepartmentGtmDataLayer;
  recentlyViewed: Object;
};

export default function Category({
  recentlyViewed,
  departmentData,
  currentUrl,
  gtmData
}: Props): JSX.Element {
  const DepartmentComponent = () => {
    const { page, categories, metaData } = departmentData?.getDepartmentData ?? {};
    if (!page) {
      return <></>;
    }
    return (
      <Grid container style={{ height: 'auto' }}>
        {departmentData && (
          <>
            <Breadcrumb breadCrumbs={page?.breadCrumbs} />
            <DepartmentPage
              recentlyViewed={recentlyViewed}
              pageData={page}
              categories={categories}
              currentUrl={currentUrl}
            />
          </>
        )}
        {metaData?.title && (
          <SeoHead
            title={metaData?.title}
            description={metaData?.description}
            additionalMetaTags={[{ content: metaData?.keywords, property: 'keywords' }]}
          />
        )}
      </Grid>
    );
  };

  return (
    <>
      <DepartmentComponent />
      <DataLayer pageData={gtmData} />
    </>
  );
}

export async function getServerSideProps(context: {
  req: any;
  res: any;
  query: any;
}): Promise<GetServerSidePropsResult<Props>> {
  /* TODO: please use request url path here */

  const { query } = context;
  const headers = getCookie(context);

  const deliveryKey: string = Array.isArray(query.name) && query.name.join('/');
  const departmentData = await getDepartmentData(deliveryKey, headers);
  if (!departmentData || departmentData === undefined) {
    // TODO: redirect or 404 or something here
    console.log('departmentData is null');
  }

  const cookieGetter = context.req.cookies['_hl_rv'];
  let recentlyViewed = [];
  if (cookieGetter) {
    recentlyViewed = cookieGetter.split(',');
  }

  const gtmData: DepartmentGtmDataLayer = {
    anonymousUserId: getCookieData('hl-anon-id', context).toString(),
    event: 'page_view',
    pageType: 'department',
    department:
      departmentData?.getDepartmentData?.page?.title === undefined
        ? ''
        : departmentData?.getDepartmentData?.page?.title
  };

  return {
    props: {
      recentlyViewed,
      departmentData,
      currentUrl: deliveryKey,
      gtmData
    }
  };
}
