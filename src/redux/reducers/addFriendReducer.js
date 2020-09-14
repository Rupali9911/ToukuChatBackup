import {
  client,
  GET_SEARCHED_FRIEND,
  SEND_FRIEND_REQUEST,
  CANCEL_FRIEND_REQUEST,
} from '../../helpers/api';

import {
  setFriendRequests,
  getLocalFriendRequests
} from '../../storage/Service';

export const SET_SEARCHED_FRIEND = 'SET_SEARCHED_FRIEND';

export const GET_SEARCHED_FRIENDS_REQUEST = 'GET_SEARCHED_FRIENDS_REQUEST';
export const GET_SEARCHED_FRIENDS_SUCCESS = 'GET_SEARCHED_FRIENDS_SUCCESS';
export const GET_SEARCHED_FRIENDS_FAIL = 'GET_SEARCHED_FRIENDS_FAIL';
export const SET_FRIEND_REQUEST = 'SET_FRIEND_REQUEST';

const initialState = {
  loading: false,
  searchedFriend: {},
  friendRequest: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SEARCHED_FRIEND:
      return {
        ...state,
        loading: false,
        searchedFriend: action.payload.data,
      };

    //Get Search Friend
    case GET_SEARCHED_FRIENDS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_SEARCHED_FRIENDS_SUCCESS:
      return {
        ...state,
        loading: false,
        searchedFriend: action.payload,
      };

    case GET_SEARCHED_FRIENDS_FAIL:
      return {
        ...state,
        loading: false,
      };

    case SET_FRIEND_REQUEST: {
      return {
        ...state,
        friendRequest: action.payload.data,
      };
    }
    default:
      return state;
  }
}

//Actions
//Get searched friend
const setSearchedFriends = (data) => ({
  type: SET_SEARCHED_FRIEND,
  payload: {
    data: data,
  },
});

//Get searched friend
const getSearchedFriendsRequest = () => ({
  type: GET_SEARCHED_FRIENDS_REQUEST,
});

const getSearchedFriendsSuccess = (data) => ({
  type: GET_SEARCHED_FRIENDS_SUCCESS,
  payload: data,
});

const getSearchedFriendsFailure = () => ({
  type: GET_SEARCHED_FRIENDS_FAIL,
});

export const getSearchedFriends = (param) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getSearchedFriendsRequest());
    client
      .get(GET_SEARCHED_FRIEND + '?query=' + param + '&type=add-friend')
      .then((res) => {
        if (res.contacts) {
          dispatch(setSearchedFriends(res.contacts));
          dispatch(getSearchedFriendsSuccess(res.contacts));
        }
        resolve(res.contacts);
      })
      .catch((err) => {
        dispatch(getSearchedFriendsFailure());
        reject(err);
      });
  });

export const sendFriendRequest = (id) => (dispatch) =>
  new Promise(function (resolve, reject) {
    let request = {
      channel_name: 'friend_request_' + id,
      receiver_id: id,
    };
    console.log('Request', request);
    client
      .post(SEND_FRIEND_REQUEST, request)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const cancelFriendRequest = (id) => (dispatch) =>
  new Promise(function (resolve, reject) {
    let request = {
      channel_name: 'cancel_sent_request_' + id,
      receiver_id: id,
    };
    console.log('Request', request);
    client
      .post(CANCEL_FRIEND_REQUEST, request)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

// set is_requested param
export const setIsRequestedParam = (searchedFriend, is_requested, index) => (
  dispatch
) =>
  new Promise(function (resolve, reject) {
    console.log('friend', searchedFriend, is_requested, index);
    searchedFriend[index].is_requested = is_requested;
    dispatch(setSearchedFriends(searchedFriend));
    resolve(searchedFriend);
  });

const setFiendRequest = (data) => ({
  type: SET_FRIEND_REQUEST,
  payload: {
    data: data,
  },
});

export const setFriendRequest = () => (dispatch) => {
  var result = getLocalFriendRequests();
    var requests = [];
  for (let i of result) {
    let item = {
      from_user_id: i.from_user_id,
      from_user_display_name: i.from_user_display_name,
      from_user_username: i.from_user_username,
      from_user_avatar: i.from_user_avatar,
      created: i.created
    }
    requests = [...requests, item];
  }
  dispatch(setFiendRequest(requests))
}

export const getFriendRequest = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`/xchat/list-friend-request/`)
      .then((res) => {
        setFriendRequests(res);
        dispatch(setFiendRequest(res));
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        // dispatch(getUserGroupsFailure());
        reject(err);
      });
  });

export const acceptFriendRequst = (payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    console.log('acceptFriendRequst');
    client
      .post(`/xchat/accept-friend-request/`, payload)
      .then((res) => {
        console.log('res', res);
        resolve(res);
      })
      .catch((err) => {
        console.log('err', err);
        reject(err);
      });
  });

export const rejectFriendRequst = (payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    console.log('rejectFriendRequst');
    client
      .post(`/xchat/reject-friend-request/`, payload)
      .then((res) => {
        console.log('res', res);
        resolve(res);
      })
      .catch((err) => {
        console.log('err', err);
        reject(err);
      });
  });
