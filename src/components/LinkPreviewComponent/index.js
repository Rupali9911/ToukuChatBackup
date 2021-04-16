import {getLinkPreview} from 'link-preview-js';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import HyperLink from 'react-native-hyperlink';
import {withNavigationFocus} from 'react-navigation';
import {connect} from 'react-redux';
import {Colors, Images, registerUrl, registerUrlStage} from '../../constants';
import {staging} from '../../helpers/api';
import {addFriendByReferralCode} from '../../redux/reducers/friendReducer';
import AudioPlayerCustom from '../AudioPlayerCustom';
import {ImageLoader} from '../Loaders';
import VideoPlayerCustom from '../VideoPlayerCustom';
import styles from './styles';

class LinkPreviewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      linkPreview: null,
      thumbnailUrl: null,
    };
  }

  componentDidMount() {
    this.generateThumbnail(this.props.url);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.url && nextProps.url !== this.props.url) {
      this.generateThumbnail(nextProps.url);
    }
  }

  generateThumbnail = (url) => {
    getLinkPreview(url).then((data) => {
      // console.debug(data);
      this.setState({linkPreview: data});
    });
  };

  checkUrlAndNavigate(url) {
    let regUrl = staging ? registerUrlStage : registerUrl;
    if (url.indexOf(regUrl) > -1) {
      let suffixUrl = url.split(regUrl)[1].trim();
      let invitationCode =
        suffixUrl.split('/').length > 0
          ? suffixUrl.split('/')[0].trim()
          : suffixUrl;
      if (invitationCode) {
        this.addFriendFromUrl(invitationCode);
      }
    } else {
      Linking.openURL(url);
    }
  }
  addFriendFromUrl(invitationCode) {
    console.log('invitationCode onfocus', invitationCode);
    if (invitationCode) {
      let data = {invitation_code: invitationCode};
      this.props.addFriendByReferralCode(data).then((res) => {
        console.log('addFriendByReferralCode response', res);
      });
    }
  }
  render() {
    const {
      text,
      style,
      clickable,
      onClick,
      color,
      resizeMode,
      borderSize,
      borderColor,
      showPlayButton,
    } = this.props;
    const {linkPreview} = this.state;

    return linkPreview ? (
      <View style={styles.container}>
        {linkPreview.contentType.includes('text/html') ? (
          <View style={styles.contentContainer}>
            <HyperLink
              onPress={(url) => {
                this.checkUrlAndNavigate(url);
              }}
              linkStyle={styles.linkStyle}
              style={styles.hyperlinkStyle}>
              <Text numberOfLines={2} style={styles.text}>
                {text}
              </Text>
            </HyperLink>
            <TouchableOpacity
              activeOpacity={0.6}
              disabled={!clickable}
              onPress={onClick}
              style={style || styles.imageLoaderContainer}>
              <ImageLoader
                style={[
                  {
                    resizeMode,
                    borderWidth: borderSize,
                    borderColor,
                    tintColor: color,
                  },
                  styles.imageLoader,
                ]}
                source={{uri: linkPreview.images[0]}}
                showPlayButton={showPlayButton ? true : false}
              />
            </TouchableOpacity>
          </View>
        ) : linkPreview.contentType.includes('video') ? (
          <View style={styles.videoContainer}>
            <HyperLink
              onPress={(url) => this.checkUrlAndNavigate(url)}
              linkStyle={styles.mediaLinkStyle}
              style={styles.mediaHyperlink}>
              <Text numberOfLines={3} style={styles.mediaText}>
                {text}
              </Text>
            </HyperLink>
            <View style={styles.linkPreviewURL}>
              <VideoPlayerCustom url={linkPreview.url} />
            </View>
          </View>
        ) : linkPreview.contentType.includes('audio') ? (
          <View style={styles.audioContainer}>
            <HyperLink
              onPress={(url) => this.checkUrlAndNavigate(url)}
              linkStyle={styles.mediaLinkStyle}
              style={styles.mediaHyperlink}>
              <Text numberOfLines={2} style={styles.mediaText}>
                {text}
              </Text>
            </HyperLink>
            <View style={styles.audioPlayer}>
              <AudioPlayerCustom
                audioPlayingId={1}
                perviousPlayingAudioId={-1}
                onAudioPlayPress={(id) => {}}
                postId={1}
                url={linkPreview.url}
                isSmall={true}
              />
            </View>
          </View>
        ) : null}
      </View>
    ) : null;
  }
}

LinkPreviewComponent.propTypes = {
  text: PropTypes.string,
  url: PropTypes.any,
  source: PropTypes.any,
  size: PropTypes.any,
  clickable: PropTypes.bool,
  isRounded: PropTypes.bool,
  isBadge: PropTypes.bool,
  isOnline: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.any,
  resizeMode: PropTypes.string,
  borderSize: PropTypes.number,
  borderColor: PropTypes.string,
};

LinkPreviewComponent.defaultProps = {
  text: '',
  url: null,
  source: Images.image_default_profile,
  size: 50,
  clickable: false,
  isRounded: true,
  isBadge: false,
  isOnline: false,
  onClick: null,
  color: null,
  resizeMode: 'cover',
  borderSize: 0,
  borderColor: Colors.primary,
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = {
  addFriendByReferralCode,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigationFocus(LinkPreviewComponent));
