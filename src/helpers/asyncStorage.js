import AsyncStorage from '@react-native-community/async-storage';

const _isLogin = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('userToken')
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};
const _storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(error);
  }
};

const _getData = key => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};
const _removeData = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
  console.log('token removed.');
};

const _clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error(error);
  }
  console.log('AsyncStorage cleared.');
};

//underbar : class 의 private 함수 를 만들때 씀.
export default {
  _isLogin,
  _storeData,
  _getData,
  _removeData,
  _clearAsyncStorage
};
