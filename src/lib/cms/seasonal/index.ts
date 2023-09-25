import { fetchGqlData } from '@Graphql/client';
import SeasonalPageGql from '@GqlQueries/headless/seasonalPage.graphql';
import IndividualSeasonalPageGql from '@GqlQueries/headless/individualSeasonalPage.graphql';
import { Page, PageBlock, PageBlockData } from 'src/types/cms/seasonal';

/*
 * Extract Hompage Card & promotional CMS data
 */
async function getSeasonalPageData(): Promise<PageBlockData[]> {
  try {
    const { seasonalPage } = await fetchGqlData(SeasonalPageGql);
    return processSeasonalPageData(seasonalPage);
  } catch (err) {
    console.error('getSeasonalPageData-----', err);
    return null;
  }
}

async function getIndividualSeasonalPageData(deliveryKey) {
  try {
    const response = await fetchGqlData(IndividualSeasonalPageGql, { deliveryKey });
    response.individualSeasonalPage.content = processSeasonalPageData(
      response.individualSeasonalPage
    );
    return response.individualSeasonalPage;
  } catch (err) {
    console.error('getIndividualSeasonalPageData-----', err);
    return null;
  }
}

const processSeasonalPageData = ({ __typename: _headTypeName, content }: Page): PageBlockData[] => {
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
      case 'SecondaryPromoComponent3x':
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
      case 'ThemeTile':
        prev.push({ ...curr, key });
        break;
      case 'ThemeTilePair':
        prev.push({ ...curr, key });
        break;
    }
    return prev;
  };
  return content.reduce(extractData, []);
};

export { getSeasonalPageData, getIndividualSeasonalPageData };
