import React, { Component } from 'react';
import {
  Modal,
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView
} from 'react-native';
import fetchHelper from '../../helpers/fetch';
import MyInlineWeb from './MyInlineWeb';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import NavigationService from '../../NavigationService';
const { height, width } = Dimensions.get('window');
class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  };

  // alreadySingedup = () => {
  //   Alert.alert(
  //     'fetch',
  //     '이미 가입되어있는 계정입니다. \n로그인을 진행해 주세요.',
  //     [
  //       {
  //         text: '로그인 하기',
  //         onPress: () => {
  //           this.props.navigation.navigate('LogIn');
  //         }
  //       }
  //     ]
  //   );
  // };
  setUserData = async data => {
    console.log(data);

    if (data !== undefined) {
      if (data.length > 1) {
        await this.toggleModal();
        let userResponse = await JSON.parse(data);
        console.log(userResponse);
        if (userResponse.isUser) {
          this.props.navigation.navigate('AuthRoot');
        } else {
          this.props.navigation.navigate('SignUpWithSocial', {
            data: userResponse
          });
        }
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
          <Text style={styles.titleText}>회원가입</Text>
        </View>
        <View style={styles.signupButtonContainer}>
          <Button
            icon={<Icon name="envelope" color="#5bb487" size={16} />}
            title="이메일로 회원가입"
            titleStyle={styles.signupButtonText}
            type="outline"
            buttonStyle={styles.signupButton}
            onPress={() => {
              this.props.navigation.navigate('SignUpDetail');
            }}
          />
        </View>
        <View style={{ paddingTop: 5, alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ color: '#757575' }}>or</Text>
        </View>
        <View style={styles.socialButtonContainer}>
          <Button
            icon={<Icon name="google" color="#fff" size={16} />}
            buttonStyle={styles.googleButton}
            title="Google 아이디로 회원가입"
            titleStyle={{ fontSize: 14, fontWeight: '600', paddingLeft: 25 }}
            onPress={() => {
              this.handleSocialLogin('google');
            }}
          />
          {/* <Button
            icon={<Icon name="facebook" color="#fff" size={16} />}
            buttonStyle={{
              backgroundColor: '#4a68ad',
              borderRadius: 5,
              width: '100%',
              marginBottom: 15
            }}
            title="Facebook 아이디로 회원가입"
            titleStyle={{ fontSize: 14, fontWeight: '600', paddingLeft: 25 }}
            onPress={() => {}}
          /> */}
        </View>
        <View style={styles.bottom}>
          <Text style={styles.bottomText}>이미 계정이 있나요?</Text>
          <TouchableOpacity
            style={{ justifyContent: 'center' }}
            onPress={() => {
              NavigationService.navigate('AuthRoot');
            }}
          >
            <Text style={styles.bottomLink}>로그인</Text>
          </TouchableOpacity>
        </View>
      </View>
      // </ScrollView>
    );
  }
}

export default SignUpScreen;

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
  bottom: {
    height: height * 0.1,
    // position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    // marginBottom: height * 0.2,
    flexDirection: 'row'
  },
  modalView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signupButtonContainer: {
    marginTop: height * 0.06,
    width: '75%',
    paddingTop: 10,
    alignItems: 'stretch',
    marginBottom: 10
  },
  signupButton: {
    borderColor: '#5bb487',
    borderRadius: 5,
    width: '100%',
    marginBottom: 10
  },
  signupButtonText: {
    fontSize: 14,
    fontWeight: '400',
    paddingLeft: 25,
    color: '#424242'
  },
  socialButtonContainer: {
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
  bottomText: {
    color: '#212121',
    justifyContent: 'center',
    textAlignVertical: 'center'
  },
  bottomLink: { paddingLeft: 20, color: '#5bb487' }
});
