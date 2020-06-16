import {client, GET_USER_CONFIG, UPDATE_CHANNEL_MODE, GET_TOUKU_POINTS, GET_SEARCHED_FRIEND} from '../../helpers/api';
import {wSetChannelMode} from '../utility/worker';

export const SET_SEARCHED_FRIEND = 'SET_SEARCHED_FRIEND';

export const UPDATE_CHANNEL_MODE_REQUEST = 'UPDATE_CHANNEL_MODE_REQUEST';
export const UPDATE_CHANNEL_MODE_SUCCESS = 'UPDATE_CHANNEL_MODE_SUCCESS';
export const UPDATE_CHANNEL_MODE_FAIL = 'UPDATE_CHANNEL_MODE_FAIL';

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
        default:
            return state;
    }
}

//Actions
//Get searched friend
const setUserConfig = (data) => ({
    type: SET_SEARCHED_FRIEND,
    payload: {
        data: data,
    },
});

export const getSearchedFriends = (data) => (dispatch) =>
    new Promise(function (resolve, reject) {
        client
            .get(GET_SEARCHED_FRIEND + '?query=' +data+ '&type=add-friend')
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
///xchat/search-contacts/?query=shubham&type=add-friend
