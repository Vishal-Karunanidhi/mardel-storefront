/* eslint-disable no-console */
import { fetchDataViaGql } from '@Lib/graphql/client';
import FaqPage from '@GqlQueries/headless/faq.graphql';
import GQL_CONST from '@Constants/gqlConstants';

async function getFaqPage(deliveryKey: string) {
  const gqlArguments = {
    variables: { deliveryKey }
  };

  try {
    const { data } = await fetchDataViaGql(FaqPage, GQL_CONST._UNUSED, gqlArguments);
    return data.getFaqPage;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export { getFaqPage };
