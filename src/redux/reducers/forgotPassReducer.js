import {client} from '../../helpers/api';
export const GET_FORGOT_PASSWORD_REQUEST = 'GET_FORGOT_PASSWORD_REQUEST';
export const GET_FORGOT_PASSWORD_SUCCESS = 'GET_FORGOT_PASSWORD_SUCCESS';
export const GET_FORGOT_PASSWORD_FAIL = 'GET_FORGOT_PASSWORD_FAIL';

const initialState = {
  loading: false,
  userData: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        loading: false,
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

    default:
      return state;
  }
}

//Actions
const getForgotPasswordRequest = () => ({
  type: GET_FORGOT_PASSWORD_REQUEST,
});

const getForgotPasswordSuccess = (data) => ({
  type: GET_FORGOT_PASSWORD_SUCCESS,
  payload: {
    userData: data,
  },
});

const getForgotPasswordFailure = () => ({
  type: GET_FORGOT_PASSWORD_FAIL,
});

export const forgotUserName = (username) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/forgot-password/`, username)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const forgotPassword = (forgotData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/verify-forgotpassword-otp/`, forgotData)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
