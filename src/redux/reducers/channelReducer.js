import {client} from '../../helpers/api';

export const GET_USER_CHANNELS_REQUEST = 'GET_USER_CHANNELS_REQUEST';
export const GET_USER_CHANNELS_SUCCESS = 'GET_USER_CHANNELS_SUCCESS';
export const GET_USER_CHANNELS_FAIL = 'GET_USER_CHANNELS_FAIL';

const initialState = {
  loading: false,
  userChannels: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_CHANNELS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_USER_CHANNELS_SUCCESS:
      return {
        ...state,
        loading: false,
        userChannels: action.payload,
      };

    case GET_USER_CHANNELS_FAIL:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

//Actions
const getUserChannelsRequest = () => ({
  type: GET_USER_CHANNELS_REQUEST,
});

const getUserChannelsSuccess = (data) => ({
  type: GET_USER_CHANNELS_SUCCESS,
  payload: data,
});

const getUserChannelsFailure = () => ({
  type: GET_USER_CHANNELS_FAIL,
});

//Login User
export const getUserChannels = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getUserChannelsRequest());
    client
      .get(`/xchat/get-my-channel/?start=0`)
      .then((res) => {
        if (res.conversations) {
          dispatch(getUserChannelsSuccess(res.conversations));
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getUserChannelsFailure());
        reject(err);
      });
  });
