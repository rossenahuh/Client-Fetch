import { handleActions } from 'redux-actions';
import axios from 'axios';
const serverEndpoint = 'https://server.fetcher.fun';
import asyncHelper from '../helpers/asyncStorage';

const GET_USERINFO_PENDING = 'GET_USERINFO_PENDING';
const GET_USERINFO_SUCCESS = 'GET_USERINFO_SUCCESS';
const GET_USERINFO_FAILURE = 'GET_USERINFO_FAILURE';

const GET_USERTRAVELINFO_PENDING = 'GET_USERTRAVELINFO_PENDING';
const GET_USERTRAVELINFO_SUCCESS = 'GET_USERTRAVELINFO_SUCCESS';
const GET_USERTRAVELINFO_FAILURE = 'GET_USERTRAVELINFO_FAILURE';

const GET_USER_ORDERLIST_PENDING = 'GET_USER_ORDERLIST_PENDING';
const GET_USER_ORDERLIST_SUCCESS = 'GET_USER_ORDERLIST_SUCCESS';
const GET_USER_ORDERLIST_FAILURE = 'GET_USER_ORDERLIST_FAILURE';

const GET_USER_APPLYLIST_PENDING = 'GET_USER_APPLYLIST_PENDING';
const GET_USER_APPLYLIST_SUCCESS = 'GET_USER_APPLYLIST_SUCCESS';
const GET_USER_APPLYLIST_FAILURE = 'GET_USER_APPLYLIST_FAILURE';

const initialState = {
  pending: false,
  error: false,
  userInfo: '',
  travelInfo: [],
  orderList: [],
  applyList: []
};

getUerInfoAPI = async () => {
  let userToken = await asyncHelper._getData('userToken');
  return axios.get(`${serverEndpoint}/users/info`, {
    headers: {
      authorization: 'JWT ' + userToken
    }
  });
};

getTravelInfoAPI = async () => {
  let userToken = await asyncHelper._getData('userToken');
  return axios.get(`${serverEndpoint}/users/travellist`, {
    headers: {
      authorization: 'JWT ' + userToken
    }
  });
};

getUserOrderListAPI = async () => {
  let userToken = await asyncHelper._getData('userToken');
  return axios.get(`${serverEndpoint}/users/orderlist`, {
    headers: {
      authorization: 'JWT ' + userToken
    }
  });
};

getUserApplyListAPI = async () => {
  let userToken = await asyncHelper._getData('userToken');
  return axios.get(`${serverEndpoint}/users/applylist`, {
    headers: {
      authorization: 'JWT ' + userToken
    }
  });
};
statusFilter = list => {
  let onWaiting = [];
  let onGoing = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].status === 0) {
      onWaiting.push(list[i]);
    } else if (list[i].status === 1) {
      onGoing.push(list[i]);
    }
  }
  let filteredList = {};
  filteredList.onWaiting = onWaiting;
  filteredList.onGoing = onGoing;

  return filteredList;
};
export const getUserInfo = () => dispatch => {
  dispatch({ type: GET_USERINFO_PENDING });
  return getUerInfoAPI()
    .then(result => {
      console.log(result);
      if (result.data.success) {
        dispatch({
          type: GET_USERINFO_SUCCESS,
          payload: result.data.userInfo
        });
      } else {
        dispatch({
          type: GET_USERINFO_FAILURE
        });
      }
    })
    .catch(error => {
      dispatch({
        type: GET_USERINFO_FAILURE
      });
    });
};

export const getUserTravelInfo = () => dispatch => {
  dispatch({ type: GET_USERTRAVELINFO_PENDING });
  return getTravelInfoAPI()
    .then(res => {
      dispatch({
        type: GET_USERTRAVELINFO_SUCCESS,
        payload: res.data.travellist
      });
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: GET_USERTRAVELINFO_FAILURE
      });
    });
};
export const getUserOrderList = () => dispatch => {
  dispatch({ type: GET_USER_ORDERLIST_PENDING });
  return getUserOrderListAPI()
    .then(res => {
      dispatch({
        type: GET_USER_ORDERLIST_SUCCESS,
        payload: res.data.orderlist
      });
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: GET_USER_ORDERLIST_FAILURE
      });
    });
};

export const getUserApplyList = () => dispatch => {
  dispatch({ type: GET_USER_APPLYLIST_PENDING });
  return getUserApplyListAPI()
    .then(res => {
      dispatch({
        type: GET_USER_APPLYLIST_SUCCESS,
        payload: res.data.applylist
      });
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: GET_USER_APPLYLIST_FAILURE
      });
    });
};

export default handleActions(
  {
    [GET_USERINFO_PENDING]: (state, action) => {
      return {
        ...state,
        pending: true,
        error: false
      };
    },
    [GET_USERINFO_SUCCESS]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: false,
        userInfo: action.payload
      };
    },
    [GET_USERINFO_FAILURE]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: true
      };
    },
    [GET_USERTRAVELINFO_PENDING]: (state, action) => {
      return {
        ...state,
        pending: true,
        error: false
      };
    },
    [GET_USERTRAVELINFO_SUCCESS]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: false,
        travelInfo: action.payload
      };
    },
    [GET_USERTRAVELINFO_FAILURE]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: true
      };
    },
    [GET_USER_ORDERLIST_PENDING]: (state, action) => {
      return {
        ...state,
        pending: true,
        error: false
      };
    },
    [GET_USER_ORDERLIST_SUCCESS]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: false,
        orderList: statusFilter(action.payload)
      };
    },
    [GET_USER_ORDERLIST_FAILURE]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: true
      };
    },
    [GET_USER_APPLYLIST_PENDING]: (state, action) => {
      return {
        ...state,
        pending: true,
        error: false
      };
    },
    [GET_USER_APPLYLIST_SUCCESS]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: false,
        applyList: statusFilter(action.payload)
      };
    },
    [GET_USER_APPLYLIST_FAILURE]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: true
      };
    }
  },
  initialState
);
