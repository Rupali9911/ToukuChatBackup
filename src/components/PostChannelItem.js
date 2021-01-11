import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  FlatList,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Slider from '@react-native-community/slider';

import {Colors, Fonts, Images, Icons} from '../constants';
import {translate} from '../redux/reducers/languageReducer';
import ScalableImage from './ScalableImage';
import PostCardHeader from './PostCardHeader';
import VideoPlayerCustom from './VideoPlayerCustom';
import AudioPlayerCustom from './AudioPlayerCustom';
import HyperLink from 'react-native-hyperlink';
import {normalize, onPressHyperlink} from '../utils';

const {width, height} = Dimensions.get('window');

export default class PostChannelItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      audioPlayingId: null,
      perviousPlayingAudioId: null,
      readMore: false,
      character: 40,
    };
  }

  _openMenu = () => this.setState({visible: true});

  _closeMenu = () => this.setState({visible: false});

  toggleNumberOfLines = (check) => {
    if (check === 'less') {
      this.setState({readMore: false});
    } else {
      this.setState({readMore: true});
    }
  };

  render() {
    const {post} = this.props;

    let newArray = [];
    post.text &&
      post.text.length > 0 &&
      post.text.map((data, index) => {
        return newArray.push(data.text);
      });

    return (
      <View>
        {post.media.audio && post.media.audio.length ? (
          <View style={{marginTop: 10}}>
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
          <View style={{margin: 5}}>
            <ScalableImage src={post.media.image[0]} />
          </View>
        ) : post.media.video && post.media.video.length ? (
          <View style={{margin: 5}}>
            <VideoPlayerCustom url={post.media.video[0]} />
          </View>
        ) : null}
        <View style={{marginHorizontal: '4%', marginVertical: 5}}>
          <HyperLink
            onPress={(url, text) => {
              onPressHyperlink(url);
            }}
            linkStyle={{
              color: '#7e8fce',
              textDecorationLine: 'underline',
            }}>
            {newArray.length > 0 ? (
              <Text style={{lineHeight: 18}}>
                {this.state.readMore
                  ? newArray.join('\n')
                  : newArray.join('').length > 35
                  ? newArray.join('\n').substring(0, this.state.character)
                  : newArray.join('')}
                {newArray.join('\n').length > this.state.character &&
                !this.state.readMore
                  ? ' '
                  : ' '}
                {newArray.join('\n').length > this.state.character &&
                  (this.state.readMore ? (
                    <Text
                      onPress={() => this.toggleNumberOfLines('less')}
                      style={{
                        fontFamily: Fonts.regular,
                        fontSize: normalize(12),
                        margin: 15,
                        color: '#7e8fce',
                      }}>
                      {newArray[2] !== null ? '\n\n ' : '\n '}
                      {'...' + translate('pages.xchat.showLess')}
                    </Text>
                  ) : (
                    <Text
                      onPress={() => this.toggleNumberOfLines('more')}
                      style={{
                        fontFamily: Fonts.regular,
                        fontSize: normalize(12),
                        color: '#7e8fce',
                        flex: 1,
                      }}>
                      {'  ' + '...' + translate('pages.xchat.showMore')}
                    </Text>
                  ))}
              </Text>
            ) : (
              <Text style={{fontFamily: Fonts.regular, fontSize: 16}}>
                {post.mutlilanguage_message_body
                  ? post.mutlilanguage_message_body.en
                  : ''}
              </Text>
            )}
          </HyperLink>
        </View>
      </View>
    );
  }
}

PostChannelItem.propTypes = {
  menuItems: PropTypes.object,
};

PostChannelItem.defaultProps = {
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
