import React, { Component } from 'react';
import {
  FlatList,
  TouchableOpacity,
  Dimensions,
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native';
import * as mypageActions from '../../modules/mypage';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ListItem from './ListItem';
import theme from '../../components/styles/theme';
const { height, width } = Dimensions.get('window');

class OnWaitingScreen extends Component {
  _renderItem = ({ item }) => <ListItem data={item} />;
  _keyExtractor = item => item.order_id;
  _emptyGen = () => {
    if (this.props.navigation.getParam('detailsOf') === 'My Order') {
      return '대기중인 요청이 없습니다.';
    } else if (
      this.props.navigation.getParam('detailsOf') === 'My Application'
    ) {
      return '대기중인 지원이 없습니다.';
    }
  };
  render() {
    const nav = this.props.navigation.getParam('detailsOf');
    // const renderList
    if (nav === 'My Order') {
      renderList = this.props.orderList;
    } else {
      renderList = this.props.applyList;
    }
    if (this.props.pending) {
      return (
        <View style={styles.bridge}>
          <Image source={require('../../img/loader.gif')} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {renderList.onWaiting.length === 0 ? (
            <View style={{ marginBottom: width * 0.1 }}>
              <Text style={styles.noList}>{this._emptyGen()}</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this._keyExtractor}
              data={renderList.onWaiting}
              renderItem={this._renderItem}
            />
          )}
          {nav === 'My Order' ? (
            <TouchableOpacity
              style={styles.reqeust_button}
              onPress={() => {
                this.props.navigation.navigate('OrderRequest');
              }}
            >
              <Text style={styles.button_text}>새 요청 등록하기</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    }
  }
}

const mapStateToProps = ({ mypage }) => ({
  orderList: mypage.orderList,
  applyList: mypage.applyList,
  pending: mypage.pending
});

//다양한 리덕스 모듈을 적용해야하는 상황에서 유리
const mapDispatchToProps = dispatch => ({
  MypageActions: bindActionCreators(mypageActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnWaitingScreen);

const styles = StyleSheet.create({
  container: {
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
