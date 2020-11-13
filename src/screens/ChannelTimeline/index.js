import React, {Component, Fragment} from 'react';
import {View, ImageBackground, FlatList, Text, StyleSheet} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// import { createChannelStyles } from './styles';
import {globalStyles} from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import {Images, Icons, Colors, Fonts} from '../../constants';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {getChannelTimeline} from '../../redux/reducers/timelineReducer';
import PostCard from '../../components/PostCard';
class ChannelTimeline extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      // posts: {
      //   load_more: false,
      //   posts: [],
      // },
        posts: [],
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

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this.getCurrentChannelTimeline();
  }
  getCurrentChannelTimeline = (lastId) => {
    getChannelTimeline(this.props.currentChannel.id, lastId)
      .then((res) => {
        if (res.load_more) {
          const posts = [...this.state.posts, ...res.posts];
          this.setState({posts});
        }
        if (res.load_more === false && this.noMorePosts !== true) {
          this.noMorePosts = true;
          const posts = [...this.state.posts, ...res.posts];
          this.setState({posts});
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };
  onMomentumScrollBegin = () => {
    this.doUpdate = false;
  };
  onEndReached = (info) => {
    const {posts} = this.state;
    const lastPost = posts[posts.length - 1];
    if (!this.doUpdate && this.lastPostId !== lastPost.id) {
      this.doUpdate = true;
      this.lastPostId = lastPost.id;
      this.getCurrentChannelTimeline(lastPost.id);
    }
  };
  render() {
    const {posts} = this.state;

    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <View style={globalStyles.container}>
          <HeaderWithBack
            isCentered
            onBackPress={() => this.props.navigation.goBack()}
            title={translate('pages.xchat.timeline')}
          />
          {/* <KeyboardAwareScrollView
            contentContainerStyle={createChannelStyles.mainContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            <Text style={{fontFamily: Fonts.thin, fontSize: 12, marginTop: 20}}>
              {translate('pages.xchat.noTimelineFound')}
            </Text>
          </KeyboardAwareScrollView> */}
          <PostCard
            posts={posts}
            isTimeline={true}
            useFlatlist={true}
            isChannelTimeline={true}
            onMomentumScrollBegin={this.onMomentumScrollBegin}
            onEndReached={this.onEndReached}
          />
        </View>
      </ImageBackground>
    );
  }
}

const createChannelStyles = StyleSheet.create({
  mainContainer: {
    paddingBottom: 50,
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    channelLoading: state.channelReducer.loading,
    currentChannel: state.channelReducer.currentChannel,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelTimeline);
