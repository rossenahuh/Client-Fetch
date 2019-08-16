import firebase from 'react-native-firebase';
import SendBird from 'sendbird';
import asyncHelper from './asyncStorage';
const APP_ID = '76595710-4C8C-4E6E-992A-155562E6D3F3';
import { Platform } from 'react-native';
import setSbConnection from '../modules/auth';
// import store from '../store';
// const state = store.getState();
const sbRegisterPushToken = fcmToken => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    if (sb) {
      if (Platform.OS === 'ios') {
        firebase
          .messaging()
          .ios.getAPNSToken()
          .then(token => {
            console.log('apns token::::::', token);
            if (token) {
              sb.registerAPNSPushTokenForCurrentUser(token, (result, error) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log(result);
                  console.log('apnsToken resistered');
                  resolve();
                }
              });
            } else {
              resolve();
            }
          })
          .catch(error => {
            reject(error);
          });
      }
    } else {
      console.log('SendBird is not initialized');
    }
  });
};

export const sbUnregisterPushToken = () => {
  return new Promise((resolve, reject) => {
    firebase
      .messaging()
      .getToken()
      .then(token => {
        const sb = SendBird.getInstance();
        if (sb) {
          if (Platform.OS === 'ios') {
            firebase
              .messaging()
              .ios.getAPNSToken()
              .then(token => {
                if (token !== null) {
                  sb.unregisterAPNSPushTokenForCurrentUser(
                    token,
                    (result, error) => {
                      if (!error) {
                        resolve();
                      } else reject(error);
                    }
                  );
                } else {
                  resolve();
                }
              })
              .catch(err => reject(err));
          }
        } else {
          reject('SendBird is not initialized');
        }
      })
      .catch(err => reject(err));
  });
};

const updateUserInfoWithUserProfile = (userName, userProfile) => {
  let sb = SendBird.getInstance();
  return new Promise((resolve, reject) => {
    sb.updateCurrentUserInfo(userName, userProfile, function(response, error) {
      if (error) {
        reject('Update profile failed.');
      } else {
        console.log('user', response);
        asyncHelper._storeData('user', JSON.stringify(response), () => {
          resolve(response);
        });
        console.log('Update profile succeeded.');
      }
    });
  });
};

const updateUserInfo = userName => {
  let sb = SendBird.getInstance();
  return new Promise((resolve, reject) => {
    sb.updateCurrentUserInfo(userName, null, function(response, error) {
      if (error) {
        reject('Update profile failed.');
      } else {
        console.log('user', response);
        asyncHelper._storeData('user', JSON.stringify(response), () => {
          resolve(response);
        });
        console.log('Update profile succeeded.');
        // sbRegisterPushToken();
      }
    });
  });
};
const sbConnect = (userId, userName, userProfile, fcmToken) => {
  console.log(
    'sbconnect:::::::::::::',
    userId,
    userName,
    userProfile,
    fcmToken
  );
  let sb = new SendBird({ appId: APP_ID });
  return new Promise((resolve, reject) => {
    sb.connect(userId, (user, error) => {
      if (error) {
        console.log(error);
        reject('SendBird Login Failed.');
      } else {
        console.log('connected');
        resolve(true);
        sbRegisterPushToken(fcmToken)
          .then(res => {})
          .catch(err => {});
        if (userProfile) {
          updateUserInfoWithUserProfile(userName, userProfile);
        } else {
          updateUserInfo(userName);
        }
      }
    });
  });
};

const sbDisconnect = () => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    if (sb) {
      sb.disconnect(() => {
        resolve(null);
      });
    } else {
      resolve(null);
    }
  });
};

export default {
  sbRegisterPushToken,
  sbUnregisterPushToken,
  updateUserInfoWithUserProfile,
  updateUserInfo,
  sbDisconnect,
  sbConnect
};
