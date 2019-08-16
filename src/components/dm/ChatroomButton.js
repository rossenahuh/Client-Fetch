import React from 'react';
import { Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { Avatar } from 'react-native-elements';
import SendBird from 'sendbird';
const { height, width } = Dimensions.get('window');

export default (Chatroom = ({ onPress, chats }) => {
  const {
    buttonStyle,
    imageContainer,
    textContainer,
    nameStyle,
    messageStyle,
    timeStyle
  } = styles;
  const chatroomNameDefinder = data => {
    if (data.inviter.userId === SendBird.getInstance().getCurrentUserId()) {
      return data.customType;
    } else {
      return data.inviter.nickname;
    }
  };

  const chatroomImgDefinder = data => {
    let userId = SendBird.getInstance().getCurrentUserId();
    for (key in data.memberMap) {
      if (key !== userId) {
        return data.memberMap[key].profileUrl;
      }
    }
  };
  const _unreadCount = chats => {
    if (chats.unreadMessageCount === 0) {
      return 0;
    } else {
      return chats.unreadMessageCount;
    }
  };
  const _unixTimestampToDate = unixTime => {
    const today = new Date();
    const date = new Date(unixTime);

    const hour = '0' + date.getHours();
    const minute = '0' + date.getMinutes();
    return (
      date.getMonth() +
      1 +
      '/' +
      date.getDay() +
      ' ' +
      hour.substr(-2) +
      ':' +
      minute.substr(-2)
    );
  };
  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <View style={imageContainer}>
        {chats.memberCount === 2 ? (
          <Avatar
            rounded
            size={50}
            source={{ uri: chatroomImgDefinder(chats) }}
          />
        ) : (
          <Avatar
            rounded
            size={50}
            source={require('../../img/defaultProfile.png')}
          />
        )}
      </View>
      <View style={textContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={nameStyle}>{chatroomNameDefinder(chats)}</Text>
          <Text style={timeStyle}>
            {_unixTimestampToDate(chats.lastMessage.createdAt)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={messageStyle}>{chats.lastMessage.message}</Text>
          {_unreadCount(chats) > 0 ? (
            <Avatar
              size={22}
              rounded
              overlayContainerStyle={{ backgroundColor: '#e46b2b' }}
              title={_unreadCount(chats).toString()}
              titleStyle={{ fontWeight: '500' }}
            />
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = {
  buttonStyle: {
    width: width * 0.9,
    height: 90,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderBottomWidth: 1,
    borderColor: '#5bb487',
    marginLeft: '5%',
    marginRight: '5%'
  },
  textContainer: {
    paddingLeft: 5,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 8,
    overflow: 'hidden'
  },
  nameStyle: {
    color: '#212121',
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end'
  },
  messageStyle: {
    alignSelf: 'stretch',
    height: 40,
    width: width * 0.52,
    textAlignVertical: 'center',
    color: '#212121',
    fontSize: 13,
    fontWeight: '400',
    overflow: 'hidden',
    paddingTop: 5,
    paddingRight: 8
  },
  unreadMessageStyle: {
    fontSize: 13,
    paddingTop: 2
  },
  timeStyle: {
    height: 16,
    textAlign: 'right',
    color: '#212121',
    fontSize: 12,
    fontWeight: '400',
    paddingLeft: 8,
    alignSelf: 'flex-end',
    justifyContent: 'flex-end'
  },
  imageContainer: {
    padding: 15,
    paddingTop: 20,
    paddingBottom: 20
  }
};
