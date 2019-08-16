import { handleActions } from 'redux-actions';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
var PushNotification = require('react-native-push-notification');

// import socket from './socket';

import SendBird from 'sendbird';

const serverEndpoint = 'https://server.fetcher.fun';

//with sendbird
const GET_CHANNELS_PENDING = 'GET_CHANNELS_PENDING';
const GET_CHANNELS_SUCCESS = 'GET_CHANNELS_SUCCESS';
const GET_CHANNELS_FAILURE = 'GET_CHANNELS_FAILURE';

const CREATE_CHANNEL_PENDING = 'CREATE_CHANNEL_PENDING';
const CREATE_CHANNEL_SUCCESS = 'CREATE_CHANNEL_SUCCESS';
const CREATE_CHANNEL_FAILURE = 'CREATE_CHANNEL_FAILURE';

const GET_PREV_MESSAGES_PENDING = 'GET_PREV_MESSAGES_PENDING';
const GET_PREV_MESSAGES_SUCCESS = 'GET_PREV_MESSAGES_SUCCESS';
const GET_PREV_MESSAGES_FAILURE = 'GET_PREV_MESSAGES_FAILURE';

const SEND_MESSAGE_PENDING = 'SEND_MESSAGE_PENDING';
const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE';

const SET_CHANNEL = 'SET_CHANNEL';

const GROUP_CHANNEL_CHANGED = 'GROUP_CHANNEL_CHANGED';
const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';

const initialState = {
  pending: false,
  error: false,
  channels: [],
  channel: '',
  messages: [],
  message: [],
  newMessage: []
};
const uniqueList = list => {
  return list.reduce((uniqList, currentValue) => {
    let ids = uniqList.map(item => {
      return item.messageId;
    });
    if (ids.indexOf(currentValue.messageId) < 0) {
      uniqList.push(currentValue);
    }
    return uniqList;
  }, []);
};

const msgNoti = message => {
  PushNotification.localNotification({
    // title: '새로운 메시지', // (optional)
    message: `${message.sender.nickname}: ${message.message}`, // (required)
    category: message.channelUrl
  });
};

const sbGetMyGroupChannelList = async () => {
  const sb = SendBird.getInstance();
  const groupChannelListQuery = await sb.GroupChannel.createMyGroupChannelListQuery();
  if (groupChannelListQuery.hasNext) {
    return new Promise((resolve, reject) => {
      groupChannelListQuery.next((channels, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(channels);
        }
      });
    });
  } else {
    return [];
  }
};
const sbCreatePrivateChannel = (partner_id, name) => {
  console.log('!!!', partner_id);
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    sb.GroupChannel.createChannelWithUserIds(
      partner_id,
      true,
      name,
      (channel, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(channel);
        }
      }
    );
  });
};

const sbGetGroupChannel = channelUrl => {
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
const sbCreatePreviousMessageListQuery = channelUrl => {
  return new Promise((resolve, reject) => {
    sbGetGroupChannel(channelUrl)
      .then(channel => resolve(channel.createPreviousMessageListQuery()))
      .catch(error => reject(error));
  });
};
const sbGetMessageList = previousMessageListQuery => {
  const limit = 30;
  const reverse = true;
  return new Promise((resolve, reject) => {
    previousMessageListQuery.load(limit, reverse, (messages, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(messages);
      }
    });
  });
};
const sbSendTextMessage = (channel, textMessage, callback) => {
  return new Promise((resolve, reject) => {
    channel.sendUserMessage(textMessage, (message, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(message);
      }
    });
  });
};
export const getMyChannelList = () => dispatch => {
  dispatch({ type: GET_CHANNELS_PENDING });
  return sbGetMyGroupChannelList()
    .then(channels => {
      console.log(channels);
      dispatch({
        type: GET_CHANNELS_SUCCESS,
        payload: channels
      });
    })
    .catch(error => {
      console.log(error);
      dispatch({ type: GET_CHANNELS_FAILURE });
    });
};

export const createChannel = (partner_id, name) => dispatch => {
  dispatch({ type: CREATE_CHANNEL_PENDING });
  return sbCreatePrivateChannel(partner_id, name)
    .then(channel => {
      dispatch({
        type: CREATE_CHANNEL_SUCCESS,
        payload: channel
      });
    })
    .catch(error => {
      console.log(error);
      dispatch({ type: CREATE_CHANNEL_FAILURE });
    });
};

export const getPrevMessageList = channelUrl => async dispatch => {
  dispatch({ type: GET_PREV_MESSAGES_PENDING });
  const previousMessageListQuery = await sbCreatePreviousMessageListQuery(
    channelUrl
  );
  if (previousMessageListQuery.hasMore) {
    return sbGetMessageList(previousMessageListQuery)
      .then(messages => {
        dispatch({
          type: GET_PREV_MESSAGES_SUCCESS,
          payload: messages
        });
      })
      .catch(error => dispatch({ type: GET_PREV_MESSAGES_FAILURE }));
  } else {
    dispatch({
      type: GET_PREV_MESSAGES_SUCCESS,
      list: []
    });
  }
};

export const sendMessage = (channel, textMessage) => async dispatch => {
  dispatch({ type: SEND_MESSAGE_PENDING });
  return sbSendTextMessage(channel, textMessage)
    .then(message => {
      dispatch({ type: SEND_MESSAGE_SUCCESS, payload: message });
    })
    .catch(error => {
      console.log(error);
      dispatch({ type: SEND_MESSAGE_FAILURE });
    });
};

export const setChannel = channel => dispatch => {
  dispatch({ type: SET_CHANNEL, payload: channel });
};

export const setChannelWithUrl = channelUrl => dispatch => {
  return sbGetGroupChannel(channelUrl).then(channel => {
    dispatch({ type: SET_CHANNEL, payload: channel });
  });
};
export const createGroupChannelListHandler = () => dispatch => {
  const sb = SendBird.getInstance();
  let channelHandler = new sb.ChannelHandler();
  channelHandler.onChannelChanged = channel => {
    dispatch({
      type: GROUP_CHANNEL_CHANGED,
      payload: channel
    });
  };
  sb.addChannelHandler('GROUP_CHANNEL_LIST_HANDLER', channelHandler);
  return;
};
export const createMessageHandler = (prevState, state) => dispatch => {
  let currentChannelUrl = state.channel.url
    ? state.channel.url
    : state.channel.channel_url;
  console.log('currentChannelUrl', currentChannelUrl);

  const sb = SendBird.getInstance();
  let channelHandler = new sb.ChannelHandler();
  channelHandler.onMessageReceived = (channel, message) => {
    if (state.channel) {
      if (channel.url === currentChannelUrl) {
        channel.markAsRead();
        dispatch({
          type: MESSAGE_RECEIVED,
          payload: message
        });
      } else {
        msgNoti(message);
      }
    } else {
      msgNoti(message);
    }
  };
  if (prevState) {
    sb.removeChannelHandler(prevState.channel.url);
  }
  sb.addChannelHandler(state.channel.url, channelHandler);
};

export default handleActions(
  {
    [SET_CHANNEL]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: false,
        channel: action.payload
      };
    },
    [MESSAGE_RECEIVED]: (state, action) => {
      console.log('action', action.payload);
      return {
        ...state,
        messages: uniqueList([...[action.payload], ...state.messages])
      };
    },
    [GET_CHANNELS_PENDING]: (state, action) => {
      return {
        ...state,
        pending: true,
        error: false
      };
    },
    [GET_CHANNELS_SUCCESS]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: false,
        channels: action.payload
      };
    },
    [GET_CHANNELS_FAILURE]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: true
      };
    },
    [CREATE_CHANNEL_PENDING]: (state, action) => {
      return {
        ...state,
        pending: true,
        error: false
      };
    },
    [CREATE_CHANNEL_SUCCESS]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: false,
        channel: action.payload
      };
    },
    [CREATE_CHANNEL_FAILURE]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: true
      };
    },
    [SEND_MESSAGE_PENDING]: (state, action) => {
      return {
        ...state,
        pending: true,
        error: false
      };
    },
    [SEND_MESSAGE_SUCCESS]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: false,
        messages: uniqueList([...[action.payload], ...state.messages])
      };
    },
    [SEND_MESSAGE_FAILURE]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: true
      };
    },
    [GET_PREV_MESSAGES_PENDING]: (state, action) => {
      return {
        ...state,
        pending: true,
        error: false
      };
    },
    [GET_PREV_MESSAGES_SUCCESS]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: false,
        messages: action.payload
      };
    },
    [GET_PREV_MESSAGES_FAILURE]: (state, action) => {
      return {
        ...state,
        pending: false,
        error: true
      };
    },
    [GROUP_CHANNEL_CHANGED]: (state, action) => {
      const changedChannel = action.payload;
      const updatedChannels = state.channels.map(channel => {
        return channel.url === changedChannel.url ? changedChannel : channel;
      });
      const searchChangedChannel = state.channels.filter(channel => {
        return channel.url === changedChannel.url;
      })[0];
      const newChannels = searchChangedChannel
        ? updatedChannels
        : [...[changedChannel], ...updateList];

      return {
        ...state,
        channels: newChannels
        // newMessage: changedChannel.lastMessage
      };
    }
  },
  initialState
);
