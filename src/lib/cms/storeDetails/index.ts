import client, { fetchDataViaGql, modifyDataViaGql } from '@Graphql/client';
import GQL_CONST from '@Constants/gqlConstants';
import getStoreDetailsContentQuery from '@Graphql/queries/headless/storeDetails.graphql';

export const getStoreDetailsContent = async (deliveryKey: string) => {
  const gqlArguments = {
    variables: {
      deliveryKey
    }
  };
  try {
    const { data } = await fetchDataViaGql(
      getStoreDetailsContentQuery,
      GQL_CONST._UNUSED,
      gqlArguments
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
