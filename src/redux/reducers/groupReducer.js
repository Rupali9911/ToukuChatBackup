import {client} from '../../helpers/api';

export const GET_USER_GROUP_REQUEST = 'GET_USER_GROUP_REQUEST';
export const GET_USER_GROUP_SUCCESS = 'GET_USER_GROUP_SUCCESS';
export const GET_USER_GROUP_FAIL = 'GET_USER_GROUP_FAIL';

const initialState = {
  loading: false,
  userGroups: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_GROUP_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_USER_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        userGroups: action.payload,
      };

    case GET_USER_GROUP_FAIL:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

//Actions
const getUserGroupsRequest = () => ({
  type: GET_USER_GROUP_REQUEST,
});

const getUserGroupsSuccess = (data) => ({
  type: GET_USER_GROUP_SUCCESS,
  payload: data,
});

const getUserGroupsFailure = () => ({
  type: GET_USER_GROUP_FAIL,
});

//Login User
export const getUserGroups = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getUserGroupsRequest());
    client
      .get(`/xchat/user-conversations/?chat_type=group`)
      .then((res) => {
        if (res.conversations) {
          dispatch(getUserGroupsSuccess(res.conversations));
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getUserGroupsFailure());
        reject(err);
      });
  });
