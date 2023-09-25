import { fetchGqlData } from '@Graphql/client';
import GQL_CONST from '@Constants/gqlConstants';
import HomePageGql from '@GqlQueries/headless/homePage.graphql';
import { Page, PageBlock, PageBlockData, PageData } from 'src/types/homepage';

/*
 * Extract Hompage Card & promotional CMS data
 */
async function getHomePageData(headers = {}): Promise<PageData> {
  try {
    const { homePage } = await fetchGqlData(HomePageGql,
      GQL_CONST._UNUSED,
      GQL_CONST._UNUSED,
      headers);

    const pageBlockData = processHomePageData(homePage);
    return {
      pageMetaData: { ...homePage.metaData, ogImageUrl: homePage.metaData.ogImage.url },
      pageBlockData: pageBlockData
    };
  } catch (err) {
    console.error('getHomePageData-----', err);
    return null;
  }
}

const processHomePageData = ({ __typename: _headTypeName, content }: Page): PageBlockData[] => {
  const extractData = (prev: PageBlockData[], curr: PageBlock | any) => {
    let key = curr.__typename;

    switch (key) {
      case 'HeroSlot':
        prev.push({ ...curr.slotContent, key });
        break;
      case 'WhatsOnSaleContent':
      case 'FreeShippingContent':
      case 'SecondaryPromoComponent':
        prev.push({ ...curr, key });
        break;
      case 'VideoComponent':
        prev.push({ ...curr, key });
        break;
      case 'CardList':
        key = curr.theme;
        prev.push({ ...curr, key });
        break;
      case 'ProductSelector':
        prev.push({ ...curr, key });
        break;
    }
    return prev;
  };
  return content.reduce(extractData, []);
};

export { getHomePageData };
