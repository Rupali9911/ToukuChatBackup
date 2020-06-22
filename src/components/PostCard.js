import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Slider from '@react-native-community/slider';

import { Colors, Fonts, Images, Icons } from '../constants';
import { translate } from '../redux/reducers/languageReducer';
import ScalableImage from './ScalableImage';
import PostCardHeader from './PostCardHeader';
import VideoPlayerCustom from './VideoPlayerCustom';
import AudioPlayerCustom from './AudioPlayerCustom';
const { width, height } = Dimensions.get('window');

export default class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      audioPlayingId: null,
      perviousPlayingAudioId: null,
    };
  }

  _openMenu = () => this.setState({ visible: true });

  _closeMenu = () => this.setState({ visible: false });

  render() {
    const { menuItems, posts, isTimeline } = this.props;
    return posts.length ? (
      posts.map((post, index) => {
        return (
          <View
            style={{
              backgroundColor: Colors.white,
              marginVertical: 10,
              paddingVertical: 10,
            }}
          >
            <PostCardHeader menuItems={menuItems} post={post} />
            {post.media.audio && post.media.audio.length ? (
              <View style={{ margin: 10 }}>
                <AudioPlayerCustom
                  onAudioPlayPress={(id) =>
                    this.setState({
                      audioPlayingId: id,
                      perviousPlayingAudioId: this.state.audioPlayingId,
                    })
                  }
                  audioPlayingId={this.state.audioPlayingId}
                  perviousPlayingAudioId={this.state.perviousPlayingAudioId}
                  postId={post.id}
                  url={post.media.audio[0]}
                />
              </View>
            ) : post.media.image && post.media.image.length ? (
              <View style={{ margin: 5 }}>
                <ScalableImage src={post.media.image[0]} />
              </View>
            ) : post.media.video && post.media.video.length ? (
              <View style={{ margin: 5 }}>
                <VideoPlayerCustom url={post.media.video[0]} />
              </View>
            ) : null}
            <View style={{ marginHorizontal: '4%', marginVertical: 5 }}>
              <Text style={{ fontFamily: Fonts.light }}>
                {post.text
                  ? post.text
                  : post.mutlilanguage_message_body
                  ? post.mutlilanguage_message_body.en
                  : ''}
              </Text>
            </View>
          </View>
        );
      })
    ) : (
      <Text
        style={{
          fontFamily: Fonts.thin,
          fontSize: 12,
          marginTop: 20,
          textAlign: 'center',
        }}
      >
        {isTimeline
          ? translate('pages.xchat.noTimelineFound')
          : translate('pages.xchat.noChannelFound')}
      </Text>
    );
  }
}

PostCard.propTypes = {
  menuItems: PropTypes.object,
};

PostCard.defaultProps = {
  menuItems: {},
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    height: height * 0.06,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomWidth: Platform.OS === 'ios' ? 0.3 : 0.2,
    borderBottomColor: Colors.gray_dark,
  },
  tabItem: {
    marginHorizontal: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    fontSize: 16,
    color: Colors.gradient_1,
    fontFamily: Fonts.regular,
  },
});
