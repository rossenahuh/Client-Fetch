import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import { Overlay, Avatar, Card, ListItem } from 'react-native-elements';
import * as authActions from '../../modules/auth';
import * as mypageActions from '../../modules/mypage';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NavigationService from '../../NavigationService';
import ProfileManager from './ProfileManager';

const { height, width } = Dimensions.get('window');

class MypageScreen extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   isVisible: false
    // };
    this.list = [
      {
        title: '내 일정 보기',
        onPress: () => {
          this.props.MypageActions.getUserTravelInfo();
          NavigationService.navigate('MyTravelDetail', {
            detailsOf: 'My Travel'
          });
        }
      },
      {
        title: '내 요청 보기',
        onPress: () => {
          this.props.MypageActions.getUserOrderList();
          NavigationService.navigate('MypageDetail', {
            detailsOf: 'My Order'
          });
        }
      },
      {
        title: '내 지원 보기',
        onPress: () => {
          this.props.MypageActions.getUserApplyList();
          NavigationService.navigate('MypageDetail', {
            detailsOf: 'My Application'
          });
        }
      },
      {
        title: '로그아웃',
        onPress: async () => {
          await this.props.AuthActions.logout();
          if (!this.props.auth.isLogin) {
            NavigationService.navigate('AuthRoot');
          }
        }
      },
      {
        title: '회원탈퇴',
        onPress: () => {
          Alert.alert('fetch', '정말로 회원탈퇴 하시겠습니까?', [
            {
              text: '확인',
              onPress: async () => {
                await this.props.AuthActions.deleteAccount();
              }
            },
            {
              text: '취소'
            }
          ]);
        }
      }
    ];
  }
  // _toggleOverlay = () => {
  //   this.setState({
  //     isVisible: !this.state.isVisible
  //   });
  // };
  _changeProfile = () => {};

  componentDidMount = () => {
    this.props.MypageActions.getUserInfo();
  };

  componentDidUpdate = prevProps => {
    if (prevProps.userInfo !== this.props.userInfo) {
    }
    if (!prevProps.auth.isLogin && this.props.auth.isLogin) {
      this.props.MypageActions.getUserInfo();
    }
  };

  render() {
    if (this.props.pending) {
      return (
        <View style={styles.bridge}>
          <Image source={require('../../img/loader.gif')} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {/* <Overlay
            isVisible={this.state.isVisible}
            // windowBackgroundColor="rgba(255, 255, 255, .3)"
            overlayBackgroundColor="white"
            fullScreen={true}
            children={
              <ProfileManager
                profileUrl={this.props.userInfo.imageUrl}
                toggleOverlay={this._toggleOverlay}
              />
            }
            // width={width * 0.9}
            // height={height * 0.8}
            // onBackdropPress={() => this.setState({ isVisible: false })}
          /> */}

          <Card title="Mypage" containerStyle={styles.infoContainer}>
            <View style={styles.infoView}>
              <Avatar
                rounded
                size={width * 0.13}
                source={{
                  uri: this.props.userInfo.imageUrl
                }}
                // onPress={this._toggleOverlay}
                // showEditButton
              />
              <View style={styles.rightContainer}>
                <View style={styles.accountInfoContainer}>
                  <Text style={styles.name}>{this.props.userInfo.name}</Text>
                  <Text style={styles.email}>{this.props.userInfo.email}</Text>
                </View>
              </View>
            </View>
          </Card>
          <Card containerStyle={styles.listContainer}>
            <View>
              {this.list.map((item, i) => {
                return (
                  <ListItem
                    key={i}
                    title={item.title}
                    titleStyle={styles.itemTitle}
                    onPress={item.onPress}
                    bottomDivider={true}
                    chevron
                  />
                );
              })}
            </View>
          </Card>
        </View>
      );
    }
  }
}
const mapStateToProps = ({ auth, mypage }) => ({
  auth: auth,
  userInfo: mypage.userInfo,
  pending: mypage.pending
});

//다양한 리덕스 모듈을 적용해야하는 상황에서 유리
const mapDispatchToProps = dispatch => ({
  AuthActions: bindActionCreators(authActions, dispatch),
  MypageActions: bindActionCreators(mypageActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MypageScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  infoContainer: {
    width: width,
    position: 'absolute',
    top: 0,
    margin: 0,
    padding: 20,
    paddingTop: 15,
    paddingBottom: 15
  },
  listContainer: {
    width: width,
    paddingTop: 0,
    paddingBottom: 0,
    position: 'absolute',
    top: width * 0.42
  },
  itemTitle: {
    fontSize: 14
  },
  infoView: {
    flexDirection: 'row',
    padding: 10
  },
  rightContainer: {
    justifyContent: 'center',
    paddingLeft: width * 0.05
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 3
  },
  email: {
    fontSize: 12,
    fontWeight: '500'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 5
  },
  bridge: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
