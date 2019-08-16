import React, { Component } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text
} from 'react-native';
import * as mypageActions from '../../modules/mypage';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TravelList from './TravelList';
const { height, width } = Dimensions.get('window');
import NavigationService from '../../NavigationService';
import theme from '../../components/styles/theme';

class MyTravelDetailScreen extends Component {
  _keyExtractor = item => this.props.travelInfo.indexOf(item);
  _renderItem = ({ item }) => <TravelList data={item} />;

  render() {
    if (this.props.pending) {
      return (
        <View style={styles.bridge}>
          <Image source={require('../../img/loader.gif')} />
        </View>
      );
    } else {
      return (
        <View style={styles.MainContainer}>
          {this.props.travelInfo.length === 0 ? (
            <View style={{ marginBottom: width * 0.1 }}>
              <Text style={styles.noList}>등록한 여행일정이 없습니다.</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this._keyExtractor}
              data={this.props.travelInfo}
              renderItem={this._renderItem}
            />
          )}

          <TouchableOpacity
            style={styles.reqeust_button}
            onPress={() => {
              NavigationService.navigate('TravelRegister');
            }}
          >
            <Text style={styles.button_text}>새 여행일정 등록하기</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const mapStateToProps = ({ mypage, auth }) => ({
  travelInfo: mypage.travelInfo,
  isLogin: auth.isLogin,
  pending: mypage.pending
});

//다양한 리덕스 모듈을 적용해야하는 상황에서 유리
const mapDispatchToProps = dispatch => ({
  MypageActions: bindActionCreators(mypageActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyTravelDetailScreen);

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    width: width,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  reqeust_button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.45,
    height: height * 0.05,
    backgroundColor: theme.MAIN_THEME_COLOR,
    borderRadius: 50
  },
  button_text: {
    fontWeight: '600',
    color: 'white'
  },
  noList: {
    fontSize: 16,
    fontWeight: '500'
  },
  bridge: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
