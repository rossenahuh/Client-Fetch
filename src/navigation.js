import { Platform } from 'react-native';
import React from 'react';
import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import MainScreen from './screens/Main/MainScreen';
import DMScreen from './screens/DMs/DMScreen';
import DMDetailScreen from './screens/DMs/DMDetailScreen';
import OrderScreen from './screens/Orders/OrderScreen';
import OrderDetailScreen from './screens/Orders/OrderDetailScreen';
import OrderRequestScreen from './screens/Orders/OrderReqestScreen';
import TravelScreen from './screens/Travels/TravelScreen';
import TravelDetailScreen from './screens/Travels/TravelDetailScreen';
import TravelRegisterScreen from './screens/Travels/TravelRegisterScreen';
import NoticeScreen from './screens/Notice/NoticeScreen';
import MyTravelDetailScreen from './screens/Mypage/MyTravelDetailScreen';
import OnGoingScreen from './screens/Mypage/OnGoingScreen';
import OnWaitingScreen from './screens/Mypage/OnWaitingScreen';
import AuthRootScreen from './screens/Auth/AuthRootScreen';
import SignUpScreen from './screens/Auth/SignUpScreen';
import SignUpDetailScreen from './screens/Auth/SignUpDetailScreen';
import SignUpWithSocialScreen from './screens/Auth/SignUpWithSocialScreen';
import AuthPolicyScreen from './screens/Auth/AuthPolicyScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AppStactNavigator = createStackNavigator({
  Main: {
    screen: MainScreen,
    navigationOptions: () => ({
      headerBackTitle: null
    })
  },
  DMs: {
    screen: DMScreen,
    navigationOptions: () => ({
      title: 'Direct'
    })
  },
  DMDetail: {
    screen: DMDetailScreen,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam('nickname')
    })
  }
});

const OrderStackNavigator = createStackNavigator({
  Order: {
    screen: OrderScreen
  },
  OrderDetail: {
    screen: OrderDetailScreen
  },
  OrderRequest: {
    screen: OrderRequestScreen
  }
});

const TravelStackNavigator = createStackNavigator({
  Travel: {
    screen: TravelScreen
  },
  TravelDetail: {
    screen: TravelDetailScreen
  },
  TravelRegister: {
    screen: TravelRegisterScreen
  }
});
const NoticeStackNavigator = createStackNavigator({
  Notice: {
    screen: NoticeScreen
  }
});
const SignUpStackNavigator = createStackNavigator(
  {
    SignUp: {
      screen: SignUpScreen
    },
    SignUpDetail: {
      screen: SignUpDetailScreen
    },
    SignUpWithSocial: {
      screen: SignUpWithSocialScreen
    },
    AuthPolicy: {
      screen: AuthPolicyScreen
    }
  },
  { headerMode: 'screen' }
);

const MyDetailTabNavigator = createMaterialTopTabNavigator(
  {
    onWaiting: {
      screen: OnWaitingScreen,
      navigationOptions: () => ({
        title: '대기중'
      })
    },
    onGoing: {
      screen: OnGoingScreen,
      navigationOptions: () => ({
        title: '진행중'
      })
    }
  },
  {
    swipeEnabled: true,
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: '#f7f7f7',
      labelStyle: {
        fontWeight: '600'
      },
      style: {
        backgroundColor: '#5bb487'
      },
      indicatorStyle: {
        backgroundColor: 'white'
      }
    }
  }
);
const AuthRootStackNavigator = createStackNavigator(
  {
    AuthRoot: {
      screen: AuthRootScreen
    },
    MypageDetail: {
      screen: MyDetailTabNavigator,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('detailsOf')
      })
    },
    MyTravelDetail: {
      screen: MyTravelDetailScreen,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('detailsOf')
      })
    }
  },
  { initialRouteName: 'AuthRoot' }
);
const AppAuthSwitchNavigator = createSwitchNavigator({
  AuthRoot: {
    screen: AuthRootStackNavigator
  },
  SignUp: {
    screen: SignUpStackNavigator
  }
});

const AppTapNavigator = createMaterialTopTabNavigator(
  {
    Home: {
      screen: AppStactNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" size={20} color={tintColor} />
        )
      }
    },
    Order: {
      screen: OrderStackNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="tags" size={20} color={tintColor} />
        )
      }
    },
    Travel: {
      screen: TravelStackNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="card-travel" size={22} color={tintColor} />
        )
      }
    },

    Notice: {
      screen: NoticeStackNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="bell" size={20} color={tintColor} />
        )
      }
    },
    Mypage: {
      screen: AppAuthSwitchNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="smile-o" size={20} color={tintColor} />
        )
      }
    }
  },
  {
    animationEnabled: true,
    swipeEnabled: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      style: {
        ...Platform.select({
          ios: {
            backgroundColor: 'white'
          },
          android: {
            backgroundColor: 'white'
          }
        })
      },
      iconStyle: { height: 35 },
      activeTintColor: '#5bb487',
      inactiveTintColor: '#d1cece',
      upperCaseLabel: false,
      showLabel: false,
      showIcon: true
    }
  }
);

const AppNavigator = createAppContainer(AppTapNavigator);

export default AppNavigator;

//함수로 묶어주면.. props에 접근할수있지않을까?
