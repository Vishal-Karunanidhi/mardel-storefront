import { fetchDataViaGql } from '@Lib/graphql/client';
import LookBookPage from '@GqlQueries/headless/lookBookPage.graphql';
import GQL_CONST from '@Constants/gqlConstants';

async function getLookBookPage(deliveryKey: string) {
  const gqlArguments = {
    variables: { deliveryKey }
  };
  try {
    const { data } = await fetchDataViaGql(LookBookPage, GQL_CONST._UNUSED, gqlArguments);
    return data.lookBookPage;
  } catch (error) {
    console.error('Error Occured with ContentPage GQL', error);
    return null;
  }
}

export { getLookBookPage };
