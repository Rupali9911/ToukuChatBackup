import {client} from '../../helpers/api';
import AsyncStorage from '@react-native-community/async-storage';

export const GET_SEND_OTP_REQUEST = 'GET_SEND_OTP_REQUEST';
export const GET_SEND_OTP_SUCCESS = 'GET_SEND_OTP_SUCCESS';
export const GET_SEND_OTP_FAIL = 'GET_SEND_OTP_FAIL';

export const GET_VERIFY_OTP_REQUEST = 'GET_VERIFY_OTP_REQUEST';
export const GET_VERIFY_OTP_SUCCESS = 'GET_VERIFY_OTP_SUCCESS';
export const GET_VERIFY_OTP_FAIL = 'GET_VERIFY_OTP_FAIL';

export const GET_CHECK_EMAIL_REQUEST = 'GET_CHECK_EMAIL_REQUEST';
export const GET_CHECK_EMAIL_SUCCESS = 'GET_CHECK_EMAIL_SUCCESS';
export const GET_CHECK_EMAIL_FAIL = 'GET_CHECK_EMAIL_FAIL';

export const GET_REGISTER_REQUEST = 'GET_REGISTER_REQUEST';
export const GET_REGISTER_SUCCESS = 'GET_REGISTER_SUCCESS';
export const GET_REGISTER_FAIL = 'GET_REGISTER_FAIL';

const initialState = {
  loading: false,
  loadingSMS: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    //Send OTP
    case GET_SEND_OTP_REQUEST:
      return {
        ...state,
        loadingSMS: true,
      };

    case GET_SEND_OTP_SUCCESS:
      return {
        ...state,
        loadingSMS: false,
      };

    case GET_SEND_OTP_FAIL:
      return {
        ...state,
        loadingSMS: false,
      };

    //Verify OTP
    case GET_VERIFY_OTP_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_VERIFY_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_VERIFY_OTP_FAIL:
      return {
        ...state,
        loading: false,
      };

    //Check Email
    case GET_CHECK_EMAIL_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_CHECK_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_CHECK_EMAIL_FAIL:
      return {
        ...state,
        loading: false,
      };

    //Register User
    case GET_REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_REGISTER_FAIL:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

//Actions
//Send OTP
const getSendOtpRequest = () => ({
  type: GET_SEND_OTP_REQUEST,
});

const getSendOtpSuccess = () => ({
  type: GET_SEND_OTP_SUCCESS,
});

const getSendOtpFailure = () => ({
  type: GET_SEND_OTP_FAIL,
});

//Verify OTP
const getVerifyOtpRequest = () => ({
  type: GET_VERIFY_OTP_REQUEST,
});

const getVerifyOtpSuccess = () => ({
  type: GET_VERIFY_OTP_SUCCESS,
});

const getVerifyOtpFailure = () => ({
  type: GET_VERIFY_OTP_FAIL,
});

//Check Email
const getCheckEmailRequest = () => ({
  type: GET_CHECK_EMAIL_REQUEST,
});

const getCheckEmailSuccess = () => ({
  type: GET_CHECK_EMAIL_SUCCESS,
});

const getCheckEmailFailure = () => ({
  type: GET_CHECK_EMAIL_FAIL,
});

//Register
const getRegisterRequest = () => ({
  type: GET_REGISTER_REQUEST,
});

const getRegisterSuccess = () => ({
  type: GET_REGISTER_SUCCESS,
});

const getRegisterFailure = () => ({
  type: GET_REGISTER_FAIL,
});

//SignUp User
export const userSendOTP = (signUpData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getSendOtpRequest());
    client
      .post(`/send-otp/`, signUpData)
      .then((res) => {
        if (res.status === true) {
          dispatch(getSendOtpSuccess());
        } else {
          dispatch(getSendOtpFailure());
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getSendOtpFailure());
        reject(err);
      });
  });

export const userVerifyOTP = (verifyData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getVerifyOtpRequest());
    client
      .post(`/verify-otp/`, verifyData)
      .then((res) => {
        if (res.status === true) {
          dispatch(getVerifyOtpSuccess());
        } else {
          dispatch(getVerifyOtpFailure());
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getVerifyOtpFailure());
        reject(err);
      });
  });

export const userEmailCheck = (email) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getCheckEmailRequest());
    client
      .get(`/check-user-exist/?email=` + email)
      .then((res) => {
        if (res.status === false) {
          dispatch(getCheckEmailSuccess());
        } else {
          dispatch(getCheckEmailFailure());
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getCheckEmailFailure());
        reject(err);
      });
  });

export const userNameCheck = (userName) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`/check-user-exist/?username=` + userName)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const userRegister = (registerData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getRegisterRequest());
    client
      .post(`/xana-register/`, registerData)
      .then((res) => {
        if (res.token) {
          AsyncStorage.setItem('userToken', res.token);
          dispatch(getRegisterSuccess());
        } else {
          dispatch(getRegisterFailure());
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getRegisterFailure());
        reject(err);
      });
  });
