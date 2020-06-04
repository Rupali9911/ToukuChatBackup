import {client} from '../../helpers/api';

export const SET_CURRENT_CHANNEL_DATA = 'SET_CURRENT_CHANNEL_DATA';

export const GET_USER_CHANNELS_REQUEST = 'GET_USER_CHANNELS_REQUEST';
export const GET_USER_CHANNELS_SUCCESS = 'GET_USER_CHANNELS_SUCCESS';
export const GET_USER_CHANNELS_FAIL = 'GET_USER_CHANNELS_FAIL';

export const GET_CREATE_CHANNEL_REQUEST = 'GET_CREATE_CHANNEL_REQUEST';
export const GET_CREATE_CHANNEL_SUCCESS = 'GET_CREATE_CHANNEL_SUCCESS';
export const GET_CREATE_CHANNEL_FAIL = 'GET_CREATE_CHANNEL_FAIL';

const initialState = {
  loading: false,
  userChannels: [],
  currentChannel: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_CHANNELS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case SET_CURRENT_CHANNEL_DATA:
      return {
        ...state,
        currentChannel: action.payload,
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

    default:
      return state;
  }
}

//Actions
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

//Create Channel
const getCreateChannelRequest = () => ({
  type: GET_CREATE_CHANNEL_REQUEST,
});

const getCreateChannelSuccess = () => ({
  type: GET_CREATE_CHANNEL_SUCCESS,
});

const getCreateChannelFailure = () => ({
  type: GET_CREATE_CHANNEL_FAIL,
});

//Set Current Channel Data
const setCurrentChannelData = (data) => ({
  type: SET_CURRENT_CHANNEL_DATA,
  payload: data,
});

//Set Current Friend
export const setCurrentChannel = (channel) => (dispatch) =>
  dispatch(setCurrentChannelData(channel));

//Get user channels
export const getUserChannels = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getUserChannelsRequest());
    client
      .get(`/xchat/get-my-channel/?start=0`)
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
export const getChannelDetails = (id) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`/xchat/channel-details/` + id + '/')
      .then((res) => {
        alert(JSON.stringify(res));
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
