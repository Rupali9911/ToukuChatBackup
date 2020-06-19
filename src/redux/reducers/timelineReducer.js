import { client } from '../../helpers/api';

export const GET_TREND_TIMELINE_REQUEST = 'GET_TREND_TIMELINE_REQUEST';
export const GET_TREND_TIMELINE_SUCCESS = 'GET_TREND_TIMELINE_SUCCESS';
export const GET_TREND_TIMELINE_FAIL = 'GET_TREND_TIMELINE_FAIL';

export const GET_FOLLOWING_TIMELINE_REQUEST = 'GET_FOLLOWING_TIMELINE_REQUEST';
export const GET_FOLLOWING_TIMELINE_SUCCESS = 'GET_FOLLOWING_TIMELINE_SUCCESS';
export const GET_FOLLOWING_TIMELINE_FAIL = 'GET_FOLLOWING_TIMELINE_FAIL';

export const GET_RANKING_TIMELINE_REQUEST = 'GET_RANKING_TIMELINE_REQUEST';
export const GET_RANKING_TIMELINE_SUCCESS = 'GET_RANKING_TIMELINE_SUCCESS';
export const GET_RANKING_TIMELINE_FAIL = 'GET_RANKING_TIMELINE_FAIL';

export const GET_TREND_CHANNEL_REQUEST = 'GET_TREND_CHANNEL_REQUEST';
export const GET_TREND_CHANNEL_SUCCESS = 'GET_TREND_CHANNEL_SUCCESS';
export const GET_TREND_CHANNEL_FAIL = 'GET_TREND_CHANNEL_FAIL';

export const GET_FOLLOWING_CHANNEL_REQUEST = 'GET_FOLLOWING_CHANNEL_REQUEST';
export const GET_FOLLOWING_CHANNEL_SUCCESS = 'GET_FOLLOWING_CHANNEL_SUCCESS';
export const GET_FOLLOWING_CHANNEL_FAIL = 'GET_FOLLOWING_CHANNEL_FAIL';

export const GET_RANKING_CHANNEL_REQUEST = 'GET_RANKING_CHANNEL_REQUEST';
export const GET_RANKING_CHANNEL_SUCCESS = 'GET_RANKING_CHANNEL_SUCCESS';
export const GET_RANKING_CHANNEL_FAIL = 'GET_RANKING_CHANNEL_FAIL';

const initialState = {
  loading: false,
  trendTimline: [],
  followingTimeline: [],
  rankingTimeLine: [],
    trendChannel: [],
    followingChannel: [],
    rankingChannel: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    //Get trend timeline
    case GET_TREND_TIMELINE_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_TREND_TIMELINE_SUCCESS:
      return {
        ...state,
        trendTimline: action.payload,
        loading: false,
      };

    case GET_TREND_TIMELINE_FAIL:
      return {
        ...state,
        loading: false,
      };

    //Get following timeline
    case GET_FOLLOWING_TIMELINE_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_FOLLOWING_TIMELINE_SUCCESS:
      return {
        ...state,
        followingTimeline: action.payload,
        loading: false,
      };

    case GET_FOLLOWING_TIMELINE_FAIL:
      return {
        ...state,
        loading: false,
      };

    //Get ranking timeline
    case GET_RANKING_TIMELINE_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_RANKING_TIMELINE_SUCCESS:
      return {
        ...state,
        rankingTimeLine: action.payload,
        loading: false,
      };

    case GET_RANKING_TIMELINE_FAIL:
      return {
        ...state,
        loading: false,
      };

      //Get trend channel
      case GET_TREND_CHANNEL_REQUEST:
          return {
              ...state,
              loading: true,
          };

      case GET_TREND_CHANNEL_SUCCESS:
          return {
              ...state,
              trendChannel: action.payload,
              loading: false,
          };

      case GET_TREND_CHANNEL_FAIL:
          return {
              ...state,
              loading: false,
          };

      //Get following channel
      case GET_FOLLOWING_CHANNEL_REQUEST:
          return {
              ...state,
              loading: true,
          };

      case GET_FOLLOWING_CHANNEL_SUCCESS:
          return {
              ...state,
              followingChannel: action.payload,
              loading: false,
          };

      case GET_FOLLOWING_CHANNEL_FAIL:
          return {
              ...state,
              loading: false,
          };

      //Get ranking channel
      case GET_RANKING_CHANNEL_REQUEST:
          return {
              ...state,
              loading: true,
          };

      case GET_RANKING_CHANNEL_SUCCESS:
          return {
              ...state,
              rankingChannel: action.payload,
              loading: false,
          };

      case GET_RANKING_CHANNEL_FAIL:
          return {
              ...state,
              loading: false,
          };

    default:
      return state;
  }
}

//Get trend timeline
const getTrendTimelineRequest = () => ({
  type: GET_TREND_TIMELINE_REQUEST,
});

const getTrendTimelineSuccess = (data) => ({
  type: GET_TREND_TIMELINE_SUCCESS,
  payload: data,
});

const getTrendTimelineFailure = () => ({
  type: GET_TREND_TIMELINE_FAIL,
});

export const getTrendTimeline = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getTrendTimelineRequest());
    client
      .get(`/xchat/timeline-trend/?last_id=0`)
      .then((res) => {
        if (res.status) {
          dispatch(getTrendTimelineSuccess(res.posts));
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getTrendTimelineFailure());
        reject(err);
      });
  });

//Get following timeline
const getFollowingTimelineRequest = () => ({
  type: GET_FOLLOWING_TIMELINE_REQUEST,
});

const getFollowingTimelineSuccess = (data) => ({
  type: GET_FOLLOWING_TIMELINE_SUCCESS,
  payload: data,
});

const getFollowingTimelineFailure = () => ({
  type: GET_FOLLOWING_TIMELINE_FAIL,
});

export const getFollowingTimeline = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getFollowingTimelineRequest());
    client
      .get(`/xchat/timeline-following/?last_id=0`)
      .then((res) => {
        if (res.status) {
          dispatch(getFollowingTimelineSuccess(res.posts));
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getFollowingTimelineFailure());
        reject(err);
      });
  });

//Get ranking timeline
const getRankingTimelineRequest = () => ({
  type: GET_RANKING_TIMELINE_REQUEST,
});

const getRankingTimelineSuccess = (data) => ({
  type: GET_RANKING_TIMELINE_SUCCESS,
  payload: data,
});

const getRankingTimelineFailure = () => ({
  type: GET_RANKING_TIMELINE_FAIL,
});

export const getRankingTimeline = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    console.log('getRankingTimeline');
    dispatch(getRankingTimelineRequest());
    client
      .get(`/xchat/timeline-rank/?last_id=0`)
      .then((res) => {
        if (res.status) {
          dispatch(getRankingTimelineSuccess(res.posts));
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getRankingTimelineFailure());
        reject(err);
      });
  });

//Get trend channel
const getTrendChannelRequest = () => ({
    type: GET_TREND_CHANNEL_REQUEST,
});

const getTrendChannelSuccess = (data) => ({
    type: GET_TREND_CHANNEL_SUCCESS,
    payload: data,
});

const getTrendChannelFailure = () => ({
    type: GET_TREND_CHANNEL_FAIL,
});

export const getTrendChannel = () => (dispatch) =>
    new Promise(function (resolve, reject) {
        dispatch(getTrendChannelRequest());
        client
            .get(`/xchat/channel-listing-trend/?last_id=0`)
            .then((res) => {
                if (res.status) {
                    dispatch(getTrendChannelSuccess(res.posts));
                }
                resolve(res);
            })
            .catch((err) => {
                dispatch(getChannelFailure());
                reject(err);
            });
    });

//Get following channel
const getFollowingChannelRequest = () => ({
    type: GET_FOLLOWING_CHANNEL_REQUEST,
});

const getFollowingChannelSuccess = (data) => ({
    type: GET_FOLLOWING_CHANNEL_SUCCESS,
    payload: data,
});

const getFollowingChannelFailure = () => ({
    type: GET_FOLLOWING_CHANNEL_FAIL,
});

export const getFollowingChannel = () => (dispatch) =>
    new Promise(function (resolve, reject) {
        dispatch(getFollowingChannelRequest());
        client
            .get(`/xchat/channel-listing-following/?last_id=0`)
            .then((res) => {
                if (res.status) {
                    dispatch(getFollowingChannelSuccess(res.posts));
                }
                resolve(res);
            })
            .catch((err) => {
                dispatch(getFollowingChannelFailure());
                reject(err);
            });
    });

//Get ranking channel
const getRankingChannelRequest = () => ({
    type: GET_RANKING_CHANNEL_REQUEST,
});

const getRankingChannelSuccess = (data) => ({
    type: GET_RANKING_CHANNEL_SUCCESS,
    payload: data,
});

const getRankingChannelFailure = () => ({
    type: GET_RANKING_CHANNEL_FAIL,
});

export const getRankingChannel = () => (dispatch) =>
    new Promise(function (resolve, reject) {
        dispatch(getRankingChannelRequest());
        client
            .get(`/xchat/channel-listing-ranked/?last_id=0`)
            .then((res) => {
                if (res.status) {
                    dispatch(getRankingChannelSuccess(res.posts));
                }
                resolve(res);
            })
            .catch((err) => {
                dispatch(getRankingChannelFailure());
                reject(err);
            });
    });
