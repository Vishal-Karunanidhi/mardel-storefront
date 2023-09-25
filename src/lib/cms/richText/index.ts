/* eslint-disable no-console */
import { fetchDataViaGql } from '@Lib/graphql/client';
import GetRichTextPageContents from '@GqlQueries/headless/richTextPage.graphql';
import GQL_CONST from '@Constants/gqlConstants';

async function getRichTextPage(deliveryKey: string) {
  const gqlArguments = {
    variables: { deliveryKey }
  };

  try {
    const { data } = await fetchDataViaGql(
      GetRichTextPageContents,
      GQL_CONST._UNUSED,
      gqlArguments
    );
    return data.getRichTextPageContents;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export { getRichTextPage };
