import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-community/async-storage';
import theme from '../../components/styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as messageActions from '../../modules/messages';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const axios = require('axios');

class OrderDetailScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderInfo: null,
      selectedImage: null,
      register_id: null,
      user_id: null,
      applierList: null
    };
  }

  componentDidMount = async () => {
    const order_id = this.props.navigation.getParam('order_id', 'error');
    if (order_id !== 'error') {
      axios
        .get(`https://server.fetcher.fun/orders/detail?order_id=${order_id}`)
        .then(result =>
          this.setState({
            orderInfo: result.data,
            selectedImage: result.data.imageUrls[0],
            register_id: result.data.requester.ID
          })
        );
    }

    let userToken = await AsyncStorage.getItem('userToken');

    axios
      .get(
        `https://server.fetcher.fun/orders/applierlist?order_id=${order_id}`,
        {
          headers: {
            authorization: 'JWT ' + userToken
          }
        }
      )
      .then(result => {
        // console.log('APPLIER LIST result !!!!::: ', result);
        this.setState({ applierList: result.data.applierlist });
      });

    AsyncStorage.getItem('userID').then(result => {
      console.log('Async Storage userID::: ', result);
      if (result) {
        this.setState({ user_id: parseInt(result) });
      } else {
        this.setState({ user_id: 0 });
      }
    });
  };

  _onApplyButtonPress = async () => {
    const orderID = this.props.navigation.getParam('order_id', 'error');
    if (orderID !== 'error') {
      let data = {
        order_id: orderID
      };
      let userToken = await AsyncStorage.getItem('userToken');
      axios
        .post('https://server.fetcher.fun/orders/addapplier', data, {
          headers: {
            Authorization: `JWT ${userToken}`
          }
        })
        .then(result => {
          if (result.data.success) {
            Alert.alert('Fetch', '지원이 완료되었습니다.');
          }
        });
    }
  };

  _onPressSendingDM = (applier_id, applier_name) => {
    this.props.MessageActions.createChannel(
      [applier_id.toString()],
      applier_name
    ).then(result => this.props.navigation.navigate('DMDetail'));
  };

  _onPressRequestButton = (applier_id, applier_name) => {
    Alert.alert('Fetch', `${applier_name}님께 직구를 요청하시겠습니까?`, [
      {
        text: '확인',
        onPress: async () => {
          const order_id = this.props.navigation.getParam('order_id', 'error');
          if (order_id !== 'error') {
            let userToken = await AsyncStorage.getItem('userToken');
            let data = {
              traveler_id: applier_id,
              order_id: order_id
            };
            axios
              .post('https://server.fetcher.fun/orders/pickfetcher', data, {
                headers: {
                  Authorization: `JWT ${userToken}`
                }
              })
              .then(result => {
                if (result.data.success) {
                  Alert.alert(
                    'Fetch',
                    `${applier_name}님이 구매자로 선택되었습니다.`
                  );
                }
              });
          }
        }
      },
      {
        text: '취소'
      }
    ]);
  };

  render() {
    const {
      orderInfo,
      selectedImage,
      register_id,
      user_id,
      applierList
    } = this.state;

    console.log('order detail screen user_id ::: ', typeof user_id);
    console.log('order detail screen register_id ::: ', register_id);
    console.log('order detail screen orderInfo ::: ', orderInfo);
    console.log('order detail screen applierList ::: ', applierList);

    const { navigation, isLogin } = this.props;
    return orderInfo &&
      register_id &&
      applierList !== null &&
      typeof user_id === 'number' ? (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.requester_container}>
          <Image
            style={styles.requester_image}
            source={{
              uri: orderInfo.requester.imageUrl
                ? orderInfo.requester.imageUrl
                : 'https://cdn4.iconfinder.com/data/icons/user-avatar-flat-icons/512/User_Avatar-04-512.png'
            }}
          />
          <Text style={styles.requester_name}>
            {orderInfo.requester.name} 님의 요청
          </Text>
          <Icon.Button
            name="comment"
            size={26}
            backgroundColor="transparent"
            iconStyle={{ marginRight: 0 }}
            color="white"
            onPress={() => {
              if (isLogin) {
                this.props.MessageActions.createChannel(
                  [orderInfo.requester.ID.toString()],
                  orderInfo.requester.name
                ).then(result => navigation.navigate('DMDetail'));
              } else {
                Alert.alert(
                  'fetch',
                  '로그인이 필요한 기능입니다. \n로그인 하시겠습니까?',
                  [
                    {
                      text: '로그인',
                      onPress: () => {
                        navigation.navigate('AuthRoot');
                      }
                    },
                    {
                      text: '취소'
                    }
                  ]
                );
              }
            }}
          />
        </View>
        <Image
          style={styles.representative_image}
          source={{
            uri: selectedImage
          }}
        />
        <View style={styles.image_selector}>
          {orderInfo.imageUrls.map((imageUrl, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => this.setState({ selectedImage: imageUrl })}
            >
              <Image
                style={styles.product_image}
                source={{
                  uri: imageUrl
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.text_container}>
          <Text style={styles.title}>{orderInfo.productName}</Text>
          <Text style={styles.normal_text}>{orderInfo.destination}</Text>
          <View style={styles.number_container}>
            <Text style={styles.number}>{orderInfo.quantity} 개 </Text>
            <Text style={styles.number}> {orderInfo.price} 원</Text>
          </View>
          <View style={styles.description_container}>
            <Text style={styles.description}>{orderInfo.description}</Text>
          </View>
        </View>
        {user_id === 0 ? null : user_id === register_id ? (
          <View style={styles.applier_list_container}>
            <View style={styles.applier_list_title_container}>
              <Text style={styles.applier_list_title}>지원현황</Text>
              <Ionicons
                name="ios-arrow-forward"
                size={28}
                color={theme.MAIN_THEME_COLOR}
              />
            </View>
            {applierList.length ? (
              <ScrollView
                horizontal={true}
                contentContainerStyle={styles.appliers_container}
              >
                {applierList.map((applier, index) => (
                  <View key={index} style={styles.applier_container}>
                    <Image
                      style={styles.applier_image}
                      source={{ uri: applier.travelerImageUrl }}
                    />
                    <Text style={styles.applier_name}>
                      {applier.travelerName}
                    </Text>
                    <TouchableOpacity
                      style={styles.talk_to_applier_button}
                      onPress={() =>
                        this._onPressSendingDM(
                          applier.traveler_id,
                          applier.travelerName
                        )
                      }
                    >
                      <Text style={styles.talk_to_applier_button_text}>
                        대화 하기
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        this._onPressRequestButton(
                          applier.traveler_id,
                          applier.travelerName
                        )
                      }
                      style={styles.pick_button}
                    >
                      <Text style={styles.pick_button_text}>직구 요청하기</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.normal_text}>아직 지원자가 없습니다.</Text>
            )}
          </View>
        ) : (
          <View style={styles.apply_button_container}>
            <TouchableOpacity
              style={styles.apply_button}
              onPress={this._onApplyButtonPress}
            >
              <Text style={styles.button_text}>지원하기</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    ) : (
      <View style={styles.loading_container}>
        <ActivityIndicator size="small" color={theme.MAIN_THEME_COLOR} />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  MessageActions: bindActionCreators(messageActions, dispatch)
});

const mapStateToProps = ({ auth, messages }) => ({
  isLogin: auth.isLogin,
  messages: messages
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetailScreen);

const styles = EStyleSheet.create({
  container: {
    alignItems: 'center',
    padding: '20rem',
    paddingBottom: '50rem'
  },
  loading_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  requester_container: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.MAIN_THEME_COLOR,
    borderTopLeftRadius: '3rem',
    borderTopRightRadius: '3rem',
    padding: '5rem'
  },
  requester_image: {
    width: '16%',
    aspectRatio: 1,
    marginRight: '10rem'
  },
  requester_name: {
    fontSize: '20rem',
    fontWeight: '600',
    color: 'white',
    marginRight: '35rem'
  },
  representative_image: {
    width: '90%',
    aspectRatio: 3 / 2,
    marginBottom: '5rem'
  },
  image_selector: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: '8rem'
  },
  product_image: {
    width: '50rem',
    aspectRatio: 1
  },
  text_container: {
    width: '90%',
    padding: '5rem'
  },
  number_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: '8rem',
    marginRight: '5rem'
  },
  title: {
    color: theme.MAIN_TEXT_COLOR,
    fontSize: '18rem',
    fontWeight: '600',
    marginBottom: '6rem'
  },
  normal_text: {
    color: theme.MAIN_TEXT_COLOR,
    fontSize: '15rem',
    marginBottom: '5rem'
  },
  number: {
    color: theme.MAIN_TEXT_COLOR,
    fontSize: '16rem',
    fontWeight: '600',
    marginBottom: '5rem'
  },
  description_container: {
    backgroundColor: theme.BACKGROUND_COLOR,
    borderRadius: '3rem',
    padding: '10rem',
    marginBottom: '8rem'
  },
  description: {
    color: theme.MAIN_TEXT_COLOR,
    fontSize: '15rem',
    paddingBottom: '30rem'
  },
  applier_list_container: {
    width: '90%',
    padding: '5rem'
  },
  applier_list_title_container: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5rem'
  },
  applier_list_title: {
    color: theme.MAIN_TEXT_COLOR,
    fontSize: '18rem',
    fontWeight: '600',
    marginRight: '8rem'
  },
  applier_container: {
    alignItems: 'center',
    borderColor: theme.BORDER_COLOR,
    borderWidth: '0.5rem',
    borderRadius: '3rem',
    padding: '16rem',
    marginRight: '8rem'
  },
  applier_image: {
    width: '50rem',
    aspectRatio: 1,
    marginBottom: '7rem'
  },
  applier_name: {
    color: theme.MAIN_TEXT_COLOR,
    fontWeight: '600',
    marginBottom: '5rem'
  },
  talk_to_applier_button: {
    borderColor: theme.MAIN_THEME_COLOR,
    borderWidth: '0.5rem',
    borderRadius: '5rem',
    padding: '6rem',
    marginBottom: '4rem'
  },
  talk_to_applier_button_text: {
    color: theme.MAIN_THEME_COLOR,
    fontWeight: '600'
  },
  pick_button: {
    backgroundColor: theme.MAIN_THEME_COLOR,
    borderRadius: '5rem',
    padding: '6rem'
  },
  pick_button_text: {
    color: 'white',
    fontWeight: '600'
  },
  apply_button_container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '24rem'
  },
  apply_button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.35,
    height: height * 0.045,
    backgroundColor: theme.MAIN_THEME_COLOR,
    borderRadius: 50
  },
  button_text: {
    fontSize: '15rem',
    fontWeight: '600',
    color: 'white'
  }
});
