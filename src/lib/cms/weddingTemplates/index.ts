/* eslint-disable no-console */
import { fetchDataViaGql } from '@Lib/graphql/client';
import GetWeddingTemplatesContent from '@GqlQueries/headless/weddingTemplates.graphql';
import GQL_CONST from '@Constants/gqlConstants';

async function getWeddingTemplatesPage(deliveryKey: string) {
  const gqlArguments = {
    variables: { deliveryKey }
  };

  try {
    const { data } = await fetchDataViaGql(
      GetWeddingTemplatesContent,
      GQL_CONST._UNUSED,
      gqlArguments
    );
    return data.getWeddingTemplatesContent;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export { getWeddingTemplatesPage };
