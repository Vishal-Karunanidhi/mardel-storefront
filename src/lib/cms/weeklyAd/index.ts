import { fetchDataViaGql } from '@Lib/graphql/client';
import WeeklyAd from '@GqlQueries/headless/weeklyAdPage.graphql';
import GQL_CONST from '@Constants/gqlConstants';
import { WeeklyAdPage } from '@Types/cms/weeklyAd';

async function getWeeklyAd(deliveryKey: string, headers = {}): Promise<WeeklyAdPage> {
  const gqlArguments = {
    variables: { deliveryKey }
  };
  try {
    const {
      data: { weeklyAdPage }
    } = await fetchDataViaGql(WeeklyAd, GQL_CONST._UNUSED, gqlArguments, headers);
    return weeklyAdPage;
  } catch (error) {
    console.error('Error Occured with WeeklyAdPage GQL', error);
    return null;
  }
}

export { getWeeklyAd };
