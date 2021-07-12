import {
  getChannels,
  getGroups,
  getLocalUserFriends,
} from '../../storage/Service';
import { realmToPlainObject } from '../../utils';

export const SET_COMMON_CHAT = 'SET_COMMON_CHAT';
export const GET_COMMON_CHAT = 'GET_COMMON_CHAT';
export const UPDATE_COMMON_CHAT = 'UPDATE_COMMON_CHAT';
export const DELETE_COMMON_CHAT = 'DELETE_COMMON_CHAT';
export const ADD_COMMON_CHAT = 'ADD_COMMON_CHAT';

const initialState = {
  commonChat: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_COMMON_CHAT:
      // console.log('data', action.payload);
      return {
        ...state,
        commonChat: [...action.payload],
      };

    //Get Following Channels
    case GET_COMMON_CHAT:
      return state;
    case UPDATE_COMMON_CHAT: 
      let currentThread = state.commonChat.slice();
      let index = currentThread.findIndex((_item)=>{
        if(action.payload.chat === 'group'){
          return _item.group_id == action.payload.group_id; 
        }else if(action.payload.chat === 'channel') {
          return _item.id == action.payload.id;
        } else {
          return _item.user_id == action.payload.user_id;
        }
      });
      console.log('item_index',index);
      if(index>=0){
        currentThread.splice(index,1,action.payload);
        return {
          ...state,
          commonChat: currentThread
        }
      }else {
        if(action.payload.chat === 'group' && !action.payload.no_msgs){
          currentThread.splice(0,0,action.payload);
        }else if(action.payload.chat === 'channel' && action.payload.last_msg!==null){
          currentThread.splice(0,0,action.payload);
        }else if(action.payload.chat == undefined && action.payload.last_msg_id!==null){
          currentThread.splice(0,0,action.payload);
        }
        return {
          ...state,
          commonChat: currentThread
        }
      }
      
    case DELETE_COMMON_CHAT:
      return {
        ...state,
        commonChat: state.commonChat.filter((_)=>{
          if(action.payload.chat === 'group'){
            return _.group_id !== action.payload.id 
          }else if(action.payload.chat === 'channel') {
            return _.id !== action.payload.id;
          } else if(action.payload.chat === 'friend'){
            return _.user_id !== action.payload.user_id;
          }
          return true;
        })
      }

    case ADD_COMMON_CHAT:
      let newList = state.commonChat.slice();
      let _index = newList.findIndex((_item)=>{
        if(action.payload.chat === 'group'){
          return _item.group_id == action.payload.group_id 
        }else if(action.payload.chat === 'channel') {
          return _item.id == action.payload.id;
        } else {
          return _item.user_id == action.payload.user_id;
        }
      });
      if(_index<0){
        if(action.payload.chat === 'group' && !action.payload.no_msgs){
          newList.splice(0,0,action.payload);
        }else if(action.payload.chat === 'channel' && action.payload.last_msg!==null){
          newList.splice(0,0,action.payload);
        }else if(action.payload.chat == undefined && action.payload.last_msg_id!==null){
          newList.splice(0,0,action.payload);
        }
        return {
          ...state,
          commonChat: newList
        }
      }else {
        return state;
      }

    default:
      return state;
  }
}

export const setCommonChat = (data) => ({
  type: SET_COMMON_CHAT,
  payload: data,
});

export const getCommonChat = () => ({
  type: GET_COMMON_CHAT,
});

export const updateCommonChat = (data) => ({
  type: UPDATE_COMMON_CHAT,
  payload: data,
})

export const deleteCommonChatItem = (data) => ({
  type: DELETE_COMMON_CHAT,
  payload: data,
})

export const addCommonChatItem = (data) => ({
  type: ADD_COMMON_CHAT,
  payload: data,
})

export const setCommonChatConversation = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    let array = [];
    let channels = getChannels();

    if (channels.length) {
      // array = [...array, ...channels.toJSON()];
      let a = Array.from(channels);
      let plain_json = realmToPlainObject(a);
      // let channel_array = channels.toJSON().filter((item)=>item.last_msg!==null);
      let channel_array = plain_json.filter((item)=>item.last_msg!==null);
      array = [...array, ...channel_array];
      // channels.map((item, index) => {
      //   if (item.last_msg !== null) {
      //     let i = {
      //       id: item.id,
      //       name: item.name,
      //       unread_msg: item.unread_msg,
      //       total_members: item.total_members,
      //       description: item.description,
      //       chat: item.chat,
      //       channel_picture: item.channel_picture,
      //       last_msg: item.last_msg,
      //       is_pined: item.is_pined,
      //       created: item.created,
      //       joining_date: item.joining_date,
      //       subject_message: item.subject_message
      //     };
      //     array = [...array, i];
      //   }
      // });
    }
    var friends = getLocalUserFriends();
    if (friends.length) {
      let a = Array.from(friends);
      let plain_json = realmToPlainObject(a);
      // let friend_array = friends.toJSON().filter((item)=>item.last_msg_id!==null);
      let friend_array = plain_json.filter((item)=>item.last_msg_id!==null);
      // friends.map((item) => {
      //   if (item.last_msg_id !== null) {
      //     let i = {
      //       user_id: item.user_id,
      //       friend: item.friend,
      //       unread_msg: item.unread_msg,
      //       last_msg_id: item.last_msg_id,
      //       username: item.username,
      //       avatar: item.avatar,
      //       profile_picture: item.profile_picture,
      //       background_image: item.background_image,
      //       last_msg: item.last_msg,
      //       last_msg_type: item.last_msg_type,
      //       display_name: item.display_name,
      //       isChecked: item.isChecked,
      //       is_online: item.is_online,
      //       is_typing: item.is_typing,
      //       timestamp: item.timestamp,
      //       is_pined: item.is_pined,
      //     };
      //     array = [...array, i];
      //   }
      // });
      array = [...array, ...friend_array];
    }
    var groups = getGroups();
    
    if (groups.length) {
      let a = Array.from(groups);
      let plain_json = realmToPlainObject(a);
      // let group_array = groups.toJSON().filter((item)=>!item.no_msgs);
      let group_array = plain_json.filter((item)=>!item.no_msgs);
      
      array = [...array, ...group_array];
      
      // groups.map((item, index) => {
      //   if (item.last_msg_id !== null) {
      //     let i = {
      //       group_id: item.group_id,
      //       group_name: item.group_name,
      //       unread_msg: item.unread_msg,
      //       total_members: item.total_members,
      //       description: item.description,
      //       chat: item.chat,
      //       group_picture: item.group_picture,
      //       last_msg: item.last_msg,
      //       last_msg_id: item.last_msg_id,
      //       timestamp: item.timestamp,
      //       event: item.event,
      //       no_msgs: item.no_msgs,
      //       is_pined: item.is_pined,
      //       sender_id: item.sender_id,
      //       sender_username: item.sender_username,
      //       sender_display_name: item.sender_display_name,
      //       mentions: item.mentions,
      //       reply_to: item.reply_to,
      //       joining_date: item.joining_date,
      //     };
      //     array = [...array, i];
      //   }
      // });
      // array.sort((a, b) =>
      //   a.timestamp &&
      //   b.timestamp &&
      //   new Date(a.timestamp) < new Date(b.timestamp)
      //     ? 1
      //     : -1,
      // );
    }
    dispatch(setCommonChat(array));
    // console.log('commonData length',array.length);
    resolve();
  });

export const setDeleteChat = (deleteItems) => (dispatch) => {
  dispatch(setCommonChat(deleteItems));
};
