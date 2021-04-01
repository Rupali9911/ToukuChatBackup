import {client, userAgent} from '../../helpers/api';
import AsyncStorage from '@react-native-community/async-storage';
import {KAKAO_API_KEY, apiRoot} from '../../helpers/api';
import Toast from '../../components/Toast';
import {translate} from './languageReducer';
import axios from 'axios';
import { dispatch } from 'rxjs/internal/observable/pairs';

export const SET_CURRENT_ROUTE_NAME = 'SET_CURRENT_ROUTE_NAME';

export const SET_USER_PROFILE = 'SET_USER_PROFILE';

export const GET_CHANGE_NAME_REQUEST = 'GET_CHANGE_NAME_REQUEST';
export const GET_CHANGE_NAME_SUCCESS = 'GET_CHANGE_NAME_SUCCESS';
export const GET_CHANGE_NAME_FAIL = 'GET_CHANGE_NAME_FAIL';

export const GET_CHANGE_PASSWORD_REQUEST = 'GET_CHANGE_PASSWORD_REQUEST';
export const GET_CHANGE_PASSWORD_SUCCESS = 'GET_CHANGE_PASSWORD_SUCCESS';
export const GET_CHANGE_PASSWORD_FAIL = 'GET_CHANGE_PASSWORD_FAIL';
let uuid = require('react-native-uuid');

const initialState = {
  loading: false,
  userData: {},
  currentRouteName: '',

};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER_PROFILE:
      return {
        ...state,
        loading: false,
        userData: {...action.payload.data},
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
    case SET_CURRENT_ROUTE_NAME:
      return {
        ...state,
        currentRouteName: action.payload.data,
      };

    default:
      return state;
  }
}

//Actions
// Set current route name
export const setCurrentRouteData = (data) => ({
  type: SET_CURRENT_ROUTE_NAME,
  payload: {
    data: data,
  },
});

//Get User Profile
const setUserData = (data) => ({
  type: SET_USER_PROFILE,
  payload: {
    data: data,
  },
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

export const kakaoRegister = (socialLoginData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/kakao-login-auth/`, socialLoginData)
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

export const appleRegister = (socialLoginData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/apple-login-auth/`, socialLoginData)
      .then((res) => {
        if (res.token) {
          AsyncStorage.setItem('socialToken', res.token);
          // dispatch(getLoginSuccess(res.token))
        }
        resolve(res);
      })
      .catch((err) => {
        // reject(err);
        console.log('Error from Apple login', err);
        if (err.response) {
          console.log('Error from Apple login', err.response);
          if (err.response.data) {
            console.log('Error from Apple login', err.response.data);
            Toast.show({
              title: 'Login Failed',
              text: translate(err.response.data.toString()),
              type: 'primary',
            });
          }
        }
      });
  });

export const getAccessCodeKakao = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(
        'https://kauth.kakao.com/oauth/authorize?client_id=' +
          KAKAO_API_KEY +
          '&scope=account_email&redirect_uri=https://touku.angelium.net&response_type=code&auth_tran_id=lvlxw5uu5g7608d108073fe9a65906c012b5c3f489kbkep4jw',
      )
      .then((res) => {
        // if (res.token) {
        //     AsyncStorage.setItem('socialToken', res.token);
        //     // dispatch(getLoginSuccess(res.token))
        // }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const updateUserProfileImage = (data) => (dispatch) => {
  dispatch(setUserData(data));
}

//Get User Profile
export const getUserProfile = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`/profile/`)
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
      .post(`/xchat/send-email-otp/`, data)
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
      .post(`/xchat/change-email/`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

// set touku points
export const setToukuPoints = (userData, toukuPoints) => (dispatch) =>
  new Promise(function (resolve, reject) {
    userData.total_tp = toukuPoints;
    dispatch(setUserData(userData));
    resolve(userData);
  });

export const getMissedSocketEventsById = (id) => (dispatch) =>
  new Promise(function (resolve, reject) {
    console.log('getMissedSocketEventsById called', id);
    client
      .get(`/xchat/get-missed-socket-events/?socket_event_id=` + id)
      .then((res) => {
        console.log('res getMissedSocketEventsById', res);
        resolve(res);
      })
      .catch((err) => {
        console.log('Error getMissedSocketEventsById');
        reject(err);
      });
  });

export const getMissedSocketEventsByIdFromApp = (id) =>
  new Promise(function (resolve, reject) {
    console.log('getMissedSocketEventsById called', id);
    client
      .get(`/xchat/get-missed-socket-events/?socket_event_id=` + id)
      .then((res) => {
        console.log('res getMissedSocketEventsById', res);
        resolve(res);
      })
      .catch((err) => {
        console.log('Error getMissedSocketEventsById');
        reject(err);
      });
  });

export const getAdWallUniqueUrl = (ad) => (dispatch) =>
  new Promise(function(resolve, reject) {
    client
      .get(`xchat/get-adwall-unique-url/?ad=${ad}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const requestLoginForm = () => (dispatch) =>
  new Promise(function (resolve,reject) {
    client
    .get(`/request-login-from/`)
    .then((res)=>{
      resolve(res);
    })
    .catch((err)=>{
      console.log('err');
      reject(err);
    });
  });

export const getExchangeHistory = (offset = 0) => (dispatch) =>
  new Promise(function (resolve,reject) {
    client
    .get(`xchat/get-amazon-and-btc-history/?limit=${20}&offset=${offset}`)
    .then((res)=>{
      resolve(res);
    })
    .catch((err)=>{
      console.log('err');
      reject(err);
    });
  });

  export const getAmazonExchangeHistory = (offset = 0) => (dispatch) =>
  new Promise(function (resolve,reject) {
    client
    .get(`xchat/get-amazon-history/?limit=${20}&offset=${offset}`)
    .then((res)=>{
      resolve(res);
    })
    .catch((err)=>{
      console.log('err');
      reject(err);
    });
  });

  export const getBtcExchangeHistory = (offset = 0) => (dispatch) =>
  new Promise(function (resolve,reject) {
    client
    .get(`xchat/get-btc-history/?limit=${20}&offset=${offset}`)
    .then((res)=>{
      resolve(res);
    })
    .catch((err)=>{
      console.log('err');
      reject(err);
    });
  });

export const sendOtpToAddAmount = () => (dispatch) =>
  new Promise(function (resolve,reject){
    client
    .post(`/xchat/send-otp-to-add-amount/`)
    .then((res)=>{
      resolve(res);
    })
    .catch((err)=>{
      console.log('err');
      reject(err);
    })
  });

  export const verifyOtpToAddAmount = (data) => (dispatch) =>
  new Promise(function (resolve,reject){
    client
    .post(`/xchat/verify-otp-to-add-amount/`,data)
    .then((res)=>{
      resolve(res);
    })
    .catch((err)=>{
      console.log('err');
      reject(err);
    })
  });

export const getAnyUserProfile = (id) => (dispatch) =>
    new Promise(function (resolve,reject) {
        client
            .get(`xchat/get-user-profile/?user_id=${id}`)
            .then((res)=>{
                resolve(res);
            })
            .catch((err)=>{
                reject(err);
            });
    });
