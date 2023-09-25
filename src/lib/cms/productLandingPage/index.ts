import { fetchDataViaGql } from '@Graphql/client';
import GetDepartmentLandingPageGql from '@GqlQueries/headless/dlp.graphql';
import GetSeasonalDepartmentLandingPageGql from '@GqlQueries/headless/sdlp.graphql';
import GetCategoryPageDataGql from '@GqlQueries/headless/categoryListPage.graphql';
import GQL_CONST from '@Constants/gqlConstants';

/*
 * Retrieve Inventory Details for PDP - CSR
 */
async function getDepartmentData(deliveryKey, headers = {}): Promise<any> {
  const gqlArguments = {
    variables: { deliveryKey }
  };
  try {
    const { data }: any = await fetchDataViaGql(
      GetDepartmentLandingPageGql,
      GQL_CONST._UNUSED,
      gqlArguments,
      headers
    );
    return data;
  } catch (err) {
    console.error('getDepartmentData----- err');
    return null;
  }
}

async function getSeasonalDepartmentPageContent(deliveryKey: string): Promise<any> {
  const gqlArguments = {
    variables: { deliveryKey }
  };
  try {
    const { data }: any = await fetchDataViaGql(
      GetSeasonalDepartmentLandingPageGql,
      GQL_CONST._UNUSED,
      gqlArguments
    );
    return data;
  } catch (err) {
    console.error('getSeasonalDepartmentData----- err');
    return null;
  }
}

export { getDepartmentData, getSeasonalDepartmentPageContent };
