import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';

import { globalStyles } from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import { Images, Icons, Colors, Fonts } from '../../constants';
import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import TabBar from '../../components/TabBar';
import PostCard from '../../components/PostCard';
import {
  getTrendTimeline,
  getFollowingTimeline,
  getRankingTimeline,
} from '../../redux/reducers/timelineReducer';

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
            this.setState({ activeTab: 'trend' });
          },
        },
        {
          id: 2,
          title: 'following',
          icon: Icons.icon_setting,
          action: () => {
            this.setState({ activeTab: 'following' });
          },
        },
        {
          id: 3,
          title: 'ranking',
          icon: Icons.icon_timeline,
          action: () => {
            this.setState({ activeTab: 'ranking' });
          },
        },
      ],
      visible: false,
      menuItems: [
        {
          id: 1,
          title: translate('pages.xchat.hideThisPost'),
          icon: 'bars',
          onPress: () => {},
        },
        {
          id: 1,
          title: translate('pages.xchat.hideAllPost'),
          icon: 'bars',
          onPress: () => {},
        },
        {
          id: 1,
          title: translate('pages.xchat.reportContent'),
          icon: 'bars',
          onPress: () => {},
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
    this.setState({ orientation: initial });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this.props.getTrendTimeline();
    this.props.getFollowingTimeline();
    this.props.getRankingTimeline();
    this.showData();
  }

  showData() {
    const { trendTimline, followingTimeline, rankingTimeLine } = this.props;
    console.log('Timeline -> showData -> trendTimline', trendTimline);
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
      }
    );
  };

  onLayout = () => {
    this.getAspectRatio();
  };
  render() {
    const { tabBarItem, activeTab, menuItems, posts } = this.state;
    const { trendTimline, followingTimeline, rankingTimeLine } = this.props;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
        <View style={globalStyles.container}>
          <HomeHeader title={translate('pages.xchat.timeline')} />
          <View style={globalStyles.container}>
            <TabBar tabBarItem={tabBarItem} activeTab={activeTab} />
            <ScrollView>
              {activeTab === 'trend' ? (
                <PostCard menuItems={menuItems} posts={trendTimline} />
              ) : activeTab === 'following' ? (
                <PostCard menuItems={menuItems} posts={followingTimeline} />
              ) : (
                <PostCard menuItems={menuItems} posts={rankingTimeLine} />
              )}
            </ScrollView>
          </View>
        </View>
      </ImageBackground>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
