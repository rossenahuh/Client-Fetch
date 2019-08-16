import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  PixelRatio,
  Keyboard,
  Animated,
  Dimensions,
  UIManager
  // KeyboardAvoidingView
} from 'react-native';
import { Button } from 'react-native-elements';
import * as messageActions from '../../modules/messages';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Message } from '../../components/dm/Message';
import SendBird from 'sendbird';
const { State: TextInputState } = TextInput;

class DMDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textMessage: '',
      shift: new Animated.Value(0)
    };
  }

  _onChangeText = text => {
    this.setState({
      textMessage: text
    });
  };

  _onSend = () => {
    // keyboard.dismiss();
    this.props.MessageActions.sendMessage(
      this.props.messages.channel,
      this.state.textMessage
    ).then(result => {
      this.setState({
        textMessage: ''
      });
    });
  };
  sbGetGroupChannel = channelUrl => {
    return new Promise((resolve, reject) => {
      const sb = SendBird.getInstance();
      sb.GroupChannel.getChannel(channelUrl, (channel, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(channel);
        }
      });
    });
  };

  _getMessageList = async channelUrl => {
    return await this.props.MessageActions.getPrevMessageList(channelUrl);
  };

  _markAsRead = async channelUrl => {
    await this.sbGetGroupChannel(channelUrl).then(channel =>
      channel.markAsRead()
    );
  };
  _keyboardWillShow = event => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(
      currentlyFocusedField,
      (originX, originY, width, height, pageX, pageY) => {
        const fieldHeight = height;
        const fieldTop = pageY;
        const gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight);
        if (gap >= 0) {
          return;
        }
        Animated.timing(this.state.shift, {
          toValue: gap,
          duration: 100,
          useNativeDriver: true
        }).start();
      }
    );
  };

  _keyboardDidHide = event => {
    Animated.timing(this.state.shift, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true
    }).start();
  };
  _renderMessage = rowData => {
    const message = rowData.item;
    return (
      <Message
        key={message.messageId ? message.messageId : message.reqId}
        isShow={message.sender.isShow}
        profileUrl={message.sender.profileUrl.replace('http://', 'https://')}
        senderId={message._sender.userId}
        nickname={message._sender.nickname}
        time={message.createdAt}
        message={message.message}
      />
    );
  };

  componentDidMount = () => {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this._keyboardWillShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide
    );

    const channelUrl = this.props.messages.channel.url
      ? this.props.messages.channel.url
      : this.props.messages.channel.channel_url;
    console.log(channelUrl);
    this._getMessageList(channelUrl);
    this._markAsRead(channelUrl);
    // this.props.MessageActions.createMessageHandler(channelUrl);
  };

  componentDidUpdate = prevProps => {
    const channelUrl = this.props.messages.channel.url
      ? this.props.messages.channel.url
      : this.props.messages.channel.channel_url;
    const prevChannelUrl = prevProps.messages.channel.url
      ? prevProps.messages.channel.url
      : prevProps.messages.channel.channel_url;
    console.log(channelUrl);
    if (prevChannelUrl !== channelUrl) {
      this._getMessageList(channelUrl);
      this._markAsRead(channelUrl);
    }
    // this.props.MessageActions.createMessageHandler(channelUrl);
  };

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  render() {
    const { shift } = this.state;

    if (this.props.messages.pending) {
      return (
        <View style={styles.bridge}>
          <Image source={require('../../img/loader.gif')} />
        </View>
      );
    } else {
      return (
        // <KeyboardAvoidingView
        //   behavior="padding"
        //   enabled
        //   style={styles.container}
        // >
        <Animated.View
          style={[styles.container, { transform: [{ translateY: shift }] }]}
        >
          <View style={[styles.chatContainer, { transform: [{ scaleY: -1 }] }]}>
            {this.props.messages.messages.length > 0 ? (
              <FlatList
                // enableEmptySections={true}
                data={this.props.messages.messages}
                renderItem={item => this._renderMessage(item)}
              />
            ) : null}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={'Please type mesasge...'}
              ref="textInput"
              onChangeText={this._onChangeText}
              value={this.state.textMessage}
              autoFocus={false}
              blurOnSubmit={false}
            />
            <Button
              type="clear"
              onPress={this._onSend}
              title="Send"
              titleStyle={styles.sendButtonTitle}
              // disabled={this.state.disabled}
            />
          </View>
        </Animated.View>
        // </KeyboardAvoidingView>
      );
    }
  }
}

const mapDispatchToProps = dispatch => ({
  MessageActions: bindActionCreators(messageActions, dispatch)
});

const mapStateToProps = ({ messages }) => ({
  messages: messages
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DMDetailScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#fff'
  },
  bridge: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatContainer: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#fff'
  },
  inputContainer: {
    height: 44,
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderColor: '#b2b2b2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 10
  },
  textInput: {
    alignSelf: 'center',
    height: 30,
    width: 100,
    backgroundColor: '#FFF',
    flex: 1,
    paddingLeft: 8,
    padding: 0,
    margin: 0,
    fontSize: 15
  },
  sendButtonTitle: {
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 14,
    color: '#5bb487',
    fontWeight: '600'
  }
});
