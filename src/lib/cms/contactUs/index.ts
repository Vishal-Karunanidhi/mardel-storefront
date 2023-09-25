import { fetchDataViaGql, modifyDataViaGql } from '@Graphql/client';
import contactUs from '@GqlMutations/contactUs/contactUs.graphql';
import contactUsPage from '@GqlQueries/headless/contactUsPage.graphql';
import { ContactUsPage, ContactUsRequest, ContactUsResponse } from '@Types/cms/contactUs';
import GQL_CONST from '@Constants/gqlConstants';

export async function contactUsMutation(
  payload: ContactUsRequest
): Promise<ContactUsResponse | null> {
  try {
    const { data } = await modifyDataViaGql(contactUs, { request: { ...payload } });
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getContactUsPage(deliveryKey: string): Promise<ContactUsPage | null> {
  const gqlArguments = {
    variables: { deliveryKey }
  };

  try {
    const { data } = await fetchDataViaGql(contactUsPage, GQL_CONST._UNUSED, gqlArguments);
    return data.getContactUsPage;
  } catch (error) {
    console.error(error);
    return null;
  }
}
