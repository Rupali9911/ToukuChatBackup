import React, { Fragment, Component } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Clipboard,
  Linking,
  NativeModules,
  NativeEventEmitter,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Divider } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import OpenFile from 'react-native-doc-viewer';

import { Colors, Icons, Fonts, Images } from '../constants';
import { translate, setI18nConfig } from '../redux/reducers/languageReducer';
import ScalableImage from './ScalableImage';
import AudioPlayerCustom from './AudioPlayerCustom';
import VideoPlayerCustom from './VideoPlayerCustom';
import Toast from '../components/Toast';
import ImageView from 'react-native-image-viewing';
import HyperLink from 'react-native-hyperlink';
import {
  getAvatar,
  normalize,
  onPressHyperlink,
  getUserName,
  getUser_ActionFromUpdateText,
} from '../utils';
import VideoThumbnailPlayer from './VideoThumbnailPlayer';
import RoundedImage from './RoundedImage';
import ParsedText from 'react-native-parsed-text';

import Menu from '../components/Menu/Menu';
import MenuItem from '../components/Menu/MenuItem';
import linkify from 'linkify-it';
import LinkPreviewComponent from './LinkPreviewComponent';

let borderRadius = 20;

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
    this.setState({ visible: false });
  };
  showMenu = () => {
    this._menu.show();
    this.setState({ visible: true });
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
        (error, url) => {
          if (error) {
            Toast.show({
              title: 'Touku',
              text: translate('common.somethingWentWrong'),
              type: 'primary',
            });
            this.props.showOpenLoader(false);
          } else {
            console.log(url);
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
        (error, url) => {
          if (error) {
            Toast.show({
              title: 'Touku',
              text: translate('common.somethingWentWrong'),
              type: 'primary',
            });
            this.props.showOpenLoader(false);
          } else {
            console.log(url);
            this.props.showOpenLoader(false);
          }
        },
      );
    }
  };

  renderReplyMessage = (message) => {
    let replyMessage = message.reply_to;

    if (replyMessage.message) {
      return (
        <>
          <TouchableOpacity
            disabled={this.props.isMultiSelect}
            onPress={() => {
              this.props.onReplyPress &&
                this.props.onReplyPress(replyMessage.id);
            }}
            style={{
              backgroundColor: this.props.isUser
                ? 'rgba(243,243,243,.53)'
                : Colors.gray,
              padding: 5,
              width: '100%',
              borderRadius: 5,
              marginBottom: 5,
            }}>
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
            <View style={{}}>
              <View
                style={{
                  flex: 3,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text numberOfLines={2} style={{ color: Colors.gradient_1 }}>
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
              <View
                style={{
                  flex: 7,
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: 5,
                }}>
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
                    <Fragment>
                      <Text
                        style={{
                          color: Colors.black,
                          fontSize: 15,
                          fontWeight: '500',
                          fontFamily: Fonts.light,
                        }}>
                        {replyMessage.message.split('/').pop().split('%2F').pop()}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 5,
                        }}>
                        <FontAwesome
                          name={'volume-up'}
                          size={15}
                          color={Colors.black_light}
                        />
                        <Text
                          style={{
                            color: Colors.dark_gray,
                            fontSize: 13,
                            marginLeft: 5,
                            fontFamily: Fonts.light,
                          }}>
                          Audio
                      </Text>
                      </View>
                    </Fragment>
                  ) : replyMessage.msg_type === 'doc' ? (
                    <Fragment>
                      <Text
                        style={{
                          color: Colors.black,
                          fontSize: 15,
                          fontWeight: '500',
                          fontFamily: Fonts.light,
                        }}>
                        {replyMessage.message.split('/').pop().split('%2F').pop()}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 5,
                        }}>
                        <FontAwesome
                          name={'file-o'}
                          size={15}
                          color={Colors.black_light}
                        />
                        <Text
                          style={{
                            color: Colors.dark_gray,
                            fontSize: 13,
                            marginLeft: 5,
                            fontFamily: Fonts.light,
                          }}>
                          File
                      </Text>
                      </View>
                    </Fragment>
                  ) : (
                          <Text numberOfLines={2} style={{ fontFamily: Fonts.regular }}>
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
    if (text == null) return;
    var urlRE = new RegExp(
      '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+',
    );
    const url = text.match(urlRE);
    return url;
  };

  openUrl = (text) => {
    if (text == null) return;
    var urlRE = new RegExp(
      '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+',
    );
    const url = text.match(urlRE);
    Linking.openURL(url[0]);
  };

  getMentionsPattern = () => {
    const { groupMembers, message } = this.props;
    let mentions = message.mentions;
    if(mentions && mentions.length>0){
      let groupMentions = mentions.map(
        (groupMember) => `@${getUserName(groupMember.id) || groupMember.desplay_name || groupMember.username}`,
      );
      if(groupMembers && groupMembers.length>0){
        let groupAllMembers = groupMembers.map(
          (groupMember) => `@${getUserName(groupMember.id) || groupMember.display_name || groupMember.username}`,
        );
        groupMentions = [...groupMentions, ...groupAllMembers]
      }
      // console.log('getMentionsPattern',groupMentions.join('|'));
      return groupMentions.join('|');
    }else{
      return '';
    }
  };

  renderMessageWitMentions = (msg = '') => {
    const { groupMembers, message } = this.props;
    let splitNewMessageText = msg.split(' ');
    let newMessageMentions = [];
    const newMessageTextWithMention = splitNewMessageText
      .map((text) => {
        let mention = null;
        let mentions = message.mentions;
        mentions && mentions.forEach((groupMember) => {
          // console.log('groupMember',groupMember);
          if (text === `~${groupMember.id}~`) {
            mention = `@${getUserName(groupMember.id) || groupMember.desplay_name || groupMember.username}`;
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
    return linkify().match(text).map((item) => {
      return (
        <LinkPreviewComponent text={item.text} url={item.url} />
      );
    });
  }

  render() {
    const {
      message,
      isUser,
      onMessageReply,
      onMessagePress,
      longPressMenu,
      closeMenu,
      openMenu,
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
    const { showImage, images } = this.state;
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
    // console.log('mentions',message.mentions);
    return (
      <View>
        <Menu
          ref={(ref) => {
            this._menu = ref;
          }}
          style={{
            marginTop: 25,
            marginLeft: -20,
            backgroundColor: Colors.gradient_3,
            opacity: 0.9,
          }}
          tabHeight={110}
          headerHeight={80}
          button={
            !isUser ? (
              <Animated.View style={[styles.talkBubble, animatedStyle]}>
                <View style={{ marginLeft: 5 }}>
                  <View
                    style={[
                      styles.talkBubbleAbsoluteLeft,
                      message.is_unsent && { borderRightColor: Colors.gray },
                    ]}
                  />
                  {message.is_unsent ? (
                    <View
                      activeOpacity={0.8}
                      style={[
                        {
                          minHeight: 40,
                          backgroundColor: Colors.gray,
                          borderRadius: borderRadius,
                          justifyContent: 'center',
                          paddingHorizontal: 10,
                          paddingVertical: 10,
                        },
                      ]}>
                      <Text
                        style={{
                          color: Colors.black,
                          fontSize: 12,
                          fontFamily: Fonts.regular,
                        }}>
                        {translate('pages.xchat.messageUnsent')}
                      </Text>
                    </View>
                  ) : message.message_body &&
                    message.message_body.type &&
                    message.message_body.type === 'update' ? (
                        this.renderGroupUpdate(message)
                      ) : (
                        <TouchableOpacity
                          disabled={isMultiSelect}
                          activeOpacity={0.8}
                          style={[
                            {
                              flex:0,
                              minHeight: 40,
                              backgroundColor: Colors.white,
                              borderRadius: borderRadius,
                              justifyContent: 'center',
                              paddingHorizontal:
                                message.message_body.type === 'image' ? 5 : 10,
                              paddingVertical:
                                message.message_body.type === 'image' ? 5 : 10,
                            },
                            message.message_body.type === 'audio' && {
                              minWidth: '100%',
                            },
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
                                postId={message.msg_id}
                                url={message.message_body.text}
                                isSmall={true}
                              />
                            ) : message.message_body.type === 'doc' ? (
                              <Fragment>
                                <Text
                                  style={{
                                    fontFamily: Fonts.regular,
                                    fontWeight: '300',
                                    fontSize: 15,
                                  }}>
                                  {message.message_body.text
                                    .split('/')
                                    .pop()
                                    .split('%2F')
                                    .pop()}
                                </Text>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginTop: 5,
                                  }}>
                                  <FontAwesome
                                    name={'file-o'}
                                    size={15}
                                    color={Colors.black_light}
                                  />
                                  <Text
                                    style={{
                                      color: Colors.dark_gray,
                                      fontSize: 13,
                                      marginLeft: 5,
                                      fontFamily: Fonts.light,
                                    }}>
                                    File
                            </Text>
                                </View>
                              </Fragment>
                            ) : this.isContainUrl(message.message_body.text) ? (
                              <TouchableOpacity
                                // onPress={() =>
                                //   this.openUrl(message.message_body.text)
                                // }
                                onLongPress={(msg_id) => {
                                  onMessagePress(message.msg_id);
                                  this.showMenu();
                                }}
                              >
                                {/* <HyperLink
                                  onPress={(url, text) => onPressHyperlink(url)}
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
                                    style={{
                                      fontSize: Platform.isPad
                                        ? normalize(8)
                                        : normalize(12),
                                      fontFamily: Fonts.regular,
                                      fontWeight: '400',
                                    }}
                                    parse={this.getMentionsPattern()===''?[
                                      {
                                        type: 'url', style: { color: Colors.link_color, textDecorationLine: 'underline' },
                                        onPress: onPressHyperlink,
                                        onLongPress: () => {
                                          onMessagePress(message.msg_id);
                                          this.showMenu();
                                        }
                                      },
                                    ]:[
                                      {
                                        type: 'url', style: { color: Colors.link_color, textDecorationLine: 'underline' },
                                        onPress: onPressHyperlink,
                                        onLongPress: () => {
                                          onMessagePress(message.msg_id);
                                          this.showMenu();
                                        }
                                      },
                                      {
                                        // pattern: /\B\@([\w\-]+)/gim,
                                        pattern: new RegExp(this.getMentionsPattern()),
                                        style: { color: '#E65497' },
                                      },
                                    ]}
                                    childrenProps={{ allowFontScaling: false }}>
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
                                          style={{
                                            fontSize: Platform.isPad
                                              ? normalize(8)
                                              : normalize(12),
                                            fontFamily: Fonts.regular,
                                            fontWeight: '400',
                                          }}
                                          parse={this.getMentionsPattern()===''?[]:[
                                            {
                                              // pattern: /\B\@([\w\-]+)/gim,
                                              pattern: new RegExp(this.getMentionsPattern()),
                                              style: { color: '#E65497' },
                                            },
                                          ]}
                                          childrenProps={{ allowFontScaling: false }}>
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
                      ? { marginVertical: 5 }
                      : {},
                    animatedStyle,
                  ]}>
                  {message.message_body &&
                    message.message_body.type === 'image' ? null : (
                      <View
                        style={[
                          styles.talkBubbleAbsoluteRight,
                          message.is_unsent && { borderLeftColor: Colors.gray },
                        ]}
                      />
                    )}
                  {message.is_unsent ? (
                    <View
                      style={[
                        {
                          minHeight: 40,
                          borderRadius: borderRadius,
                          backgroundColor: Colors.gray,
                        },
                      ]}>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          paddingHorizontal: 10,
                          paddingVertical: 10,
                        }}>
                        <Text
                          style={{
                            color: Colors.black,
                            fontSize: 12,
                            fontFamily: Fonts.regular,
                          }}>
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
                          {
                            minHeight: 40,
                            borderRadius: borderRadius,
                            backgroundColor:
                              message.message_body &&
                                message.message_body.type === 'image'
                                ? 'transparent'
                                : Colors.pink_chat,
                          },
                          message.message_body.type === 'audio' && {
                            minWidth: '100%',
                          },
                        ]}>
                        <TouchableOpacity
                          disabled={isMultiSelect}
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            paddingHorizontal:
                              message.message_body.type === 'image' ? 0 : 10,
                            paddingVertical:
                              message.message_body.type === 'image' ? 0 : 10,
                          }}
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
                              // borderRadius={borderRadius}
                              />
                            ) : message.message_body.type === 'video' ? (
                              <VideoPlayerCustom url={message.message_body.text} />
                            ) : message.message_body.type === 'audio' ? (
                              <AudioPlayerCustom
                                audioPlayingId={audioPlayingId}
                                perviousPlayingAudioId={perviousPlayingAudioId}
                                onAudioPlayPress={(id) => onAudioPlayPress(id)}
                                postId={message.msg_id}
                                url={message.message_body.text}
                                isSmall={true}
                              />
                            ) : message.message_body.type === 'doc' ? (
                              <Fragment>
                                <Text
                                  style={{
                                    fontFamily: Fonts.regular,
                                    fontWeight: '300',
                                    fontSize: 15,
                                  }}>
                                  {message.message_body.text
                                    .split('/')
                                    .pop()
                                    .split('%2F')
                                    .pop()}
                                </Text>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginTop: 5,
                                  }}>
                                  <FontAwesome
                                    name={'file-o'}
                                    size={15}
                                    color={Colors.black_light}
                                  />
                                  <Text
                                    style={{
                                      color: Colors.dark_gray,
                                      fontSize: 13,
                                      marginLeft: 5,
                                      fontFamily: Fonts.light,
                                    }}>
                                    File
                            </Text>
                                </View>
                              </Fragment>
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
                                    onPressHyperlink(url);
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
                                    style={{
                                      fontSize: Platform.isPad
                                        ? normalize(8)
                                        : normalize(12),
                                      fontFamily: Fonts.regular,
                                      fontWeight: '300',
                                    }}
                                    parse={this.getMentionsPattern()===''?[
                                      {
                                        type: 'url', style: { color: Colors.link_color, textDecorationLine: 'underline' },
                                        onPress: onPressHyperlink,
                                        onLongPress: () => {
                                          onMessagePress(message.msg_id);
                                          this.showMenu();
                                        }
                                      },
                                    ]:[
                                      {
                                        type: 'url', style: { color: Colors.link_color, textDecorationLine: 'underline' },
                                        onPress: onPressHyperlink,
                                        onLongPress: () => {
                                          onMessagePress(message.msg_id);
                                          this.showMenu();
                                        }
                                      },
                                      {
                                        // pattern: /\B\@([\w\-]+)/gim,
                                        pattern: new RegExp(this.getMentionsPattern()),
                                        style: { color: '#E65497' },
                                      },
                                    ]}
                                    childrenProps={{ allowFontScaling: false }}>
                                    {this.renderMessageWitMentions(
                                      message.message_body.text,
                                    )}
                                  </ParsedText>
                                {/* </HyperLink> */}

                                {this.renderLinkMedia(message.message_body.text)}

                              </TouchableOpacity>
                            ) : (
                                      <ParsedText
                                        style={{
                                          fontSize: Platform.isPad
                                            ? normalize(8)
                                            : normalize(12),
                                          fontFamily: Fonts.regular,
                                          fontWeight: '300',
                                        }}
                                        parse={this.getMentionsPattern()===''?[]:[
                                          {
                                            // pattern: /\B\@([\w\-]+)/gim,
                                            pattern: new RegExp(this.getMentionsPattern()),
                                            style: { color: '#E65497' },
                                          },
                                        ]}
                                        childrenProps={{ allowFontScaling: false }}>
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
                <View style={{ flex: 1, flexDirection: 'row', margin: 15 }}>
                  <FontAwesome5
                    name={'language'}
                    size={20}
                    color={Colors.white}
                  />
                  <Text style={{ marginLeft: 10, color: '#fff' }}>
                    {translate('common.translate')}
                  </Text>
                </View>
              }
            />
          )}
          {/* {isUser && ( */}
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
              <View style={{ flex: 1, flexDirection: 'row', margin: 15 }}>
                <FontAwesome5 name={'reply'} size={20} color={Colors.white} />
                <Text style={{ marginLeft: 10, color: '#fff' }}>
                  {translate('common.reply')}
                </Text>
              </View>
            }
          />
          {/* )} */}
          {isUser &&
            isEditable > new Date() &&
            message.message_body &&
            message.message_body.type === 'text' && (
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
                  <View style={{ flex: 1, flexDirection: 'row', margin: 15 }}>
                    <FontAwesome5
                      name={'pencil-alt'}
                      size={20}
                      color={Colors.white}
                    />
                    <Text style={{ marginLeft: 10, color: '#fff' }}>
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
              <View style={{ flex: 1, flexDirection: 'row', margin: 15 }}>
                <FontAwesome5 name={'trash'} size={20} color={Colors.white} />
                <Text style={{ marginLeft: 10, color: '#fff' }}>
                  {translate('common.delete')}
                </Text>
              </View>
            }
          />
          {isUser && isEditable > new Date() && (
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
                <View style={{ flex: 1, flexDirection: 'row', margin: 15 }}>
                  <FontAwesome5
                    name={'minus-circle'}
                    size={20}
                    color={Colors.white}
                  />
                  <Text style={{ marginLeft: 10, color: '#fff' }}>
                    {translate('common.unsend')}
                  </Text>
                </View>
              }
            />
          )}
          {message.message_body && message.message_body.type === 'text' && (
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
                <View style={{ flex: 1, flexDirection: 'row', margin: 15 }}>
                  <FontAwesome5 name={'copy'} size={20} color={Colors.white} />
                  <Text style={{ marginLeft: 10, color: '#fff' }}>
                    {translate('common.copy')}
                  </Text>
                </View>
              }
            />
          )}
          {message.message_body && message.message_body.type !== 'text' && (
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
                <View style={{ flex: 1, flexDirection: 'row', margin: 15 }}>
                  <FontAwesome5
                    name={'download'}
                    size={20}
                    color={Colors.white}
                  />
                  <Text style={{ marginLeft: 10, color: '#fff' }}>
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
    transform: [{ rotate: '-90deg' }],
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
    transform: [{ rotate: '90deg' }],
    left: -5,
    top: -15,
  },
});

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupChatMessageBubble);
