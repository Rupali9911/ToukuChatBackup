import { client } from '../../helpers/api';

export const SET_CURRENT_CHANNEL_DATA = 'SET_CURRENT_CHANNEL_DATA';

export const GET_USER_CHANNELS_REQUEST = 'GET_USER_CHANNELS_REQUEST';
export const GET_USER_CHANNELS_SUCCESS = 'GET_USER_CHANNELS_SUCCESS';
export const GET_USER_CHANNELS_FAIL = 'GET_USER_CHANNELS_FAIL';

export const GET_FOLLOWING_CHANNELS_REQUEST = 'GET_FOLLOWING_CHANNELS_REQUEST';
export const GET_FOLLOWING_CHANNELS_SUCCESS = 'GET_FOLLOWING_CHANNELS_SUCCESS';
export const GET_FOLLOWING_CHANNELS_FAIL = 'GET_FOLLOWING_CHANNELS_FAIL';

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

const initialState = {
  loading: false,
  userChannels: [],
  followingChannels: [],
  currentChannel: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_CHANNEL_DATA:
      return {
        ...state,
        currentChannel: action.payload,
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

//Get Following Channels
const getFollowingChannelsRequest = () => ({
  type: GET_FOLLOWING_CHANNELS_REQUEST,
});

const getFollowingChannelsSuccess = (data) => ({
  type: GET_FOLLOWING_CHANNELS_SUCCESS,
  payload: data,
});

const getFollowingChannelsFailure = () => ({
  type: GET_FOLLOWING_CHANNELS_FAIL,
});

export const getFollowingChannels = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getFollowingChannelsRequest());
    client
      .get(`/xchat/get-following-channel/?start=0`)
      .then((res) => {
        if (res.conversations) {
          dispatch(getFollowingChannelsSuccess(res.conversations));
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

export const getChannelConversations = (id, limit = 30) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getChannelConversationsRequest());
    client
      .get(`/xchat/channel-conversation/` + id + '/?' + limit)
      .then((res) => {
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
    client
      .patch(`/xchat/unfollow-channel/` + id + '/', user)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
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

export const editChannelMessage = (data) => (dispatch) =>
  // {message_body: "Fffffvbccc"}
  new Promise(function (resolve, reject) {
    client
      .PATCH(`/xchat/edit-channel-message/${data.id}/`, data.payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
