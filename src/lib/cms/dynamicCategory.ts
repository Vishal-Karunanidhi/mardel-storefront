import { fetchDataViaGql } from '@Lib/graphql/client';
import DynamicCategoryPageQuery from '@GqlQueries/dynamicCategoryPage.graphql';
import GQL_CONST from '@Constants/gqlConstants';
import { DynamicCategoryPage } from '@Types/dynamicCategoryPage';

async function getDynamicCategoryPage(deliveryKey: string): Promise<DynamicCategoryPage> {
  const gqlArguments = {
    variables: { deliveryKey }
  };
  try {
    const {
      data: { dcPage }
    } = await fetchDataViaGql(DynamicCategoryPageQuery, GQL_CONST._UNUSED, gqlArguments);
    return dcPage;
  } catch (error) {
    console.error('Error Occured with DynamicCategoryPage GQL', error);
    return null;
  }
}

export { getDynamicCategoryPage };
