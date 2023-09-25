import { modifyDataViaGql, fetchGqlData } from '@Graphql/client';
import CreateUserGql from '@GqlMutations/account/createUser.graphql';
import SignInUserGql from '@GqlMutations/account/signInUser.graphql';
import ForgotPasswordGql from '@GqlMutations/account/forgotPassword.graphql';
import CreateNewPasswordGql from '@GqlMutations/account/createNewPassword.graphql';
import GetHeartBeatGql from '@GqlQueries/account/heartBeat.graphql';
import GetMyAccountContent from '@GqlQueries/account/myAccountContent.graphql';
import MyProfileGql from '@GqlQueries/account/myProfile.graphql';
import LogoutGql from '@GqlMutations/account/logout.graphql';
import UpdateUserPasswordGql from '@GqlMutations/account/updateUserPassword.graphql';
import UpdateUserGql from '@GqlMutations/account/updateUser.graphql';
import GQL_CONST from '@Constants/gqlConstants';

async function createUserAccount(headers, createUserRequest): Promise<any> {
  const phone = createUserRequest?.phone;
  if (createUserRequest && !phone?.includes('+1')) {
    createUserRequest['phone'] = '+1' + phone;
  }

  const variables = {
    request: {
      ...createUserRequest
    }
  };

  try {
    const { data, errors } = await modifyDataViaGql(CreateUserGql, variables, headers);
    if (!data) {
      return errors[0]?.extensions?.error;
    } else {
      return data?.createUser;
    }
  } catch (error) {
    console.error('Error Occurred with createAccountUser GQL', error);
  }
}

async function sigInUserAccount(signInUserRequest): Promise<any> {
  const variables = {
    request: {
      ...signInUserRequest
    }
  };

  try {
    const { data, errors } = await modifyDataViaGql(SignInUserGql, variables);
    if (errors?.[0]?.extensions?.error?.['code'] === 'PasswordResetRequiredException') {
      return { status: 500, errorType: 'PasswordResetRequiredException' };
    }
    return data?.signInUser;
  } catch (error) {
    console.error('Error Occurred with signInUser GQL', error);
  }
}

async function getHeartBeatGql(headers = {}): Promise<any> {
  try {
    const { heartBeat } = await fetchGqlData(
      GetHeartBeatGql,
      GQL_CONST._UNUSED,
      GQL_CONST._UNUSED,
      headers
    );
    return heartBeat;
  } catch (err) {
    console.error('Error Occurred with heart Beat GQL', err);
    return null;
  }
}

async function getMyProfileDetails(headers = {}): Promise<any> {
  try {
    const { me } = await fetchGqlData(MyProfileGql, GQL_CONST._UNUSED, GQL_CONST._UNUSED, headers);
    return me;
  } catch (err) {
    return {};
  }
}

async function logoutUser(headers): Promise<any> {
  try {
    const { data } = await modifyDataViaGql(LogoutGql, GQL_CONST._UNUSED, headers);
    return data?.logOut;
  } catch (err) {
    return false;
  }
}

async function getMyAccountContent(): Promise<any> {
  try {
    const { myAccountContent } = await fetchGqlData(GetMyAccountContent);
    return myAccountContent?.loginDetails;
  } catch (err) {
    return {};
  }
}

async function updateUserPassword(request): Promise<any> {
  try {
    const { errors, data } = await modifyDataViaGql(UpdateUserPasswordGql, { request });
    if (data) {
      return data?.updateUserPassword;
    }
    return errors[0]?.extensions?.error;
  } catch (err) {
    return {};
  }
}

async function updateUser(request): Promise<any> {
  const phone = request?.phone;
  if (phone && !phone?.includes('+1')) {
    request['phone'] = '+1' + phone;
  }
  try {
    const { data } = await modifyDataViaGql(UpdateUserGql, { request });
    return data?.updateUser ?? {};
  } catch (err) {
    console.error(err);
    return {};
  }
}

async function forgotPassword(email: string): Promise<any> {
  try {
    const { data } = await modifyDataViaGql(ForgotPasswordGql, { email });
    return data;
  } catch (error) {
    console.error('Error Occurred with forgotPassword GQL', error);
  }
}
async function createNewPassword(UpdateForgotPasswordRequest): Promise<any> {
  const variables = {
    request: {
      ...UpdateForgotPasswordRequest
    }
  };
  try {
    const data = await modifyDataViaGql(CreateNewPasswordGql, variables);
    return data;
  } catch (error) {
    console.error('Error Occurred with createNewPassword GQL', error);
  }
}

export {
  createUserAccount,
  sigInUserAccount,
  getHeartBeatGql,
  getMyProfileDetails,
  logoutUser,
  getMyAccountContent,
  updateUserPassword,
  forgotPassword,
  createNewPassword,
  updateUser
};
