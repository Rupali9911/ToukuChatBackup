import {client} from '../../helpers/api';

export const SET_CURRENT_GROUP_DATA = 'SET_CURRENT_GROUP_DATA';
export const SET_CURRENT_GROUP_DETAIL_DATA = 'SET_CURRENT_GROUP_DETAIL_DATA';
export const SET_CURRENT_GROUP_MEMBERS = 'SET_CURRENT_GROUP_MEMBERS';

export const GET_USER_GROUP_REQUEST = 'GET_USER_GROUP_REQUEST';
export const GET_USER_GROUP_SUCCESS = 'GET_USER_GROUP_SUCCESS';
export const GET_USER_GROUP_FAIL = 'GET_USER_GROUP_FAIL';

export const GET_CREATE_GROUP_REQUEST = 'GET_CREATE_GROUP_REQUEST';
export const GET_CREATE_GROUP_SUCCESS = 'GET_CREATE_GROUP_SUCCESS';
export const GET_CREATE_GROUP_FAIL = 'GET_CREATE_GROUP_FAIL';

const initialState = {
  loading: false,
  userGroups: [],
  currentGroup: {},
  currentGroupDetail: {},
  currentGroupMembers: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_GROUP_DATA:
      return {
        ...state,
        currentGroup: action.payload,
      };

    case SET_CURRENT_GROUP_DETAIL_DATA:
      return {
        ...state,
        currentGroupDetail: action.payload,
      };

    case SET_CURRENT_GROUP_MEMBERS:
      return {
        ...state,
        currentGroupMembers: action.payload,
      };

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

    case GET_CREATE_GROUP_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_CREATE_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_CREATE_GROUP_FAIL:
      return {
        ...state,
        loading: false,
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
  type: GET_CREATE_GROUP_REQUEST,
});

const getCreateGroupSuccess = () => ({
  type: GET_CREATE_GROUP_SUCCESS,
});

const getCreateGroupFailure = () => ({
  type: GET_CREATE_GROUP_FAIL,
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
  dispatch,
) =>
  new Promise(function (resolve, reject) {
    client
      .get(
        `/xchat/get-group-members/` +
          groupId +
          '/?limit=' +
          limit +
          '&offset=' +
          offset,
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
