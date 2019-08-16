import { handleActions } from 'redux-actions';
import fetchHelper from '../helpers/fetch';

const GET_LIST_MAIN_PENDING = 'travels/GET_LIST_MAIN_PENDING';
const GET_LIST_MAIN_SUCCESS = 'travels/GET_LIST_MAIN_SUCCESS';
const GET_LIST_MAIN_FAILIRE = 'travels/GET_LIST_MAIN_FAILIRE';

const GET_LIST_PENDING = 'travels/GET_LIST_PENDING';
const GET_LIST_SUCCESS = 'travels/GET_LIST_SUCCESS';
const GET_LIST_FAILIRE = 'travels/GET_LIST_FAILIRE';

export const getMainTravelList = max => async dispatch => {
  dispatch({ type: GET_LIST_MAIN_PENDING });

  return await fetchHelper
    .getTravelListAPI(max)
    .then(result => {
      dispatch({
        type: GET_LIST_MAIN_SUCCESS,
        payload: result.data.travelList
      });
    })
    .catch(error => {
      dispatch({
        type: GET_LIST_MAIN_FAILIRE,
        payload: error
      });
    });
};

export const getTravelList = () => async dispatch => {
  dispatch({ type: GET_LIST_PENDING });

  return await fetchHelper
    .getTravelListAPI()
    .then(result => {
      dispatch({
        type: GET_LIST_SUCCESS,
        payload: result.data.travelList
      });
    })
    .catch(error => {
      dispatch({
        type: GET_LIST_FAILIRE,
        payload: error
      });
    });
};

const initialState = {
  errorMain: false,
  pendingMain: false,
  travelListMain: [],
  error: false,
  pending: false,
  travelList: []
};

export default handleActions(
  {
    [GET_LIST_MAIN_PENDING]: (state, action) => ({
      ...state,
      pendingMain: true,
      errorMain: false
    }),
    [GET_LIST_MAIN_SUCCESS]: (state, action) => ({
      ...state,
      pendingMain: false,
      travelListMain: action.payload
    }),
    [GET_LIST_MAIN_FAILIRE]: (state, action) => ({
      ...state,
      pendingMain: false,
      errorMain: true
    }),
    [GET_LIST_PENDING]: (state, action) => ({
      ...state,
      pending: true,
      error: false
    }),
    [GET_LIST_SUCCESS]: (state, action) => ({
      ...state,
      pending: false,
      travelList: action.payload
    }),
    [GET_LIST_FAILIRE]: (state, action) => ({
      ...state,
      pending: false,
      error: true
    })
  },
  initialState
);
