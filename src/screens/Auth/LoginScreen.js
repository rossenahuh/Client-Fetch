import React, { Component } from 'react';
import {
  Modal,
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import InputBox from '../../components/auth/InputBox';
import * as authActions from '../../modules/auth';
import sendbirdHelper from '../../helpers/sendbird';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SendBird from 'sendbird';
import fetchHelper from '../../helpers/fetch';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import MyInlineWeb from './MyInlineWeb';
import NavigationService from '../../NavigationService';
const APP_ID = '76595710-4C8C-4E6E-992A-155562E6D3F3'; // sample

const { height, width } = Dimensions.get('window');
class LogInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: undefined,
      pw: undefined,
      webviewSource: undefined,
      modalVisible: false
    };
  }

  handleSocialLogin = async social => {
    if (social === 'google') {
      await fetchHelper.getGoogleSignUpAPI().then(result => {
        this.setState({ webviewSource: result.data });
        this.toggleModal();
      });
    }

    // if (social === 'google') {
    //   await this.props.AuthActions.signin(social);
    //   if (this.props.auth.error) {
    //     Alert.alert('fetch', '로그인에 실패하였습니다. \n다시 시도해 주세요.');
    //   } else {
    //     this.sbConnect(this.props.auth.userDB_id, this.props.auth.userDB_name);
    //     this.props.navigation.navigate('Mypage');
    //   }
    // }
  };

  setUserData = async data => {
    console.log(data);
    if (data !== undefined) {
      if (data.length > 1) {
        await this.toggleModal();
        let userResponse = await JSON.parse(data);
        console.log(userResponse);
        if (!userResponse.isUser) {
          NavigationService.navigate('SignUp');
        } else {
          await this.props.AuthActions.socialSignin(userResponse);
          if (!this.props.auth.isLogin) {
            Alert.alert(
              'fetch',
              '로그인에 실패하였습니다. \n다시 시도해 주세요.'
            );
          } else {
            NavigationService.navigate('AuthRoot');
          }
        }
      }
    }
  };
  handleSubmit = async () => {
    if (
      this.state.email === undefined ||
      this.state.email.length === 0 ||
      this.state.pw === undefined ||
      this.state.pw.length === 0
    ) {
      Alert.alert('fetch', '로그인 정보를 입력해 주세요.');
    } else {
      let data = {
        email: this.state.email,
        password: this.state.pw
      };
      await this.props.AuthActions.signin(data);

      if (this.props.auth.error) {
        Alert.alert('fetch', '로그인에 실패하였습니다. \n다시 시도해 주세요.');
      } else {
        // fetchHelper.postFcmToken({ fcmToken: this.props.auth.fcmToken });
        NavigationService.navigate('AuthRoot');
      }
    }
  };

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  render() {
    return (
      // <ScrollView>
      <View style={styles.container}>
        <Modal
          visible={this.state.modalVisible}
          animationType="slide"
          transparent={false}
        >
          <View style={styles.modalView}>
            <View
              style={{
                width: width * 0.9,
                height: height * 0.8
              }}
            >
              <TouchableHighlight onPress={this.toggleModal}>
                <Text>X</Text>
              </TouchableHighlight>
              {this.state.webviewSource !== undefined ? (
                <MyInlineWeb
                  source={{ html: this.state.webviewSource }}
                  onGetData={this.setUserData}
                  toggleModal={this.toggleModal}
                />
              ) : null}
            </View>
          </View>
        </Modal>
        <View style={styles.title}>
          <Text style={styles.titleText}>로그인</Text>
        </View>
        <View
          style={{ paddingTop: 10, alignItems: 'center', marginBottom: 10 }}
        >
          <InputBox
            placeholder={'이메일'}
            onChangeText={email => this.setState({ email: email })}
          />
          <InputBox
            placeholder={'비밀번호'}
            secureTextEntry={true}
            onChangeText={pw => this.setState({ pw: pw })}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            icon={<Icon name="envelope" color="#5bb487" size={16} />}
            title="로그인"
            titleStyle={styles.loginText}
            type="outline"
            buttonStyle={styles.loginButton}
            onPress={() => {
              this.handleSubmit();
            }}
          />
        </View>
        <View style={styles.orContainer}>
          <Text style={{ color: '#757575' }}>or</Text>
        </View>
        <View style={styles.socialLoginView}>
          <Button
            icon={<Icon name="google" color="#fff" size={16} />}
            buttonStyle={styles.googleButton}
            title="Google 아이디로 로그인"
            titleStyle={{ fontSize: 14, fontWeight: '600', paddingLeft: 25 }}
            onPress={() => this.handleSocialLogin('google')}
          />
          {/* <Button
            icon={<Icon name="facebook" color="#fff" size={16} />}
            buttonStyle={{
              backgroundColor: '#4a68ad',
              borderRadius: 5,
              width: '100%',
              marginBottom: 15
            }}
            title="Facebook 아이디로 로그인"
            titleStyle={{ fontSize: 14, fontWeight: '600', paddingLeft: 25 }}
            onPress={() => {}}
          /> */}
        </View>
        <View style={styles.bottom}>
          <Text style={styles.bottomText}>아직 계정이 없나요?</Text>
          <TouchableOpacity
            style={{ justifyContent: 'center' }}
            onPress={() => {
              NavigationService.navigate('SignUp');
            }}
          >
            <Text style={styles.bottomLink}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
      // </ScrollView>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth: auth
});

//다양한 리덕스 모듈을 적용해야하는 상황에서 유리
const mapDispatchToProps = dispatch => ({
  AuthActions: bindActionCreators(authActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogInScreen);

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
  buttonContainer: {
    width: '75%',
    paddingTop: 10,
    alignItems: 'stretch',
    marginBottom: 10
  },
  orContainer: { paddingTop: 5, alignItems: 'center', marginBottom: 10 },
  socialLoginView: {
    width: '75%',
    paddingTop: 10,
    alignItems: 'stretch',
    marginBottom: 10
  },
  googleButton: {
    backgroundColor: '#cf553c',
    borderRadius: 5,
    width: '100%',
    marginBottom: 15
  },
  bottom: {
    height: height * 0.1,
    // position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    // marginBottom: height * 0.2,
    flexDirection: 'row'
  },
  bottomText: {
    color: '#212121',
    justifyContent: 'center',
    textAlignVertical: 'center'
  },
  bottomLink: {
    paddingLeft: 20,
    color: '#5bb487'
  },
  modalView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginButton: {
    borderColor: '#5bb487',
    borderRadius: 5,
    width: '100%',
    marginBottom: 10
  },
  loginText: {
    fontSize: 14,
    fontWeight: '400',
    paddingLeft: 25,
    color: '#424242'
  }
});
