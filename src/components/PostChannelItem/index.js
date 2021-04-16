import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Text, View} from 'react-native';
import HyperLink from 'react-native-hyperlink';
import {translate} from '../../redux/reducers/languageReducer';
import {onPressHyperlink} from '../../utils';
import AudioPlayerCustom from '../AudioPlayerCustom';
import ScalableImage from '../ScalableImage';
import VideoPlayerCustom from '../VideoPlayerCustom';
import styles from './styles';

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
    // console.log('post', post)
    let newArray = [];
    post.text &&
      post.text.length > 0 &&
      post.text.map((data, index) => {
        return newArray.push(data.text);
      });

    return (
      <View>
        {post.media.audio && post.media.audio.length ? (
          <View style={styles.subContainer}>
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
          <View style={styles.mediaContainer}>
            <ScalableImage src={post.media.image[0]} />
          </View>
        ) : post.media.video && post.media.video.length ? (
          <View style={styles.mediaContainer}>
            <VideoPlayerCustom url={post.media.video[0]} />
          </View>
        ) : null}
        <View style={styles.hyperlinkContainer}>
          <HyperLink
            onPress={(url, text) => {
              onPressHyperlink(url);
            }}
            linkStyle={styles.linkStyle}>
            {newArray.length > 0 ? (
              <Text style={styles.textContent}>
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
                      style={styles.showLessText}>
                      {newArray[2] !== null ? '\n\n ' : '\n '}
                      {'...' + translate('pages.xchat.showLess')}
                    </Text>
                  ) : (
                    <Text
                      onPress={() => this.toggleNumberOfLines('more')}
                      style={styles.showMoreText}>
                      {'  ' + '...' + translate('pages.xchat.showMore')}
                    </Text>
                  ))}
              </Text>
            ) : (
              <Text style={styles.messageBodyContainer}>
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
