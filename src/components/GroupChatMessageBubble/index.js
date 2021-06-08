import linkify from 'linkify-it';
import React, { Component, Fragment } from 'react';
import {
  Animated,
  Clipboard,
  Linking,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import OpenFile from 'react-native-doc-viewer';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ImageView from 'react-native-image-viewing';
import { Divider } from 'react-native-paper';
import ParsedText from 'react-native-parsed-text';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import GridList from 'react-native-grid-list';
import Menu from '../Menu/Menu';
import MenuItem from '../Menu/MenuItem';
import Toast from '../Toast';
import {
  Colors,
  Environment,
  EnvironmentStage,
  Fonts,
  prodInvite,
  registerUrl,
  registerUrlStage,
  stagInvite,
} from '../../constants';
import { inviteUrlRoot, staging } from '../../helpers/api';
import NavigationService from '../../navigation/NavigationService';
import { addFriendByReferralCode } from '../../redux/reducers/friendReducer';
import { translate } from '../../redux/reducers/languageReducer';
import {
  setActiveTimelineTab,
  setSpecificPostId,
} from '../../redux/reducers/timelineReducer';
import { getChannelIdAndReferral, getUserName, normalize, checkDeepLinkUrl } from '../../utils';
import AudioPlayerCustom from '../AudioPlayerCustom';
import LinkPreviewComponent from '../LinkPreviewComponent';
import RoundedImage from '../RoundedImage';
import ScalableImage from '../ScalableImage';
import VideoPlayerCustom from '../VideoPlayerCustom';
import VideoThumbnailPlayer from '../VideoThumbnailPlayer';
import VideoPreview from '../VideoPreview';
import MediaGridList from '../MediaGridList';
import styles from './styles';
import { isEqual } from 'lodash';
import GifImage from '../GifImage';

let borderRadius = 20;

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

class GroupChatMessageBubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioPlayingId: null,
      perviousPlayingAudioId: null,
      showImage: false,
      images: null,
    };
    const msgTime = new Date(this.props.message.timestamp);
    this.isEditable = new Date(msgTime);

    this.isEditable.setDate(this.isEditable.getDate() + 1);

    this.messageBodyActionContainer = {
      borderRadius,
      paddingHorizontal:
        this.props.message.type === 'note'
          ? 0
          : this.props.message.type === 'image'
            ? this.props.message.text.includes('.giphy.com/media/') ? 0 : 8
            : 10,
      paddingVertical: this.props.message.type === 'image' ? this.props.message.text.includes('.giphy.com/media/') ? 0 : 8 : 10,
    };

    this.memoTextStyle = [
      {
        marginTop: this.props.message.media && this.props.message.media.length>0 ? normalize(5) : 0
      },
      styles.memoText,
    ];
  }

  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };
  hideMenu = () => {
    this._menu.hide();
    this.setState({ visible: false });
  };
  showMenu = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', options);
    this._menu.show();
    this.setState({ visible: true });
  };

  componentDidMount() {
   
  }

  componentWillUnmount() {
    //this.eventEmitter.removeListener();
  }

  hideImage() {
    console.log('hideImage called');
    this.setState({ showImage: false });
  }
  onImagePress = (url) => {
    let images = [
      {
        uri: url,
      },
    ];
    this.setState({ showImage: true, images: images });
  };

  onCopy = (message) => {
    Clipboard.setString(message);
  };

  onUnSend = (selectedMessageId) => {
    this.props.onUnSend(selectedMessageId);
  };

  onDocumentPress = (url) => {
    this.props.showOpenLoader(true);
    let name = url.split('/').pop();
    if (Platform.OS === 'ios') {
      OpenFile.openDoc(
        [
          {
            url: url,
            fileNameOptional: name,
          },
        ],
        (error) => {
          if (error) {
            Toast.show({
              title: 'TOUKU',
              text: translate('common.somethingWentWrong'),
              type: 'primary',
            });
            this.props.showOpenLoader(false);
          } else {
            this.props.showOpenLoader(false);
          }
        },
      );
    } else {
      OpenFile.openDoc(
        [
          {
            url: url,
            fileName: name,
            cache: false,
            fileType: url.split('.').pop(),
          },
        ],
        (error) => {
          if (error) {
            Toast.show({
              title: 'TOUKU',
              text: translate('common.somethingWentWrong'),
              type: 'primary',
            });
            this.props.showOpenLoader(false);
          } else {
            this.props.showOpenLoader(false);
          }
        },
      );
    }
  };

  renderReplyMessage = (message) => {
    let replyMessage = message.reply_to;

    const container = [
      {
        backgroundColor: message.isMyMessage
          ? 'rgba(243,243,243,.53)'
          : Colors.gray,
      },
      styles.replyMessageActionContainer,
    ];

    if (replyMessage.message) {
      return (
        <>
          <TouchableOpacity
            disabled={this.props.isMultiSelect}
            onPress={() => {
              this.props.onReplyPress &&
                this.props.onReplyPress(replyMessage.id);
            }}
            style={container}>
            {/* <View style={{}}>
            <Image
              source={getAvatar(

                  message.sender_picture,
              )}              style={{
                width: 25,
                height: 25,
                borderRadius: 20,
                resizeMode: 'cover',
                marginTop: 5,
                marginRight: 5,
              }}
            />
          </View> */}
            <View>
              <View style={styles.replyContentContainer}>
                <Text numberOfLines={2} style={{ color: Colors.gradient_1 }}>
                  {replyMessage.sender_id === this.props.userData.id
                ? translate('pages.xchat.you')
                  : 
                  getUserName(replyMessage.sender_id) ||
                    replyMessage.display_name}
                  {/* } */}
                  {/* {replyMessage.sender_id === this.props.userData.id
                ? 'You'
                : replyMessage.display_name} */}
                </Text>
              </View>
              <View style={styles.replyContentSubContainer}>
                {replyMessage.msg_type === 'image' &&
                  replyMessage.message !== null ? (
                    <RoundedImage
                      source={{ url: replyMessage.message }}
                      isRounded={false}
                      size={50}
                    />
                  ) : replyMessage.msg_type === 'video' ? (
                    <VideoThumbnailPlayer
                      url={replyMessage.message}
                      showPlayButton
                    />
                  ) : replyMessage.msg_type === 'audio' ? (
                    <>
                      <Text style={styles.mediaHeading}>
                        {replyMessage.message.split('/').pop().split('%2F').pop()}
                      </Text>
                      <View style={styles.mediaContentContainer}>
                        <FontAwesome
                          name={'volume-up'}
                          size={15}
                          color={Colors.black_light}
                        />
                        <Text style={styles.mediaLabel}>Audio</Text>
                      </View>
                    </>
                  ) : replyMessage.msg_type === 'doc' ? (
                    <Fragment>
                      <Text style={styles.mediaHeading}>
                        {replyMessage.message.split('/').pop().split('%2F').pop()}
                      </Text>
                      <View style={styles.mediaContentContainer}>
                        <FontAwesome
                          name={'file-o'}
                          size={15}
                          color={Colors.black_light}
                        />
                        <Text style={styles.mediaLabel}>File</Text>
                      </View>
                    </Fragment>
                  ) : (
                          // <Text numberOfLines={2} style={{ fontFamily: Fonts.regular }}>
                          //   {replyMessage.message && replyMessage.message.match('\n')
                          //     ? replyMessage.message.split('\n').length >= 2
                          //       ? replyMessage.message.split('\n')[0] +
                          //       '\n' +
                          //       replyMessage.message.split('\n')[1] +
                          //       '...'
                          //       : replyMessage.message
                          //     : replyMessage.message}
                          // </Text>
                          <ParsedText
                            style={styles.parsedTextStyle}
                            parse={
                              [
                                {
                                  pattern: /(~[0-9]+~)/gim,
                                  style: { color: '#E65497' },
                                  renderText: (matchingString, matches) => {
                                    let match = matchingString.replace(/~/g, '');
                                    return `@${this.getReplyMentionUserName(replyMessage,match)}`;
                                  }
                                },
                              ]
                            }
                            numberOfLines={3}
                            childrenProps={{ allowFontScaling: false }}>
                            {replyMessage.message}
                          </ParsedText>
                        )}
              </View>
            </View>
          </TouchableOpacity>
          <Divider />
        </>
      );
    }
  };

  isContainUrl = (text) => {
    if (text == null) {
      return;
    }
    var urlRE = new RegExp(
      '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+',
    );
    const url = text.match(urlRE);
    return url;
  };

  openUrl = (text) => {
    if (text == null) {
      return;
    }
    var urlRE = new RegExp(
      '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+',
    );
    const url = text.match(urlRE);
    Linking.openURL(url[0]);
  };

  hyperlinkPressed = (url) => {
    let match_url = staging ? stagInvite : prodInvite;
    if (url.includes(match_url)) {
      let params = getChannelIdAndReferral(url);
      console.log('params', params);
      NavigationService.navigate('ChannelInfo', { channelItem: params });
    } else if (url.includes(`${inviteUrlRoot}/Groups/invite/`)) {
      let s_url = url.split(`${inviteUrlRoot}/Groups/invite/`)[1];
      let group_id = s_url.substring(0, s_url.lastIndexOf('/'));
      NavigationService.navigate('GroupDetails', { group_id: group_id });
    } else {
      this.checkUrlAndNavigate(url);
    }
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
    } else if (url.indexOf('/timeline-post') > -1) {
      let post_id = url.substring(url.lastIndexOf('/') + 1);
      console.log('post_id', post_id);
      this.props.setActiveTimelineTab('following');
      this.props.setSpecificPostId(post_id);
      NavigationService.navigate('Timeline');
    } else if (url.indexOf('/#/groups/') > -1) {
      let split_url = url.split('/');
      let group_id = split_url[split_url.length - 2];
      console.log('group_id', group_id);
      NavigationService.navigate('JoinGroup', { group_id: group_id });
    } else {
      Linking.openURL(url);
    }
  }

  addFriendFromUrl(invitationCode) {
    console.log('invitationCode onfocus', invitationCode);
    if (invitationCode) {
      let data = { invitation_code: invitationCode };
      this.props.addFriendByReferralCode(data).then((res) => {
        console.log('addFriendByReferralCode response', res);
      });
    }
  }

  getMentionsPattern = () => {
    const { groupMembers, message } = this.props;
    let mentions = message.mentions;
    if (mentions && mentions.length > 0) {
      let groupMentions = mentions.map(
        (groupMember) =>
          `@${
          getUserName(groupMember.id) ||
          groupMember.desplay_name ||
          groupMember.username
          }`,
      );
      if (groupMembers && groupMembers.length > 0) {
        let groupAllMembers = groupMembers.map(
          (groupMember) =>
            `@${
            getUserName(groupMember.id) ||
            groupMember.display_name ||
            groupMember.username
            }`,
        );
        groupMentions = [...groupMentions, ...groupAllMembers];
      }
      // console.log('getMentionsPattern',groupMentions.join('|'));
      return groupMentions.join('|');
    } else {
      return '';
    }
  };

  renderMessageWitMentions = (msg = '') => {
    const { message } = this.props;
    let splitNewMessageText = msg.split(' ');
    let newMessageMentions = [];
    const newMessageTextWithMention = splitNewMessageText
      .map((text) => {
        let mention = null;
        let mentions = message.mentions;
        mentions &&
          mentions.forEach((groupMember) => {
            // console.log('groupMember',groupMember);
            if (text.includes(`~${groupMember.id}~`)) {
              mention = `@${
                getUserName(groupMember.id) ||
                groupMember.desplay_name ||
                groupMember.username
                }`;
              mention = text.replace(`~${groupMember.id}~`, mention);
              newMessageMentions = [...newMessageMentions, groupMember.id];
            }
          });
        if (mention) {
          return mention;
        } else {
          return text;
        }
      })
      .join(' ');

    return newMessageTextWithMention;
  };

  getMentionUserName = (id) => {
    const { message } = this.props;
    let name = '';
    message.mentions && message.mentions.forEach((groupMember) => {
      if (groupMember.id == id) {
        name = getUserName(groupMember.id) ||
          groupMember.desplay_name ||
          groupMember.username;
      }
    });
    return name;
  }

  getReplyMentionUserName = (message,id) => {
    let name = '';
    message.mentions && message.mentions.forEach((groupMember) => {
      if (groupMember.id == id) {
        name = getUserName(groupMember.id) ||
          groupMember.desplay_name ||
          groupMember.username;
      }
    });
    return name;
  }

  renderLinkMedia = (text) => {
    //console.log('renderLinkMedia text', text)
    let arrLinks = linkify().match(text);
    console.log('arrLinks',arrLinks);
    if (arrLinks) {
      return arrLinks.map((item) => {
        if (checkDeepLinkUrl(item.url)) {
          return null;
        }
        return <View style={styles.linkPreviewContainer}>
          <LinkPreviewComponent text={item.text} url={item.url} />
        </View>;
      });
    }
  };

  renderMemoText = (message) => {
    let update_text = '';
    if (message && message.message_body.type === 'update') {
      // let user_id = '';
      let text = '';
      // let action = '';

      let split_txt = message.message_body.text.split(',');
      if (split_txt.length > 0) {
        // user_id = split_txt[0].trim();
        // action = split_txt[1].trim();
        text = split_txt[2].trim();
      }

      let update_by =
        message.sender_id === this.props.userData.id
          ? translate('pages.xchat.you')
          : getUserName(message.sender_id) ||
          message.sender_display_name ||
          message.sender_username;
      // let update_by = user_id == this.props.userData.id ? translate('pages.xchat.you') : getUserName(user_id);
      // let update_to = update_obj.user_id == this.props.userData.id ? translate('pages.xchat.you') : getUserName(update_obj.user_id) || update_obj.user_name;
      // console.log('update_to',update_obj);

      update_text = text;

      return { update_text, update_by };
    }
  };

  renderMemoMedia = (media) => {
    return (
      <MediaGridList media={media} />
    );
  }

  onMessagePress = () => {
    const {message} = this.props;
    if(message.message_body.type === 'note'){
      this.navigateToNotes()
    } else if(message.type === 'doc'){
      this.onDocumentPress(message.text)
    }else if(message.type === 'image'){
      this.onImagePress(message.text)
    }
  }

  onMessageLongPress = () => {
    this.showMenu();
  }

  onPlayAudio = () => {
    this.props.onMediaPlay &&
      this.props.onMediaPlay(true);
  }

  onPauseAudio = () => {
    this.props.onMediaPlay &&
      this.props.onMediaPlay(false);
  }


  navigateToNotes = () => {
    NavigationService.navigate('GroupDetails', {
      isNotes: true,
    });
  }

  onTranslateMessage = () => {
    this.props.onMessageTranslate(this.props.message);
    this.hideMenu();
  }

  onReplyMessage = () => {
    this.props.onMessageReply(this.props.message.id);
    this.hideMenu();
  }

  onEditMessage = () => {
    this.props.onEditMessage(this.props.message);
    this.hideMenu();
  }

  onDeleteMessage = () => {
    this.props.onDelete(this.props.message.id);
    this.hideMenu();
  }

  onUnsendMessage = () => {
    this.hideMenu();
    setTimeout(() => {
      this.props.onUnSend(this.props.message.id);
    }, 500);
  }

  onDownloadMessage = () => {
    this.props.onDownloadMessage(this.props.message);
    this.hideMenu();
  }

  onCopyMessage = () => {
    this.onCopy(this.props.message.text);
    this.hideMenu();
  }

  shouldComponentUpdate(nextProps, nextState){
    console.log('shouldPropsSame',isEqual(this.props.message, nextProps.message) &&
    isEqual(this.props.audioPlayingId, nextProps.audioPlayingId) &&
    isEqual(this.props.perviousPlayingAudioId, nextProps.perviousPlayingAudioId) &&
    isEqual(this.props.isMultiSelect, nextProps.isMultiSelect));
    // console.log('shouldStateSame',isEqual(this.state,nextState));

    if (
      !isEqual(this.props.message, nextProps.message) ||
      !isEqual(this.props.audioPlayingId, nextProps.audioPlayingId) ||
      !isEqual(this.props.perviousPlayingAudioId, nextProps.perviousPlayingAudioId) ||
      !isEqual(this.props.isMultiSelect, nextProps.isMultiSelect)
    ) {
      return true;
    } else if (!isEqual(this.state, nextState)) {
      return true;
    }
    return false;
  }

  render() {
    const {
      message,
      audioPlayingId,
      perviousPlayingAudioId,
      onAudioPlayPress,
      isMultiSelect,
    } = this.props;
    const { showImage, images } = this.state;
    if (!message.text && !message.is_unsent) {
      return null;
    }
    return (
      <View>
        <Menu
          ref={(ref) => {
            this._menu = ref;
          }}
          style={styles.menuStyle}
          tabHeight={110}
          headerHeight={80}
          button={
            <View style={styles.talkBubble}>
              <View style={!message.isMyMessage?styles.menuButtonContentContainer:{}}>
                {!message.text.includes('.giphy.com/media/') ? !message.isMyMessage ? <View
                  style={[
                    styles.talkBubbleAbsoluteLeft,
                    message.is_unsent && { borderRightColor: Colors.gray },
                  ]}
                /> :
                  <View
                    style={[
                      styles.talkBubbleAbsoluteRight,
                      message.is_unsent && { borderLeftColor: Colors.gray },
                    ]}
                  /> : null}
                {message.is_unsent ? (
                  <View
                    activeOpacity={0.8}
                    style={[{ borderRadius }, styles.unsentContainer]}>
                    <Text style={styles.unsentMessage}>
                      {translate('pages.xchat.messageUnsent')}
                    </Text>
                  </View>
                ) : (
                    <TouchableOpacity
                      disabled={isMultiSelect}
                      activeOpacity={0.8}
                      style={[
                        !message.text.includes('.giphy.com/media/') && styles.messageBodyActionContainer,
                        this.messageBodyActionContainer,
                        message.type === 'audio' &&
                        styles.replyAudioMessageWidth,
                        !message.text.includes('.giphy.com/media/') && { backgroundColor: message.isMyMessage ? Colors.pink_chat : Colors.white }
                      ]}
                      onLongPress={this.onMessageLongPress}
                      onPress={this.onMessagePress}>
                      {message.reply_to &&
                        // Object.keys(message.reply_to).length !== 0 &&
                        // message.reply_to.constructor === Object &&
                        this.renderReplyMessage(message)}
                      {message.type === 'image' && message.text !== null ? (
                        message.text.includes('.giphy.com/media/') ?
                        <GifImage src={message.text} isGif={message.text.includes('&ct=g')}/>
                        : <ScalableImage
                          src={message.text}
                          borderRadius={borderRadius}
                        />
                      ) : message.type === 'video' ? (
                        <VideoPlayerCustom url={message.text} />
                      ) : message.type === 'audio' ? (
                        <AudioPlayerCustom
                          audioPlayingId={audioPlayingId}
                          perviousPlayingAudioId={perviousPlayingAudioId}
                          onAudioPlayPress={onAudioPlayPress}
                          onPlay={this.onPlayAudio}
                          onPause={this.onPauseAudio}
                          postId={message.id}
                          url={message.text}
                          isSmall={true}
                        />
                      ) : message.type === 'doc' ? (
                        <>
                          <Text style={styles.messageBodyText}>
                            {message.text
                              .split('/')
                              .pop()
                              .split('%2F')
                              .pop()}
                          </Text>
                          <View style={styles.messageContentContainer}>
                            <FontAwesome
                              name={'file-o'}
                              size={15}
                              color={Colors.black_light}
                            />
                            <Text style={styles.messageLabel}>File</Text>
                          </View>
                        </>
                      ) : message.type === 'note' ? (
                        <View>
                          <View style={styles.memoContainer}>
                            {message.media && message.media.length > 0 && this.renderMemoMedia(message.media)}
                            {message.text.length > 0 &&
                              <Text style={this.memoTextStyle} numberOfLines={3}>
                                {message.text}
                              </Text>
                            }
                          </View>
                          <View style={styles.divider} />
                          <TouchableOpacity
                            style={styles.notesContainer}
                            onPress={this.navigateToNotes}>
                            <Text style={styles.notesText}>
                              {translate('pages.xchat.notes')}
                            </Text>
                            <FontAwesome
                              name={'angle-right'}
                              size={20}
                              color={Colors.black_light}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : this.isContainUrl(message.text) ? (
                        <TouchableOpacity
                          onLongPress={this.onMessageLongPress}>
                          <ParsedText
                            style={styles.parsedTextStyle}
                            parse={
                              [
                                {
                                  // type: 'url',
                                  pattern: /(https?:\/\/|www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/i,
                                  style: {
                                    color: Colors.link_color,
                                    textDecorationLine: 'underline',
                                  },
                                  onPress: this.hyperlinkPressed,
                                  onLongPress: this.onMessageLongPress,
                                },
                                {
                                  pattern: /(~[0-9]+~)/gim,
                                  style: { color: '#E65497' },
                                  renderText: (matchingString, matches) => {
                                    let match = matchingString.replace(/~/g, '');
                                    return `@${this.getMentionUserName(match)}`;
                                  }
                                },
                              ]
                            }
                            childrenProps={{ allowFontScaling: false }}>
                            {/* {this.renderMessageWitMentions(
                                          message.message_body.text,
                                        )} */}
                            {message.text}
                          </ParsedText>

                          {this.renderLinkMedia(message.text)}
                        </TouchableOpacity>
                      ) : (
                                    <ParsedText
                                      style={styles.parsedTextStyle}
                                      parse={
                                        [
                                          {
                                            pattern: /(~[0-9]+~)/gim,
                                            style: { color: '#E65497' },
                                            renderText: (matchingString, matches) => {
                                              let match = matchingString.replace(/~/g, '');
                                              return `@${this.getMentionUserName(match)}`;
                                            }
                                          },
                                        ]
                                      }
                                      childrenProps={{ allowFontScaling: false }}>
                                      {message.text}
                                    </ParsedText>
                                  )}
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          }>
          {message.type === 'text' && (
            <MenuItem
              // icon={() => (
              //   <FontAwesome5
              //     name={'language'}
              //     size={20}
              //     color={Colors.white}
              //   />
              // )}
              onPress={this.onTranslateMessage}
              // title={translate('common.translate')}
              // titleStyle={{marginLeft: -25, color: Colors.white}}
              customComponent={
                <View style={styles.menuItemCustomComponentContainer}>
                  <FontAwesome5
                    name={'language'}
                    size={20}
                    color={Colors.white}
                  />
                  <Text style={styles.menuItemCustomComponentText}>
                    {translate('common.translate')}
                  </Text>
                </View>
              }
            />
          )}
          {/* {isUser && ( */}
          {message.type !== 'note' && (
            <MenuItem
              // icon={() => (
              //   <FontAwesome5 name={'language'} size={20} color={Colors.white} />
              // )}
              onPress={this.onReplyMessage}
              // title={translate('common.reply')}
              // titleStyle={{marginLeft: -25, color: Colors.white}}
              customComponent={
                <View style={styles.menuItemCustomComponentContainer}>
                  <FontAwesome5 name={'reply'} size={20} color={Colors.white} />
                  <Text style={styles.menuItemCustomComponentText}>
                    {translate('common.reply')}
                  </Text>
                </View>
              }
            />
          )}
          {/* )} */}
          {message.isMyMessage &&
            this.isEditable > new Date() &&
            message.type === 'text' &&
            message.type !== 'note' && (
              <MenuItem
                // icon={() => (
                //   <FontAwesome5
                //     name={'pencil-alt'}
                //     size={20}
                //     color={Colors.white}
                //   />
                // )}
                onPress={this.onEditMessage}
                // title={translate('common.edit')}
                // titleStyle={{marginLeft: -25, color: Colors.white}}
                customComponent={
                  <View style={styles.menuItemCustomComponentContainer}>
                    <FontAwesome5
                      name={'pencil-alt'}
                      size={20}
                      color={Colors.white}
                    />
                    <Text style={styles.menuItemCustomComponentText}>
                      {translate('common.edit')}
                    </Text>
                  </View>
                }
              />
            )}
          <MenuItem
            // icon={() => (
            //   <FontAwesome name={'trash'} size={20} color={Colors.white} />
            // )}
            onPress={this.onDeleteMessage}
            // title={translate('common.delete')}
            // titleStyle={{marginLeft: -25, color: Colors.white}}
            customComponent={
              <View style={styles.menuItemCustomComponentContainer}>
                <FontAwesome5 name={'trash'} size={20} color={Colors.white} />
                <Text style={styles.menuItemCustomComponentText}>
                  {translate('common.delete')}
                </Text>
              </View>
            }
          />
          {message.isMyMessage &&
            this.isEditable > new Date() &&
            message.type !== 'note' && (
              <MenuItem
                // icon={() => (
                //   <FontAwesome5
                //     name={'minus-circle'}
                //     size={20}
                //     color={Colors.white}
                //   />
                // )}
                onPress={this.onUnsendMessage}
                // title={translate('common.unsend')}
                // titleStyle={{marginLeft: -25, color: Colors.white}}
                customComponent={
                  <View style={styles.menuItemCustomComponentContainer}>
                    <FontAwesome5
                      name={'minus-circle'}
                      size={20}
                      color={Colors.white}
                    />
                    <Text style={styles.menuItemCustomComponentText}>
                      {translate('common.unsend')}
                    </Text>
                  </View>
                }
              />
            )}
          {message.type === 'text' &&
            message.type !== 'note' && (
              <MenuItem
                onPress={this.onCopyMessage}
                customComponent={
                  <View style={styles.menuItemCustomComponentContainer}>
                    <FontAwesome5
                      name={'copy'}
                      size={20}
                      color={Colors.white}
                    />
                    <Text style={styles.menuItemCustomComponentText}>
                      {translate('common.copy')}
                    </Text>
                  </View>
                }
              />
            )}
          {message.type !== 'text' &&
            message.type !== 'note' && (
              <MenuItem
                onPress={this.onDownloadMessage}
                customComponent={
                  <View style={styles.menuItemCustomComponentContainer}>
                    <FontAwesome5
                      name={'download'}
                      size={20}
                      color={Colors.white}
                    />
                    <Text style={styles.menuItemCustomComponentText}>
                      {translate('pages.setting.download')}
                    </Text>
                  </View>
                }
              />
            )}
        </Menu>
        <ImageView
          images={images}
          imageIndex={0}
          visible={showImage}
          onRequestClose={this.hideImage.bind(this,false)}
        />
      </View>
    );
  }
}

export default GroupChatMessageBubble;
