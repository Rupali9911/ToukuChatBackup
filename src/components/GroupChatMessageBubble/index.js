import linkify from 'linkify-it';
import React, {Component, Fragment} from 'react';
import {
  Animated,
  Clipboard,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import OpenFile from 'react-native-doc-viewer';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ImageView from 'react-native-image-viewing';
import {Divider} from 'react-native-paper';
import ParsedText from 'react-native-parsed-text';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
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
import {inviteUrlRoot, staging} from '../../helpers/api';
import NavigationService from '../../navigation/NavigationService';
import {addFriendByReferralCode} from '../../redux/reducers/friendReducer';
import {translate} from '../../redux/reducers/languageReducer';
import {
  setActiveTimelineTab,
  setSpecificPostId,
} from '../../redux/reducers/timelineReducer';
import {getChannelIdAndReferral, getUserName, normalize} from '../../utils';
import AudioPlayerCustom from '../AudioPlayerCustom';
import LinkPreviewComponent from '../LinkPreviewComponent';
import RoundedImage from '../RoundedImage';
import ScalableImage from '../ScalableImage';
import VideoPlayerCustom from '../VideoPlayerCustom';
import VideoThumbnailPlayer from '../VideoThumbnailPlayer';

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
      animation: new Animated.Value(1),
    };
    // this.eventEmitter = new NativeEventEmitter(
    //   NativeModules.RNReactNativeDocViewer,
    // );
    // this.eventEmitter.addListener('DoneButtonEvent', (data) => {
    //   /*
    //    *Done Button Clicked
    //    * return true
    //    */
    //   console.log('ChatMessageBubble -> constructor -> data', data.close);
    //   // this.props.showOpenLoader(false);
    //   // this.setState({donebuttonclicked: data.close});
    // });
  }

  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };
  hideMenu = () => {
    this._menu.hide();
    this.setState({visible: false});
  };
  showMenu = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', options);
    this._menu.show();
    this.setState({visible: true});
  };

  componentDidMount() {
    // download progress
    // this.eventEmitter.addListener('RNDownloaderProgress', (Event) => {
    //   // this.props.showOpenLoader(true);
    //   console.log(
    //     'ChatMessageBubble -> componentDidMount -> Event.progress',
    //     Event.progress,
    //   );
    //   if (Event.progress === 100) {
    //     this.props.showOpenLoader(false);
    //   }
    //   // this.setState({progress: Event.progress + ' %'});
    // });
  }

  componentWillUnmount() {
    //this.eventEmitter.removeListener();
  }

  hideImage() {
    console.log('hideImage called');
    this.setState({showImage: false});
  }
  onImagePress = (url) => {
    let images = [
      {
        uri: url,
      },
    ];
    this.setState({showImage: true, images: images});
  };

  startAnimation = () => {
    this.animInterval = setInterval(() => {
      Animated.timing(this.state.animation, {
        toValue: 0,
        timing: 400,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(this.state.animation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 800);
  };

  callBlinkAnimation = () => {
    setTimeout(() => {
      clearInterval(this.animInterval);
    }, 3200);
    this.startAnimation();
    console.log('animation start');
  };

  onCopy = (message) => {
    Clipboard.setString(message.text);
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
        backgroundColor: this.props.isUser
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
                <Text numberOfLines={2} style={{color: Colors.gradient_1}}>
                  {/* {replyMessage.sender_id === this.props.userData.id
                ? 'You' */}
                  {/* :  */}
                  {getUserName(replyMessage.sender_id) ||
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
                    source={{url: replyMessage.message}}
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
                  <Text numberOfLines={2} style={{fontFamily: Fonts.regular}}>
                    {replyMessage.message && replyMessage.message.match('\n')
                      ? replyMessage.message.split('\n').length >= 2
                        ? replyMessage.message.split('\n')[0] +
                          '\n' +
                          replyMessage.message.split('\n')[1] +
                          '...'
                        : replyMessage.message
                      : replyMessage.message}
                  </Text>
                )}
                {/* <Text numberOfLines={2} style={{fontFamily: Fonts.regular}}>
                  {replyMessage.message}
                </Text> */}
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
      NavigationService.navigate('ChannelInfo', {channelItem: params});
    } else if (url.includes(`${inviteUrlRoot}/Groups/invite/`)) {
      let s_url = url.split(`${inviteUrlRoot}/Groups/invite/`)[1];
      let group_id = s_url.substring(0, s_url.lastIndexOf('/'));
      NavigationService.navigate('GroupDetails', {group_id: group_id});
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
      this.props.setActiveTimelineTab('trend');
      this.props.setSpecificPostId(post_id);
      NavigationService.navigate('Timeline');
    } else if (url.indexOf('/#/groups/') > -1) {
      let split_url = url.split('/');
      let group_id = split_url[split_url.length - 2];
      console.log('group_id', group_id);
      NavigationService.navigate('JoinGroup', {group_id: group_id});
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

  getMentionsPattern = () => {
    const {groupMembers, message} = this.props;
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
    const {message} = this.props;
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

  renderLinkMedia = (text) => {
    //console.log('renderLinkMedia text', text)
    let arrLinks = linkify().match(text);
    if (arrLinks) {
      return arrLinks.map((item) => {
        let checkUrl = staging ? EnvironmentStage : Environment;
        if (checkUrl) {
          return null;
        }
        return <LinkPreviewComponent text={item.text} url={item.url} />;
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

      return {update_text, update_by};
    }
  };

  render() {
    const {
      message,
      isUser,
      onMessageReply,
      onMessagePress,
      selectedMessageId,
      onMessageTranslate,
      onDelete,
      onUnSend,
      onEditMessage,
      onDownloadMessage,
      audioPlayingId,
      perviousPlayingAudioId,
      onAudioPlayPress,
      isMultiSelect,
    } = this.props;
    const {showImage, images} = this.state;
    if (!message.message_body && !message.is_unsent) {
      return null;
    }

    if (
      message.message_body &&
      message.message_body.text &&
      message.message_body.text === null
    ) {
      return null;
    }

    const msgTime = new Date(message.timestamp);
    const isEditable = new Date(msgTime);

    isEditable.setDate(isEditable.getDate() + 1);

    const animatedStyle = {
      opacity: this.state.animation,
    };

    const messageBodyActionContainer = {
      borderRadius,
      paddingHorizontal:
        message.message_body.type === 'update'
          ? 0
          : message.message_body.type === 'image'
          ? 5
          : 10,
      paddingVertical: message.message_body.type === 'image' ? 5 : 10,
    };

    const audioMultiSelectActionContainer = [
      {
        paddingHorizontal:
          message.message_body.type === 'update'
            ? 0
            : message.message_body.type === 'image'
            ? 8
            : 10,
        paddingVertical: message.message_body.type === 'image' ? 8 : 10,
      },
      styles.audioMultiSelectActionContainer,
    ];

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
            !isUser ? (
              <Animated.View style={[styles.talkBubble, animatedStyle]}>
                <View style={styles.menuButtonContentContainer}>
                  <View
                    style={[
                      styles.talkBubbleAbsoluteLeft,
                      message.is_unsent && {borderRightColor: Colors.gray},
                    ]}
                  />
                  {message.is_unsent ? (
                    <View
                      activeOpacity={0.8}
                      style={[{borderRadius}, styles.unsentContainer]}>
                      <Text style={styles.unsentMessage}>
                        {translate('pages.xchat.messageUnsent')}
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      disabled={isMultiSelect}
                      activeOpacity={0.8}
                      style={[
                        styles.messageBodyActionContainer,
                        messageBodyActionContainer,
                        message.message_body.type === 'audio' &&
                          styles.replyAudioMessageWidth,
                      ]}
                      onLongPress={(msg_id) => {
                        onMessagePress(message.msg_id);
                        this.showMenu();
                      }}
                      onPress={() =>
                        message.message_body.type === 'doc'
                          ? this.onDocumentPress(message.message_body.text)
                          : message.message_body.type === 'image'
                          ? this.onImagePress(message.message_body.text)
                          : null
                      }>
                      {message.reply_to &&
                        // Object.keys(message.reply_to).length !== 0 &&
                        // message.reply_to.constructor === Object &&
                        this.renderReplyMessage(message)}
                      {message.message_body.type === 'image' &&
                      message.message_body.text !== null ? (
                        <ScalableImage
                          src={message.message_body.text}
                          borderRadius={borderRadius}
                        />
                      ) : message.message_body.type === 'video' ? (
                        <VideoPlayerCustom url={message.message_body.text} />
                      ) : message.message_body.type === 'audio' ? (
                        <AudioPlayerCustom
                          audioPlayingId={audioPlayingId}
                          perviousPlayingAudioId={perviousPlayingAudioId}
                          onAudioPlayPress={(id) => onAudioPlayPress(id)}
                          onPlay={() => {
                            this.props.onMediaPlay &&
                              this.props.onMediaPlay(true);
                          }}
                          onPause={() => {
                            this.props.onMediaPlay &&
                              this.props.onMediaPlay(false);
                          }}
                          postId={message.msg_id}
                          url={message.message_body.text}
                          isSmall={true}
                        />
                      ) : message.message_body.type === 'doc' ? (
                        <>
                          <Text style={styles.messageBodyText}>
                            {message.message_body.text
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
                      ) : message.message_body &&
                        message.message_body.type &&
                        message.message_body.type === 'update' ? (
                        <View>
                          <View style={styles.memoContainer}>
                            <Text style={styles.memotText} numberOfLines={3}>
                              {this.renderMemoText(message).update_text}
                            </Text>
                          </View>
                          <View style={styles.divider} />
                          <TouchableOpacity
                            style={styles.notesContainer}
                            onPress={() => {
                              NavigationService.navigate('GroupDetails', {
                                isNotes: true,
                              });
                            }}>
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
                      ) : this.isContainUrl(message.message_body.text) ? (
                        <TouchableOpacity
                          // onPress={() =>
                          //   this.openUrl(message.message_body.text)
                          // }
                          onLongPress={(msg_id) => {
                            onMessagePress(message.msg_id);
                            this.showMenu();
                          }}>
                          {/* <HyperLink
                                  onPress={(url, text) => hyperlinkPressed(url)}
                                  onLongPress={() => {
                                    onMessagePress(message.msg_id);
                                    this.showMenu();
                                  }}
                                  linkStyle={{
                                    color: Colors.link_color,
                                    textDecorationLine: 'underline',
                                  }}
                                > */}
                          {/* <Text
                              style={{
                                fontSize: Platform.isPad
                                  ? normalize(8)
                                  : normalize(12),
                                fontFamily: Fonts.regular,
                                fontWeight: '400',
                              }}>
                              {message.message_body.text}
                            </Text> */}
                          <ParsedText
                            style={styles.parsedTextStyle}
                            parse={
                              this.getMentionsPattern() === ''
                                ? [
                                    {
                                      type: 'url',
                                      style: {
                                        color: Colors.link_color,
                                        textDecorationLine: 'underline',
                                      },
                                      onPress: this.hyperlinkPressed,
                                      onLongPress: () => {
                                        onMessagePress(message.msg_id);
                                        this.showMenu();
                                      },
                                    },
                                  ]
                                : [
                                    {
                                      type: 'url',
                                      style: {
                                        color: Colors.link_color,
                                        textDecorationLine: 'underline',
                                      },
                                      onPress: this.hyperlinkPressed,
                                      onLongPress: () => {
                                        onMessagePress(message.msg_id);
                                        this.showMenu();
                                      },
                                    },
                                    {
                                      // pattern: /\B\@([\w\-]+)/gim,
                                      pattern: new RegExp(
                                        this.getMentionsPattern(),
                                      ),
                                      style: {color: '#E65497'},
                                    },
                                  ]
                            }
                            childrenProps={{allowFontScaling: false}}>
                            {this.renderMessageWitMentions(
                              message.message_body.text,
                            )}
                          </ParsedText>
                          {/* </HyperLink> */}

                          {this.renderLinkMedia(message.message_body.text)}
                        </TouchableOpacity>
                      ) : (
                        // <Text
                        //   style={{
                        //     fontSize: normalize(12),
                        //     fontFamily: Fonts.regular,
                        //     fontWeight: '400',
                        //   }}>
                        //   {message.message_body.text}
                        // </Text>
                        <ParsedText
                          style={styles.parsedTextStyle}
                          parse={
                            this.getMentionsPattern() === ''
                              ? []
                              : [
                                  {
                                    // pattern: /\B\@([\w\-]+)/gim,
                                    pattern: new RegExp(
                                      this.getMentionsPattern(),
                                    ),
                                    style: {color: '#E65497'},
                                  },
                                ]
                          }
                          childrenProps={{allowFontScaling: false}}>
                          {this.renderMessageWitMentions(
                            message.message_body.text,
                          )}
                        </ParsedText>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            ) : (
              <Animated.View
                style={[
                  styles.talkBubble,
                  message.message_body && message.message_body.type === 'image'
                    ? styles.imageMessageBodyMargin
                    : {},
                  animatedStyle,
                ]}>
                {/* {message.message_body &&
                    message.message_body.type === 'image' ? null : ( */}
                <View
                  style={[
                    styles.talkBubbleAbsoluteRight,
                    message.is_unsent && {borderLeftColor: Colors.gray},
                  ]}
                />
                {/* )} */}
                {message.is_unsent ? (
                  <View
                    style={[
                      {borderRadius},
                      styles.imageUnsentMessageContainer,
                    ]}>
                    <View style={styles.imageUnsentMessageSubContainer}>
                      <Text style={styles.unsentMessage}>
                        {translate('pages.xchat.messageUnsent')}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    // colors={[
                    //   Colors.gradient_3,
                    //   Colors.gradient_2,
                    //   Colors.gradient_1,
                    // ]}
                    style={[
                      {borderRadius},
                      styles.audioMessageBodyContainer,
                      message.message_body.type === 'audio' &&
                        styles.replyAudioMessageWidth,
                    ]}>
                    <TouchableOpacity
                      disabled={isMultiSelect}
                      style={audioMultiSelectActionContainer}
                      onLongPress={(msg_id) => {
                        onMessagePress(message.msg_id);
                        this.showMenu();
                      }}
                      onPress={() =>
                        message.message_body.type === 'doc'
                          ? this.onDocumentPress(message.message_body.text)
                          : message.message_body.type === 'image'
                          ? this.onImagePress(message.message_body.text)
                          : null
                      }
                      activeOpacity={0.8}>
                      {message.reply_to &&
                        // &&
                        // Object.keys(message.reply_to).length !== 0 &&
                        // message.reply_to.constructor === Object
                        this.renderReplyMessage(message)}

                      {message.message_body.type === 'image' &&
                      message.message_body.text !== null ? (
                        <ScalableImage
                          src={message.message_body.text}
                          borderRadius={borderRadius}
                        />
                      ) : message.message_body.type === 'video' ? (
                        <VideoPlayerCustom url={message.message_body.text} />
                      ) : message.message_body.type === 'audio' ? (
                        <AudioPlayerCustom
                          audioPlayingId={audioPlayingId}
                          perviousPlayingAudioId={perviousPlayingAudioId}
                          onAudioPlayPress={(id) => onAudioPlayPress(id)}
                          onPlay={() => {
                            this.props.onMediaPlay &&
                              this.props.onMediaPlay(true);
                          }}
                          onPause={() => {
                            this.props.onMediaPlay &&
                              this.props.onMediaPlay(false);
                          }}
                          postId={message.msg_id}
                          url={message.message_body.text}
                          isSmall={true}
                        />
                      ) : message.message_body.type === 'doc' ? (
                        <Fragment>
                          <Text style={styles.messageBodyText}>
                            {message.message_body.text
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
                        </Fragment>
                      ) : message.message_body.type === 'update' ? (
                        <View>
                          <View style={styles.memoContainer}>
                            <Text style={styles.memotText} numberOfLines={3}>
                              {this.renderMemoText(message).update_text}
                            </Text>
                          </View>
                          <View style={styles.divider} />
                          <TouchableOpacity
                            style={styles.notesContainer}
                            onPress={() => {
                              NavigationService.navigate('GroupDetails', {
                                isNotes: true,
                              });
                            }}>
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
                      ) : this.isContainUrl(message.message_body.text) ? (
                        <TouchableOpacity
                          // onPress={() =>
                          //   this.openUrl(message.message_body.text)
                          // }
                          onLongPress={(msg_id) => {
                            onMessagePress(message.msg_id);
                            this.showMenu();
                          }}>
                          {/* <HyperLink
                                  onPress={(url, text) => {
                                    hyperlinkPressed(url);
                                  }}
                                  onLongPress={() => {
                                    onMessagePress(message.msg_id);
                                    this.showMenu();
                                  }}
                                  linkStyle={{
                                    color: Colors.link_color,
                                    textDecorationLine: 'underline',
                                  }}> */}
                          {/* <Text
                              style={{
                                color: Colors.black,
                                fontSize: Platform.isPad
                                  ? normalize(8)
                                  : normalize(12),
                                fontFamily: Fonts.regular,
                                fontWeight: '300',
                              }}>
                              {message.message_body.text}
                            </Text> */}
                          <ParsedText
                            style={styles.urlParsedTextStyle}
                            parse={
                              this.getMentionsPattern() === ''
                                ? [
                                    {
                                      type: 'url',
                                      style: {
                                        color: Colors.link_color,
                                        textDecorationLine: 'underline',
                                      },
                                      onPress: this.hyperlinkPressed,
                                      onLongPress: () => {
                                        onMessagePress(message.msg_id);
                                        this.showMenu();
                                      },
                                    },
                                  ]
                                : [
                                    {
                                      type: 'url',
                                      style: {
                                        color: Colors.link_color,
                                        textDecorationLine: 'underline',
                                      },
                                      onPress: this.hyperlinkPressed,
                                      onLongPress: () => {
                                        onMessagePress(message.msg_id);
                                        this.showMenu();
                                      },
                                    },
                                    {
                                      // pattern: /\B\@([\w\-]+)/gim,
                                      pattern: new RegExp(
                                        this.getMentionsPattern(),
                                      ),
                                      style: {color: '#E65497'},
                                    },
                                  ]
                            }
                            childrenProps={{allowFontScaling: false}}>
                            {this.renderMessageWitMentions(
                              message.message_body.text,
                            )}
                          </ParsedText>
                          {/* </HyperLink> */}

                          {this.renderLinkMedia(message.message_body.text)}
                        </TouchableOpacity>
                      ) : (
                        <ParsedText
                          style={styles.urlParsedTextStyle}
                          parse={
                            this.getMentionsPattern() === ''
                              ? []
                              : [
                                  {
                                    // pattern: /\B\@([\w\-]+)/gim,
                                    pattern: new RegExp(
                                      this.getMentionsPattern(),
                                    ),
                                    style: {color: '#E65497'},
                                  },
                                ]
                          }
                          childrenProps={{allowFontScaling: false}}>
                          {this.renderMessageWitMentions(
                            message.message_body.text,
                          )}
                        </ParsedText>
                        // <Text
                        //   style={{
                        //     color: Colors.black,
                        //     fontSize: normalize(12),
                        //     fontFamily: Fonts.regular,
                        //     fontWeight: '300',
                        //   }}>
                        //   {message.message_body.text}
                        // </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            )
          }>
          {message.message_body && message.message_body.type === 'text' && (
            <MenuItem
              // icon={() => (
              //   <FontAwesome5
              //     name={'language'}
              //     size={20}
              //     color={Colors.white}
              //   />
              // )}
              onPress={() => {
                onMessageTranslate(message);
                // closeMenu();
                this.hideMenu();
              }}
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
          {message.message_body && message.message_body.type !== 'update' && (
            <MenuItem
              // icon={() => (
              //   <FontAwesome5 name={'language'} size={20} color={Colors.white} />
              // )}
              onPress={() => {
                onMessageReply(selectedMessageId);
                // closeMenu();
                this.hideMenu();
              }}
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
          {isUser &&
            isEditable > new Date() &&
            message.message_body &&
            message.message_body.type === 'text' &&
            message.message_body.type !== 'update' && (
              <MenuItem
                // icon={() => (
                //   <FontAwesome5
                //     name={'pencil-alt'}
                //     size={20}
                //     color={Colors.white}
                //   />
                // )}
                onPress={() => {
                  onEditMessage(message);
                  // closeMenu();
                  this.hideMenu();
                }}
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
            onPress={() => {
              onDelete(selectedMessageId);
              // closeMenu();
              this.hideMenu();
            }}
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
          {isUser &&
            isEditable > new Date() &&
            message.message_body &&
            message.message_body.type !== 'update' && (
              <MenuItem
                // icon={() => (
                //   <FontAwesome5
                //     name={'minus-circle'}
                //     size={20}
                //     color={Colors.white}
                //   />
                // )}
                onPress={() => {
                  this.hideMenu();
                  setTimeout(() => {
                    onUnSend(selectedMessageId);
                  }, 500);
                  // closeMenu();
                }}
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
          {message.message_body &&
            message.message_body.type === 'text' &&
            message.message_body.type !== 'update' && (
              <MenuItem
                // icon={() => (
                //   <FontAwesome5 name={'copy'} size={20} color={Colors.white} />
                // )}
                onPress={() => {
                  this.onCopy(message.message_body);
                  this.hideMenu();
                }}
                // title={translate('common.copy')}
                // titleStyle={{marginLeft: -25, color: Colors.white}}
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
          {message.message_body &&
            message.message_body.type !== 'text' &&
            message.message_body.type !== 'update' && (
              <MenuItem
                // icon={() => (
                //   <FontAwesome name={'download'} size={20} color={Colors.white} />
                // )}
                onPress={() => {
                  onDownloadMessage(message);
                  // closeMenu();
                  this.hideMenu();
                }}
                // title={translate('pages.setting.download')}
                // titleStyle={{marginLeft: -25, color: Colors.white}}
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
          onRequestClose={() => this.hideImage(false)}
        />
      </View>
    );
  }
}

const parsedTextStyle = {
  fontSize: Platform.isPad ? normalize(8) : normalize(12),
  fontFamily: Fonts.regular,
};

const styles = StyleSheet.create({
  talkBubble: {
    justifyContent: 'flex-end',
    marginBottom: 7,
    marginTop: 2,
  },
  talkBubbleAbsoluteRight: {
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderTopColor: 'transparent',
    borderTopWidth: 12.5,
    borderLeftWidth: 6.5,
    borderLeftColor: Colors.pink_chat,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    transform: [{rotate: '-90deg'}],
    right: -5,
    top: -15,
  },
  talkBubbleAbsoluteLeft: {
    width: 30,
    height: 30,
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderTopColor: 'transparent',
    borderTopWidth: 12.5,
    borderRightWidth: 6.5,
    borderRightColor: Colors.white,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    transform: [{rotate: '90deg'}],
    left: -5,
    top: -15,
  },
  replyMessageActionContainer: {
    padding: 5,
    width: '100%',
    borderRadius: 5,
    marginBottom: 5,
  },
  replyContentContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyContentSubContainer: {
    flex: 7,
    justifyContent: 'center',
    width: '100%',
    marginTop: 5,
  },
  mediaHeading: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: Fonts.light,
  },
  mediaContentContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  mediaLabel: {
    color: Colors.dark_gray,
    fontSize: 13,
    marginLeft: 5,
    fontFamily: Fonts.light,
  },
  menuStyle: {
    marginTop: 25,
    marginLeft: -20,
    backgroundColor: Colors.gradient_3,
    opacity: 0.9,
  },
  menuButtonContentContainer: {
    marginLeft: 5,
  },
  unsentContainer: {
    minHeight: 40,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  unsentMessage: {
    color: Colors.black,
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  messageBodyActionContainer: {
    flex: 0,
    minHeight: 40,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  replyAudioMessageWidth: {
    minWidth: '100%',
  },
  messageBodyText: {
    fontFamily: Fonts.regular,
    fontWeight: '300',
    fontSize: 15,
  },
  messageContentContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  messageLabel: {
    color: Colors.dark_gray,
    fontSize: 13,
    marginLeft: 5,
    fontFamily: Fonts.light,
  },
  memoContainer: {
    paddingHorizontal: 10,
  },
  memotText: {
    fontFamily: Fonts.regular,
    fontWeight: '300',
    fontSize: 15,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginVertical: 5,
  },
  notesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  notesText: {
    flex: 1,
    color: Colors.black_light,
    fontSize: 13,
    fontFamily: Fonts.regular,
    fontWeight: '600',
  },
  parsedTextStyle: {
    ...parsedTextStyle,
    fontWeight: '400',
  },
  urlParsedTextStyle: {
    ...parsedTextStyle,
    fontWeight: '300',
  },
  imageMessageBodyMargin: {
    marginVertical: 5,
  },
  imageUnsentMessageContainer: {
    minHeight: 40,
    backgroundColor: Colors.gray,
  },
  imageUnsentMessageSubContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  audioMessageBodyContainer: {
    minHeight: 40,
    backgroundColor: Colors.pink_chat,
  },
  audioMultiSelectActionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItemCustomComponentContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 15,
  },
  menuItemCustomComponentText: {
    marginLeft: 10,
    color: 'white',
  },
});

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {
  addFriendByReferralCode,
  setSpecificPostId,
  setActiveTimelineTab,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupChatMessageBubble);
