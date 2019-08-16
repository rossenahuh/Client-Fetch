import React, { Component } from 'react';
import { View, Image, ScrollView, Text, StyleSheet } from 'react-native';
import * as messageActions from '../../modules/messages';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ChatroomButton from '../../components/dm/ChatroomButton';
import RequireLogin from '../../components/common/RequireLogin';
import SendBird from 'sendbird';

class DMScreen extends Component {
  static navigationOptions = { title: 'Direct' };

  componentDidMount() {
    if (this.props.isLogin) {
      this.props.MessageActions.getMyChannelList();
      this.props.MessageActions.createGroupChannelListHandler();
    }
  }
  componentDidUpdate = prevProps => {
    if (this.props.isLogin && !prevProps.isLogin) {
      this.props.MessageActions.getMyChannelList();
      this.props.MessageActions.createGroupChannelListHandler();
    }
  };
  chatroomNameDefinder = data => {
    if (data.inviter.userId === SendBird.getInstance().getCurrentUserId()) {
      return data.customType;
    } else {
      return data.inviter.nickname;
    }
  };
  render() {
    if (!this.props.isLogin) {
      return <RequireLogin />;
    } else {
      if (this.props.messages.pending) {
        return (
          <View style={styles.bridge}>
            <Image source={require('../../img/loader.gif')} />
          </View>
        );
      } else if (this.props.messages.channels.length === 0) {
        return (
          <View style={styles.bridge}>
            <Image
              style={{ width: 50, height: 50, marginBottom: 30 }}
              source={require('../../img/chat.png')}
            />
            <Text style={styles.noMessage}>No Messages, yet</Text>
          </View>
        );
      } else {
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
            {this.props.messages.channels.map(aList => (
              <ChatroomButton
                key={aList.url}
                chats={aList}
                onPress={() => {
                  this.props.MessageActions.setChannel(aList);
                  this.props.navigation.navigate('DMDetail', {
                    nickname: this.chatroomNameDefinder(aList)
                  });
                }}
              />
            ))}
          </ScrollView>
        );
      }
    }
  }
}

const mapStateToProps = ({ messages, auth }) => ({
  messages: messages,
  isLogin: auth.isLogin
});

//다양한 리덕스 모듈을 적용해야하는 상황에서 유리
const mapDispatchToProps = dispatch => ({
  MessageActions: bindActionCreators(messageActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DMScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
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
