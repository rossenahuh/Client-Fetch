//ducks pattern에 따른 redux

//FSA 규칙을 따르는 액션 객체 생성하는 함수
import { handleActions } from 'redux-actions';
import fetchHelper from '../helpers/fetch';

//액션 타입정의
const GET_LIST_PENDING = 'orders/GET_LIST_PENDING';
const GET_LIST_SUCCESS = 'orders/GET_LIST_SUCCESS';
const GET_LIST_FAILURE = 'orders/GET_LIST_FAILURE';

const GET_LIST_MAIN_PENDING = 'orders/GET_LIST_MAIN_PENDING';
const GET_LIST_MAIN_SUCCESS = 'orders/GET_LIST_MAIN_SUCCESS';
const GET_LIST_MAIN_FAILURE = 'orders/GET_LIST_MAIN_FAILURE';

//액션 함수 정의
//컴포넌트에 redux를 connect해서 불러와 사용하게 되므로 export 필수
//createAction으로 refactoring 가능
// export const getNewOrderList = () => ({ type: GET_NEW_ORDER_LIST });와 동일
export const getOrderList = () => async dispatch => {
  dispatch({ type: GET_LIST_PENDING });

  return await fetchHelper
    .getOrderListAPI()
    .then(result => {
      dispatch({
        type: GET_LIST_SUCCESS,
        payload: result.data.orderList
      });
    })
    .catch(error => {
      dispatch({
        type: GET_LIST_FAILURE,
        payload: error
      });
    });
};

export const getMainOrderList = max => async dispatch => {
  dispatch({ type: GET_LIST_MAIN_PENDING });

  return await fetchHelper
    .getOrderListAPI(max)
    .then(result => {
      dispatch({
        type: GET_LIST_MAIN_SUCCESS,
        payload: result.data.orderList
      });
    })
    .catch(error => {
      dispatch({
        type: GET_LIST_MAIN_FAILURE,
        payload: error
      });
    });
};

//initial state defineb
const initialState = {
  errorMain: false,
  pendingMain: false,
  orderListMain: [],
  error: false,
  pending: false,
  orderList: []
};

//handleActions로 reducer 함수 작성
export default handleActions(
  {
    [GET_LIST_PENDING]: (state, action) => ({
      ...state,
      pending: true,
      error: false
    }),
    [GET_LIST_SUCCESS]: (state, action) => ({
      ...state,
      pending: false,
      orderList: action.payload
    }),
    [GET_LIST_FAILURE]: (state, action) => ({
      ...state,
      pending: false,
      error: true
    }),
    [GET_LIST_MAIN_PENDING]: (state, action) => ({
      ...state,
      pendingMain: true,
      errorMain: false
    }),
    [GET_LIST_MAIN_SUCCESS]: (state, action) => ({
      ...state,
      pendingMain: false,
      orderListMain: action.payload
    }),
    [GET_LIST_MAIN_FAILURE]: (state, action) => ({
      ...state,
      pendingMain: false,
      errorMain: true
    })
  },
  initialState
);
