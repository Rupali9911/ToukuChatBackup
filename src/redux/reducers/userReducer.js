// import {client} from '../../helpers/api';

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
