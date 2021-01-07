import {
  getChannels,
  getGroups,
  getLocalUserFriends,
} from '../../storage/Service';

export const SET_COMMON_CHAT = 'SET_COMMON_CHAT';

export const GET_COMMON_CHAT = 'GET_COMMON_CHAT';

const initialState = {
  commonChat: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_COMMON_CHAT:
      // console.log('data', action.payload);
      return {
        ...state,
        commonChat: action.payload,
      };

    //Get Following Channels
    case GET_COMMON_CHAT:
      return state;
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

export const setCommonChatConversation = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    let array = [];
    let channels = getChannels();

    if (channels.length) {
      // array = [...array, ...channels.toJSON()];
      let channel_array = channels.toJSON().filter((item)=>item.last_msg!==null);
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
      let friend_array = friends.toJSON().filter((item)=>item.last_msg_id!==null);
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
      let group_array = groups.toJSON().filter((item)=>!item.no_msgs);
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
    resolve();
  });

export const setDeleteChat = (deleteItems) => (dispatch) => {
  dispatch(setCommonChat(deleteItems));
};
