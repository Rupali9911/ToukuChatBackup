import {client} from '../../helpers/api';
import AsyncStorage from '@react-native-community/async-storage';

export const SET_USER_PROFILE = 'SET_USER_PROFILE';

export const GET_UPLOAD_AVATAR_REQUEST = 'GET_UPLOAD_AVATAR_REQUEST';
export const GET_UPLOAD_AVATAR_SUCCESS = 'GET_UPLOAD_AVATAR_SUCCESS';
export const GET_UPLOAD_AVATAR_FAIL = 'GET_UPLOAD_AVATAR_FAIL';

export const GET_CHANGE_NAME_REQUEST = 'GET_CHANGE_NAME_REQUEST';
export const GET_CHANGE_NAME_SUCCESS = 'GET_CHANGE_NAME_SUCCESS';
export const GET_CHANGE_NAME_FAIL = 'GET_CHANGE_NAME_FAIL';

export const GET_CHANGE_PASSWORD_REQUEST = 'GET_CHANGE_PASSWORD_REQUEST';
export const GET_CHANGE_PASSWORD_SUCCESS = 'GET_CHANGE_PASSWORD_SUCCESS';
export const GET_CHANGE_PASSWORD_FAIL = 'GET_CHANGE_PASSWORD_FAIL';

export const GET_CONFIGURATION_REQUEST = 'GET_CONFIGURATION_REQUEST';
export const GET_CONFIGURATION_SUCCESS = 'GET_CONFIGURATION_SUCCESS';
export const GET_CONFIGURATION_FAIL = 'GET_CONFIGURATION_FAIL';

const initialState = {
  loading: false,
  userData: {},
  configuration: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER_PROFILE:
      return {
        ...state,
        loading: false,
        userData: action.payload.data,
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

    case GET_CHANGE_NAME_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_CHANGE_NAME_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case GET_CHANGE_NAME_FAIL:
      return {
        ...state,
        loading: false,
      };

    case GET_CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case GET_CHANGE_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
      };

    //Get Configuration
    case GET_CONFIGURATION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_CONFIGURATION_SUCCESS:
      return {
        ...state,
        loading: false,
        configuration: action.payload,
      };
    case GET_CONFIGURATION_FAIL:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

//Actions
//Get User Profile
const setUserData = (data) => ({
  type: SET_USER_PROFILE,
  payload: {
    data: data,
  },
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

//Change Name
const getChangeNameRequest = () => ({
  type: GET_CHANGE_NAME_REQUEST,
});

const getChangeNameSuccess = () => ({
  type: GET_CHANGE_NAME_SUCCESS,
});

const getChangeNameFailure = () => ({
  type: GET_CHANGE_NAME_FAIL,
});

//Change Password
const getChangePasswordRequest = () => ({
  type: GET_CHANGE_PASSWORD_REQUEST,
});

const getChangePasswordSuccess = () => ({
  type: GET_CHANGE_PASSWORD_SUCCESS,
});

const getChangePasswordFailure = () => ({
  type: GET_CHANGE_PASSWORD_FAIL,
});

export const facebookRegister = (socialLoginData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/facebook-login-auth/`, socialLoginData)
      .then((res) => {
        if (res.token) {
          AsyncStorage.setItem('socialToken', res.token);
          // dispatch(getLoginSuccess(res.token))
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const googleRegister = (socialLoginData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/google-login-auth/`, socialLoginData)
      .then((res) => {
        if (res.token) {
          AsyncStorage.setItem('socialToken', res.token);
          // dispatch(getLoginSuccess(res.token))
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const twitterRegister = (socialLoginData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/twitter-login-auth/`, socialLoginData)
      .then((res) => {
        if (res.token) {
          AsyncStorage.setItem('socialToken', res.token);
          // dispatch(getLoginSuccess(res.token))
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const lineRegister = (socialLoginData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/line-login-auth/`, socialLoginData)
      .then((res) => {
        if (res.token) {
          AsyncStorage.setItem('socialToken', res.token);
          // dispatch(getLoginSuccess(res.token))
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Get User Profile
export const getUserProfile = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`/profile/`)
      .then((res) => {
        if (res.id) {
          dispatch(setUserData(res));
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const uploadAvatar = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getUploadAvatarRequest());
    client
      .post(`/avatar-upload/`, data)
      .then((res) => {
        dispatch(getUploadAvatarSuccess());
        resolve(res);
      })
      .catch((err) => {
        dispatch(getUploadAvatarFailure());
        reject(err);
      });
  });

export const changeNameDetails = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getChangeNameRequest());
    client
      .put(`/name_details/`, data)
      .then((res) => {
        dispatch(getChangeNameSuccess());
        resolve(res);
      })
      .catch((err) => {
        dispatch(getChangeNameFailure());
        reject(err);
      });
  });

export const changePassword = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getChangePasswordRequest());
    client
      .put(`/change-password/`, data)
      .then((res) => {
        if (res.status === true) {
          dispatch(getChangePasswordSuccess());
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getChangePasswordFailure());
        reject(err);
      });
  });

export const changeEmailSendOtp = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/change/send-email-otp/`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const changeEmail = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/change/change_email/`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const changeBackgroundImage = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/configuration/`, data)
      .then((res) => {
        dispatch(getConfiguraionSuccess(res));
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Get Configuration
const getConfiguraionRequest = () => ({
  type: GET_CONFIGURATION_REQUEST,
});

const getConfiguraionSuccess = (data) => ({
  type: GET_CONFIGURATION_SUCCESS,
  payload: data,
});

const getConfiguraionFailure = () => ({
  type: GET_CONFIGURATION_FAIL,
});

export const getConfiguration = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getConfiguraionRequest());
    client
      .get(`/xchat/configuration/`)
      .then((res) => {
        dispatch(getConfiguraionSuccess(res));
        resolve(res);
      })
      .catch((err) => {
        dispatch(getConfiguraionFailure());
        reject(err);
      });
  });
