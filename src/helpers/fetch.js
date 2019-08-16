import axios from 'axios';
import { getOrderList } from '../modules/orders';
import asyncHelper from './asyncStorage';
const serverEndpoint = 'https://server.fetcher.fun';

const getCheckIdAPI = async id => {
  console.log('getCheckIdAPI triggered', id);
  try {
    return await axios.get(
      `${serverEndpoint}/users/signup/checkemail?email=${id}`
    );
  } catch (error) {
    console.error(error);
  }
};

postSignUpAPI = data => {
  console.log(data);
  return axios.post(`${serverEndpoint}/users/signup/register`, data);
};

getGoogleSignUpAPI = () => {
  return axios.get(`${serverEndpoint}/auth/google`);
};

getOrderListAPI = max => {
  if (max) {
    return axios.get(`${serverEndpoint}/orders/list?max=${max}`);
  }
  return axios.get(`${serverEndpoint}/orders/list`);
};

postFcmToken = async fcmToken => {
  let userToken = await asyncHelper._getData('userToken');
  return axios
    .post(`${serverEndpoint}/firebase/token`, fcmToken, {
      headers: {
        authorization: 'JWT ' + userToken
      }
    })
    .then(result => console.log(result));
};

deleteFcmToken = async () => {
  let userToken = await asyncHelper._getData('userToken');
  console.log('deleting token in db', userToken);
  return axios.delete(`${serverEndpoint}/firebase/delete`, {
    headers: {
      authorization: 'JWT ' + userToken
    }
  });
};
getTravelListAPI = max => {
  if (max) {
    return axios.get(`${serverEndpoint}/travels/list?max=${max}`);
  }
  return axios.get(`${serverEndpoint}/travels/list`);
};

export default {
  getCheckIdAPI,
  postSignUpAPI,
  getGoogleSignUpAPI,
  getOrderListAPI,
  postFcmToken,
  getTravelListAPI,
  deleteFcmToken
};

//axios wrapper
