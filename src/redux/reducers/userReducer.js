import {client} from '../../helpers/api';
import AsyncStorage from '@react-native-community/async-storage';

export const SET_USER_PROFILE = 'SET_USER_PROFILE';

const initialState = {
  loading: false,
  userData: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER_PROFILE:
      return {
        ...state,
        loading: false,
        userData: action.payload.data,
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

//SignUp User
export const userSendOTP = (signUpData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/send-otp/`, signUpData)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const userVerifyOTP = (verifyData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/verify-otp/`, verifyData)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const userEmailCheck = (email) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`/check-user-exist/?email=` + email)
      .then((res) => {
        console.log('USER EMAIL CHECK RESPONSE=>', JSON.stringify(res));
        resolve(res);
      })
      .catch((err) => {
        console.log('USER EMAIL CHECK ERROR=>', JSON.stringify(err));
        reject(err);
      });
  });

export const userNameCheck = (userName) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`/check-user-exist/?username=` + userName)
      .then((res) => {
        console.log('USER NAME CHECK RESPONSE=>', JSON.stringify(res));
        resolve(res);
      })
      .catch((err) => {
        console.log('USER NAME CHECK ERROR=>', JSON.stringify(err));
        reject(err);
      });
  });

export const userRegister = (registerData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xana-register/`, registerData)
      .then((res) => {
        if (res.token) {
          AsyncStorage.setItem('userToken', res.token);
          // dispatch(getLoginSuccess(res.token))
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const facebookRegister = (socialLoginData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/facebook-login-auth/`, socialLoginData)
      .then((res) => {
        if (res.token) {
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
        console.log(res);
        if (res.token) {
          AsyncStorage.setItem('userToken', res.token);
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
        console.log(JSON.stringify(res));
        if (res.id) {
          dispatch(setUserData(res));
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
