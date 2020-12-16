import {client} from '../../helpers/api';
import {
  setChannels,
  getChannels,
  setChannelChatConversation,
  getChannelChatConversation,
} from '../../storage/Service';

export const SET_CURRENT_CHANNEL_DATA = 'SET_CURRENT_CHANNEL_DATA';
export const UPDATE_CURRENT_CHANNEL_DATA = 'UPDATE_CURRENT_CHANNEL_DATA';
export const GET_USER_CHANNELS_REQUEST = 'GET_USER_CHANNELS_REQUEST';
export const GET_USER_CHANNELS_SUCCESS = 'GET_USER_CHANNELS_SUCCESS';
export const GET_USER_CHANNELS_FAIL = 'GET_USER_CHANNELS_FAIL';

export const GET_USER_MORE_CHANNELS_SUCCESS = 'GET_USER_MORE_CHANNELS_SUCCESS';

export const GET_FOLLOWING_CHANNELS_REQUEST = 'GET_FOLLOWING_CHANNELS_REQUEST';
export const GET_FOLLOWING_CHANNELS_SUCCESS = 'GET_FOLLOWING_CHANNELS_SUCCESS';
export const GET_FOLLOWING_CHANNELS_FAIL = 'GET_FOLLOWING_CHANNELS_FAIL';

export const GET_MORE_FOLLOWING_CHANNELS_SUCCESS =
  'GET_MORE_FOLLOWING_CHANNELS_SUCCESS';

export const GET_CREATE_CHANNEL_REQUEST = 'GET_CREATE_CHANNEL_REQUEST';
export const GET_CREATE_CHANNEL_SUCCESS = 'GET_CREATE_CHANNEL_SUCCESS';
export const GET_CREATE_CHANNEL_FAIL = 'GET_CREATE_CHANNEL_FAIL';

export const GET_CHANNEL_DETAIL_REQUEST = 'GET_CHANNEL_DETAIL_REQUEST';
export const GET_CHANNEL_DETAIL_SUCCESS = 'GET_CHANNEL_DETAIL_SUCCESS';
export const GET_CHANNEL_DETAIL_FAIL = 'GET_CHANNEL_DETAIL_FAIL';

export const GET_CHANNEL_CONVERSATION_REQUEST =
  'GET_CHANNEL_CONVERSATION_REQUEST';
export const GET_CHANNEL_CONVERSATION_SUCCESS =
  'GET_CHANNEL_CONVERSATION_SUCCESS';
export const GET_CHANNEL_CONVERSATION_FAIL = 'GET_CHANNEL_CONVERSATION_FAIL';

export const SET_UNREAD_CHANNEL_MSG_COUNTS = 'SET_UNREAD_CHANNEL_MSG_COUNTS';

export const GET_CHANNEL_CONVERSATION = 'GET_CHANNEL_CONVERSATION';
export const SET_CHANNEL_CONVERSATION = 'SET_CHANNEL_CONVERSATION';
export const RESET_CHANNEL_CONVERSATION = 'RESET_CHANNEL_CONVERSATION';
export const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';
export const Delete_Message = 'Delete_Message';

const initialState = {
  loading: false,
  userChannels: [],
  followingChannels: [],
  currentChannel: {},
  chatConversation: [],
  unreadChannelMsgsCounts: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_CHANNEL_DATA:
      return {
        ...state,
        currentChannel: action.payload,
      };
    case UPDATE_CURRENT_CHANNEL_DATA:
      return {
        ...state,
        currentChannel: {
          ...state.currentChannel,
          channel_picture: action.payload.channel_picture,
          description: action.payload.description,
          name: action.payload.name,
        },
      };

    //Get Following Channels
    case GET_FOLLOWING_CHANNELS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_FOLLOWING_CHANNELS_SUCCESS:
      return {
        ...state,
        loading: false,
        followingChannels: action.payload,
      };

    case GET_MORE_FOLLOWING_CHANNELS_SUCCESS:
      return {
        ...state,
        loading: false,
        followingChannels: state.followingChannels.concat(action.payload),
      };

    case GET_FOLLOWING_CHANNELS_FAIL:
      return {
        ...state,
        loading: false,
      };

    //Get User Channels
    case GET_USER_CHANNELS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_USER_CHANNELS_SUCCESS:
      return {
        ...state,
        loading: false,
        userChannels: action.payload,
      };

    case GET_USER_MORE_CHANNELS_SUCCESS:
      return {
        ...state,
        loading: false,
        userChannels: state.userChannels.concat(action.payload),
      };

    case GET_USER_CHANNELS_FAIL:
      return {
        ...state,
        loading: false,
      };

    case GET_CREATE_CHANNEL_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_CREATE_CHANNEL_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_CREATE_CHANNEL_FAIL:
      return {
        ...state,
        loading: false,
      };

    //Get Channel Detail
    case GET_CHANNEL_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_CHANNEL_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_CHANNEL_DETAIL_FAIL:
      return {
        ...state,
        loading: false,
      };

    //Get Channel Conversations
    case GET_CHANNEL_CONVERSATION_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_CHANNEL_CONVERSATION_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_CHANNEL_CONVERSATION_FAIL:
      return {
        ...state,
        loading: false,
      };

    case SET_UNREAD_CHANNEL_MSG_COUNTS:
      return {
        ...state,
        unreadChannelMsgsCounts: action.payload,
      };
    case SET_CHANNEL_CONVERSATION:
      return {
        ...state,
        chatConversation: action.payload,
      };
    case RESET_CHANNEL_CONVERSATION:
      return {
        ...state,
        chatConversation: [],
      };
    case ADD_NEW_MESSAGE:
      return {
        ...state,
        chatConversation: [action.payload, ...state.chatConversation],
      };
    case Delete_Message:
      return {
        ...state,
        chatConversation: state.chatConversation.filter(
          (item) => item.id !== action.payload,
        ),
      };
    default:
      return state;
  }
}

//Actions
//Set Current Channel
const setCurrentChannelData = (data) => ({
  type: SET_CURRENT_CHANNEL_DATA,
  payload: data,
});

export const setCurrentChannel = (channel) => (dispatch) =>
  dispatch(setCurrentChannelData(channel));

const updateCurrentChannelData = (data) => ({
  type: UPDATE_CURRENT_CHANNEL_DATA,
  payload: data,
});

export const updateCurrentChannel = (channel) => (dispatch) =>
  dispatch(updateCurrentChannelData(channel));

//Set Unread Friend Msgs Count
const setUnreadChannelMsgsCounts = (counts) => ({
  type: SET_UNREAD_CHANNEL_MSG_COUNTS,
  payload: counts,
});

export const updateUnreadChannelMsgsCounts = (counts) => (dispatch) =>
  dispatch(setUnreadChannelMsgsCounts(counts));

//Get Following Channels
const getFollowingChannelsRequest = () => ({
  type: GET_FOLLOWING_CHANNELS_REQUEST,
});

const getFollowingChannelsSuccess = (data) => ({
  type: GET_FOLLOWING_CHANNELS_SUCCESS,
  payload: data,
});

const getMoreFollowingChannelsSuccess = (data) => ({
  type: GET_MORE_FOLLOWING_CHANNELS_SUCCESS,
  payload: data,
});

const getFollowingChannelsFailure = () => ({
  type: GET_FOLLOWING_CHANNELS_FAIL,
});

export const getLocalFollowingChannels = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    let channels = getChannels();
    if (channels.length) {
      let array = [];
      let counts = 0;
      channels.map((item, index) => {
        counts = counts + item.unread_msg;
        // let i = {
        //   id: item.id,
        //   name: item.name,
        //   unread_msg: item.unread_msg,
        //   total_members: item.total_members,
        //   description: item.description,
        //   chat: item.chat,
        //   channel_picture: item.channel_picture,
        //   last_msg: item.last_msg,
        //   is_pined: item.is_pined,
        //   created: item.created,
        //   joining_date: item.joining_date,
        // };
        // array = [...array, i];
      });

      array = channels.toJSON();
      console.log('array', array);

      dispatch(setUnreadChannelMsgsCounts(counts));
      dispatch(getFollowingChannelsSuccess(array));
    } else {
      dispatch(setUnreadChannelMsgsCounts(0));
      dispatch(getFollowingChannelsSuccess([]));
    }
    resolve();
  });

export const getFollowingChannels = (start = 0) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getFollowingChannelsRequest());
    recursionFollowingChannels(start)
      .then((res) => {
        let channels = getChannels();
        if (channels.length) {
          let array = [];
          let counts = 0;
          channels.map((item, index) => {
            counts = counts + item.unread_msg;
            // let i = {
            //   id: item.id,
            //   name: item.name,
            //   unread_msg: item.unread_msg,
            //   total_members: item.total_members,
            //   description: item.description,
            //   chat: item.chat,
            //   channel_picture: item.channel_picture,
            //   last_msg: item.last_msg,
            //   is_pined: item.is_pined,
            //   created: item.created,
            //   joining_date: item.joining_date,
            // };
            // array = [...array, i];
          });

          array = channels.toJSON();

          dispatch(setUnreadChannelMsgsCounts(counts));
          dispatch(getFollowingChannelsSuccess(array));
        } else {
          dispatch(setUnreadChannelMsgsCounts(0));
          dispatch(getFollowingChannelsSuccess([]));
          dispatch(getFollowingChannelsFailure());
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getFollowingChannelsFailure());
        reject(err);
      });

    // client
    //   .get(`/xchat/get-following-channel/?start=` + start)
    //   .then((res) => {
    //     if (res.conversations) {
    //       // console.log('channels_response',res.conversations);
    //       var channels = res.conversations;
    //       let unread_counts = 0;
    //       if (channels && channels.length > 0) {
    //          channels = channels.map(function (el) {
    //           unread_counts = unread_counts + el.unread_msg;
    //            return channels;
    //         });
    //         console.log(res.load_more);
    //         if (res.load_more) {
    //           console.log('getFollowingChannels',getFollowingChannels);
    //           getFollowingChannels(start + 20);
    //         }
    //         // dispatch(setUnreadChannelMsgsCounts(unread_counts));
    //         setChannels(res.conversations);

    //         if(!res.load_more){
    //           // dispatch(getFollowingChannelsSuccess(res.conversations));
    //           console.log('resolve');
    //           resolve(res);
    //         }

    //       }else{
    //         // dispatch(getFollowingChannelsSuccess(res.conversations));
    //         console.log('resolve');
    //         resolve(res);
    //       }
    //       // res.conversations.sort((a, b) =>
    //       //   a.created &&
    //       //   b.created &&
    //       //   new Date(a.last_msg ? a.last_msg.updated : a.created) <
    //       //     new Date(b.last_msg ? b.last_msg.updated : b.created)
    //       //     ? 1
    //       //     : -1
    //       // );

    //       // console.log('length',res.conversations.length);
    //       // dispatch(getFollowingChannelsSuccess(res.conversations));
    //     }else{
    //       // dispatch(getFollowingChannelsSuccess(res.conversations));
    //       console.log('resolve');
    //       resolve(res);
    //     }
    //   })
    //   .catch((err) => {
    //     dispatch(getFollowingChannelsFailure());
    //     reject(err);
    //   });
  });

export const recursionFollowingChannels = (start = 0) =>
  getChannel(start)
    .then((res) => {
      if (res.load_more) {
        return recursionFollowingChannels(start + 20).then((res) => res);
      } else {
        return res;
      }
    })
    .catch((err) => err);

const getChannel = (start) =>
  new Promise((resolve, reject) => {
    client
      .get(`/xchat/get-following-channel/?start=` + start)
      .then((res) => {
        if (res.conversations) {
          setChannels(res.conversations);
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const getMoreFollowingChannels = (start) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getFollowingChannelsRequest());
    client
      .get(`/xchat/get-following-channel/?start=` + start)
      .then((res) => {
        if (res.conversations) {
          dispatch(getMoreFollowingChannelsSuccess(res.conversations));
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getFollowingChannelsFailure());
        reject(err);
      });
  });

//Get User Channels
const getUserChannelsRequest = () => ({
  type: GET_USER_CHANNELS_REQUEST,
});

const getUserChannelsSuccess = (data) => ({
  type: GET_USER_CHANNELS_SUCCESS,
  payload: data,
});

const getMoreUserChannelsSuccess = (data) => ({
  type: GET_USER_MORE_CHANNELS_SUCCESS,
  payload: data,
});

const getUserChannelsFailure = () => ({
  type: GET_USER_CHANNELS_FAIL,
});

export const getUserChannels = (start = 0) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getUserChannelsRequest());
    client
      .get(`/xchat/get-my-channel/?start=` + start)
      .then((res) => {
        if (res.conversations) {
          dispatch(getUserChannelsSuccess(res.conversations));
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getUserChannelsFailure());
        reject(err);
      });
  });

export const getMoreUserChannels = (start = 20) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getUserChannelsRequest());
    client
      .get(`/xchat/get-my-channel/?start=` + start)
      .then((res) => {
        if (res.conversations) {
          dispatch(getMoreUserChannelsSuccess(res.conversations));
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getUserChannelsFailure());
        reject(err);
      });
  });

//Create New Channel
const getCreateChannelRequest = () => ({
  type: GET_CREATE_CHANNEL_REQUEST,
});

const getCreateChannelSuccess = () => ({
  type: GET_CREATE_CHANNEL_SUCCESS,
});

const getCreateChannelFailure = () => ({
  type: GET_CREATE_CHANNEL_FAIL,
});

export const createNewChannel = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getCreateChannelRequest());
    client
      .post(`/xchat/create-channel/`, data)
      .then((res) => {
        dispatch(getCreateChannelSuccess());
        resolve(res);
      })
      .catch((err) => {
        dispatch(getCreateChannelFailure());
        reject(err);
      });
  });

//Get channel details
const getChannelDetailRequest = () => ({
  type: GET_CHANNEL_DETAIL_REQUEST,
});

const getChannelDetailSuccess = () => ({
  type: GET_CHANNEL_DETAIL_SUCCESS,
});

const getChannelDetailFailure = () => ({
  type: GET_CHANNEL_DETAIL_FAIL,
});

export const getChannelDetails = (id) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getChannelDetailRequest());
    client
      .get(`/xchat/channel-details/` + id + '/')
      .then((res) => {
        dispatch(getChannelDetailSuccess());
        resolve(res);
      })
      .catch((err) => {
        dispatch(getChannelDetailFailure());
        reject(err);
      });
  });

//Get Channel Conversations
const getChannelConversationsRequest = () => ({
  type: GET_CHANNEL_CONVERSATION_REQUEST,
});

const getChannelConversationsSuccess = () => ({
  type: GET_CHANNEL_CONVERSATION_SUCCESS,
});

const getChannelConversationsFailure = () => ({
  type: GET_CHANNEL_CONVERSATION_FAIL,
});

export const setChannelConversation = (data) => ({
  type: SET_CHANNEL_CONVERSATION,
  payload: data,
});

export const resetChannelConversation = () => ({
  type: RESET_CHANNEL_CONVERSATION,
});

export const addNewSendMessage = (data) => ({
  type: ADD_NEW_MESSAGE,
  payload: data,
});

const deleteMessage = (data) => ({
  type: Delete_Message,
  payload: data,
});

export const getChannelConversations = (id, limit = 30) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getChannelConversationsRequest());
    console.log('id-', id, ',limit-', limit);
    client
      .get(`/xchat/channel-conversation/` + id + '/?' + limit)
      .then(async (res) => {
        console.log('res_channel_conversation', JSON.stringify(res));
        setChannelChatConversation(res.conversation);
        dispatch(getFollowingChannels(0));
        dispatch(getChannelConversationsSuccess());
        resolve(res);
      })
      .catch((err) => {
        dispatch(getChannelConversationsFailure());
        reject(err);
      });
  });

//Read All Message Channel Chat
export const readAllChannelMessages = (id) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`/xchat/read-all-msg-channelchat/` + id + '/')
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Unfollow Channel
export const unfollowChannel = (id, user) => (dispatch) =>
  new Promise(function (resolve, reject) {
    console.log('id', id, 'user', user);

    client
      .patch(`/xchat/unfollow-channel/` + id + '/', user)
      .then((res) => {
        console.log('res', res);
        resolve(res);
      })
      .catch((err) => {
        console.log('res err', err);
        reject(err);
      });
  });

//Follow Channel
export const followChannel = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/check-user-in-channel/`, data)
      .then((res) => {
        resolve(res);
        dispatch(getChannelConversations(data.channel_id, 30))
          .then((res) => {
            dispatch(readAllChannelMessages(data.channel_id));
          })
          .catch(() => {});
      })
      .catch((err) => {
        reject(err);
      });
  });

//Follow Channel
export const sendChannelMessage = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/send-channel-message/`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const editChannelMessage = (id, payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .patch(`/xchat/edit-channel-message/${id}/`, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const deleteChannelMessage = (id, payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .patch(`/xchat/delete-channel-message/${id}/`, payload)
      .then((res) => {
        // alert(JSON.stringify(res));
        resolve(res);
        dispatch(deleteMessage(id));
      })
      .catch((err) => {
        reject(err);
      });
  });

export const deleteMultipleChannelMessage = (payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/delete-multiple-message-from-channel/`, payload)
      .then((res) => {
        // alert(JSON.stringify(res));
        resolve(res);
        // dispatch(deleteMessage(id));
      })
      .catch((err) => {
        reject(err);
      });
  });

export const getLoginBonusOfChannel = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`xigolo_payment/login_jackpot/`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const checkLoginBonusOfChannel = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`xigolo_payment/user_login_jackpot/`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const selectLoginJackpotOfChannel = (payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`xigolo_payment/select_login_jackpot/`, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const assetXPValueOfChannel = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`asset-xp-value/`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const pinChannel = (channelId, data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .patch(`xchat/pin-channel/${channelId}/`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
// Unpin Channel
export const unpinChannel = (channelId, data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .patch(`xchat/unpin-channel/${channelId}/`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
