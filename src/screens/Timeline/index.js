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
import ConfirmationModal from "../../components/Modals/ConfirmationModal";
import AsyncStorage from "@react-native-community/async-storage";
import {resetData} from "../../storage/Service";

class Timeline extends Component {
  constructor(props) {
    super(props);

    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      activeTab: 'trend',
      tabBarItem: [
        {
          id: 1,
          title: 'trend',
          icon: Icons.icon_chat,
          action: () => {
            this.setState({activeTab: 'trend'});
            this.props.getTrendTimeline().then((res) => {});
          },
        },
        {
          id: 2,
          title: 'following',
          icon: Icons.icon_setting,
          action: () => {
            this.setState({activeTab: 'following'});
            this.props.getFollowingTimeline().then((res) => {});
          },
        },
        {
          id: 3,
          title: 'ranking',
          icon: Icons.icon_timeline,
          action: () => {
            this.setState({activeTab: 'ranking'});
            this.props.getRankingTimeline().then((res) => {});
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
        }
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
        currentPost: null
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

    await this.props.getTrendTimeline().then((res) => {
      this.props.getFollowingTimeline().then((res) => {
        this.props.getRankingTimeline().then((res) => {
          this.showData();
        });
      });
    });
  }

  showData() {
    const {trendTimline, followingTimeline, rankingTimeLine} = this.props;
    console.log('Timeline -> showData -> trendTimline', trendTimline);
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
    this.setState({showConfirmation: true, currentPost: post})
  }

  hideAllPost(post) {
    const {activeTab} = this.state;
    this.props.hideAllPost(post.channel_id).then((res) => {
      console.log('hideAllPost post server response', res);
      this.refreshContent();
    });
  }

  reportContent(post) {
    const {activeTab} = this.state;
    this.props.reportPost(post.id).then((res) => {
      console.log('reportContent server response', res);
      this.refreshContent();
    });
  }

  refreshContent() {
    const {activeTab} = this.state;
    if (activeTab === 'trend') {
      console.log('trend selected');
      this.props.getTrendTimeline().then((res) => {
        this.showData();
      });
    } else if (activeTab === 'following') {
      console.log('following selected');
      this.props.getFollowingTimeline().then((res) => {
        this.showData();
      });
    } else if (activeTab === 'ranking') {
      console.log('ranking selected');
      this.props.getRankingTimeline().then((res) => {
        this.showData();
      });
    }
  }

    updateModalVisibility() {
        this.setState({showConfirmation: !this.state.showConfirmation});
    }

    actionSure = async () => {
    const {currentPost} = this.state
        this.props.hidePost(currentPost.id).then((res) => {
            console.log('Hide post server response', res);
            this.refreshContent();
            this.setState({showConfirmation: false});
        }).catch((err) => {
            this.setState({showConfirmation: false});
        });
    };

    actionCancel() {
        this.updateModalVisibility();
    }

  render() {
    const {tabBarItem, activeTab, menuItems, posts, orientation, showConfirmation} = this.state;
    const {trendTimline, followingTimeline, rankingTimeLine, loading} = this.props;
    return (
      // <ImageBackground
      //   source={Images.image_home_bg}
      //   style={globalStyles.container}
      // >
      <View style={globalStyles.container}>
        <HomeHeader title={translate('pages.xchat.timeline')} />
        <View style={globalStyles.container}>
          <TabBar tabBarItem={tabBarItem} activeTab={activeTab} />
          <ScrollView>
            {activeTab === 'trend' ? (
              <PostCard
                menuItems={menuItems}
                posts={trendTimline}
                isTimeline={true}
              />
            ) : activeTab === 'following' ? (
              <PostCard
                menuItems={menuItems}
                posts={followingTimeline}
                isTimeline={true}
              />
            ) : (
              <PostCard
                menuItems={menuItems}
                posts={rankingTimeLine}
                isTimeline={true}
              />
            )}
          </ScrollView>
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
