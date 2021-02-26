import {
  client,
  GET_USER_CONFIG,
  UPDATE_CHANNEL_MODE,
  GET_TOUKU_POINTS,
} from '../../helpers/api';
import {wSetChannelMode} from '../utility/worker';
import {UPDATE_CURRENT_FRIEND_BACKGROUND_IMAGE} from "./friendReducer";

export const SET_USER_CONFIGURATION = 'SET_USER_CONFIGURATION';

export const UPDATE_CHANNEL_MODE_REQUEST = 'UPDATE_CHANNEL_MODE_REQUEST';
export const UPDATE_CHANNEL_MODE_SUCCESS = 'UPDATE_CHANNEL_MODE_SUCCESS';
export const UPDATE_CHANNEL_MODE_FAIL = 'UPDATE_CHANNEL_MODE_FAIL';
export const UPDATE_USER_BACKGROUND_IMAGE = "UPDATE_USER_BACKGROUND_IMAGE";
export const UPDATE_USER_DISPLAY_NAME = "UPDATE_USER_DISPLAY_NAME";

const initialState = {
  loading: false,
  userConfig: {
      display_name: '',
      background_image: ''
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER_CONFIGURATION:
      return {
        ...state,
        loading: false,
        userConfig: action.payload.data,
      };
    case UPDATE_USER_BACKGROUND_IMAGE:
      return {
        ...state,
        userConfig: {
          ...state.userConfig,
          background_image: action.payload.background_image,
        },
      }
    case UPDATE_USER_DISPLAY_NAME:
      return {
        ...state,
        userConfig: {
          ...state.userConfig,
          display_name: action.payload.display_name,
        },
      }
    case UPDATE_CHANNEL_MODE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_CHANNEL_MODE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case UPDATE_CHANNEL_MODE_FAIL:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

//Update Channel Mode
const updateChannelModeRequest = () => ({
  type: UPDATE_CHANNEL_MODE_REQUEST,
});

const updateChannelModeSuccess = () => ({
  type: UPDATE_CHANNEL_MODE_SUCCESS,
});

const updateChannelModeFailure = () => ({
  type: UPDATE_CHANNEL_MODE_FAIL,
});

//Actions
//Get User Configuration
const setUserConfig = (data) => ({
  type: SET_USER_CONFIGURATION,
  payload: {
    data: data,
  },
});

export const updateUserBackgroundImage = (data) => {
    return {type: UPDATE_USER_BACKGROUND_IMAGE, payload: data};
}

export const updateUserDisplayName = (data) => {
  return {type: UPDATE_USER_DISPLAY_NAME, payload: data};
}

// set channel mode
export const setChannelMode = (userConfig, channelMode) => (dispatch) =>
  new Promise(function (resolve, reject) {
    userConfig.channel_mode = channelMode;
    dispatch(setUserConfig(userConfig));
    resolve(userConfig);
  });

//Get User Config
export const getUserConfiguration = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(GET_USER_CONFIG)
      .then((res) => {
        dispatch(setUserConfig(res));
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const updateChannelMode = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(updateChannelModeRequest());
    client
      .put(UPDATE_CHANNEL_MODE, data)
      .then((res) => {
        dispatch(updateChannelModeSuccess());
        resolve(res);
      })
      .catch((err) => {
        dispatch(updateChannelModeFailure());
        reject(err);
      });
  });

export const updateConfiguration = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/configuration/`, data)
      .then((res) => {
        dispatch(setUserConfig(res));
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const getToukuPoints = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(GET_TOUKU_POINTS, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
