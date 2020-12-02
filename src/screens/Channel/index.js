import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  Text,
  ScrollView,
} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';

import {globalStyles} from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import {Images, Icons, Colors, Fonts} from '../../constants';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import TabBar from '../../components/TabBar';
import PostCard from '../../components/PostCard';
import PostChannelCard from '../../components/PostChannelCard';
import {
  getTrendChannel,
  getFollowingChannel,
  getRankingChannel,
  hidePost,
  hideAllPost,
  reportPost,
} from '../../redux/reducers/timelineReducer';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {ListLoader} from '../../components/Loaders';

// let visibleNewPost = null;
class Channel extends Component {
  constructor(props) {
    super(props);
    this.pageCount = '0';
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      activeTab: 'trend',
      refreshData: false,
      trendChannel: [],
      followingChannel: [],
      rankingChannel: [],
      onRefreshLoad: false,
      showPostsVisible: false,
      isLoading: true,
      tabBarItem: [
        {
          id: 1,
          title: 'trend',
          icon: Icons.icon_chat,
          action: () => {
            this.setState({activeTab: 'trend'});
            this.pageCount = 0;
            // this.props
            //   .getTrendChannel(this.props.userData.user_type, this.pageCount)
            //   .then((res) => {});
          },
        },
        {
          id: 2,
          title: 'following',
          icon: Icons.icon_setting,
          action: () => {
            this.setState({activeTab: 'following'});
            this.pageCount = 0;
            // this.props.getFollowingChannel(this.pageCount).then((res) => {});
          },
        },
        {
          id: 3,
          title: 'ranking',
          icon: Icons.icon_timeline,
          action: () => {
            this.setState({activeTab: 'ranking'});
            this.pageCount = 0;
            // this.props
            //   .getRankingChannel(this.props.userData.user_type, this.pageCount)
            //   .then((res) => {});
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
        {
          id: 1,
          title: translate('pages.xchat.hideAllPost'),
          icon: 'bars',
          onPress: (res) => {
            this.hideAllPost(res);
          },
        },
        {
          id: 1,
          title: translate('pages.xchat.reportContent'),
          icon: 'bars',
          onPress: (res) => {
            this.reportContent(res);
          },
        },
      ],
    };
  }

  // componentDidMount() {
  //   if (
  //     this.props.trendChannel.length === 0 &&
  //     this.props.rankingChannel.length === 0 &&
  //     this.props.followingChannel.length === 0
  //   ) {
  //     this.props.getTrendChannel(this.props.userData.user_type, this.pageCount);
  //     this.props.getFollowingChannel(this.pageCount);
  //     this.props.getRankingChannel(
  //       this.props.userData.user_type,
  //       this.pageCount,
  //     );
  //   }
  // }

  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

  pagination = (pageno) => {
    if (this.state.activeTab === 'trend') {
      if (this.props.trendLoadMore) {
        this.pageCount = parseInt(this.pageCount) + parseInt(pageno);
        this.props.getTrendChannel(
          this.props.userData.user_type,
          this.pageCount,
        );
      }
    } else if (this.state.activeTab === 'following') {
      if (this.props.followingLoadMore) {
        this.pageCount = parseInt(this.pageCount) + parseInt(pageno);
        this.props.getFollowingChannel(this.pageCount);
      }
    } else if (this.state.activeTab === 'ranking') {
      if (this.props.rankingLoadMore) {
        this.pageCount = parseInt(this.pageCount) + parseInt(pageno);
        this.props.getRankingChannel(
          this.props.userData.user_type,
          this.pageCount,
        );
      }
    }
  };

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  onRefreshChannel = () => {
    const {activeTab} = this.state;
    this.setState({onRefreshLoad: true});
    console.log('log');
    this.pageCount = 0;
    if (activeTab === 'trend') {
      this.props
        .getTrendChannel(this.props.userData.user_type, 0, activeTab)
        .then((res) => {
          if (res.status) {
            this.setState({showPostsVisible: false, onRefreshLoad: false});
            clearInterval(visibleNewPost);
          }
        });
    } else if (activeTab === 'following') {
      this.props.getFollowingChannel(this.pageCount, activeTab).then((res) => {
        if (res.status) {
          this.setState({showPostsVisible: false, onRefreshLoad: false});
          clearInterval(visibleNewPost);
        }
      });
    } else if (activeTab === 'ranking') {
      this.props
        .getRankingChannel(
          this.props.userData.user_type,
          this.pageCount,
          activeTab,
        )
        .then((res) => {
          if (res.status) {
            this.setState({showPostsVisible: false, onRefreshLoad: false});
            clearInterval(visibleNewPost);
          }
        });
    }
  };

  async componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    // this.props.getTrendChannel();
    // this.props.getFollowingChannel();
    // this.props.getRankingChannel();
    // this.showData();

    // visibleNewPost = setInterval(() => {
    //   this.setState({showPostsVisible: true});
    // }, 15000);

    await this.props
      .getTrendChannel(this.props.userData.user_type)
      .then((res) => {
        this.setState({isLoading: false});
        this.props.getFollowingChannel(this.pageCount).then((res) => {
          this.setState({isLoading: false});

          this.props
            .getRankingChannel(this.props.userData.user_type, this.pageCount)
            .then((res) => {
              this.setState({isLoading: false});

              this.showData();
            });
        });
      });
    this.willFocusListener = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.onRefreshChannel();
      },
    );
  }

  componentWillReceiveProps(nextProps) {
    const {trendChannel, followingChannel, rankingChannel} = this.props;

    if (
      nextProps.trendChannel !== trendChannel ||
      nextProps.followingChannel !== followingChannel ||
      nextProps.rankingChannel !== rankingChannel
    ) {
      this.setState({
        trendChannel: nextProps.trendChannel,
        followingChannel: nextProps.followingChannel,
        rankingChannel: nextProps.rankingChannel,
      });
    }
  }

  showData() {
    const {trendChannel, followingChannel, rankingChannel} = this.props;
    // console.log(
    //   'Timeline -> showData -> trendChannel ============>>>>>>>>>>>>>>>',
    //   trendChannel.map((item) => console.log(item.media.audio))
    // );
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  _openMenu = () => this.setState({visible: true});

  _closeMenu = () => this.setState({visible: false});

  getAspectRatio = () => {
    Image.getSize(
      'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_5MG.mp3',
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
    const {activeTab} = this.state;
    console.log('post', post);
    this.props.hidePost(post.id).then((res) => {
      console.log('Hide post server response', res);
      this.refreshContent();
    });
  }

  hideAllPost(post) {
    const {activeTab} = this.state;
    console.log('post', post);
    this.props.hideAllPost(post.channel_id).then((res) => {
      console.log('hideAllPost post server response', res);
      this.refreshContent();
    });
  }

  reportContent(post) {
    const {activeTab} = this.state;
    console.log('post', post);
    this.props.reportPost(post.id).then((res) => {
      console.log('reportContent server response', res);
      this.refreshContent();
    });
  }

  refreshContent() {
    const {activeTab} = this.state;
    if (activeTab === 'trend') {
      console.log('trend selected');
      this.props
        .getTrendChannel(this.props.userData.user_type, this.pageCount)
        .then((res) => {
          this.showData();
        });
    } else if (activeTab === 'following') {
      console.log('following selected');
      this.props.getFollowingChannel(this.pageCount).then((res) => {
        this.showData();
      });
    } else if (activeTab === 'ranking') {
      console.log('ranking selected');
      this.props
        .getRankingChannel(this.props.userData.user_type, this.pageCount)
        .then((res) => {
          this.showData();
        });
    }
  }

  render() {
    const {
      tabBarItem,
      activeTab,
      menuItems,
      posts,
      trendChannel,
      followingChannel,
      rankingChannel,
      showPostsVisible,
    } = this.state;

    return (
      // <ImageBackground
      //   source={Images.image_home_bg}
      //   style={globalStyles.container}
      // >
      <View style={globalStyles.container}>
        <HomeHeader title={translate('pages.xchat.channel')} />
        <View style={globalStyles.container}>
          <TabBar tabBarItem={tabBarItem} activeTab={activeTab} />
          <View
            style={{flex: 1}}
            // showsVerticalScrollIndicator={false}
            // onScrollEndDrag={() => this.setState({pageCount: pageCount + 20})}
            // onScrollBeginDrag={() => this.setState({pageCount: pageCount - 20})}
            // initialNumToRender={4}
            // maxToRenderPerBatch={1}
            // onEndReachedThreshold={1}
          >
            {/* {showPostsVisible && (
              <LinearGradient
                start={{x: 0.1, y: 0.7}}
                end={{x: 0.5, y: 0.2}}
                locations={[0.1, 0.6, 1]}
                colors={[
                  Colors.gradient_1,
                  Colors.gradient_2,
                  Colors.gradient_3,
                ]}
                style={{
                  position: 'absolute',
                  zIndex: 15,
                  alignSelf: 'center',
                  marginTop: 10,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                  shadowColor: '#fff',
                  borderWidth: 1,
                  borderColor: Colors.gradient_1,
                }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.onRefreshChannel();
                    this.setState({showPostsVisible: false});
                  }}
                  hitSlop={{top: 200, bottom: 200, left: 200, right: 200}}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: '400',
                      paddingHorizontal: 15,
                    }}>
                    {'New Posts'}
                  </Text>
                </TouchableWithoutFeedback>
              </LinearGradient>
            )} */}
            {this.state.isLoading ? (
              <ListLoader justifyContent={'flex-start'} />
            ) : activeTab === 'trend' ? (
              <PostChannelCard
                menuItems={menuItems}
                posts={trendChannel}
                isTimeline={false}
                navigation={this.props.navigation}
                pagination={this.pagination}
                onRefresh={this.onRefreshChannel}
                onLoad={this.state.onRefreshLoad}
              />
            ) : activeTab === 'following' ? (
              <PostChannelCard
                menuItems={menuItems}
                posts={followingChannel}
                isTimeline={false}
                navigation={this.props.navigation}
                pagination={this.pagination}
                onRefresh={this.onRefreshChannel}
                onLoad={this.state.onRefreshLoad}
              />
            ) : (
              activeTab === 'ranking' && (
                <PostChannelCard
                  menuItems={menuItems}
                  posts={rankingChannel}
                  isTimeline={false}
                  navigation={this.props.navigation}
                  pagination={this.pagination}
                  onRefresh={this.onRefreshChannel}
                  onLoad={this.state.onRefreshLoad}
                />
              )
            )}
          </View>
        </View>
      </View>
      // </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    loading: state.timelineReducer.loading,
    trendChannel: state.timelineReducer.trendChannel,
    followingChannel: state.timelineReducer.followingChannel,
    rankingChannel: state.timelineReducer.rankingChannel,
    userData: state.userReducer.userData,
    trendLoadMore: state.timelineReducer.trendLoadMore,
    followingLoadMore: state.timelineReducer.followingLoadMore,
    rankingLoadMore: state.timelineReducer.rankingLoadMore,
  };
};

const mapDispatchToProps = {
  getTrendChannel,
  getFollowingChannel,
  getRankingChannel,
  hidePost,
  hideAllPost,
  reportPost,
};

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
