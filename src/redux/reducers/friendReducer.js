import {client} from '../../helpers/api';
import Realm from 'realm';
import {
  setFriendChatConversation,
  getFriendChatConversation,
  getLocalUserFriends,
  setUserFriendsFromApi,
} from '../../storage/Service';
import {dispatch} from 'rxjs/internal/observable/pairs';
export const GET_USER_FRIENDS_REQUEST = 'GET_USER_FRIENDS_REQUEST';
export const GET_USER_FRIENDS_SUCCESS = 'GET_USER_FRIENDS_SUCCESS';
export const GET_USER_FRIENDS_FAIL = 'GET_USER_FRIENDS_FAIL';

export const GET_PERSONAL_CONVERSATION_REQUEST =
  'GET_PERSONAL_CONVERSATION_REQUEST';
export const GET_PERSONAL_CONVERSATION_SUCCESS =
  'GET_PERSONAL_CONVERSATION_SUCCESS';
export const GET_PERSONAL_CONVERSATION_FAIL = 'GET_PERSONAL_CONVERSATION_FAIL';

export const SET_CURRENT_FRIEND_DATA = 'SET_CURRENT_FRIEND_DATA';
export const UPDATE_CURRENT_FRIEND_AVTAR = 'UPDATE_CURRENT_FRIEND_AVTAR';
export const SET_UNREAD_FRIEND_MSG_COUNTS = 'SET_UNREAD_FRIEND_MSG_COUNTS';

export const GET_FRIEND_CONVERSATION = 'GET_FRIEND_CONVERSATION';
export const SET_FRIEND_CONVERSATION = 'SET_FRIEND_CONVERSATION';
export const RESET_FRIEND_CONVERSATION = 'RESET_FRIEND_CONVERSATION';
export const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';
export const Delete_Message = 'Delete_Message';

export const UNFRIEND = 'UNFRIEND';
export const UNFRIEND_SUCCESS = 'UNFRIEND_SUCCESS';
export const UNFRIEND_FAIL = 'UNFRIEND_FAIL';

const initialState = {
  loading: false,
  userFriends: [],
  currentFriend: {},
  chatFriendConversation: [],
  unreadFriendMsgsCounts: 0,
};

var realm = new Realm({path: 'ToukuDB.realm'});

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_FRIEND_DATA:
      return {
        ...state,
        currentFriend: action.payload,
      };

    case UPDATE_CURRENT_FRIEND_AVTAR:
      return {
        ...state,
        currentFriend: {
          ...state.currentFriend,
          profile_picture: action.payload.avatar,
          display_name: action.payload.display_name,
          username: action.payload.username,
        },
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

    case SET_UNREAD_FRIEND_MSG_COUNTS:
      return {
        ...state,
        unreadFriendMsgsCounts: action.payload,
      };
    case SET_FRIEND_CONVERSATION:
      return {
        ...state,
        chatFriendConversation: action.payload,
      };
    case RESET_FRIEND_CONVERSATION:
      return {
        ...state,
        chatFriendConversation: [],
      };
    case ADD_NEW_MESSAGE:
      return {
        ...state,
        chatFriendConversation: [
          action.payload,
          ...state.chatFriendConversation,
        ],
      };
    case UNFRIEND:
      return {
        ...state,
        loading: true,
      };
    case UNFRIEND_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case UNFRIEND_FAIL:
      return {
        ...state,
        loading: false,
      };
    case Delete_Message:
      return {
        ...state,
        chatFriendConversation: state.chatFriendConversation.filter(
          (item) => item.id !== action.payload,
        ),
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

export const updateCurrentFriendAvtar = (data) => ({
  type: UPDATE_CURRENT_FRIEND_AVTAR,
  payload: data,
});

export const setCurrentFriend = (friend) => (dispatch) =>
  dispatch(setCurrentFriendData(friend));

//Set Unread Friend Msgs Count
const setUnreadFriendMsgsCounts = (counts) => ({
  type: SET_UNREAD_FRIEND_MSG_COUNTS,
  payload: counts,
});

export const updateUnreadFriendMsgsCounts = (counts) => (dispatch) =>
  dispatch(setUnreadFriendMsgsCounts(counts));

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

export const setFriendConversation = (data) => ({
  type: SET_FRIEND_CONVERSATION,
  payload: data,
});

export const resetFriendConversation = () => ({
  type: RESET_FRIEND_CONVERSATION,
});

export const addNewSendMessage = (data) => ({
  type: ADD_NEW_MESSAGE,
  payload: data,
});

const deleteMessage = (data) => ({
  type: Delete_Message,
  payload: data,
});

export const setUserFriends = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getUserFriendsRequest());
    var result = getLocalUserFriends();

    var friends = [];

    result.map((item) => {
      var item2 = {
        avatar: item.avatar,
        background_image: item.background_image,
        display_name: item.display_name,
        friend: item.friend,
        isChecked: item.isChecked,
        is_online: item.is_online,
        is_typing: item.is_typing,
        last_msg: item.last_msg,
        last_msg_id: item.last_msg_id,
        last_msg_type: item.last_msg_type,
        profile_picture: item.profile_picture,
        timestamp: item.timestamp,
        unread_msg: item.unread_msg,
        user_id: item.user_id,
        username: item.username,
      };
      friends.push(item2);
    });

    let unread_counts = 0;
    if (friends && friends.length > 0) {
      friends.map(function (el) {
        unread_counts = unread_counts + el.unread_msg;
        // var o = Object.assign({}, el);
        // o.isChecked = false;
        // o.is_typing = false;
        // return o;
      });
      dispatch(setUnreadFriendMsgsCounts(unread_counts));
    }
    friends.sort((a, b) =>
      a.timestamp &&
      b.timestamp &&
      new Date(a.timestamp) < new Date(b.timestamp)
        ? 1
        : -1,
    );
    dispatch(getUserFriendsSuccess(friends));
    resolve();
  });

export const getUserFriends = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getUserFriendsRequest());
    client
      .get(`/xchat/get-my-friends/`)
      .then((res) => {
        if (res.conversations) {
          var friends = res.conversations;
          let unread_counts = 0;
          if (friends && friends.length > 0) {
            friends = friends.map(function (el) {
              unread_counts = unread_counts + el.unread_msg;
              var o = Object.assign({}, el);
              o.isChecked = false;
              o.is_typing = false;
              return o;
            });
            dispatch(setUnreadFriendMsgsCounts(unread_counts));
          }

          setUserFriendsFromApi(friends);

          friends.sort((a, b) =>
            a.timestamp &&
            b.timestamp &&
            new Date(a.timestamp) < new Date(b.timestamp)
              ? 1
              : -1,
          );

          // for (let item of friends) {
          //   var obj = realm
          //     .objects('user_friends')
          //     .filtered('user_id =' + item.user_id);
          //   if (obj.length > 0) {
          //     // alert('matching friend');
          //     realm.write(() => {
          //       realm.create('user_friends', {
          //         user_id: item.user_id,
          //         friend: item.friend,
          //         unread_msg: item.unread_msg,
          //         last_msg_id: item.last_msg_id,
          //         username: item.username,
          //         avatar: item.avatar,
          //         profile_picture: item.profile_picture,
          //         background_image: item.background_image,
          //         last_msg: item.last_msg ? item.last_msg : '',
          //         last_msg_type: item.last_msg_type,
          //         display_name: item.display_name,
          //         isChecked: false,
          //         is_online: item.is_online,
          //         is_typing: false,
          //         timestamp: item.timestamp,
          //       },'modified');
          //     });
          //   } else {
          //     realm.write(() => {
          //       realm.create('user_friends', {
          //         user_id: item.user_id,
          //         friend: item.friend,
          //         unread_msg: item.unread_msg,
          //         last_msg_id: item.last_msg_id,
          //         username: item.username,
          //         avatar: item.avatar,
          //         profile_picture: item.profile_picture,
          //         background_image: item.background_image,
          //         last_msg: item.last_msg ? item.last_msg : '',
          //         last_msg_type: item.last_msg_type,
          //         display_name: item.display_name,
          //         isChecked: false,
          //         is_online: item.is_online,
          //         is_typing: false,
          //         timestamp: item.timestamp,
          //       });
          //     });
          //   }
          // }

          var user_friends = realm.objects('user_friends');
          // console.log('user_friends', user_friends);

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
      .get(`/xchat/personal-conversation/${friend}/`)
      .then((res) => {
        setFriendChatConversation(res.conversation);
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
      .get(`/xchat/mark-friend-msgs-read/${id}/`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Get Personal Conversation
const unFriend = () => ({
  type: UNFRIEND,
});

const unFriendSuccess = () => ({
  type: UNFRIEND_SUCCESS,
});

const unFriendFail = () => ({
  type: UNFRIEND_FAIL,
});

export const unFriendUser = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(unFriend());
    client
      .post(`/xchat/unfriend-user/`, data)
      .then((res) => {
        dispatch(unFriendSuccess());
        resolve(res);
      })
      .catch((err) => {
        dispatch(unFriendFail());
        reject(err);
      });
  });

export const editPersonalMessage = (id, payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .patch(`/xchat/edit-personal-message/${id}/`, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Unsend Personal Message
export const unSendPersonalMessage = (id, payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .patch(`/xchat/unsent-personal-message/${id}/`, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Unsend Personal Message
export const deletePersonalMessage = (id, payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .patch(`/xchat/delete-personal-message/${id}/`, payload)
      .then((res) => {
        resolve(res);
        dispatch(deleteMessage(id));
      })
      .catch((err) => {
        reject(err);
      });
  });
