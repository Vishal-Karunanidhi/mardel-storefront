import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { getCookieData } from '@Lib/common/serverUtility';
import { constructSsrUrl, getAlgoliaIndexName, titleCase } from '@Lib/common/utility';
import { BreadCrumb } from '@Types/cms/schema/pdp/pdpData.schema';
import DataLayer from '@Utils/DataLayer';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next/types';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { getServerState } from 'react-instantsearch-hooks-server';
import { Configure, InstantSearchServerState } from 'react-instantsearch-hooks-web';
import InstantSearchProvider from '@Components/algolia/instantSearchProvider';
import AlgoliaListingPage from '@Components/algolia/algoliaListingPage';
import { DynamicCategoryGtmDataLayer } from 'src/interfaces/gtmDataLayer';

type Props = {
  breadCrumbData: BreadCrumb[];
  gtmData?: DynamicCategoryGtmDataLayer;
  numResults?: number;
  ruleContext: string;
  ruleTitle: string;
  serverState?: InstantSearchServerState;
  url: string;
};

export default function RuleContextPage({
  breadCrumbData,
  gtmData,
  numResults,
  ruleContext,
  ruleTitle,
  serverState,
  url
}: Props) {
  const [resultCount, setResultCount] = useState<number>(numResults ?? 0);

  return (
    <>
      <Breadcrumb
        breadCrumbs={breadCrumbData}
        optionalHeader={
          <>
            Results for "{ruleTitle}" <label>({resultCount})</label>
          </>
        }
      />
      <InstantSearchProvider serverState={serverState} url={url}>
        <Configure
          hitsPerPage={12}
          facets={['*']}
          distinct={false}
          facetingAfterDistinct={false}
          typoTolerance={false}
          filters={'on_sale:true'}
          ruleContexts={[ruleContext]}
        />
        <AlgoliaListingPage
          resultCount={resultCount}
          searchTerm={ruleContext}
          setResultCount={setResultCount}
          fromParentPageType={'WARC'}
        />
      </InstantSearchProvider>
      <DataLayer pageData={gtmData} />
    </>
  );
}

export async function getServerSideProps({
  req,
  res,
  query
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> {
  const ruleContext = query.ruleContext as string;
  const ruleTitle: string = ruleContext ? titleCase(ruleContext.split('-')) : null;
  const url: string = constructSsrUrl(req);

  const breadCrumbData: BreadCrumb[] = [
    {
      key: 'home',
      name: 'Home',
      openInNewTab: false,
      slug: '/'
    },
    {
      key: 'weekly-ad',
      name: 'Weekly Ad',
      openInNewTab: false,
      slug: '/weekly-ad'
    },
    {
      key: ruleContext,
      name: ruleTitle,
      openInNewTab: false,
      slug: ''
    }
  ];

  const indexName: string = getAlgoliaIndexName();
  const ruleContextPageProps: Props = {
    breadCrumbData,
    ruleContext,
    ruleTitle,
    url
  };

  const serverState: InstantSearchServerState = await getServerState(
    <RuleContextPage {...ruleContextPageProps} />,
    {
      renderToString
    }
  );
  const numResults = serverState?.initialResults?.[indexName]?.results?.[0]?.nbHits;
  const gtmData: DynamicCategoryGtmDataLayer = {
    anonymousUserId: getCookieData('hl-anon-id', { req, res }).toString(),
    dcRule: ruleContext,
    dcRuleTitle: ruleTitle,
    event: 'page_view',
    numResults: numResults,
    pageType: 'weekly ad rule context'
  };

  return {
    props: {
      ...ruleContextPageProps,
      gtmData,
      numResults,
      serverState
    }
  };
}
