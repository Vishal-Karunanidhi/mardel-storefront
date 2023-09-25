import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { getCookieData } from '@Lib/common/serverUtility';
import { constructSsrUrl, getAlgoliaIndexName, imageURL, imageUrlQuery } from '@Lib/common/utility';
import { BreadCrumb } from '@Types/cms/schema/pdp/pdpData.schema';
import DataLayer from '@Utils/DataLayer';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next/types';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { getServerState } from 'react-instantsearch-hooks-server';
import { Configure, InstantSearchServerState } from 'react-instantsearch-hooks-web';
import InstantSearchProvider from '@Components/algolia/instantSearchProvider';
import AlgoliaListingPage from '@Components/algolia/algoliaListingPage';
import { DynamicCategoryGtmDataLayer as DynamicCategoryGtmDataLayer } from 'src/interfaces/gtmDataLayer';
import { DynamicCategoryPage } from '@Types/dynamicCategoryPage';
import { getDynamicCategoryPage } from '@Lib/cms/dynamicCategory';
import SeoHead from '@Components/common/seoHead';
import { MetaData } from '@Types/shared';
import { HeroSlotContent } from '@Types/homepage';
import styles from '@Styles/dynamicCategory/dynamicCategoryPage.module.scss';
import listingPageStyles from '@Styles/plp/categoryListingPages.module.scss';
import { ContentMainSection } from '@Types/cms/schema/contentPage.schema';
import MarkdownView from 'react-showdown';
import SeoContent from '@Components/landingPage/department/components/seoContent';

type Props = {
  breadCrumbData: BreadCrumb[];
  gtmData?: DynamicCategoryGtmDataLayer;
  heroContent?: HeroSlotContent;
  mainSection?: ContentMainSection;
  metaData: MetaData;
  numResults?: number;
  dcRule: string;
  dcRuleTitle: string;
  serverState?: InstantSearchServerState;
  url: string;
};

export default function DynamicCategoryRulePage({
  breadCrumbData,
  gtmData,
  heroContent,
  mainSection,
  metaData,
  numResults,
  dcRule,
  dcRuleTitle,
  serverState,
  url
}: Props) {
  const [resultCount, setResultCount] = useState<number>(numResults ?? 0);

  function OptionalCustomHitsHeader({
    heading1,
    description,
    image: { defaultHost, endpoint, name }
  }) {
    const displayImageSrc = imageURL(defaultHost, endpoint, name);
    return (
      <div className={styles.dcPageCustomHitsHeader}>
        <div className={styles.dcPageCustomHitsHeaderInfo}>
          <h1>{heading1}</h1>
          <p>{description}</p>
        </div>
        <picture>
          <source media="(min-width:1261px)" srcSet={imageUrlQuery(displayImageSrc, 530)} />
          <source
            media="(min-width:1119px) and (max-width:1260px)"
            srcSet={imageUrlQuery(displayImageSrc, 430)}
          />
          <source
            media="(min-width:1024px) and (max-width:1118px)"
            srcSet={imageUrlQuery(displayImageSrc, 330)}
          />
          <source
            media="(min-width:860px) and (max-width:1023px)"
            srcSet={imageUrlQuery(displayImageSrc, 630)}
          />
          <source
            media="(min-width:700px) and (max-width:859px)"
            srcSet={imageUrlQuery(displayImageSrc, 530)}
          />
          <source
            media="(min-width:500px) and (max-width:699px)"
            srcSet={imageUrlQuery(displayImageSrc, 430)}
          />
          <img src={imageUrlQuery(displayImageSrc, 330)} alt={`${dcRuleTitle} page image`} />
        </picture>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        breadCrumbs={breadCrumbData}
        optionalHeader={
          <>
            {mainSection?.title} <label>({resultCount})</label>
          </>
        }
      />
      <SeoHead
        title={metaData?.title}
        description={metaData?.description}
        additionalMetaTags={[{ content: metaData?.keywords, property: 'keywords' }]}
      />
      <InstantSearchProvider serverState={serverState} url={url}>
        <Configure hitsPerPage={12} typoTolerance={false} ruleContexts={[dcRule]} />

        <AlgoliaListingPage
          optionalCustomHitsHeader={heroContent && <OptionalCustomHitsHeader {...heroContent} />}
          resultCount={resultCount}
          searchTerm={dcRule}
          setResultCount={setResultCount}
        />
      </InstantSearchProvider>
      {mainSection?.richText && (
        <div className={listingPageStyles.seoWrapper}>
          <SeoContent title={mainSection?.title} description={mainSection?.richText} />
        </div>
      )}
      <DataLayer pageData={gtmData} />
    </>
  );
}

export async function getServerSideProps({
  req,
  res,
  query
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const dcQuery = query.dcRule;
  const dcRule = dcQuery.at(dcQuery.length - 1) as string;
  const dcRuleTitle = dcQuery.at(0).split('-').join(' ');
  const url: string = constructSsrUrl(req);

  const { content, metaData }: DynamicCategoryPage = await getDynamicCategoryPage(dcRule);

  const heroContent = content?.find(
    (contentComponent) => contentComponent.__typename === 'HeroSlotContent'
  ) as HeroSlotContent;
  const mainSection = content?.find(
    (contentComponent) => contentComponent.__typename === 'ContentMainSection'
  ) as ContentMainSection;

  const breadCrumbData: BreadCrumb[] = [
    {
      key: 'home',
      name: 'Home',
      openInNewTab: false,
      slug: '/'
    },
    {
      key: mainSection?.title || '',
      name: mainSection?.title || '',
      openInNewTab: false,
      slug: ''
    }
  ];
  const serverState: InstantSearchServerState = await getServerState(
    <DynamicCategoryRulePage
      breadCrumbData={breadCrumbData}
      dcRule={dcRule}
      dcRuleTitle={dcRuleTitle}
      heroContent={heroContent}
      mainSection={mainSection}
      metaData={metaData}
      url={url}
    />,
    {
      renderToString
    }
  );

  const indexName: string = getAlgoliaIndexName();
  const numResults = serverState?.initialResults?.[indexName]?.results?.[0]?.nbHits;
  // TODO: adapt gtmData for weekly-ad pages with typing
  const gtmData: DynamicCategoryGtmDataLayer = {
    anonymousUserId: getCookieData('hl-anon-id', { req, res }).toString(),
    dcRule,
    dcRuleTitle,
    event: 'page_view',
    numResults,
    pageType: 'dynamic category page'
  };

  return {
    props: {
      breadCrumbData,
      dcRule,
      dcRuleTitle,
      gtmData,
      heroContent,
      mainSection,
      metaData,
      numResults,
      serverState,
      url
    }
  };
}
