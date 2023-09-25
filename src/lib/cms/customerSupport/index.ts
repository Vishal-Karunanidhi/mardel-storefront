import { fetchDataViaGql } from '@Lib/graphql/client';
import { CustomerSupportPage } from '@Types/cms/customerSupport';
import customerSupportPage from '@GqlQueries/headless/customerSupportPage.graphql';

export async function getCustomerSupportPage(): Promise<CustomerSupportPage | null> {
  try {
    const { data } = await fetchDataViaGql(customerSupportPage);
    return data.getCustomerSupportPage;
  } catch (error) {
    console.error(error);
    return null;
  }
}
