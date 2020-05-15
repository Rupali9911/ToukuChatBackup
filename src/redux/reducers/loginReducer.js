import {client} from '../../helpers/api';
import AsyncStorage from '@react-native-community/async-storage';

export const GET_LOGIN_REQUEST = 'GET_LOGIN_REQUEST';
export const GET_LOGIN_SUCCESS = 'GET_LOGIN_SUCCESS';
export const GET_LOGIN_FAIL = 'GET_LOGIN_FAIL';

const initialState = {
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
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

const getLoginSuccess = () => ({
  type: GET_LOGIN_SUCCESS,
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
          dispatch(getLoginSuccess());
        } else {
          dispatch(getLoginFailure());
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getLoginFailure());
        reject(err);
      });
  });
