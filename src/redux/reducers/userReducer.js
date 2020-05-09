import {client} from '../../helpers/api';
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
  // new Promise(function (resolve, reject) {
  //   // dispatch(getLoginRequest());
  //   client
  //     .post(`/jwt/api-token-auth-xana/`, user)
  //     .then((res) => {
  //       alert(JSON.stringify(res));
  //       resolve(res);
  //     })
  //     .catch((err) => {
  //       alert(JSON.stringify(err));
  //       reject(err);
  //     });
  // });

  new Promise(function (resolve, reject) {
    fetch('https://touku.angelium.net/api/jwt/api-token-auth-xana/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dev_id: '',
        email: 'new.register@angelium.net',
        password: 'Test@123',
        rememberMe: false,
      }),
    })
      .then((json) => {
        // alert(JSON.stringify(json));
      })
      .catch((error) => {
        alert(error);
      });
  });
