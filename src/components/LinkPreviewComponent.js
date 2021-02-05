import React, { Component } from 'react';
import { View, Linking, Platform, Image, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import {Images, Fonts, Colors, registerUrl, registerUrlStage} from '../constants';
import { ImageLoader } from './Loaders';
import HyperLink from 'react-native-hyperlink';
import { normalize } from '../utils';
import VideoPlayerCustom from './VideoPlayerCustom';
import AudioPlayerCustom from './AudioPlayerCustom';
import { getLinkPreview, getPreviewFromContent } from 'link-preview-js';
import AsyncStorage from "@react-native-community/async-storage";
import {connect} from 'react-redux';
import {withNavigationFocus} from "react-navigation";
import {addFriendByReferralCode} from "../redux/reducers/friendReducer";
import NavigationService from "../navigation/NavigationService";
import Toast from "./Toast";
import {translate} from "../redux/reducers/languageReducer";
import {staging} from "../helpers/api";


class LinkPreviewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      linkPreview: null,
      thumbnailUrl: null
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
    getLinkPreview(url)
      .then(data => {
        // console.debug(data);
        this.setState({ linkPreview: data });
      });
  };

  checkUrlAndNavigate(url){
      let regUrl = staging ? registerUrlStage : registerUrl
      if (url.indexOf(regUrl) > -1) {
          let suffixUrl = url.split(regUrl)[1].trim();
          let invitationCode =
              suffixUrl.split('/').length > 0
                  ? suffixUrl.split('/')[0].trim()
                  : suffixUrl;
        if (invitationCode){
          this.addFriendFromUrl(invitationCode)
        }
      }else{
          Linking.openURL(url);
      }
  }
    addFriendFromUrl(invitationCode){
         console.log('invitationCode onfocus', invitationCode)
        if (invitationCode) {
            let data = {invitation_code: invitationCode};
            this.props.addFriendByReferralCode(data).then((res) => {
                 console.log('addFriendByReferralCode response', res)
            });
        }
    }
  render() {
    const {
      text,
      style,
      size,
      clickable,
      onClick,
      color,
      isRounded,
      isBadge,
      isOnline,
      resizeMode,
      borderSize,
      borderColor,
      showPlayButton,
    } = this.props;
    const { thumbnailUrl, linkPreview } = this.state;
    return (
      linkPreview ?
        <View style={{ marginVertical: 5, marginTop: 15 }}>
          {linkPreview.contentType.includes("text/html") ?
            <View style={{ borderLeftWidth: 2, borderLeftColor: '#e13887', flexDirection: 'row' }}>
              <HyperLink
                onPress={(url, text) => {
                    this.checkUrlAndNavigate(url)
                }}
                linkStyle={{
                  color: Colors.link_color,
                  textDecorationLine: 'underline',
                }}
                style={{ paddingHorizontal: 10, flex: 1 }}
              >
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: Fonts.regular,
                    fontWeight: '400',
                    fontSize: Platform.isPad
                      ? normalize(7.5)
                      : normalize(12),
                  }}>
                  {text}
                </Text>
              </HyperLink>
              <TouchableOpacity
                activeOpacity={0.6}
                disabled={!clickable}
                onPress={onClick}
                style={
                  style || {
                    width: 50,
                    height: 50,
                    borderRadius: 50 / 2,
                  }
                }>
                <ImageLoader
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 5,
                    tintColor: color,
                    resizeMode: resizeMode,
                    borderWidth: borderSize,
                    borderColor: borderColor,
                    overflow: 'hidden',
                  }}
                  source={{ uri: linkPreview.images[0] }}
                  showPlayButton={showPlayButton ? true : false}
                />
              </TouchableOpacity>
            </View>
            : linkPreview.contentType.includes("video") ?
              <View style={{ borderLeftWidth: 2, borderLeftColor: '#e13887', }}>
                <HyperLink
                  onPress={(url, text) => {
                      this.checkUrlAndNavigate(url)
                  }}
                  linkStyle={{
                    color: Colors.link_color,
                    textDecorationLine: 'underline',
                  }}
                  style={{ paddingHorizontal: 10, flex: 1 }}
                >
                  <Text
                    numberOfLines={3}
                    style={{
                      fontFamily: Fonts.regular,
                      fontWeight: '400',
                      fontSize: Platform.isPad
                        ? normalize(7.5)
                        : normalize(12),
                    }}>
                    {text}
                  </Text>
                </HyperLink>
                <View style={{ paddingHorizontal: 10, marginTop:5 }}>
                  <VideoPlayerCustom url={linkPreview.url} />
                </View>
              </View>
              : linkPreview.contentType.includes("audio") ?
                <View style={{ borderLeftWidth: 2, borderLeftColor: '#e13887', alignItems:'center' }}>
                  <HyperLink
                    onPress={(url, text) => {
                        this.checkUrlAndNavigate(url)
                    }}
                    linkStyle={{
                      color: Colors.link_color,
                      textDecorationLine: 'underline',
                    }}
                    style={{ paddingHorizontal: 10, flex: 1 }}
                  >
                    <Text
                      numberOfLines={2}
                      style={{
                        fontFamily: Fonts.regular,
                        fontWeight: '400',
                        fontSize: Platform.isPad
                          ? normalize(7.5)
                          : normalize(12),
                      }}>
                      {text}
                    </Text>
                  </HyperLink>
                  <View style={{ marginTop:10, width: '90%' }}>
                    <AudioPlayerCustom
                      audioPlayingId={1}
                      perviousPlayingAudioId={-1}
                      onAudioPlayPress={(id) => { }}
                      postId={1}
                      url={linkPreview.url}
                      isSmall={true}
                    />
                  </View>
                </View>
                : null
          }
        </View> : null
    );
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
    return {
    };
};

const mapDispatchToProps = {
    addFriendByReferralCode
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withNavigationFocus(LinkPreviewComponent));
