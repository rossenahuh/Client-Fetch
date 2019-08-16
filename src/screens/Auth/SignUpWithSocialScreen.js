import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import InputBox from '../../components/auth/InputBox';
import Icon from 'react-native-vector-icons/FontAwesome';
import fetchHelper from '../../helpers/fetch';
import { Button } from 'react-native-elements';
import NavigationService from '../../NavigationService';

class SignUpDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
  }

  handleSubmit = userData => {
    if (!this.state.checked) {
      Alert.alert(
        'fetch',
        '회원가입을 위해서는 서비스 이용약관, 개인정보 처리방침, 개인정보 수집/이용 약관 동의가 필요합니다.'
      );
    } else {
      let data = {
        email: userData.email,
        name: userData.name,
        provider: userData.provider,
        socialId: userData.google_id,
        imageURL: userData.image,
        password: 'social login'
      };
      fetchHelper.postSignUpAPI(data).then(result => {
        console.log(result);
        if (!result.data.success) {
          Alert.alert(
            'fetch',
            '회원가입에 실패하였습니다. \n다시 시도해 주세요.'
          );
        } else {
          Alert.alert('fetch', '정상적으로 회원가입 되었습니다.', [
            {
              text: '로그인 하기',
              onPress: () => {
                NavigationService.navigate('AuthRoot');
              }
            }
          ]);
        }
      });
    }
  };
  render() {
    const { navigation } = this.props;
    const userData = navigation.getParam('data');
    console.log(userData);
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>회원가입</Text>
        </View>
        <View style={styles.checkBoxContents}>
          <CheckBox
            style={{ alignItems: 'flex-start' }}
            checkedIcon={
              <Icon name="check-circle-o" size={18} color="#5bb487" />
            }
            uncheckedIcon={<Icon name="circle-o" size={18} color="#5bb487" />}
            checked={this.state.checked}
            onPress={() => this.setState({ checked: !this.state.checked })}
          />
          <Text>
            Fetch의 서비스 이용약관, 개인정보 처리방침, 개인정보 수집/이용에
            동의합니다.
          </Text>
        </View>
        <View
          style={{
            paddingTop: 20,
            marginBottom: 10
          }}
        >
          <Text style={styles.midTitleText}>기본정보</Text>
          <InputBox editable={false} placeholder={userData.email} />
          <InputBox editable={false} placeholder={userData.name} />
        </View>
        <View
          style={{
            width: '75%',
            paddingTop: 10,
            alignItems: 'stretch',
            marginBottom: 10
          }}
        >
          <Button
            title="회원가입"
            titleStyle={{
              fontSize: 14,
              fontWeight: '400',
              paddingLeft: 15,
              color: '#424242'
            }}
            type="outline"
            buttonStyle={{
              borderColor: '#5bb487',
              borderRadius: 5,
              width: '100%',
              marginBottom: 10
            }}
            onPress={() => {
              this.handleSubmit(userData);
            }}
          />
        </View>
      </View>
    );
  }
}

export default SignUpDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    width: '80%',
    flexDirection: 'row',
    marginBottom: 30,
    paddingRight: 10,
    paddingLeft: 10
  },
  titleText: {
    color: '#212121',
    fontSize: 30,
    fontWeight: '800'
  },
  checkBoxContents: {
    paddingTop: 10,
    marginLeft: 60,
    marginRight: 60,
    marginBottom: 25,
    flexDirection: 'row'
  },
  midTitleText: {
    width: '80%',
    color: '#212121',
    fontSize: 16,
    fontWeight: '600',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 25,
    flexDirection: 'row'
  },
  alertText: {
    color: '#e46b2b',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10
  }
});
