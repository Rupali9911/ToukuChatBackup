import axios from 'axios';
import {
  apiRoot,
  client,
  GET_TOUKU_POINTS,
  GET_USER_CONFIG,
  GET_MAINTENANCE,
  UPDATE_CHANNEL_MODE,
  userAgent,
} from '../../helpers/api';

export const SET_USER_CONFIGURATION = 'SET_USER_CONFIGURATION';
export const SET_USER_PROFILE = 'SET_USER_PROFILE';

export const GET_UPLOAD_AVATAR_REQUEST = 'GET_UPLOAD_AVATAR_REQUEST';
export const GET_UPLOAD_AVATAR_SUCCESS = 'GET_UPLOAD_AVATAR_SUCCESS';
export const GET_UPLOAD_AVATAR_FAIL = 'GET_UPLOAD_AVATAR_FAIL';

export const UPDATE_CHANNEL_MODE_REQUEST = 'UPDATE_CHANNEL_MODE_REQUEST';
export const UPDATE_CHANNEL_MODE_SUCCESS = 'UPDATE_CHANNEL_MODE_SUCCESS';
export const UPDATE_CHANNEL_MODE_FAIL = 'UPDATE_CHANNEL_MODE_FAIL';
export const UPDATE_USER_BACKGROUND_IMAGE = 'UPDATE_USER_BACKGROUND_IMAGE';
export const UPDATE_USER_DISPLAY_NAME = 'UPDATE_USER_DISPLAY_NAME';

const uuid = require('react-native-uuid');

// Reducer initial state
const initialState = {
  loading: false,
  userConfig: {
    display_name: '',
    background_image: '',
  },
};

/**
 * Reducer
 */
export default (state = initialState, action) => {
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
      };
    case UPDATE_USER_DISPLAY_NAME:
      return {
        ...state,
        userConfig: {
          ...state.userConfig,
          display_name: action.payload.display_name,
        },
      };
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

      case GET_UPLOAD_AVATAR_REQUEST:
          return {
              ...state,
              loading: true,
          };
      case GET_UPLOAD_AVATAR_SUCCESS:
          return {
              ...state,
              loading: false,
          };
      case GET_UPLOAD_AVATAR_FAIL:
          return {
              ...state,
              loading: false,
          };
    default:
      return state;
  }
};

/**
 * Actions
 */

const updateChannelModeRequest = () => ({
  type: UPDATE_CHANNEL_MODE_REQUEST,
});

const updateChannelModeSuccess = () => ({
  type: UPDATE_CHANNEL_MODE_SUCCESS,
});

const updateChannelModeFailure = () => ({
  type: UPDATE_CHANNEL_MODE_FAIL,
});

const getUploadAvatarRequest = () => ({
  type: GET_UPLOAD_AVATAR_REQUEST,
});

const getUploadAvatarSuccess = () => ({
  type: GET_UPLOAD_AVATAR_SUCCESS,
});

const getUploadAvatarFailure = () => ({
  type: GET_UPLOAD_AVATAR_FAIL,
});

// Get User Profile
const setUserData = (data) => ({
  type: SET_USER_PROFILE,
  payload: {
    data: data,
  },
});

// Actions

// Get User Configuration
const setUserConfig = (data) => ({
  type: SET_USER_CONFIGURATION,
  payload: {
    data: data,
  },
});

// Update user background image
export const updateUserBackgroundImage = (data) => {
  return {type: UPDATE_USER_BACKGROUND_IMAGE, payload: data};
};

// Update user display name
export const updateUserDisplayName = (data) => {
  return {type: UPDATE_USER_DISPLAY_NAME, payload: data};
};

// Get User Profile
export const getUserProfile = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get('/profile/')
      .then((res) => {
        if (res.id) {
          if (res.user_type === 'user') {
            res.user_category = 'anx';
            res.user_type = 'user';
          } else if (res.user_type === 'company') {
            res.user_category = 'anx';
            res.user_type = 'company';
          } else if (res.user_type === 'owner') {
            res.user_category = 'anx';
            res.user_type = 'owner';
          }
          // For ANV users
          if (res.user_type === 'user_anv') {
            res.user_category = 'anv';
            res.user_type = 'user';
          } else if (res.user_type === 'company_anv') {
            res.user_category = 'anv';
            res.user_type = 'company';
          } else if (res.user_type === 'owner_anv') {
            res.user_category = 'anv';
            res.user_type = 'owner';
          }
          // For ANT users
          if (res.user_type === 'user_ant') {
            res.user_category = 'ant';
            res.user_type = 'user';
          } else if (res.user_type === 'company_ant') {
            res.user_category = 'ant';
            res.user_type = 'company';
          } else if (res.user_type === 'owner_ant') {
            res.user_category = 'ant';
            res.user_type = 'owner';
          }
          // For general users
          if (res.user_type === 'user_general') {
            res.user_category = 'general';
            res.user_type = 'user';
          } else if (res.user_type === 'company_general') {
            res.user_category = 'general';
            res.user_type = 'company';
          } else if (res.user_type === 'owner_general') {
            res.user_category = 'general';
            res.user_type = 'owner';
          }
          dispatch(setUserData(res));
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

// Set channel mode
export const setChannelMode = (userConfig, channelMode) => (dispatch) =>
  new Promise(function (resolve) {
    userConfig.channel_mode = channelMode;
    dispatch(setUserConfig(userConfig));
    resolve(userConfig);
  });

// Get user config
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

// Update channel mode
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

// Update configuration
export const updateConfiguration = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post('/xchat/configuration/', data)
      .then((res) => {
        dispatch(setUserConfig(res));
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

// Get Touku Points
export const getToukuPoints = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(GET_TOUKU_POINTS, data)
      .then((res) => {
          console.log('getToukuPoints', res)
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const uploadAvatar = (data, token) => (dispatch) =>
    new Promise(function (resolve, reject) {
        dispatch(getUploadAvatarRequest());
        let name = uuid.v4();
        let formData = new FormData();
        formData.append('avatar_thumbnail', {
            uri: data.replace('file://', ''),
            mineType: 'image/jpeg',
            fileType: 'image/jpg',
            type: 'image/jpg',
            name: name + '.jpg',
        });
        formData.append('avatar', {
            uri: data.replace('file://', ''),
            mineType: 'image/jpeg',
            fileType: 'image/jpg',
            type: 'image/jpg',
            name: name + '.jpg',
        });
        console.log('Token and Form Data', token, formData);
        axios
            .post(`${apiRoot}/avatar-upload/`, formData, {
                headers: {
                    'Content-Type':
                        'multipart/form-data; charset=utf-8; boundary=----WebKitFormBoundary3zGb8o6Nkel7zNjl',
                    'User-Agent': userAgent,
                    Origin: 'touku',
                    Authorization: token,
                },
            })
            .then((resp) => {
                console.log('uploadAvatar API responser', resp);
                dispatch(getUploadAvatarSuccess());
                resolve(resp);
            })
            .catch((err) => {
                console.log('uploadAvatar API response', err.response);
                dispatch(getUploadAvatarFailure());
                reject(err);
            });
    });

export const getMaintenance = () =>
    new Promise(function (resolve, reject) {
        client
            .get(GET_MAINTENANCE)
            .then((res) => {
                console.log('getMaintenance Response', res)
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
