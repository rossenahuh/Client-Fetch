import { handleActions } from 'redux-actions';
import axios from 'axios';
const serverEndpoint = 'https://server.fetcher.fun';
import asyncHelper from '../helpers/asyncStorage';

const GET_NOTICES_PENDING = 'GET_NOTICES_PENDING';
const GET_NOTICES_SUCCESS = 'GET_NOTICES_SUCCESS';
const GET_NOTICES_FAILURE = 'GET_NOTICES_FAILURE';

const initialState = {
  pending: false,
  error: false,
  noticeList: []
};

getNoticeListAPI = async () => {
  let userToken = await asyncHelper._getData('userToken');
  return axios.get(`${serverEndpoint}/notifications/list`, {
    headers: {
      authorization: 'JWT ' + userToken
    }
  });
};

export const getNoticeList = () => dispatch => {
  dispatch({ type: GET_NOTICES_PENDING });
  return getNoticeListAPI()
    .then(result => {
      console.log(result);
      if (result.data.notiList) {
        dispatch({
          type: GET_NOTICES_SUCCESS,
          payload: result.data.notiList
        });
      }
    })
    .catch(error => {
      dispatch({
        type: GET_NOTICES_FAILURE,
        payload: result.data.error
      });
      console.log(result.data.error);
    });
};

export default handleActions(
  {
    [GET_NOTICES_PENDING]: (state, action) => {
      return {
        ...state,
        pending: true,
        error: false
      };
    },
    [GET_NOTICES_SUCCESS]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: false,
        noticeList: action.payload
      };
    },
    [GET_NOTICES_FAILURE]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: true
      };
    }
  },
  initialState
);
