import {client} from '../../helpers/api';
import { dispatch } from 'rxjs/internal/observable/pairs';

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

export const HIDE_POST_REQUEST = 'HIDE_POST_REQUEST';
export const HIDE_POST_SUCCESS = 'HIDE_POST_SUCCESS';
export const HIDE_POST_FAIL = 'HIDE_POST_FAIL';

export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';

const initialState = {
  loading: false,
  trendTimline: [],
  followingTimeline: [],
  rankingTimeLine: [],
  trendChannel: [],
  followingChannel: [],
  rankingChannel: [],
  trendLoadMore: false,
  followingLoadMore: false,
  rankingLoadMore: false,
  activeTab: 'trend'
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
        trendTimline: [...action.payload],
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
      const {trendChannel} = state;

      let newTrend = [];
      if (action.payload.type !== undefined) {
        newTrend = action.payload.posts;
      } else {
        if (trendChannel.length > 0) {
          trendChannel.map((followingItem) => {
            let list = action.payload.posts.filter((item) => {
              return item.id != followingItem.channel_id;
            });
            newTrend = [...trendChannel, ...list];
          });
        } else {
          newTrend = action.payload.posts;
        }
      }
      return {
        ...state,
        trendChannel: newTrend,
        trendLoadMore: action.payload.load_more,
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
      const {followingChannel} = state;

      let newFollowing = [];
      if (action.payload.type !== undefined) {
        newFollowing = action.payload.posts;
      } else {
        if (followingChannel.length > 0) {
          followingChannel.map((followingItem) => {
            let list = action.payload.posts.filter((item) => {
              return item.id != followingItem.channel_id;
            });
            newFollowing = [...followingChannel, ...list];
          });
        } else {
          newFollowing = action.payload.posts;
        }
      }
      return {
        ...state,
        followingChannel: newFollowing,
        followingLoadMore: action.payload.load_more,
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
      const {rankingChannel} = state;

      let newRanking = [];
      if (action.payload.type !== undefined) {
        newRanking = action.payload.channels;
      } else {
        if (rankingChannel.length > 0) {
          rankingChannel.map((followingItem) => {
            let list = action.payload.channels.filter((item) => {
              return item.channel_id != followingItem.channel_id;
            });
            newRanking = [...rankingChannel, ...list];
          });
          // newRanking = [...rankingChannel, ...action.payload.channels];
        } else {
          newRanking = action.payload.channels;
        }
      }
      console.log('load_more',action.payload.load_more)
      return {
        ...state,
        rankingChannel: newRanking,
        rankingLoadMore: action.payload.load_more,
        loading: false,
      };

    case GET_RANKING_CHANNEL_FAIL:
      return {
        ...state,
        loading: false,
      };

    case HIDE_POST_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case HIDE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case HIDE_POST_FAIL:
      return {
        ...state,
        loading: false,
      };
    
    case SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload
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
//

const hidePostRequest = () => ({
  type: HIDE_POST_REQUEST,
});

const hidePostSuccess = (data) => ({
  type: HIDE_POST_SUCCESS,
  payload: data,
});

const hidePostFailure = () => ({
  type: HIDE_POST_FAIL,
});

export const getChannelTimeline = (groupId, lastId) => {
  // console.log(
  //   `/xchat/channel-timeline/${groupId}/?last_id=${lastId ? lastId : 0}`,
  // );
  return new Promise(function (resolve, reject) {
    client
      .get(`/xchat/channel-timeline/${groupId}/?last_id=${lastId ? lastId : 0}`)
      .then((res) => {
        // console.log(res);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateTrendTimeline = (data) => (dispatch) => {
  dispatch(getTrendTimelineSuccess(data));
}


//
export const getTrendTimeline = (userType) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getTrendTimelineRequest());
    let url = ['tester', 'owner', 'company'].includes(userType)
      ? `/xchat/timeline-trend-for-testers/?last_id=0`
      : `/xchat/timeline-trend/?last_id=0`;
    client
      .get(url)
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

const setActiveTab = (data) => ({
  type: SET_ACTIVE_TAB,
  payload: data
})

export const setActiveTimelineTab = (data) => (dispatch) => {
  dispatch(setActiveTab(data));
};

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

export const getRankingTimeline = (userType) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getRankingTimelineRequest());

    let url = ['tester', 'owner', 'company'].includes(userType)
      ? `/xchat/timeline-rank-for-testers/?last_id=0`
      : `/xchat/timeline-rank/?last_id=0`;

    client
      .get(url)
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

  export const getRankingChannelList = (start, type) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getRankingChannelRequest());
    console.log('api_Called',start);
    client
      .get(`/xchat/channel-listing-ranked/?start=${start}`)
      .then((res) => {
        if (res.status) {
          const newRes = {...res, type: type};
          dispatch(getRankingChannelSuccess(newRes));
          // dispatch(getRankingTimelineSuccess(res.channels));
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getRankingChannelFailure());
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

export const getTrendChannel = (userType, pageCount, type) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getTrendChannelRequest());
    let page = pageCount ? pageCount : 0;

    let url = ['tester', 'owner', 'company'].includes(userType)
      ? `/xchat/channel-listing-trend-for-testers/?start=${page}`
      : `/xchat/channel-listing-trend/?start=${page}`;

    client
      .get(url)
      .then((res) => {
        if (res.status) {
          const newRes = {...res, type: type};
          dispatch(getTrendChannelSuccess(newRes));
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getTrendChannelFailure());
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

export const getFollowingChannel = (pageCount, type) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getFollowingChannelRequest());

    let page = pageCount ? pageCount : 0;

    client
      .get(`/xchat/channel-listing-following/?last_id=${page}`)
      .then((res) => {
        if (res.status) {
          const newRes = {...res, type: type};
          dispatch(getFollowingChannelSuccess(newRes));
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

export const updateRankingChannel = (data) => (dispatch) => {
  dispatch(getRankingChannelSuccess(data));
}

export const getRankingChannel = (userType, pageCount, type) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(getRankingChannelRequest());

    let page = pageCount ? pageCount : 0;

    let url = ['tester', 'owner', 'company'].includes(userType)
      ? `/xchat/channel-listing-ranked-for-testers/?start=${page}`
      : `/xchat/channel-listing-ranked/?start=${page}`;

    client
      .get(url)
      .then((res) => {
        if (res.status) {
          const newRes = {...res, type: type};
          dispatch(getRankingChannelSuccess(newRes));
        }
        resolve(res);
      })
      .catch((err) => {
        dispatch(getRankingChannelFailure());
        reject(err);
      });
  });

export const hidePost = (postId) => (dispatch) =>
  new Promise(function (resolve, reject) {
    dispatch(hidePostRequest());
    let data = {
      filtered_post: postId,
    };
    client
      .patch(`/xchat/report-timeline-content/`, data)
      .then((res) => {
        if (res.status) {
          resolve(res);
          dispatch(hidePostSuccess());
        }
      })
      .catch((err) => {
        dispatch(hidePostFailure());
        reject(err);
      });
  });

export const hideAllPost = (postId) => (dispatch) =>
  new Promise(function (resolve, reject) {
    let data = {
      filtered_channel: postId,
    };
    client
      .patch(`/xchat/report-timeline-content/`, data)
      .then((res) => {
        if (res.status) {
          resolve(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });

export const reportPost = (postId) => (dispatch) =>
  new Promise(function (resolve, reject) {
    let data = {
      reported_post: postId,
    };
    //console.log('reported_post', data);
    client
      .patch(`/xchat/report-timeline-content/`, data)
      .then((res) => {
        if (res.status) {
          resolve(res);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
