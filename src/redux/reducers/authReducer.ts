type SessionCtxProps = {
  heartBeatInfo?: any;
  myProfileInfo?: any;
  signInInfo?: any;
};

const initialSessionState: SessionCtxProps = {
  heartBeatInfo: {
    isExistingSession: false
  },
  myProfileInfo: {},
  signInInfo: {}
};

/*TODO: Check if signin-response is needed else remove the case*/
const AuthReducer = (state = initialSessionState, { type, payload }) => {
  let currState = state;
  switch (type) {
    case 'UPDATE_HEART_BEAT':
      currState = { heartBeatInfo: payload };
      break;
    case 'UPDATE_SIGN_IN_RESPONSE':
      currState = { signInInfo: payload };
      break;
    case 'UPDATE_MY_PROFILE':
      currState = { myProfileInfo: payload };
      break;
  }

  return {
    ...state,
    ...currState
  };
};

export default AuthReducer;
