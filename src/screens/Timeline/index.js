import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
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
import {
  getTrendTimeline,
  getFollowingTimeline,
  getRankingTimeline,
  hidePost,
  hideAllPost,
  reportPost,
} from '../../redux/reducers/timelineReducer';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import AsyncStorage from '@react-native-community/async-storage';
import {resetData} from '../../storage/Service';
import {ListLoader} from '../../components/Loaders';

class Timeline extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      activeTab: 'trend',
      isLoading: true,
      tabBarItem: [
        {
          id: 1,
          title: 'trend',
          icon: Icons.icon_chat,
          action: () => {
            this.setState({activeTab: 'trend'});
            this.props
              .getTrendTimeline(this.props.userData.user_type)
              .then((res) => {
                this.setState({isLoading: false});
              })
              .catch((err) => {
                this.setState({isLoading: false});
              });
          },
        },
        {
          id: 2,
          title: 'following',
          icon: Icons.icon_setting,
          action: () => {
            this.setState({activeTab: 'following'});
            this.props
              .getFollowingTimeline()
              .then((res) => {
                this.setState({isLoading: false});
              })
              .catch((err) => {
                this.setState({isLoading: false});
              });
          },
        },
        {
          id: 3,
          title: 'ranking',
          icon: Icons.icon_timeline,
          action: () => {
            this.setState({activeTab: 'ranking'});
            this.props
              .getRankingTimeline(this.props.userData.user_type)
              .then((res) => {
                this.setState({isLoading: false});
              })
              .catch((err) => {
                this.setState({isLoading: false});
              });
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
  }

  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  async componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    // this.props.getTrendTimeline();
    // this.props.getFollowingTimeline();
    // this.props.getRankingTimeline();
    // this.showData();

    await this.props
      .getTrendTimeline(this.props.userData.user_type)
      .then((res) => {
        this.setState({isLoading: false});
        this.props.getFollowingTimeline().then((res) => {
          this.setState({isLoading: false});
          this.props
            .getRankingTimeline(this.props.userData.user_type)
            .then((res) => {
              this.setState({isLoading: false});
              this.showData();
            });
        });
      })
      .catch((err) => {
        this.setState({isLoading: false});
      });
  }

  showData() {
    const {trendTimline, followingTimeline, rankingTimeLine} = this.props;
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  _openMenu = () => this.setState({visible: true});

  _closeMenu = () => this.setState({visible: false});

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
    this.setState({showConfirmation: true, currentPost: post});
  }

  hideAllPost(post) {
    const {activeTab} = this.state;
    this.props.hideAllPost(post.channel_id).then((res) => {
      this.refreshContent();
    });
  }

  reportContent(post) {
    const {activeTab} = this.state;
    this.props.reportPost(post.id).then((res) => {
      this.refreshContent();
    });
  }

  refreshContent() {
    const {activeTab} = this.state;
    if (activeTab === 'trend') {
      this.props.getTrendTimeline(this.props.userData.user_type).then((res) => {
        this.showData();
      });
    } else if (activeTab === 'following') {
      this.props.getFollowingTimeline().then((res) => {
        this.showData();
      });
    } else if (activeTab === 'ranking') {
      this.props
        .getRankingTimeline(this.props.userData.user_type)
        .then((res) => {
          this.showData();
        });
    }
  }

  updateModalVisibility() {
    this.setState({showConfirmation: !this.state.showConfirmation});
  }

  actionSure = async () => {
    const {currentPost} = this.state;
    this.props
      .hidePost(currentPost.id)
      .then((res) => {
        this.refreshContent();
        this.setState({showConfirmation: false});
      })
      .catch((err) => {
        this.setState({showConfirmation: false});
      });
  };

  actionCancel() {
    this.updateModalVisibility();
  }

  render() {
    const {
      tabBarItem,
      activeTab,
      menuItems,
      posts,
      orientation,
      showConfirmation,
    } = this.state;
    const {
      trendTimline,
      followingTimeline,
      rankingTimeLine,
      loading,
    } = this.props;
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
            <ScrollView>
              {activeTab === 'trend' ? (
                <PostCard
                  menuItems={menuItems}
                  posts={trendTimline}
                  isTimeline={true}
                  navigation={this.props.navigation}
                />
              ) : activeTab === 'following' ? (
                <PostCard
                  menuItems={menuItems}
                  posts={followingTimeline}
                  isTimeline={true}
                  navigation={this.props.navigation}
                />
              ) : (
                <PostCard
                  menuItems={menuItems}
                  posts={rankingTimeLine}
                  isTimeline={true}
                  navigation={this.props.navigation}
                />
              )}
            </ScrollView>
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
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {
  getTrendTimeline,
  getFollowingTimeline,
  getRankingTimeline,
  hidePost,
  hideAllPost,
  reportPost,
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
