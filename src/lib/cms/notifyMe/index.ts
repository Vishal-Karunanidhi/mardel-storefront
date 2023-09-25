import { modifyDataViaGql } from '@Graphql/client';
import notifyMe from '@GqlMutations/notifyMe/notifyMe.graphql';
import { NotifyMeRequest } from '@Types/cms/notifyMe';

export async function notifyMeMutation(payload: NotifyMeRequest) {
  try {
    const { data } = await modifyDataViaGql(notifyMe, { request: { ...payload } });
    return data;
  } catch (error) {
    console.error(error);
  }
}
