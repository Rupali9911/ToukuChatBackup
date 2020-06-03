import {client} from '../../helpers/api';

export const GET_USER_FRIENDS_REQUEST = 'GET_USER_FRIENDS_REQUEST';
export const GET_USER_FRIENDS_SUCCESS = 'GET_USER_FRIENDS_SUCCESS';
export const GET_USER_FRIENDS_FAIL = 'GET_USER_FRIENDS_FAIL';

export const SET_CURRENT_FRIEND_DATA = 'SET_CURRENT_FRIEND_DATA';

const initialState = {
  loading: false,
  userFriends: [],
  currentFriend: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_FRIENDS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_USER_FRIENDS_SUCCESS:
      return {
        ...state,
        loading: false,
        userFriends: action.payload,
      };

    case GET_USER_FRIENDS_FAIL:
      return {
        ...state,
        loading: false,
      };

    case SET_CURRENT_FRIEND_DATA:
      return {
        ...state,
        currentFriend: action.payload,
      };

    default:
      return state;
  }
}

//Actions
const getUserFriendsRequest = () => ({
  type: GET_USER_FRIENDS_REQUEST,
});

const getUserFriendsSuccess = (data) => ({
  type: GET_USER_FRIENDS_SUCCESS,
  payload: data,
});

const getUserFriendsFailure = () => ({
  type: GET_USER_FRIENDS_FAIL,
});

//Set Current Friend Data
const setCurrentFriendData = (data) => ({
  type: SET_CURRENT_FRIEND_DATA,
  payload: data,
});

//Get User's Friends
export const setCurrentFriend = (friend) => (dispatch) =>
  dispatch(setCurrentFriendData(friend));

//Get User's Friends
export const getUserFriends = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getUserFriendsRequest());
    client
      .get(`/xchat/get-my-friends/`)
      .then((res) => {
        alert(JSON.stringify(res));
        if (res.conversations) {
          var friends = res.conversations;
          if (friends && friends.length > 0) {
            friends = friends.map(function (el) {
              var o = Object.assign({}, el);
              o.isChecked = false;
              return o;
            });
          }
          dispatch(getUserFriendsSuccess(friends));
        }
        resolve(friends);
      })
      .catch((err) => {
        dispatch(getUserFriendsFailure());
        reject(err);
      });
  });
