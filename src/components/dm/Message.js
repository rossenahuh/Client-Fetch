import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SendBird from 'sendbird';
import { Avatar } from 'react-native-elements';

const _renderNickname = nickname => {
  return nickname ? (
    <Text
      style={{
        fontSize: 12,
        fontWeight: '500',
        color: '#5bb487',
        paddingLeft: 6,
        paddingRight: 4,
        alignSelf: 'flex-end'
      }}
    >
      {nickname}
    </Text>
  ) : null;
};

const _unixTimestampToDate = unixTime => {
  const today = new Date();
  const date = new Date(unixTime);
  const hour = '0' + date.getHours();
  const minute = '0' + date.getMinutes();
  let formedDate;
  if (
    today.getMonth() !== date.getMonth() ||
    today.getDay() !== date.getDay()
  ) {
    formedDate =
      date.getMonth() +
      '/' +
      date.getDay() +
      ' ' +
      hour.substr(-2) +
      ':' +
      minute.substr(-2);
  } else {
    formedDate = hour.substr(-2) + ':' + minute.substr(-2);
  }
  return (
    <Text
      style={{
        fontSize: 8,
        color: '#212121',
        alignSelf: 'flex-end'
      }}
    >
      {formedDate}
    </Text>
  );
};
const userDefinder = data => {
  if (data === SendBird.getInstance().getCurrentUserId()) {
    return true;
  } else {
    return false;
  }
};
const Message = props => {
  const isUser = userDefinder(props.senderId);
  return (
    <View style={styles.messageViewStyle}>
      <View
        style={{
          flexDirection: isUser ? 'row-reverse' : 'row',
          paddingLeft: 17,
          paddingRight: 17,
          paddingBottom: 10
        }}
      >
        <View style={{ flexDirection: 'column' }}>
          {isUser ? null : (
            <View style={{ padding: 4, flexDirection: 'row' }}>
              <Avatar
                size="small"
                rounded
                source={{
                  uri: props.profileUrl
                }}
              />
              {_renderNickname(props.nickname)}
              {_unixTimestampToDate(props.time)}
            </View>
          )}
          {isUser ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                padding: 4
              }}
            >
              {_unixTimestampToDate(props.time)}
            </View>
          ) : null}
          <View
            style={{
              maxWidth: 250,
              padding: 8,
              paddingTop: 10,
              marginTop: 2,
              borderRadius: 8,
              backgroundColor: isUser ? '#5bb487' : '#f2f2f2'
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: isUser ? '#fff' : '#212121'
              }}
            >
              {props.message}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = {
  messageViewStyle: {
    transform: [{ scaleY: -1 }]
  }
};

export { Message };
