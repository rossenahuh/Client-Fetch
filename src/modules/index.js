import { combineReducers } from 'redux';
import auth from './auth';
import orders from './orders';
import travels from './travels';
import messages from './messages';
import notices from './notices';
import mypage from './mypage';

export default combineReducers({
  auth,
  orders,
  travels,
  messages,
  notices,
  mypage
});
