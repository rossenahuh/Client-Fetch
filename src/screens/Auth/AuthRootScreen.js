import React, { Component } from 'react';
import LoginScreen from './LoginScreen';
import MypageScreen from '../Mypage/MypageScreen';
import asyncHelper from '../../helpers/asyncStorage';
import sendbirdHelper from '../../helpers/sendbird';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from '../../modules/auth';

class AuthRootScreen extends Component {
  componentDidMount = () => {
    asyncHelper
      ._isLogin()
      .then(res => {
        this.props.AuthActions.checkLoginStatus(res);
      })
      .then(() => {
        if (this.props.auth.isLogin && !this.props.auth.initialLogin) {
          asyncHelper._getData('user').then(res => {
            console.log('asyncstorage userInfo::::::::::', JSON.parse(res));
            res = JSON.parse(res);
            sendbirdHelper
              .sbConnect(res.userId, res.nickname, res.profileUrl)
              .then(res => {
                this.props.AuthActions.checkSBConnection(res);
              });
          });
        }
      });
  };

  render() {
    if (this.props.auth.isLogin) {
      return <MypageScreen />;
    } else {
      return <LoginScreen />;
    }
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
)(AuthRootScreen);
