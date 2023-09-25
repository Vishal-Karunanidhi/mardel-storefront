import { AppProps } from 'next/app';
import client from '@Graphql/client';
import { ApolloProvider } from '@apollo/client';

import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Reducers from '@Redux/reducers';
import ReduxProvider, { applyMiddleware } from '@Redux/store';

import Layout from '@Components/layout';
import SeoHead from '@Components/common/seoHead';
import ErrorBoundary from '@Components/errorBoundary';
import CommonWrapperComponent from '@Components/layout/commonWrapper';

import {
  getGlobalHeaderData,
  getGlobalFooterData,
  getMegaNavData,
  getMegaNavMobileData
} from '@Lib/cms/globalHeaderFooter';
import { getCookie, upsertCjEventCookie } from '@Lib/common/serverUtility';

import { LayoutIndexProps } from '@Types/homepage';
import createEmotionCache from '@Styles/createEmotionCache';

// import '@Styles/style.scss';
import { appTheme } from '@Styles/theme';
import '@Styles/globals.css';
import '@Styles/plp/aisTheme.scss';
import { getProductKeysFromCookie } from '@Lib/common/serverUtility';
import { OrganizationJsonLd, SiteLinksSearchBoxJsonLd } from 'next-seo';
import qs from 'qs';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  layoutProps?: LayoutIndexProps;
  hostUrl?: string;
}

const md = applyMiddleware();

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, layoutProps } = props;

  const {
    globalHeaderCmsData,
    globalFooterCmsData,
    megaNavData,
    megaNavMobileData,
    recentlyViewedKeys
  } = layoutProps;

  const organizationStructuredData = {
    // '@context': 'https://schema.org',
    // '@type': 'Organization',
    type: 'Organization',
    url: 'https://www.hobbylobby.com/',
    logo: 'https://imgprd19.hobbylobby.com/sys-master/migrated/hbc/h78/h00/9714481922078/HLLogo_RGB_286x33.png',
    name: 'Hobby Lobby'
  };

  const websiteStructuredData = {
    url: 'https://www.hobbylobby.com/',
    potentialActions: [
      {
        target: 'https://www.hobbylobby.com/search/?text',
        queryInput: 'search_term_string'
      }
    ]
  };

  return (
    <CacheProvider value={emotionCache}>
      <OrganizationJsonLd {...organizationStructuredData} />
      <SiteLinksSearchBoxJsonLd {...websiteStructuredData} />
      <SeoHead hostUrl={props.hostUrl} />
      <ThemeProvider theme={appTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <ReduxProvider reducers={Reducers} applyMiddleware={md}>
          <ApolloProvider client={client}>
            <ErrorBoundary>
              <CommonWrapperComponent recentlyViewedKeys={recentlyViewedKeys}>
                <Layout
                  globalHeaderCmsData={globalHeaderCmsData}
                  megaNavData={megaNavData}
                  megaNavMobileData={megaNavMobileData}
                  globalFooterCmsData={globalFooterCmsData}
                >
                  <ErrorBoundary>
                    <Component {...pageProps} />
                  </ErrorBoundary>
                </Layout>
              </CommonWrapperComponent>
            </ErrorBoundary>
          </ApolloProvider>
        </ReduxProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const headers = getCookie(ctx);
  const isCheckoutPage = ctx?.asPath?.indexOf('/checkout') !== -1;

  const dataArray: any = [
    getGlobalHeaderData(headers, isCheckoutPage),
    getGlobalFooterData(headers, isCheckoutPage)
  ];
  if (!isCheckoutPage) {
    dataArray.push(getMegaNavData(headers));
    dataArray.push(getMegaNavMobileData(headers));

    // CJ query string shouldn't be present on the cart, checkout, or order confirmation pages
    if (ctx.asPath?.indexOf('/cart') === -1 && ctx.asPath?.indexOf('/orderConfirmation') === -1) {
      // TODO: optimize
      const { req } = ctx;
      // ideally, all pages should have access to the query parameter.
      if (req?.url) {
        // it feels like retrieving a query parameter should be easier, but this the way i could get it working.
        // REF: https://stackoverflow.com/a/75962686
        var urlParts = req.url.split('?');
        if (urlParts.length > 1) {
          const rawParams = urlParts[1];
          const params = qs.parse(rawParams);
          if (params) {
            let cjEventData = params.cjevent;

            if (cjEventData) {
              upsertCjEventCookie(cjEventData.toString(), ctx);
            }
          }
        }
      }
    }
  }

  const [globalHeaderCmsData, globalFooterCmsData, megaNavData = [], megaNavMobileData] =
    await Promise.all(dataArray);

  const hostUrl = process.env.HOST_URL;

  const layoutProps: LayoutIndexProps = {
    globalHeaderCmsData,
    globalFooterCmsData,
    megaNavData,
    megaNavMobileData,
    recentlyViewedKeys: getProductKeysFromCookie({ req: ctx.req })
  };

  return { layoutProps, hostUrl };
};

export default MyApp;
