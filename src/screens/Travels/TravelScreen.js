import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, Text, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import TrevalList from '../../components/travel/TravelList';
import { connect } from 'react-redux';
import theme from '../../components/styles/theme';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class TravelScreen extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    const { isLogin, navigation } = this.props;
    return (
      <View style={styles.container}>
        <TrevalList navigation={navigation} />
        <TouchableOpacity
          style={styles.register_button}
          onPress={() => {
            if (isLogin) {
              navigation.navigate('TravelRegister');
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
        >
          <Text style={styles.button_text}>여행 일정 등록하기</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  isLogin: auth.isLogin
});
export default connect(mapStateToProps)(TravelScreen);

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    width: width,
    display: 'flex',
    alignItems: 'center'
  },
  register_button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.4,
    height: height * 0.05,
    backgroundColor: theme.MAIN_THEME_COLOR,
    borderRadius: 50
  },
  button_text: {
    fontWeight: '600',
    color: 'white'
  }
});
