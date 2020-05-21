import {client} from '../../helpers/api';
export const GET_FORGOT_PASSWORD_REQUEST = 'GET_FORGOT_PASSWORD_REQUEST';
export const GET_FORGOT_PASSWORD_SUCCESS = 'GET_FORGOT_PASSWORD_SUCCESS';
export const GET_FORGOT_PASSWORD_FAIL = 'GET_FORGOT_PASSWORD_FAIL';

export const GET_USERNAME_OTP_REQUEST = 'GET_USERNAME_OTP_REQUEST';
export const GET_USERNAME_OTP_SUCCESS = 'GET_USERNAME_OTP_SUCCESS';
export const GET_USERNAME_OTP_FAIL = 'GET_USERNAME_OTP_FAIL';

export const GET_USERNAMES_ON_EMAIL_REQUEST = 'GET_USERNAMES_ON_EMAIL_REQUEST';
export const GET_USERNAMES_ON_EMAIL_SUCCESS = 'GET_USERNAMES_ON_EMAIL_SUCCESS';
export const GET_USERNAMES_ON_EMAIL_FAIL = 'GET_USERNAMES_ON_EMAIL_FAIL';

const initialState = {
  loadingSMS: false,
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_FORGOT_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
      };

    case GET_USERNAME_OTP_REQUEST:
      return {
        ...state,
        loadingSMS: true,
      };

    case GET_USERNAME_OTP_SUCCESS:
      return {
        ...state,
        loadingSMS: false,
      };

    case GET_USERNAME_OTP_FAIL:
      return {
        ...state,
        loadingSMS: false,
      };

    case GET_USERNAMES_ON_EMAIL_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_USERNAMES_ON_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_USERNAMES_ON_EMAIL_FAIL:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

//Actions
//Password Reset
const getForgotPasswordRequest = () => ({
  type: GET_FORGOT_PASSWORD_REQUEST,
});

const getForgotPasswordSuccess = (data) => ({
  type: GET_FORGOT_PASSWORD_SUCCESS,
});

const getForgotPasswordFailure = () => ({
  type: GET_FORGOT_PASSWORD_FAIL,
});

//Username Trough OTP
const getUsernameOtpRequest = () => ({
  type: GET_USERNAME_OTP_REQUEST,
});

const getUsernameOtpSuccess = (data) => ({
  type: GET_USERNAME_OTP_SUCCESS,
});

const getUsernameOtpFailure = () => ({
  type: GET_USERNAME_OTP_FAIL,
});

//Usernames on Email
const getUsernamesOnEmailRequest = () => ({
  type: GET_USERNAMES_ON_EMAIL_REQUEST,
});

const getUsernamesOnEmailSuccess = (data) => ({
  type: GET_USERNAMES_ON_EMAIL_SUCCESS,
});

const getUsernamesOnEmailFailure = () => ({
  type: GET_USERNAMES_ON_EMAIL_FAIL,
});

export const forgotUserName = (username) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getUsernameOtpRequest());
    client
      .post(`/forgot-password/`, username)
      .then((res) => {
        dispatch(getUsernameOtpSuccess());
        resolve(res);
      })
      .catch((err) => {
        dispatch(getUsernameOtpFailure());
        reject(err);
      });
  });

export const forgotPassword = (forgotData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getForgotPasswordRequest());
    client
      .post(`/verify-forgotpassword-otp/`, forgotData)
      .then((res) => {
        dispatch(getForgotPasswordSuccess());
        resolve(res);
      })
      .catch((err) => {
        dispatch(getForgotPasswordFailure());
        reject(err);
      });
  });

export const recoverUserName = (email) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getUsernamesOnEmailRequest());
    client
      .post(`/get-usernames-on-email/`, email)
      .then((res) => {
        dispatch(getUsernamesOnEmailSuccess());
        resolve(res);
      })
      .catch((err) => {
        dispatch(getUsernamesOnEmailFailure());
        reject(err);
      });
  });
