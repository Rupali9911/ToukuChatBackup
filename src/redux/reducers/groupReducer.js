import { client } from '../../helpers/api';

export const SET_CURRENT_GROUP_DATA = 'SET_CURRENT_GROUP_DATA';
export const SET_CURRENT_GROUP_DETAIL_DATA = 'SET_CURRENT_GROUP_DETAIL_DATA';
export const SET_CURRENT_GROUP_MEMBERS = 'SET_CURRENT_GROUP_MEMBERS';

export const GET_USER_GROUP_REQUEST = 'GET_USER_GROUP_REQUEST';
export const GET_USER_GROUP_SUCCESS = 'GET_USER_GROUP_SUCCESS';
export const GET_USER_GROUP_FAIL = 'GET_USER_GROUP_FAIL';

export const CREATE_GROUP_REQUEST = 'CREATE_GROUP_REQUEST';
export const CREATE_GROUP_SUCCESS = 'CREATE_GROUP_SUCCESS';
export const CREATE_GROUP_FAIL = 'CREATE_GROUP_FAIL';

export const GET_GROUP_CONVERSATION_REQUEST = 'GET_GROUP_CONVERSATION_REQUEST';
export const GET_GROUP_CONVERSATION_SUCCESS = 'GET_GROUP_CONVERSATION_SUCCESS';
export const GET_GROUP_CONVERSATION_FAIL = 'GET_GROUP_CONVERSATION_FAIL';

export const SET_UNREAD_GROUP_MSG_COUNTS = 'SET_UNREAD_GROUP_MSG_COUNTS';

const initialState = {
  loading: false,
  userGroups: [],
  currentGroup: {},
  currentGroupDetail: {},
  currentGroupMembers: [],
  unreadGroupMsgsCounts: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    //Current Group Data
    case SET_CURRENT_GROUP_DATA:
      return {
        ...state,
        currentGroup: action.payload,
      };

    //Current Group Detail
    case SET_CURRENT_GROUP_DETAIL_DATA:
      return {
        ...state,
        currentGroupDetail: action.payload,
      };

    //Current Group Members
    case SET_CURRENT_GROUP_MEMBERS:
      return {
        ...state,
        currentGroupMembers: action.payload,
      };

    //Get User Groups
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

    //Create New Group
    case CREATE_GROUP_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CREATE_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case CREATE_GROUP_FAIL:
      return {
        ...state,
        loading: false,
      };

    //Create New Group
    case GET_GROUP_CONVERSATION_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_GROUP_CONVERSATION_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_GROUP_CONVERSATION_FAIL:
      return {
        ...state,
        loading: false,
      };

    case SET_UNREAD_GROUP_MSG_COUNTS:
      return {
        ...state,
        unreadGroupMsgsCounts: action.payload,
      };

    default:
      return state;
  }
}

//Set Current Group data
const setCurrentGroupData = (data) => ({
  type: SET_CURRENT_GROUP_DATA,
  payload: data,
});

export const setCurrentGroup = (group) => (dispatch) =>
  dispatch(setCurrentGroupData(group));

//Set Unread Group Msgs Count
const setUnreadGroupMsgsCounts = (counts) => ({
  type: SET_UNREAD_GROUP_MSG_COUNTS,
  payload: counts,
});

export const updateUnreadGroupMsgsCounts = (counts) => (dispatch) =>
  dispatch(setUnreadGroupMsgsCounts(counts));

//Set Current Group Detail
const setCurrentGroupDetailData = (data) => ({
  type: SET_CURRENT_GROUP_DETAIL_DATA,
  payload: data,
});

export const setCurrentGroupDetail = (data) => (dispatch) =>
  dispatch(setCurrentGroupDetailData(data));

//Set Current Group Members
const setCurrentGroupMembersData = (members) => ({
  type: SET_CURRENT_GROUP_MEMBERS,
  payload: members,
});

export const setCurrentGroupMembers = (members) => (dispatch) =>
  dispatch(setCurrentGroupMembersData(members));

//Get User Groups
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

export const getUserGroups = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getUserGroupsRequest());
    client
      .get(`/xchat/user-conversations/?chat_type=group`)
      .then((res) => {
        if (res.conversations) {
          var groups = res.conversations;
          let unread_counts = 0;
          if (groups && groups.length > 0) {
            groups = groups.map(function (el) {
              unread_counts = unread_counts + el.unread_msg;
              return groups;
            });
            dispatch(setUnreadGroupMsgsCounts(unread_counts));
          }
          res.conversations.sort((a, b) =>
            a.timestamp &&
            b.timestamp &&
            new Date(a.timestamp) < new Date(b.timestamp)
              ? 1
              : -1
          );
          dispatch(getUserGroupsSuccess(res.conversations));
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getUserGroupsFailure());
        reject(err);
      });
  });

//Create Group
const getCreateGroupRequest = () => ({
  type: CREATE_GROUP_REQUEST,
});

const getCreateGroupSuccess = () => ({
  type: CREATE_GROUP_SUCCESS,
});

const getCreateGroupFailure = () => ({
  type: CREATE_GROUP_FAIL,
});

export const createNewGroup = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getCreateGroupRequest());
    client
      .post(`/xchat/create-group/`, data)
      .then((res) => {
        dispatch(getCreateGroupSuccess());
        resolve(res);
      })
      .catch((err) => {
        dispatch(getCreateGroupFailure());
        reject(err);
      });
  });

export const leaveGroup = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/mute-group/${data.group_id}/`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Mark Group Conversation Read
export const markGroupConversationRead = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/mark-read-group-conversation/`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Get Group Conversations
const getGroupConversationRequest = () => ({
  type: GET_GROUP_CONVERSATION_REQUEST,
});

const getGroupConversationSuccess = () => ({
  type: GET_GROUP_CONVERSATION_SUCCESS,
});

const getGroupConversationFailure = () => ({
  type: GET_GROUP_CONVERSATION_FAIL,
});

export const getGroupConversation = (groupId) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getGroupConversationRequest());
    client
      .get(`/xchat/group-conversation/` + groupId + '/')
      .then((res) => {
        dispatch(getGroupConversationSuccess());
        resolve(res);
      })
      .catch((err) => {
        dispatch(getGroupConversationFailure());
        reject(err);
      });
  });

//Delete Group
export const deleteGroup = (groupId) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .delete(`/xchat/delete-group/` + groupId + '/')
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Edit Group
export const editGroup = (groupId, data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .patch(`/xchat/edit-group/` + groupId + '/', data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Update Group Members
export const updateGroupMembers = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .patch(`/xchat/update-group-members/`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Get Group Details
export const getGroupDetail = (groupId) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`/xchat/group-detail/` + groupId + '/')
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Get Group Members
export const getGroupMembers = (groupId, limit = 20, offset = 0) => (
  dispatch
) =>
  new Promise(function (resolve, reject) {
    client
      .get(
        `/xchat/get-group-members/` +
          groupId +
          '/?limit=' +
          limit +
          '&offset=' +
          offset
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Send Group Message
export const sendGroupMessage = (message) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/send-group-message/`, message)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const editGroupMessage = (id, payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .put(`/xchat/edit-group-message/${id}/`, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const unSendGroupMessage = (id, payload) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/xchat/delete-group-message/${id}/`, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
