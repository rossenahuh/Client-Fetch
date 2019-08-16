import React, { Component } from 'react';
import { View, Dimensions, Text, StyleSheet, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyListItem from './MyListItem';
import RequireLogin from '../../components/common/RequireLogin';
import * as noticeActions from '../../modules/notices';
const { height, width } = Dimensions.get('window');

class NoticeScreen extends Component {
  static navigationOptions = { title: 'Notices' };

  _onPressItem = status => {
    if (status.status === 1) {
      this.props.navigation.navigate('OrderDetail', {
        order_id: status.status_id
      });
    }
  };

  _keyExtractor = aList => this.props.noticeList.indexOf(aList);

  componentDidMount() {
    if (this.props.isLogin) {
      this.props.NoticeActions.getNoticeList();
    }
  }

  componentDidUpdate = prevProps => {
    if (this.props.isLogin && !prevProps.isLogin) {
      this.props.NoticeActions.getNoticeList();
    }
  };
  render() {
    if (!this.props.isLogin) {
      return <RequireLogin />;
    } else {
      if (this.props.notices.pending) {
        return (
          <View style={styles.bridge}>
            <Image source={require('../../img/loader.gif')} />
          </View>
        );
      } else if (this.props.noticeList.length === 0) {
        return (
          <View style={styles.bridge}>
            <Image
              style={{ width: 50, height: 50, marginBottom: 30 }}
              source={require('../../img/chat.png')}
            />
            <Text style={styles.noMessage}>No Notices, yet</Text>
          </View>
        );
      } else if (this.props.noticeList.length > 0) {
        return (
          <ScrollView style={styles.container}>
            <View
              style={{
                paddingTop: 20,
                width: '90%',
                borderColor: '#5bb487',
                marginLeft: '5%',
                marginRight: '5%',
                borderBottomWidth: 1
              }}
            />
            {this.props.noticeList.map(aList => (
              <MyListItem
                key={this._keyExtractor(aList)}
                sender={aList.from}
                notice={aList.notice}
                onPress={() => this._onPressItem(aList.status)}
              />
            ))}
          </ScrollView>
        );
      }
    }
  }
}

const mapStateToProps = ({ notices, auth }) => ({
  notices: notices,
  noticeList: notices.noticeList,
  isLogin: auth.isLogin
});

const mapDispatchToProps = dispatch => ({
  NoticeActions: bindActionCreators(noticeActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoticeScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: width
  },
  bridge: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noMessage: {
    fontSize: 16,
    fontWeight: '500'
  }
});
