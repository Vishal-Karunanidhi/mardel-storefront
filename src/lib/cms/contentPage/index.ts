import { fetchDataViaGql } from '@Lib/graphql/client';
import ContentPage from '@GqlQueries/headless/contentPage.graphql';
import GQL_CONST from '@Constants/gqlConstants';

async function getContentPage(deliveryKey: string) {
  const gqlArguments = {
    variables: { deliveryKey }
  };
  try {
    const { data } = await fetchDataViaGql(ContentPage, GQL_CONST._UNUSED, gqlArguments);
    return data;
  } catch (error) {
    console.error('Error Occured with ContentPage GQL', error);
    return null;
  }
}

export { getContentPage };
