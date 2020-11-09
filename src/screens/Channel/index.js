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
import PostChannelCard from '../../components/PostChannelCard';
import {
  getTrendChannel,
  getFollowingChannel,
  getRankingChannel,
  hidePost,
  hideAllPost,
  reportPost,
} from '../../redux/reducers/timelineReducer';

class Channel extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      activeTab: 'trend',
      refreshData: false,
      trendChannel: [],
      followingChannel: [],
      rankingChannel: [],
      tabBarItem: [
        {
          id: 1,
          title: 'trend',
          icon: Icons.icon_chat,
          action: () => {
            this.setState({activeTab: 'trend'});
            this.props.getTrendChannel().then((res) => {});
          },
        },
        {
          id: 2,
          title: 'following',
          icon: Icons.icon_setting,
          action: () => {
            this.setState({activeTab: 'following'});
            this.props.getFollowingChannel().then((res) => {});
          },
        },
        {
          id: 3,
          title: 'ranking',
          icon: Icons.icon_timeline,
          action: () => {
            this.setState({activeTab: 'ranking'});
            this.props.getRankingChannel().then((res) => {});
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
    // this.props.getTrendChannel();
    // this.props.getFollowingChannel();
    // this.props.getRankingChannel();
    // this.showData();

    await this.props.getTrendChannel().then((res) => {
      this.props.getFollowingChannel().then((res) => {
        this.props.getRankingChannel().then((res) => {
          this.showData();
        });
      });
    });
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
      this.props.getTrendChannel().then((res) => {
        this.showData();
      });
    } else if (activeTab === 'following') {
      console.log('following selected');
      this.props.getFollowingChannel().then((res) => {
        this.showData();
      });
    } else if (activeTab === 'ranking') {
      console.log('ranking selected');
      this.props.getRankingChannel().then((res) => {
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
          <ScrollView showsVerticalScrollIndicator={false}>
            {activeTab === 'trend' ? (
              <PostChannelCard
                menuItems={menuItems}
                posts={trendChannel}
                isTimeline={false}
                navigation={this.props.navigation}
              />
            ) : activeTab === 'following' ? (
              <PostChannelCard
                menuItems={menuItems}
                posts={followingChannel}
                isTimeline={false}
              />
            ) : (
              <PostChannelCard
                menuItems={menuItems}
                posts={rankingChannel}
                isTimeline={false}
              />
            )}
          </ScrollView>
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
