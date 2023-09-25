import client, { fetchDataViaGql, modifyDataViaGql } from '@Graphql/client';
import GQL_CONST from '@Constants/gqlConstants';
import sendHolidayEmailMutation from '@GqlMutations/email/sendHolidayEmail.graphql';

export async function sendHolidayMessageEmail(payload: {
  emailAddress: string;
  senderName: string;
  holidayMessage: string;
  deliveryKey: string;
}) {
  const variables = {
    request: {
      ...payload
    }
  };
  try {
    const { data } = await modifyDataViaGql(sendHolidayEmailMutation, variables);
    return data;
  } catch (error) {
    console.error(error);
  }
}
