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
      channels.map((item, index) => {
        array = [...array, item];
      });
    }
    var friends = getLocalUserFriends();
    if (friends.length) {
      friends.map((friend) => {
        array = [...array, friend];
      });
    }
    var groups = getGroups();
    if (groups.length) {
      groups.map((item, index) => {
        array = [...array, item];
      });
      array.sort((a, b) =>
        a.timestamp &&
        b.timestamp &&
        new Date(a.timestamp) < new Date(b.timestamp)
          ? 1
          : -1,
      );
    }
    dispatch(setCommonChat(array));
    resolve();
  });
