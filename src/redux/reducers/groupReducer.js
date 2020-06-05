import {client} from '../../helpers/api';

export const SET_CURRENT_GROUP_DATA = 'SET_CURRENT_GROUP_DATA';

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
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_GROUP_DATA:
      return {
        ...state,
        currentGroup: action.payload,
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

//Set Current Channel
const setCurrentGroupData = (data) => ({
  type: SET_CURRENT_GROUP_DATA,
  payload: data,
});

export const setCurrentGroup = (group) => (dispatch) =>
  dispatch(setCurrentGroupData(group));

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
