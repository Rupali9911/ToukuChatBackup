import {client} from '../../helpers/api';
import Realm from 'realm';
import {
  setFriendChatConversation,
  getFriendChatConversation,
  getLocalUserFriends,
  setUserFriendsFromApi,
} from '../../storage/Service';
import {dispatch} from 'rxjs/internal/observable/pairs';
import { realmToPlainObject } from '../../utils';
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "../../components/Toast";
import {translate} from "./languageReducer";
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
export const UPDATE_CURRENT_FRIEND_DISPLAY_NAME =
  'UPDATE_CURRENT_FRIEND_DISPLAY_NAME';
export const UPDATE_CURRENT_FRIEND_BACKGROUND_IMAGE = "UPDATE_CURRENT_FRIEND_BACKGROUND_IMAGE";
export const SET_UNREAD_FRIEND_MSG_COUNTS = 'SET_UNREAD_FRIEND_MSG_COUNTS';

export const GET_FRIEND_CONVERSATION = 'GET_FRIEND_CONVERSATION';
export const SET_FRIEND_CONVERSATION = 'SET_FRIEND_CONVERSATION';
export const RESET_FRIEND_CONVERSATION = 'RESET_FRIEND_CONVERSATION';
export const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';
export const Delete_Message = 'Delete_Message';

export const UNFRIEND = 'UNFRIEND';
export const UNFRIEND_SUCCESS = 'UNFRIEND_SUCCESS';
export const UNFRIEND_FAIL = 'UNFRIEND_FAIL';

export const UPDATE_FRIEND_CONVERSATION = 'UPDATE_FRIEND_CONVERSATION';
export const ADD_NEW_FRIEND_CONVERSATION = 'ADD_NEW_FRIEND_CONVERSATION';

export const ADD_NEW_FRIEND = 'ADD_NEW_FRIEND';
export const UPDATE_FRIEND = 'UPDATE_FRIEND';
export const DELETE_FRIEND = 'DELETE_FRIEND';

const initialState = {
  loading: false,
  userFriends: [],
  currentFriend: {},
  chatFriendConversation: [],
  unreadFriendMsgsCounts: 0,
};

// var realm = new Realm({path: 'ToukuDB.realm'});

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

    case UPDATE_CURRENT_FRIEND_DISPLAY_NAME:
      return {
        ...state,
        currentFriend: {
          ...state.currentFriend,
          display_name: action.payload.display_name,
        },
      };

    case UPDATE_CURRENT_FRIEND_BACKGROUND_IMAGE:
      return {
        ...state,
        currentFriend: {
          ...state.currentFriend,
          background_image: action.payload.background_image,
        },
      }

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
        userFriends: [...action.payload],
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
    case UPDATE_FRIEND_CONVERSATION: 
      let currentArray = state.chatFriendConversation.slice();
      let index = currentArray.findIndex((_)=>_.id==action.payload.id)
      currentArray.splice(index,1,action.payload)
      return {
        ...state,
        chatFriendConversation: currentArray
      }

    case ADD_NEW_FRIEND_CONVERSATION:
      let newArray = state.chatFriendConversation;
      let _index = newArray.findIndex((_)=>_.id==action.payload.id)
      if(_index<0){
        newArray.splice(0, 0, action.payload);
        return {
          ...state,
          chatFriendConversation: newArray
        }
      }else {
        return state;
      }

    case ADD_NEW_FRIEND: 
      let friendList = state.userFriends.slice();
      let friendIndex = friendList.findIndex((_) => _.user_id == action.payload.user_id);  

      if(friendIndex<0){
        friendList.splice(0,0,action.payload);
        return {
          ...state,
          userFriends: friendList
        }
      }else{
        return state;
      }  

    case UPDATE_FRIEND:
      let friend_list = state.userFriends.slice();
      let friend_index = friend_list.findIndex((_) => _.user_id == action.payload.user_id);

      if (friendIndex < 0) {
        return state;
      } else {
        friend_list.splice(friend_index, 1, action.payload);
        return {
          ...state,
          userFriends: friend_list
        }
      }

    case DELETE_FRIEND:
      return {
        ...state,
        userFriends: state.userFriends.filter((_)=>_.user_id!==action.payload)
      }

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

export const updateCurrentFriendDisplayName = (data) => {
  return {type: UPDATE_CURRENT_FRIEND_DISPLAY_NAME, payload: data};
};

export const updateCurrentFriendBackgroundImage = (data) => {
  return {type: UPDATE_CURRENT_FRIEND_BACKGROUND_IMAGE, payload: data};
}

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

export const deleteMessage = (data) => ({
  type: Delete_Message,
  payload: data,
});

export const updateFriendConversation = (data) => ({
  type: UPDATE_FRIEND_CONVERSATION,
  payload: data
});

export const addNewFriendConversation = (data) => ({
  type: ADD_NEW_FRIEND_CONVERSATION,
  payload: data
});

export const addNewFriend = (data) => ({
  type: ADD_NEW_FRIEND,
  payload: data
});

export const updateFriend = (data) => ({
  type: UPDATE_FRIEND,
  payload: data
});

export const deleteFriend = (data) => ({
  type: DELETE_FRIEND,
  payload: data
});

export const setUserFriends = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getUserFriendsRequest());
    var result = getLocalUserFriends();
    var friends = [];

    // result.map((item) => {
    //   var item2 = {
    //     avatar: item.avatar,
    //     background_image: item.background_image,
    //     display_name: item.display_name,
    //     friend: item.friend,
    //     isChecked: item.isChecked,
    //     is_online: item.is_online,
    //     is_typing: item.is_typing,
    //     last_msg: item.last_msg,
    //     last_msg_id: item.last_msg_id,
    //     last_msg_type: item.last_msg_type,
    //     profile_picture: item.profile_picture,
    //     timestamp: item.timestamp,
    //     unread_msg: item.unread_msg,
    //     user_id: item.user_id,
    //     username: item.username,
    //     is_pined: item.is_pined,
    //   };
    //   friends.push(item2);
    // });
    let a = Array.from(result);
    friends = realmToPlainObject(a);
    // friends = result.toJSON();

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
          //console.log('/xchat/get-my-friends/', res)
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

          // var user_friends = realm.objects('user_friends');
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

export const getPersonalConversation = (friend, id) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getPersonalConversationRequest());

    let params = '';
    if(id){
      params = `?limit=50&msg_id=${id}`;
    }

    client
      .get(`/xchat/personal-conversation/${friend}/${params}`)
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

//delete multiple message
export const deleteMultiplePersonalMessage = (payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/delete-multiple-message-from-friend/`, payload)
      .then((res) => {
        resolve(res);
        // dispatch(deleteMessage(id));})
      })
      .catch((err) => {
        reject(err);
      });
  });
export const getFriendNotes = (id, limit, offset) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(
        `/xchat/friend-notes/?friend_id=${id}&limit=${limit}&offset=${offset}`,
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const postFriendNotes = (payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/friend-notes/`, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const editFriendNotes = (payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .patch(`/xchat/friend-notes/`, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const deleteFriendNotes = (id) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .delete(`/xchat/friend-notes/?note_id=${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const updateFriendDisplayName = (payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .patch(`/xchat/update-user-display-name/`, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const pinFriend = (friendKey, friendId, data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .patch(`xchat/pin-friend/${friendKey}/${friendId}/`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
export const unpinFriend = (friendKey, friendId, data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .patch(`xchat/unpin-friend/${friendKey}/${friendId}/`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//#region Firend Note
export const likeUnlikeNote = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client.post(`xchat/like-friend-note/`,data)
    .then((res)=>{
      resolve(res);
    })
    .catch((err)=>{
      reject(err);
    })
  });
//#endregion

//#region Comment on group note
export const commentOnNote = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client.post(`xchat/friend-note-comment/`,data)
    .then((res)=>{
      resolve(res);
    })
    .catch((err)=>{
      reject(err);
    })
  });

export const getFriendCommentList = (note_id,offset) => (dispatch) =>
  new Promise(function(resolve,reject){
    client
    .get(`xchat/friend-note-comment-list/?note_id=${note_id}&limit=20&offset=${offset}`)
    .then((res)=>{
      resolve(res);
    })
    .catch((err)=>{
      reject(err);
    })
  });

export const likeUnlikeComment = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client.post(`xchat/like-friend-note-comment/`,data)
    .then((res)=>{
      resolve(res);
    })
    .catch((err)=>{
      reject(err);
    })
  });

export const deleteFriendComment = (comment_id) => (dispatch) =>
  new Promise(function(resolve,reject){
    client.delete(`xchat/friend-note-comment/${comment_id}/`)
    .then((res)=>{
      resolve(res);
    })
    .catch((err)=>{
      reject(err);
    });
  })

export const deleteFriendObject = (user_id) => (dispatch) =>
  new Promise(function(resolve,reject){
    client.delete(`xchat/remove-friend-object/${user_id}/`)
    .then((res)=>{
      resolve(res);
    }).catch((err)=>{
      reject(err);
    })
  })

export const addFriendByReferralCode = (data) => (dispatch) =>
    new Promise(function (resolve, reject) {
        console.log('Data to xchat/add-friend-through-referral-code/', data)
        client.post(`xchat/add-friend-through-referral-code/`,data)
            .then((res)=>{
                console.log('addFriendByReferralCode response1', res)
                if (res.status === false) {
                    Toast.show({
                        title: translate('common.referral'),
                        text: res.message,
                        type: 'primary',
                    });
                }
                resolve(res);
            })
            .catch((err)=>{
                console.log('addFriendByReferralCode response', err)
                reject(err);
            })
    });

export const updateUserOnlineStatus = (friends) => (dispatch) => {
  dispatch(getUserFriendsSuccess(friends));
}