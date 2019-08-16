import React, { Component } from 'react';
import AppNavigator from './src/navigation';
import firebase from 'react-native-firebase';
import * as authActions from './src/modules/auth';
import * as messageActions from './src/modules/messages';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
var PushNotification = require('react-native-push-notification');
import { Platform, AppState } from 'react-native';
import SendBird from 'sendbird';
import NavigationService from './src/NavigationService';
import type, { RemoteMessage } from 'react-native-firebase';
const APP_ID = '76595710-4C8C-4E6E-992A-155562E6D3F3'; // sample

class App extends Component {
  sbConnect = (userId, userName, userProfile) => {
    let sb = new SendBird({ appId: APP_ID });
    return new Promise((resolve, reject) => {
      sb.connect(userId, (user, error) => {
        if (error) {
          reject('SendBird Login Failed.');
        } else {
          console.log('connected');
        }
      });
    });
  };
  componentDidMount = () => {
    firebase.messaging().onTokenRefresh(fcmToken => {
      console.log('fcmToken::::::::::', fcmToken);
      // this.props.AuthActions.setFcmToken(fcmToken);
    });

    firebase.notifications().onNotificationOpened(notif => {
      console.log(notif.notification);
      if (notif.notification.data.sendbird) {
        this.sbConnect(notif.notification.data.sendbird.recipient.id);
        this.props.MessageActions.setChannel(
          notif.notification.data.sendbird.channel
        );
        NavigationService.navigate('DMDetail');
      } else if (notif.notification.data.status) {
        NavigationService.navigate('OrderDetail', {
          order_id: notif.notification.data.status_id
        });
      } else {
        this.props.MessageActions.setChannelWithUrl(
          notif.notification.ios.category
        ).then(() => {
          NavigationService.navigate('DMDetail');
        });
      }
    });
  };
  componentDidUpdate = prevProps => {
    if (
      (!prevProps.auth.sbConnected && this.props.auth.sbConnected) ||
      prevProps.messages.channel !== this.props.messages.channel
    ) {
      AppState.addEventListener('change', this._handleAppStateChange);
      this.addListner(prevProps.messages, this.props.messages);
    }
    if (prevProps.messages.channel !== this.props.messages.channel) {
      console.log('add msg listener', this.props.messages.channel);
      this.addListner(prevProps.messages, this.props.messages);
    }
  };
  componentWillUnmount = () => {
    console.log('app will UNMOUNT');
    AppState.removeEventListener('change', this._handleAppStateChange);
    // this.onTokenRefreshListener();
    // this.onMessageListener();
  };
  messageListener = () => {
    console.log("messageListner's on");
    firebase.messaging().onMessage(message => {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log(message);
      if (Platform.OS === 'ios') {
        const text = message.data.message;
        const payload = JSON.parse(message.data.sendbird);
        // PushNotification.localNotification({
        //   title: 'New Message', // (optional)
        //   message: text // (required)
        // });
        const localNotification = new firebase.notifications.Notification({
          show_in_foreground: true
        })
          .setNotificationId(message.messageId)
          .setTitle('New message')
          // .setSubtitle(`Unread message: ${payload.unread_message_count}`)
          .setBody(text)
          .setData(payload);
        firebase.notifications().displayNotification(localNotification);
      }
    });
  };
  _handleAppStateChange = nextAppState => {
    const sb = SendBird.getInstance();
    if (sb) {
      if (nextAppState === 'active') {
        // if (Platform.OS === 'ios') {
        //   PushNotificationIOS.setApplicationIconBadgeNumber(0);
        // }
        console.log('app is into foreground');
        sb.setForegroundState();
        // this.appStateHandler.notify();
      } else if (nextAppState === 'background') {
        this.messageListener();
        console.log('app is into background');
        sb.setBackgroundState();
      }
    }
  };

  addListner = (prevState, state) => {
    if (this.props.auth.isLogin) {
      console.log('this is app.js checking isLogin', this.props.auth.isLogin);
      this.props.MessageActions.createMessageHandler(prevState, state);
    }
  };

  render() {
    return (
      <AppNavigator
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}
const mapStateToProps = ({ auth, messages }) => ({
  auth: auth,
  messages: messages
});
const mapDispatchToProps = dispatch => ({
  AuthActions: bindActionCreators(authActions, dispatch),
  MessageActions: bindActionCreators(messageActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
// const messaging = firebase.messaging();
// messaging
//   .hasPermission()
//   .then(enabled => {
//     if (enabled) {
//       messaging
//         .getToken()
//         .then(token => {
//           console.log('firebase token::::::', token);
//         })
//         .catch(error => {
//           console.error(error);
//         });
//     } else {
//       messaging
//         .requestPermissions()
//         .then(() => {})
//         .catch(error => {
//           console.error(error);
//         });
//     }
//   })
//   .catch(error => {
//     console.error(error);
//   });

// // messaging.setBackgroundMessageHandler(function(payload) {
// //   const title = 'fetch';
// //   const options = {
// //     body: payload.data.status
// //   };
// //   return self.registration.showNotification(title, options);
// // });

firebase.notifications().onNotification(notification => {
  const { title, body } = notification;
  console.log('notification:::::::::', notification);
  const clicked = notification.userInteraction;
  PushNotification.localNotification({
    title: title,
    message: body
  });
});
// firebase.messaging().onMessage(message => {
//   console.log(message);
//   PushNotification.localNotification({
//     // title: 'My Notification Title', // (optional)
//     message: '새로운 메시지가 도착했습니다.',
//     category: '5'
//   });
// });
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification);

    // process the notification

    // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
    // notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  onMessage: function(message) {
    console.log('MESSAGE:', message);
  },

  // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
  // senderID: 'YOUR GCM (OR FCM) SENDER ID',

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  requestPermissions: true
});
