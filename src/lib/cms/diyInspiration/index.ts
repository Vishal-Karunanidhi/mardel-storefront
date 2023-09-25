import { fetchGqlData } from '@Graphql/client';
import GetLandingPageGql from '@Graphql/queries/diyInspiration/getLandingPage.graphql';
import GetCategoryPageGql from '@Graphql/queries/diyInspiration/getCategoryPage.graphql';
import GetProjectPageGql from '@Graphql/queries/diyInspiration/getProjectPage.graphql';

const getLandingPage = async () => {
  try {
    const { getDiyLandingPage } = await fetchGqlData(GetLandingPageGql);
    return getDiyLandingPage;
  } catch (err) {
    console.error(err);
  }
};

const getCategoryPage = async (deliveryKey) => {
  const variables = {
    deliveryKey
  };
  try {
    const { getDiyCategoryPage } = await fetchGqlData(GetCategoryPageGql, variables);
    return getDiyCategoryPage;
  } catch (err) {
    console.error(err);
  }
};

const getProjectPage = async (deliveryKey) => {
  const variables = {
    deliveryKey
  };
  try {
    const { getDiyProjectPage } = await fetchGqlData(GetProjectPageGql, variables);
    return getDiyProjectPage;
  } catch (err) {
    console.error(err);
  }
};

export { getLandingPage, getCategoryPage, getProjectPage };
