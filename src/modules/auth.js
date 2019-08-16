import { handleActions } from 'redux-actions';
import axios from 'axios';
const serverEndpoint = 'https://server.fetcher.fun';
import asyncHelper from '../helpers/asyncStorage';
import fetchHelper from '../helpers/fetch';
import sendbirdHelper from '../helpers/sendbird';
import firebase from 'react-native-firebase';

const CHECK_LOGIN_STATUS = 'CHECK_LOGIN_STATUS';

const SB_CONNECT = 'SB_CONNECT';

const POST_SIGNIN_PENDING = 'POST_SIGNIN_PENDING';
const POST_SIGNIN_SUCCESS = 'POST_SIGNIN_SUCCESS';
const POST_SIGNIN_FAILURE = 'POST_SIGNIN_FAILUER';

const SET_SOCIAL_LOGIN_INFO = 'SET_SOCIAL_LOGIN_INFO';

const DELETE_ACCOUNT_PENDING = 'DELETE_ACCOUNT_PENDING';
const DELETE_ACCOUNT_SUCCESS = 'DELETE_ACCOUNT_SUCCESS';
const DELETE_ACCOUNT_FAILURE = 'DELETE_ACCOUNT_FAILUER';

const LOGOUT = 'LOGOUT';

const SET_PROFILE_IMG = 'SET_PROFILE_IMG';

postSignInAPI = data => {
  console.log(data);
  return axios.post(`${serverEndpoint}/users/signin`, data);
};

deleteAccountAPI = async () => {
  let userToken = await asyncHelper._getData('userToken');
  console.log('deleteAccount triggered');
  return axios.delete(`${serverEndpoint}/users/deleteaccount`, {
    headers: {
      authorization: 'JWT ' + userToken
    }
  });
};

// checkIsLogin = async () => {
//   let isLogin = await asyncHelper._isLogin();
//   console.log(isLogin);
//   return isLogin;
// };
const initialState = {
  pending: false,
  error: false,
  isLogin: undefined,
  initialLogin: false,
  sbConnected: false
};

export const checkLoginStatus = isLogin => dispatch => {
  dispatch({
    type: CHECK_LOGIN_STATUS,
    payload: isLogin
  });
};
export const checkSBConnection = isConnected => dispatch => {
  dispatch({
    type: SB_CONNECT,
    payload: isConnected
  });
};
export const socialSignin = data => dispatch => {
  if (data.success) {
    let userID = data.userDB_id + '';
    asyncHelper._storeData('userToken', data.token);
    asyncHelper._storeData('provider', data.userDB_provider);
    asyncHelper._storeData('userID', userID);
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          firebase
            .messaging()
            .getToken()
            .then(fcmToken => {
              console.log('fcmToken::::::::::', fcmToken);
              fetchHelper.postFcmToken({ fcmToken: fcmToken });
              sendbirdHelper
                .sbConnect(
                  data.userDB_id,
                  data.userDB_name,
                  data.userDB_image,
                  fcmToken
                )
                .then(res => {
                  dispatch({
                    type: SET_SOCIAL_LOGIN_INFO
                  });
                  dispatch({
                    type: SB_CONNECT,
                    payload: res
                  });
                });
            });
        }
      });
  }
};

export const signin = data => (dispatch, state) => {
  dispatch({ type: POST_SIGNIN_PENDING });
  return postSignInAPI(data)
    .then(result => {
      console.log(':::result', result);
      let userID = result.data.userDB_id;
      if (result.data.success) {
        asyncHelper._storeData('userToken', result.data.token);
        asyncHelper._storeData('provider', result.data.userDB_provider);
        asyncHelper._storeData('userID', userID);

        console.log('!!!!!!');
        firebase
          .messaging()
          .hasPermission()
          .then(enabled => {
            if (enabled) {
              firebase
                .messaging()
                .getToken()
                .then(fcmToken => {
                  console.log('fcmToken::::::::::', fcmToken);
                  fetchHelper.postFcmToken({ fcmToken: fcmToken });
                  sendbirdHelper
                    .sbConnect(
                      result.data.userDB_id,
                      result.data.userDB_name,
                      result.data.userDB_image,
                      fcmToken
                    )
                    .then(res => {
                      dispatch({
                        type: POST_SIGNIN_SUCCESS
                      });
                      dispatch({
                        type: SB_CONNECT,
                        payload: res
                      });
                    });
                });
            }
          });
      } else {
        dispatch({ type: POST_SIGNIN_FAILURE, payload: result.data.error });
        console.log(result.data.error);
      }
    })
    .catch(error => {
      dispatch({
        type: POST_SIGNIN_FAILURE,
        payload: result.data.error
      });
      console.log(result.data.error);
    });
};

export const setProfileImg = data => dispatch => {
  dispatch({ type: SET_PROFILE_IMG, payload: data });
};

export const logout = () => dispatch => {
  fetchHelper.deleteFcmToken();
  asyncHelper._clearAsyncStorage();
  sendbirdHelper
    .sbUnregisterPushToken()
    .then(() => sendbirdHelper.sbDisconnect())
    .then(() => {
      dispatch({ type: LOGOUT });
    });
};

export const deleteAccount = () => dispatch => {
  dispatch({ type: DELETE_ACCOUNT_PENDING });
  return deleteAccountAPI()
    .then(result => {
      if (result.data.success) {
        asyncHelper._clearAsyncStorage();
        sendbirdHelper
          .sbUnregisterPushToken()
          .then(() => sendbirdHelper.sbDisconnect())
          .then(() => {
            dispatch({ type: DELETE_ACCOUNT_SUCCESS });
          });
      } else {
        dispatch({ type: DELETE_ACCOUNT_FAILURE, payload: result.data.error });
        console.log(result.data.error);
      }
    })
    .catch(error => {
      dispatch({
        type: DELETE_ACCOUNT_FAILURE,
        payload: result.data.error
      });
      console.log(result.data.error);
    });
};

export default handleActions(
  {
    [CHECK_LOGIN_STATUS]: (state, action) => {
      return {
        ...state,
        isLogin: action.payload
      };
    },
    [SB_CONNECT]: (state, action) => {
      return {
        ...state,
        sbConnected: action.payload
      };
    },
    [POST_SIGNIN_PENDING]: (state, action) => {
      return {
        ...state,
        pending: true,
        error: false
      };
    },
    [POST_SIGNIN_SUCCESS]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: false,
        isLogin: true,
        initialLogin: true
      };
    },
    [POST_SIGNIN_FAILURE]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: true
      };
    },
    [SET_SOCIAL_LOGIN_INFO]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: false,
        isLogin: true,
        initialLogin: true
      };
    },
    [SET_PROFILE_IMG]: (state, action) => {
      return {
        ...state,
        userDB_image: action.payload
      };
    },
    [LOGOUT]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: false,
        isLogin: false,
        initialLogin: false,
        sbConnected: false
      };
    },
    [DELETE_ACCOUNT_PENDING]: (state, action) => {
      return {
        ...state,
        pending: true,
        error: false
      };
    },
    [DELETE_ACCOUNT_SUCCESS]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: false,
        isLogin: false,
        initialLogin: false,
        sbConnected: false
      };
    },
    [DELETE_ACCOUNT_FAILURE]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: true
      };
    }
  },
  initialState
);
