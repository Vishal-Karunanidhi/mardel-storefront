import { fetchGqlData } from '@Graphql/client';
import GQL_CONST from '@Constants/gqlConstants';
import GetListingPageContentAndDataGql from '@GqlQueries/category/getListingPageData.graphql';
import getCategoryDetails from '@GqlQueries/category/getCategoryDetails.graphql';
import invokeProductClickEvent from '@GqlQueries/headless/invokeProductClickEvent.graphql';
import { formatBreadcrumbsData } from '@Lib/common/utility';
import GiftCardsContent from 'src/static/giftCardsContent.json';

async function getListingPageContentAndData(
  categoryKey: String,
  deliveryKey: String,
  headers = {}
): Promise<any> {
  const variables = { categoryKey, deliveryKey };
  const defaultValue = {
    breadCrumbs: { links: [] },
    clpPageContent: {}
  };

  try {
    const { getCategoryBreadCrumbs, getCategoryPageContent } = await fetchGqlData(
      GetListingPageContentAndDataGql,
      variables,
      GQL_CONST._UNUSED,
      headers
    );

    return {
      breadCrumbs: formatBreadcrumbsData(getCategoryBreadCrumbs) ?? defaultValue.breadCrumbs,
      clpPageContent: getCategoryPageContent ?? defaultValue.clpPageContent
    };
  } catch (err) {
    console.error(
      `Error retrieving getCategoryListPageContentAndData for categoryKey : ${categoryKey} deliveryKey: ${deliveryKey}`,
      err
    );
    return defaultValue;
  }
}

async function getGiftCardsContent(): Promise<any> {
  try {
    return GiftCardsContent?.getGiftCardsContent?.giftCards;
  } catch (err) {}
}

async function getGcLookUpContent(): Promise<any> {
  try {
    return GiftCardsContent?.getGiftCardsContent?.balance;
  } catch (err) {}
}

async function getCategoryDetailsData(key: String): Promise<any> {
  try {
    const variables = {
      key
    };
    const data = (await fetchGqlData(getCategoryDetails, variables)) ?? {};
    return data;
  } catch (error) {
    console.error('Error Occured with getCategoryDetails GQL', error);
    return {};
  }
}

async function productClickEvent(request): Promise<any> {
  try {
    const data = (await fetchGqlData(invokeProductClickEvent, request)) ?? {};
    return data;
  } catch (error) {
    console.error('Error Occured with invokeProductClickEvent GQL', error);
    return {};
  }
}

export {
  getListingPageContentAndData,
  getGiftCardsContent,
  getGcLookUpContent,
  getCategoryDetailsData,
  productClickEvent
};
