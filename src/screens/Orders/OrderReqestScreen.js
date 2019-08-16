import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import CustomDatePicker from '../../components/common/DatePicker';
import ImagePicker from 'react-native-image-picker';
import CountrySelector from '../../components/common/CountrySelector';
import theme from '../../components/styles/theme';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ordersActions from '../../modules/orders';

import axios from 'axios';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export class OrderReqestScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productName: null,
      nation: null,
      description: null,
      referenceUrl: null,
      isUrlValid: true,
      quantity: null,
      isQuantityValid: true,
      price: null,
      isPriceValid: true,
      uploadedImage: null,
      due: null,
      selectedIndex: 0
    };

    this.urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  }

  _checkUrl = () => {
    if (!this.urlPattern.test(this.state.referenceUrl)) {
      this.setState({ isUrlValid: false });
    } else {
      this.setState({ isUrlValid: true });
    }
  };

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex: selectedIndex });
  };

  _updateDue = date => {
    this.setState({ due: date });
  };

  _getCountryValue = value => {
    this.setState({
      nation: value
    });
  };

  _checkQuantityType = () => {
    this.setState({ isQuantityValid: true });
    let { quantity } = this.state;

    let numbers = '0123456789';

    for (let i = 0; i < quantity.length; i++) {
      if (numbers.indexOf(quantity[i]) === -1) {
        this.setState({ isQuantityValid: false });
      }
    }
  };

  _checkPriceType = () => {
    this.setState({ isPriceValid: true });
    let { price } = this.state;

    let numbers = '0123456789';

    for (let i = 0; i < price.length; i++) {
      if (numbers.indexOf(price[i]) === -1) {
        this.setState({ isPriceValid: false });
      }
    }
  };

  _refreshFunction = () => {};

  _handleChoosePhoto = () => {
    const options = {};
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({
          uploadedImage: response
        });
      }
    });
  };

  _postOrder = async () => {
    let {
      productName,
      nation,
      description,
      referenceUrl,
      quantity,
      price,
      uploadedImage,
      due,
      selectedIndex,
      isUrlValid,
      isQuantityValid,
      isPriceValid
    } = this.state;

    if (
      !productName ||
      !nation ||
      !description ||
      !quantity ||
      !price ||
      !uploadedImage ||
      !due ||
      !isPriceValid ||
      !isUrlValid ||
      !isQuantityValid
    ) {
      Alert.alert('Fetch', '빈 칸없이 모두 입력해주세요', [{ text: '확인' }]);
    } else {
      const data = new FormData();

      data.append('productName', productName);
      data.append('destination', nation);
      data.append('description', description);
      data.append('quantity', quantity);
      data.append('referenceUrl', referenceUrl);
      data.append('price', price);
      data.append('preferParcel', selectedIndex === 0 ? true : false);
      data.append('due', due);
      data.append('uploadedImage', {
        name: uploadedImage.fileName,
        type: uploadedImage.type,
        uri:
          Platform.OS === 'android'
            ? uploadedImage.uri
            : uploadedImage.uri.replace('file://', '')
      });

      // console.log('form data ::: ', data);

      let userToken = await AsyncStorage.getItem('userToken');

      axios
        .post('https://server.fetcher.fun/orders/create', data, {
          headers: {
            'content-type': 'multipart/form-data',
            Authorization: `JWT ${userToken}`
          }
        })
        .then(result => {
          if (result.data.success) {
            Alert.alert('Fetch', '요청 등록이 완료되었습니다', [
              {
                text: '확인',
                onPress: () => {
                  this.props.OrdersActions.getOrderList();
                  this.props.OrdersActions.getMainOrderList(5);
                  this.props.navigation.navigate('Order');
                }
              }
            ]);
          }
        });
    }
  };

  render() {
    const {
      due,
      uploadedImage,
      selectedIndex,
      isUrlValid,
      isQuantityValid,
      isPriceValid
    } = this.state;
    const transactionMethods = ['택배거래', '직거래'];

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <KeyboardAvoidingView behavior="padding" enabled>
          <View style={styles.function_container}>
            <Text style={styles.title}>상품 이미지</Text>
            {uploadedImage ? (
              <TouchableOpacity
                style={styles.photo_container}
                onPress={this._handleChoosePhoto}
              >
                <Image
                  source={{ uri: uploadedImage.uri }}
                  style={styles.photo}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.fake_photo_container}
                onPress={this._handleChoosePhoto}
              >
                <Icon name="plus-square-o" size={30} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.function_container}>
            <Text style={styles.title}>상품명</Text>
            <TextInput
              multiline={true}
              style={styles.product_name_input}
              onChangeText={text => this.setState({ productName: text })}
            />
          </View>
          <View style={styles.function_container}>
            <Text style={styles.title}>국가</Text>
            <CountrySelector getCountryValue={this._getCountryValue} />
          </View>
          <View style={styles.function_container}>
            <Text style={styles.title}>수량</Text>
            <TextInput
              style={styles.number_text_input}
              onChangeText={text => this.setState({ quantity: text })}
              onEndEditing={this._checkQuantityType}
            />
            {!isQuantityValid ? (
              <Text style={styles.warning_text}>숫자를 입력해주세요</Text>
            ) : (
              <Text style={styles.warning_text} />
            )}
          </View>
          <View style={styles.function_container}>
            <Text style={styles.title}>금액 (수고비를 포함한 금액)</Text>
            <TextInput
              style={styles.number_text_input}
              onChangeText={text => this.setState({ price: text })}
              onEndEditing={this._checkPriceType}
            />
            {!isPriceValid ? (
              <Text style={styles.warning_text}>숫자를 입력해주세요</Text>
            ) : (
              <Text style={styles.warning_text} />
            )}
          </View>
          <View style={styles.function_container}>
            <Text style={styles.title}>거래 방법</Text>
            <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={selectedIndex}
              buttons={transactionMethods}
              containerStyle={styles.transaction_method}
              selectedButtonStyle={styles.selected_transaction_method}
            />
          </View>
          <View style={styles.function_container}>
            <Text style={styles.title}>요청 만료일</Text>
            <View style={styles.due_container}>
              {due ? (
                <TextInput
                  style={styles.due_input}
                  placeholder={due}
                  placeholderTextColor={theme.SUB_TEXT_COLOR}
                />
              ) : (
                <TextInput style={styles.due_input} />
              )}
              <CustomDatePicker
                updateDateFunc={this._updateDue}
                minimumDate={new Date()}
              />
            </View>
          </View>
          <View style={styles.function_container}>
            <Text style={styles.title}>상품 상세설명</Text>
            <TextInput
              multiline={true}
              style={styles.description_input}
              onChangeText={text => this.setState({ description: text })}
            />
          </View>
          <View style={styles.function_container}>
            <Text style={styles.title}>참고 url</Text>
            <TextInput
              style={styles.url_input}
              onChangeText={text => this.setState({ referenceUrl: text })}
              onEndEditing={this._checkUrl}
            />
            {!isUrlValid ? (
              <Text style={styles.warning_text}>올바른 url을 입력해주세요</Text>
            ) : (
              <Text style={styles.warning_text} />
            )}
          </View>
          <View style={styles.button_container}>
            <TouchableOpacity
              style={styles.register_button}
              onPress={this._postOrder}
            >
              <Text style={styles.button_text}>등록하기</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  OrdersActions: bindActionCreators(ordersActions, dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(OrderReqestScreen);

const styles = EStyleSheet.create({
  container: {
    padding: '22rem'
  },
  function_container: {
    marginBottom: '16rem'
  },
  photo_container: {
    width: width * 0.3,
    aspectRatio: 1
  },
  fake_photo_container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.3,
    aspectRatio: 1,
    borderRadius: '8rem',
    backgroundColor: '#b1b1b150'
  },
  photo: { width: '100%', height: '100%', borderRadius: '8rem' },
  product_name_input: {
    width: '60%',
    height: '28rem',
    color: theme.SUB_TEXT_COLOR,
    borderBottomColor: theme.BORDER_COLOR,
    borderBottomWidth: '0.5rem'
  },
  number_text_input: {
    width: '40%',
    height: '28rem',
    borderBottomColor: theme.BORDER_COLOR,
    color: theme.SUB_TEXT_COLOR,
    borderBottomWidth: '0.5rem'
  },
  description_input: {
    width: '80%',
    height: '56rem',
    color: theme.SUB_TEXT_COLOR,
    borderColor: theme.BORDER_COLOR,
    borderWidth: '0.5rem',
    borderRadius: '3rem',
    padding: '5rem'
  },
  url_input: {
    width: '90%',
    height: '28rem',
    color: theme.SUB_TEXT_COLOR,
    borderBottomColor: theme.BORDER_COLOR,
    borderBottomWidth: '0.5rem'
  },
  due_container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  due_input: {
    width: '50%',
    height: '28rem',
    borderBottomColor: theme.BORDER_COLOR,
    borderBottomWidth: '0.5rem',
    marginRight: '8rem'
  },
  title: {
    color: theme.MAIN_TEXT_COLOR,
    fontSize: '16rem',
    fontWeight: '600',
    marginBottom: '8rem'
  },
  pick_photo_text: {
    color: theme.SUB_TEXT_COLOR
  },
  warning_text: {
    color: theme.WARNING_TEXT_COLOR,
    fontSize: '12rem',
    marginTop: '3rem'
  },
  transaction_method: {
    width: '70%',
    height: '32rem',
    color: theme.MAIN_THEME_COLOR
  },
  selected_transaction_method: {
    height: '32rem',
    backgroundColor: theme.MAIN_THEME_COLOR
  },
  button_container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  register_button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.3,
    height: height * 0.04,
    backgroundColor: theme.MAIN_THEME_COLOR,
    borderRadius: 50,
    marginTop: '12rem'
  },
  button_text: {
    fontSize: '16rem',
    fontWeight: '600',
    color: 'white'
  }
});
