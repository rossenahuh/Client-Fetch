import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import InputBox from '../../components/auth/InputBox';
import Icon from 'react-native-vector-icons/FontAwesome';
import fetchHelper from '../../helpers/fetch';
import { Button } from 'react-native-elements';
import NavigationService from '../../NavigationService';

const { height, width } = Dimensions.get('window');

class SignUpDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      emailValidity: true,
      pwValidity: true
    };
    this.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    this.pwPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; //최소 8 자, 최소 하나의 문자 및 하나의 숫자
  }

  //이메일 중복체크 및 유효성 체크
  checkEmail = () => {
    if (!this.emailPattern.test(this.state.email)) {
      this.setState({ emailValidity: false });
    } else {
      this.setState({ emailValidity: true });
      fetchHelper.getCheckIdAPI(this.state.email).then(result => {
        console.log(result.data);
        this.setState({ emailExist: result.data.exist });
      });
    }
  };
  //비밀번호 유효성 체크
  checkPwValidity = pw => {
    if (!this.pwPattern.test(pw)) {
      this.setState({ pwValidity: false });
    } else {
      this.setState({ pw: pw, pwValidity: true });
    }
  };

  //비밀번호 확인
  checkPw = pw => {
    if (pw !== this.state.pw) {
      console.log(this.state.pw);
      this.setState({
        pwIdentical: false
      });
    } else if (pw === this.state.pw) {
      this.setState({
        pwIdentical: true
      });
      console.log(this.state.pwIdentical);
    }
  };
  handleSubmit = () => {
    if (!this.state.checked) {
      Alert.alert(
        'fetch',
        '회원가입을 위해서는 개인정보 처리방침 및 이용 약관 동의가 필요합니다.'
      );
    } else if (
      this.state.emailExist ||
      !this.state.emailValidity ||
      !this.state.pwIdentical ||
      !this.state.pwValidity
    ) {
      Alert.alert('fetch', '이메일 또는 비밀번호를 확인해 주세요.');
    } else {
      let data = {
        email: this.state.email,
        password: this.state.pw,
        name: this.state.name
      };
      fetchHelper.postSignUpAPI(data).then(result => {
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
    return (
      <ScrollView>
        <KeyboardAvoidingView behavior="padding" enabled>
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
                uncheckedIcon={
                  <Icon name="circle-o" size={18} color="#5bb487" />
                }
                checked={this.state.checked}
                onPress={() => this.setState({ checked: !this.state.checked })}
              />
              <View>
                <Text style={{ paddingRight: 30 }}>
                  Fetch의 개인정보 처리방침 및 이용 약관에 동의합니다.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('AuthPolicy');
                  }}
                  style={styles.policyLinkContainer}
                >
                  <Icon name="file-text-o" color="#5bb487" size={12} />
                  <Text style={styles.policyLinkText}>
                    개인정보 처리방침 및 이용약관
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.emailContainer}>
              <Text style={styles.midTitleText}>기본정보</Text>
              <InputBox
                placeholder={'이메일'}
                onChangeText={email => this.setState({ email: email })}
                onEndEditing={this.checkEmail}
              />
              {this.state.emailValidity === false ? (
                <Text style={styles.alertText}>
                  유효한 이메일을 입력해 주세요.
                </Text>
              ) : null}
              {this.state.emailExist === undefined ? null : !this.state
                  .emailExist ? (
                <Text style={styles.validText}>사용 가능한 이메일 입니다.</Text>
              ) : (
                <Text style={styles.alertText}>
                  사용이 불가능한 이메일 입니다.
                </Text>
              )}
              <InputBox
                placeholder={'이름'}
                onChangeText={name => this.setState({ name: name })}
              />
            </View>
            <View style={styles.passwordContainer}>
              <Text style={styles.midTitleText}>비밀번호</Text>
              <InputBox
                placeholder={'비밀번호 입력'}
                secureTextEntry={true}
                onChangeText={pw => this.checkPwValidity(pw)}
              />
              {this.state.pwValidity === false ? (
                <Text style={styles.alertText}>
                  비밀번호 규칙: 영문+숫자를 혼합한 최소 8자리 이상
                </Text>
              ) : null}
              <InputBox
                placeholder={'비밀번호 확인'}
                secureTextEntry={true}
                onChangeText={pw => this.checkPw(pw)}
              />
              {this.state.pwIdentical === undefined ||
              this.state.pwIdentical === true ? null : (
                <Text style={styles.alertText}>
                  비밀번호가 일치하지 않습니다.
                </Text>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="회원가입"
                titleStyle={styles.buttonText}
                type="outline"
                buttonStyle={styles.signupButton}
                onPress={() => {
                  this.handleSubmit();
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

export default SignUpDetailScreen;

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    width: '80%',
    flexDirection: 'row',
    marginTop: height * 0.1,
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
  },
  policyLinkContainer: {
    flexDirection: 'row',
    paddingTop: 6
  },
  policyLinkText: { fontSize: 12, color: '#5bb487', paddingLeft: 6 },
  emailContainer: {
    paddingTop: 20,
    marginBottom: 10
  },
  passwordContainer: {
    paddingTop: 15,
    marginBottom: 20
  },
  validText: {
    color: '#5bb487',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10
  },
  buttonContainer: {
    width: '75%',
    paddingTop: 10,
    alignItems: 'stretch',
    marginBottom: 10
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '400',
    paddingLeft: 0,
    color: '#424242'
  },
  signupButton: {
    borderColor: '#5bb487',
    borderRadius: 5,
    width: '100%',
    marginBottom: 10
  }
});
