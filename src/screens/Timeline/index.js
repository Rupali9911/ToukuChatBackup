/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from 'react';
import { Image, View } from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import HomeHeader from '../../components/HomeHeader';
import { ListLoader } from '../../components/Loaders';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import PostCard from '../../components/PostCard';
import TabBar from '../../components/TabBar';
import { Icons, SocketEvents } from '../../constants';
import { followChannel } from '../../redux/reducers/channelReducer';
import { setI18nConfig, translate } from '../../redux/reducers/languageReducer';
import {
  getFollowingTimeline,
  getRankingChannelList,
  getRankingTimeline,
  getTrendTimeline,
  hideAllPost,
  hidePost,
  reportPost,
  setActiveTimelineTab,
  setSpecificPostId,
  updateRankingChannel,
  updateTrendTimeline,
  likeUnlikeTimelinePost,
  updateFollowingTimeline,
  timelinePostComment,
  getPostComments,
  deletePostComment
} from '../../redux/reducers/timelineReducer';
import { globalStyles } from '../../styles';
import { showToast, eventService } from '../../utils';

class Timeline extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      activeTab: 'following',
      isLoading: true,
      tabBarItem:
        this.props.userData.user_type === 'owner' ||
          this.props.userData.user_type === 'company' ||
          this.props.userData.user_type === 'tester'
          ? [
            // {
            //   id: 1,
            //   title: 'trend',
            //   icon: Icons.icon_chat,
            //   action: () => {
            //     this.setState({ activeTab: 'trend' });
            //     this.props.setActiveTimelineTab('trend');
            //     this.props
            //       .getTrendTimeline(this.props.userData.user_type)
            //       .then((res) => {
            //         this.setState({ isLoading: false });
            //       })
            //       .catch((err) => {
            //         console.error(err);
            //         this.setState({ isLoading: false });
            //       });
            //   },
            // },
            {
              id: 2,
              title: 'following',
              icon: Icons.icon_setting,
              action: () => {
                this.setState({ activeTab: 'following' });
                this.props.setActiveTimelineTab('following');
                this.props
                  .getFollowingTimeline()
                  .then((res) => {
                    this.setState({ isLoading: false });
                  })
                  .catch((err) => {
                    console.error(err);
                    this.setState({ isLoading: false });
                  });
              },
            },
            {
              id: 3,
              title: 'ranking',
              icon: Icons.icon_timeline,
              action: () => {
                // this.setState({activeTab: 'ranking'});
                this.props.setActiveTimelineTab('ranking');
                // this.props
                //   .getRankingTimeline(this.props.userData.user_type)
                //   .then((res) => {
                //     this.setState({isLoading: false});
                //   })
                //   .catch((err) => {
                //     this.setState({isLoading: false});
                //   });
                // this.props.rankingTimeLine && this.props.rankingTimeLine.length===0 && this.props.getRankingChannelList(this.props.rankingTimeLine.length)
                //   .then((res) => {
                //     this.setState({ isLoading: false });
                //     this.showData();
                //   })
                //   .catch((err) => {
                //     this.setState({ isLoading: false });
                //   });
              },
            },
          ]
          : [
            // {
            //   id: 1,
            //   title: 'trend',
            //   icon: Icons.icon_chat,
            //   action: () => {
            //     this.setState({ activeTab: 'trend' });
            //     this.props.setActiveTimelineTab('trend');
            //     this.props
            //       .getTrendTimeline(this.props.userData.user_type)
            //       .then((res) => {
            //         this.setState({ isLoading: false });
            //       })
            //       .catch((err) => {
            //         console.error(err);
            //         this.setState({ isLoading: false });
            //       });
            //   },
            // },
            {
              id: 2,
              title: 'following',
              icon: Icons.icon_setting,
              action: () => {
                this.setState({ activeTab: 'following' });
                this.props.setActiveTimelineTab('following');
                this.props
                  .getFollowingTimeline()
                  .then((res) => {
                    this.setState({ isLoading: false });
                  })
                  .catch((err) => {
                    console.error(err);
                    this.setState({ isLoading: false });
                  });
              },
            },
            {
              id: 3,
              title: 'ranking',
              icon: Icons.icon_timeline,
              action: () => {
                showToast(
                  'TOUKU',
                  translate('pages.clasrm.comingSoon'),
                  'positive',
                );
              },
            },
          ],
      visible: false,
      menuItems: [
        {
          id: 1,
          title: translate('pages.xchat.hideThisPost'),
          icon: 'bars',
          onPress: (res) => {
            this.hidePost(res);
          },
        },
        // ,
        // {
        //   id: 1,
        //   title: translate('pages.xchat.hideAllPost'),
        //   icon: 'bars',
        //   onPress: (res) => {
        //     this.hideAllPost(res);
        //   },
        // },
        // {
        //   id: 1,
        //   title: translate('pages.xchat.reportContent'),
        //   icon: 'bars',
        //   onPress: (res) => {
        //     this.reportContent(res);
        //   },
        // },
      ],
      showConfirmation: false,
      currentPost: null,
    };
    this.specificPosts = null;
  }

  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({ orientation: initial });

    this.events = eventService.getMessage().subscribe((message) => {
      this.checkEventTypes(message);
    });
  }

  async componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    // this.props.getTrendTimeline();
    // this.props.getFollowingTimeline();
    // this.props.getRankingTimeline();
    // this.showData();

    let activeTab = this.props.navigation.getParam('activeTab');

    if (activeTab) {
      this.setState({ activeTab });
    }

    let postId = this.props.specificPostId;

    console.log('postId', postId);

    // await this.props
    //   .getTrendTimeline(this.props.userData.user_type, postId)
    //   .then((res) => {
    //     this.setState({isLoading: false});

    if (postId && res.status) {
      this.specificPosts = res.posts;
    }

    this.props.getFollowingTimeline().then(() => {
      this.setState({ isLoading: false });
      // this.props
      //   .getRankingTimeline(this.props.userData.user_type)
      //   .then((res) => {
      //     this.setState({isLoading: false});
      //     this.showData();
      //   });
      if (
        this.props.userData.user_type === 'owner' ||
        this.props.userData.user_type === 'company' ||
        this.props.userData.user_type === 'tester'
      ) {
        this.props
          .getRankingChannelList(this.props.rankingChannel.length)
          .then(() => {
            this.setState({ isLoading: false });
            this.showData();
          });
      } else {
        this.setState({ isLoading: false });
        this.showData();
      }
    })
      .catch((err) => {
        console.error(err);
        this.setState({ isLoading: false });
      });

    this.focusListener = this.props.navigation.addListener(
      'didBlur',
      async () => this.props.setSpecificPostId(null),
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.specificPostId && !nextProps.specificPostId) {
      this.setState({ isLoading: true });
      // this.props.getTrendTimeline(this.props.userData.user_type)
      this.props.getFollowingTimeline()
        .then((res) => { this.setState({ isLoading: false }) });
    }
    if (nextProps.specificPostId) {
      this.setState({ isLoading: true });
      this.props.getTrendTimeline(this.props.userData.user_type, nextProps.specificPostId)
        // this.props.getFollowingTimeline(nextProps.specificPostId)
        .then((res) => {
          if (res.status) {
            this.specificPosts = res.posts;
          }
          this.setState({ isLoading: false });
        });
    }
  }

  checkEventTypes(message) {
    console.log('event_message', message)
    switch (message.text.data.type) {
      case SocketEvents.LIKE_TIMELINE_POST:
        this.handlePostLikeUnlike(message);
        break;
      case SocketEvents.TIMELINE_POST_COMMENT_DATA:
        this.handlePostTimelineComment(message);
        break;
      case SocketEvents.TIMELINE_POST_COMMENT_DELETE:
        this.handlePostCommentDelete(message);
        break;
    }
  }

  handlePostLikeUnlike = (message) => {
    console.log('handlePostLikeUnlike', message);
    const { followingTimeline } = this.props;
    const message_details = message.text.data.message_details;
    console.log('message_details', message_details);
    if (followingTimeline && followingTimeline.length > 0) {
      let index = followingTimeline.findIndex((value, index) => {
        return value.id == message_details.post_id;
      });
      console.log('index', index);
      if (index == 0 || index > 0) {
        let item = followingTimeline[index];
        if (message_details.user_id == this.props.userData.id) {
          item.is_liked = message_details.like.like;
        }
        item.liked_by_count = message_details.like.like ? item.liked_by_count + 1 : item.liked_by_count - 1;
        let array = followingTimeline;
        array.splice(index, 1, item);
        this.props.updateFollowingTimeline(array);
      }
    }
  }

  handlePostTimelineComment = (message) => {
    const { followingTimeline } = this.props;
    const message_details = message.text.data.message_details;
    console.log('message_details', message_details);
    if (followingTimeline && followingTimeline.length > 0) {
      let index = followingTimeline.findIndex((value, index) => {
        return value.id == message_details.schedule_post;
      });
      console.log('index', index);
      if (index == 0 || index > 0) {
        let item = followingTimeline[index];
        let isCommentExists = item.post_comments.findIndex((value, index) => {
          return value.id == message_details.id;
        });
        if (isCommentExists == -1) {
          item.post_comments.splice(0, 0, message_details);
          let array = followingTimeline;
          array.splice(index, 1, item);
          this.props.updateFollowingTimeline(array);
        }
      }
    }
  }

  handlePostCommentDelete = (message) => {
    const { followingTimeline } = this.props;
    const message_details = message.text.data.message_details;
    console.log('message_details', message_details);
    if (followingTimeline && followingTimeline.length > 0) {
      let index = followingTimeline.findIndex((value, index) => {
        return value.id == message_details.post_id;
      });
      console.log('index', index);
      if (index == 0 || index > 0) {
        let item = followingTimeline[index];
        let commentIndex = item.post_comments.findIndex((value, index) => {
          return value.id == message_details.comment_id;
        });
        if (commentIndex > -1) {
          item.post_comments.splice(commentIndex, 1);
          let array = followingTimeline;
          array.splice(index, 1, item);
          this.props.updateFollowingTimeline(array);
        }
      }
    }
    if (nextProps.specificPostId) {
      this.setState({ isLoading: true });
      this.props
        .getTrendTimeline(
          this.props.userData.user_type,
          nextProps.specificPostId,
        )
        .then((res) => {
          if (res.status) {
            this.specificPosts = res.posts;
          }
          this.setState({ isLoading: false });
        });
    }
  }

  showData() {
    // const {trendTimline, followingTimeline, rankingTimeLine} = this.props;
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  _openMenu = () => this.setState({ visible: true });

  _closeMenu = () => this.setState({ visible: false });

  getAspectRatio = () => {
    Image.getSize(
      'https://angelium-media.s3.ap-southeast-1.amazonaws.com/image_1589547165984_1.png',
      (height, width) => {
        this.setState({
          ratio: height / width,
        });
      },
    );
  };

  onLayout = () => {
    this.getAspectRatio();
  };

  hidePost(post) {
    this.setState({ showConfirmation: true, currentPost: post });
  }

  hideAllPost(post) {
    // const {activeTab} = this.state;
    this.props.hideAllPost(post.channel_id).then((res) => {
      this.refreshContent();
    });
  }

  reportContent(post) {
    // const {activeTab} = this.state;
    this.props.reportPost(post.id).then((res) => {
      this.refreshContent();
    });
  }

  refreshContent() {
    const { activeTab } = this.state;
    if (activeTab === 'trend') {
      this.props.getTrendTimeline(this.props.userData.user_type).then((res) => {
        this.showData();
      });
    } else if (activeTab === 'following') {
      this.props.getFollowingTimeline().then((res) => {
        this.showData();
      });
    } else if (activeTab === 'ranking') {
      // this.props
      //   .getRankingTimeline(this.props.userData.user_type)
      //   .then((res) => {
      //     this.showData();
      //   });
    }
  }

  updateModalVisibility() {
    this.setState({ showConfirmation: !this.state.showConfirmation });
  }

  actionSure = async () => {
    const { currentPost } = this.state;
    this.props
      .hidePost(currentPost.id)
      .then((res) => {
        this.refreshContent();
        this.setState({ showConfirmation: false });
      })
      .catch((err) => {
        this.setState({ showConfirmation: false });
      });
  };

  actionCancel() {
    this.updateModalVisibility();
  }

  onFollowUnfollow = async (channel_id, index, channel_name, onFinish) => {
    const { trendTimline } = this.props;
    let data = {
      channel_id: channel_id,
      user_id: this.props.userData.id,
    };
    this.props
      .followChannel(data)
      .then((res) => {
        onFinish();
        if (res.status === true) {
          showToast(
            channel_name,
            translate('pages.xchat.toastr.AddedToNewChannel'),
            'positive',
          );
          if (trendTimline && trendTimline.length > 0) {
            let item = trendTimline[index];
            item.is_following = true;
            let array = trendTimline;
            array.splice(index, 1, item);
            this.props.updateTrendTimeline(array);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        onFinish();
        showToast('TOUKU', translate('common.somethingWentWrong'), 'primary');
        this.isFollowing = false;
        this.setState({
          isLoading: false,
        });
      });
  };

  likeUnlikePost = (id, action, index) => {
    const { followingTimeline } = this.props;
    this.props.likeUnlikeTimelinePost(id, action).then((res) => {
      if (res) {
        console.log('response', res);
        // if(followingTimeline && followingTimeline.length>0){
        //   let item = followingTimeline[index];
        //   item.is_liked = res.like;
        //   item.liked_by_count = res.like?item.liked_by_count+1:item.liked_by_count-1
        //   let array = followingTimeline;
        //   array.splice(index, 1, item);
        //   console.log('item',item);
        //   this.props.updateFollowingTimeline(array);
        // }
      }
    }).catch((err) => {
      console.log('error', err);
    });
  }

  createCommentOnPost = (id, text) => {
    this.props.timelinePostComment(id, text).then((res) => {
      if (res) {
        console.log('response comment', res);
      }
    }).catch((err) => {
      console.log('err', err);
    });
  }

  onMomentumScrollBegin = () => {
    this.doUpdate = false;
  };

  onEndReached = (info) => {
    const { posts } = this.state;
    const lastPost = posts[posts.length - 1];
    if (!this.doUpdate && this.lastPostId !== lastPost.id) {
      this.doUpdate = true;
      this.lastPostId = lastPost.id;
      this.getCurrentChannelTimeline(lastPost.id);
    }
  };

  render() {
    const { tabBarItem, menuItems, orientation, showConfirmation } = this.state;
    const {
      trendTimline,
      followingTimeline,
      rankingChannel,
      rankingLoadMore,
      loading,
      activeTab,
    } = this.props;

    let postId = this.props.specificPostId;
    if (!postId) {
      this.specificPosts = null;
    }

    console.log('postId', postId, 'posts', this.specificPosts);

    return (
      // <ImageBackground
      //   source={Images.image_home_bg}
      //   style={globalStyles.container}
      // >
      <View style={globalStyles.container}>
        <HomeHeader title={translate('pages.xchat.timeline')} />
        <View style={globalStyles.container}>
          <TabBar tabBarItem={tabBarItem} activeTab={activeTab} />
          {this.state.isLoading ? (
            <ListLoader justifyContent={'flex-start'} />
          ) : (
              <View style={{ flex: 1 }}>
                {
                  // activeTab === 'trend' ? (
                  //   <PostCard
                  //     menuItems={menuItems}
                  //     posts={this.specificPosts || trendTimline}
                  //     isTimeline={true}
                  //     navigation={this.props.navigation}
                  //     onFollowUnfollowChannel={this.onFollowUnfollow}
                  //     // onMomentumScrollBegin={this.onMomentumScrollBegin}
                  //     // onEndReached={this.onEndReached}
                  //   />
                  // ) : 
                  activeTab === 'following' ? (
                    <PostCard
                      menuItems={menuItems}
                      posts={this.specificPosts ? [this.specificPosts[0], ...followingTimeline] : followingTimeline}
                      isTimeline={true}
                      userData={this.props.userData}
                      navigation={this.props.navigation}
                      onFollowUnfollowChannel={this.onFollowUnfollow}
                      likeUnlikePost={this.likeUnlikePost}
                      addComment={this.props.timelinePostComment}
                      getPostComments={this.props.getPostComments}
                      deleteComment={this.props.deletePostComment}
                    />
                  ) : loading && rankingChannel.length <= 0 ? (
                    <ListLoader justifyContent={'flex-start'} />
                  ) : (
                        <PostCard
                          menuItems={menuItems}
                          posts={rankingChannel}
                          isTimeline={true}
                          navigation={this.props.navigation}
                          isRankedChannel={true}
                          rankingLoadMore={loading}
                          onEndReached={() => {
                            if (rankingLoadMore && !loading) {
                              console.log('load_more', rankingLoadMore);
                              this.props.getRankingChannelList(this.props.rankingChannel.length)
                                .then((res) => {
                                  this.setState({ isLoading: false });
                                  this.showData();
                                });
                            }
                          }}
                          onChannelUpdate={(status, index) => {
                            let item = rankingChannel[index];
                            item.is_following = status;
                            let array = rankingChannel;
                            array.splice(index, 1, item);
                            console.log('item', item);
                            this.props.updateRankingChannel({
                              channels: array,
                              load_more: rankingLoadMore,
                              type: 'update'
                            });
                          }}
                        />
                    )}
              </View>
            )}
        </View>
        <ConfirmationModal
          orientation={orientation}
          visible={showConfirmation}
          onCancel={this.actionCancel.bind(this)}
          onConfirm={this.actionSure.bind(this)}
          title={translate('pages.xchat.reallyWannaRelease')}
          message={translate('pages.xchat.ifYouCancelIt')}
          isLoading={loading}
        />

      </View>
      // </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    loading: state.timelineReducer.loading,
    trendTimline: state.timelineReducer.trendTimline,
    followingTimeline: state.timelineReducer.followingTimeline,
    rankingTimeLine: state.timelineReducer.rankingTimeLine,
    rankingChannel: state.timelineReducer.rankingChannel,
    rankingLoadMore: state.timelineReducer.rankingLoadMore,
    activeTab: state.timelineReducer.activeTab,
    userData: state.userReducer.userData,
    specificPostId: state.timelineReducer.specificPostId,
  };
};

const mapDispatchToProps = {
  getTrendTimeline,
  getFollowingTimeline,
  getRankingTimeline,
  getRankingChannelList,
  hidePost,
  hideAllPost,
  reportPost,
  setActiveTimelineTab,
  updateRankingChannel,
  followChannel,
  updateTrendTimeline,
  setSpecificPostId,
  likeUnlikeTimelinePost,
  updateFollowingTimeline,
  timelinePostComment,
  getPostComments,
  deletePostComment
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
