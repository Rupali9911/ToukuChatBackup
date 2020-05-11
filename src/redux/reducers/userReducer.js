import {client} from '../../helpers/api';
import AsyncStorage from '@react-native-community/async-storage';
export const GET_LOGIN_REQUEST = 'GET_LOGIN_REQUEST';
export const GET_LOGIN_SUCCESS = 'GET_LOGIN_SUCCESS';
export const GET_LOGIN_FAIL = 'GET_LOGIN_FAIL';

const initialState = {
  loading: false,
  userData: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LOGIN_REQUEST:
      return {
        ...state,
        loading: false,
      };

    case GET_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_LOGIN_FAIL:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

//Actions
const getLoginRequest = () => ({
  type: GET_LOGIN_REQUEST,
});

const getLoginSuccess = (data) => ({
  type: GET_LOGIN_SUCCESS,
  payload: {
    userData: data,
  },
});

const getLoginFailure = () => ({
  type: GET_LOGIN_FAIL,
});

//Login User
export const userLogin = (user) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getLoginRequest());
    client
      .post(`/jwt/api-token-auth-xana/`, user)
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

// new Promise(function (resolve, reject) {
//   fetch('https://touku.angelium.net/api/jwt/api-token-auth-xana/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'User-Agent':
//         'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
//     },
//     body: JSON.stringify({
//       dev_id: '',
//       email: 'new.register@angelium.net',
//       password: 'Test@123',
//       rememberMe: false,
//     }),
//   })
//     .then((res) => res.json())
//     .then((res) => {
//       alert(JSON.stringify(res));
//     })
//     .catch((error) => {
//       alert(error);
//     });
// });

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
      .post(`/check-user-exist/?email=` + email)
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
      .post(`/check-user-exist/?username=` + userName)
      .then((res) => {
        console.log('USER NAME CHECK RESPONSE=>', JSON.stringify(res));
        resolve(res);
      })
      .catch((err) => {
        console.log('USER NAME CHECK ERROR=>', JSON.stringify(err));
        reject(err);
      });
  });
