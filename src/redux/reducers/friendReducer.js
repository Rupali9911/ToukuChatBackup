import {client} from '../../helpers/api';

export const GET_USER_FRIENDS_REQUEST = 'GET_USER_FRIENDS_REQUEST';
export const GET_USER_FRIENDS_SUCCESS = 'GET_USER_FRIENDS_SUCCESS';
export const GET_USER_FRIENDS_FAIL = 'GET_USER_FRIENDS_FAIL';

export const GET_PERSONAL_CONVERSATION_REQUEST =
  'GET_PERSONAL_CONVERSATION_REQUEST';
export const GET_PERSONAL_CONVERSATION_SUCCESS =
  'GET_PERSONAL_CONVERSATION_SUCCESS';
export const GET_PERSONAL_CONVERSATION_FAIL = 'GET_PERSONAL_CONVERSATION_FAIL';

export const SET_CURRENT_FRIEND_DATA = 'SET_CURRENT_FRIEND_DATA';

const initialState = {
  loading: false,
  userFriends: [],
  currentFriend: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_FRIEND_DATA:
      return {
        ...state,
        currentFriend: action.payload,
      };

    //Get Friend Requests
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

    //Get Personal Conversations
    case GET_PERSONAL_CONVERSATION_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_PERSONAL_CONVERSATION_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_PERSONAL_CONVERSATION_FAIL:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

//Actions
//Set Current Friend Data
const setCurrentFriendData = (data) => ({
  type: SET_CURRENT_FRIEND_DATA,
  payload: data,
});

export const setCurrentFriend = (friend) => (dispatch) =>
  dispatch(setCurrentFriendData(friend));

//Get User's Friends
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

export const getUserFriends = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getUserFriendsRequest());
    client
      .get(`/xchat/get-my-friends/`)
      .then((res) => {
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

//Get Friend Requests
export const getFriendRequests = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`/xchat/list-friend-request/`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Get Personal Conversation
const getPersonalConversationRequest = () => ({
  type: GET_PERSONAL_CONVERSATION_REQUEST,
});

const getPersonalConversationSuccess = () => ({
  type: GET_PERSONAL_CONVERSATION_SUCCESS,
});

const getPersonalConversationFailure = () => ({
  type: GET_PERSONAL_CONVERSATION_FAIL,
});

export const getPersonalConversation = (friend) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getPersonalConversationRequest());
    client
      .get(`/xchat/personal-conversation/` + friend + '/')
      .then((res) => {
        dispatch(getPersonalConversationSuccess());
        resolve(res);
      })
      .catch((err) => {
        dispatch(getPersonalConversationFailure());
        reject(err);
      });
  });

//Send Personal Message
export const sendPersonalMessage = (message) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/send-personal-message/`, message)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Mark Friend Messages Read
export const markFriendMsgsRead = (id) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`/xchat/mark-friend-msgs-read/` + id + '/')
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const unFriendUser = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/unfriend-user/`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const editPersonalMessage = (id, payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .patch(`/xchat/edit-personal-message/${id}/`, payload)
      .then((res) => {
        console.log('res', res);
        resolve(res);
      })
      .catch((err) => {
        console.log('err', err);
        reject(err);
      });
  });
