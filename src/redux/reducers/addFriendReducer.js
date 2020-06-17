import {client, GET_SEARCHED_FRIEND, SEND_FRIEND_REQUEST, CANCEL_FRIEND_REQUEST} from '../../helpers/api';

export const SET_SEARCHED_FRIEND = 'SET_SEARCHED_FRIEND';

export const GET_SEARCHED_FRIENDS_REQUEST = 'GET_SEARCHED_FRIENDS_REQUEST';
export const GET_SEARCHED_FRIENDS_SUCCESS = 'GET_SEARCHED_FRIENDS_SUCCESS';
export const GET_SEARCHED_FRIENDS_FAIL = 'GET_SEARCHED_FRIENDS_FAIL';

const initialState = {
    loading: false,
    searchedFriend: {},
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
            .get(GET_SEARCHED_FRIEND + '?query=' +param+ '&type=add-friend')
            .then((res) => {
                if (res.contacts){
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
            'channel_name': 'friend_request_' + id,
            'receiver_id': id
        }
        console.log('Request', request)
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
            'channel_name': 'cancel_sent_request_' + id,
            'receiver_id': id
        }
        console.log('Request', request)
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
export const setIsRequestedParam = (searchedFriend, is_requested, index) => (dispatch) =>
    new Promise(function (resolve, reject) {
        console.log('friend', searchedFriend, is_requested, index)
        searchedFriend[index].is_requested = is_requested
         dispatch(setSearchedFriends(searchedFriend));
        resolve(searchedFriend);
    })
