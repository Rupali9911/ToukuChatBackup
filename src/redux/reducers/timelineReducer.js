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

const initialState = {
  loading: false,
  trendTimline: [],
  followingTimeline: [],
  rankingTimeLine: [],
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
    console.log('getTrendTimeline');
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
    console.log('getFollowingTimeline');
    client
      .get(`/xchat/timeline-following/?last_id=0`)
      .then((res) => {
        console.log('res', res);
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
