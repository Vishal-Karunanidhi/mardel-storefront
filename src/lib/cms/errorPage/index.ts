import { fetchGqlData } from '@Lib/graphql/client';
import getErrorPageGql from '@GqlQueries/headless/getErrorPages.graphql';

async function getErrorPageData(errorCode: string): Promise<any> {
  try {
    const variables = {
      errorCode
    };
    const { getErrorPage } = await fetchGqlData(getErrorPageGql, variables);
    return getErrorPage;
  } catch (error) {
    console.error('Error Occured with getErrorPages GQL', error);
    return {};
  }
}

export { getErrorPageData };
