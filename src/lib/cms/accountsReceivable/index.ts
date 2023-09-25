import { fetchGqlData, modifyDataViaGql } from '@Graphql/client';
import GetAccountsReceivableCardBalance from '@Graphql/queries/accountsReceivable/getAccountsReceivableCardBalance.graphql';

export async function getAccountsReceivableCardBalance(
  cardNumber: string,
  customerNumber: string,
  zipCode: string
) {
  const gqlArguments = { cardNumber, accountNumber: customerNumber, zipCode };
  try {
    const response = await fetchGqlData(GetAccountsReceivableCardBalance, gqlArguments);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}
