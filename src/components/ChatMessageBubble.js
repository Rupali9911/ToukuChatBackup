import React, {Component, Fragment} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Clipboard,
  Image,
  Linking,
  Modal,
  NativeModules,
  NativeEventEmitter,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Divider} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import OpenFile from 'react-native-doc-viewer';

import {Colors, Fonts, Images, Icons} from '../constants';
import {translate} from '../redux/reducers/languageReducer';
import ScalableImage from './ScalableImage';
import VideoPlayerCustom from './VideoPlayerCustom';
import AudioPlayerCustom from './AudioPlayerCustom';
import Toast from '../components/Toast';
import HyperLink from 'react-native-hyperlink';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImageView from 'react-native-image-viewing';
import {
  getAvatar,
  normalize,
  getChannelIdAndReferral,
  onPressHyperlink,
  getUserName,
} from '../utils';
import VideoThumbnailPlayer from './VideoThumbnailPlayer';
import RoundedImage from './RoundedImage';

import Menu from '../components/Menu/Menu';
import MenuItem from '../components/Menu/MenuItem';
import {inviteUrlRoot, staging} from '../helpers/api';
import NavigationService from '../navigation/NavigationService';

let borderRadius = 20;
let downloaded = false
class ChatMessageBubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showImage: false,
      images: null,
    };
    // this.eventEmitter = new NativeEventEmitter(
    //   NativeModules.RNReactNativeDocViewer,
    // );
    // this.eventEmitter.addListener('DoneButtonEvent', (data) => {
    //   console.log('ChatMessageBubble -> constructor -> data', data.close, downloaded);
    //     if (!downloaded) {
    //         downloaded = true
    //         this.props.showOpenLoader(false);
    //     }
    // });
  }

  componentDidMount() {
    // download progress
    // this.eventEmitter.addListener('RNDownloaderProgress', (Event) => {
    //   if (Event.progress === 100 && !downloaded) {
    //       downloaded = true
    //       console.log(
    //           'ChatMessageBubble -> componentDidMount -> Event.progress',
    //           Event.progress, downloaded
    //       );
    //     this.props.showOpenLoader(false);
    //   }
    // });
  }

  componentWillUnmount() {
    //this.eventEmitter.removeListener();
  }

  onCopy = (message) => {
    Clipboard.setString(message);
  };

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
              flexDirection: 'row',
            }}>
            {/* <View style={{}}>
              <Image
                source={getAvatar(
                  replyMessage.sender_id === this.props.userData.id
                    ? message.from_user.avatar
                    : message.to_user.avatar,
                )}
                style={{
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
                <Text numberOfLines={2} style={{color: Colors.gradient_1}}>
                  {replyMessage.sender_id === this.props.userData.id
                    ? translate('pages.xchat.you')
                    : getUserName(replyMessage.sender_id) ||
                      (replyMessage.display_name &&
                      replyMessage.display_name !== ''
                        ? replyMessage.display_name
                        : replyMessage.name)}
                </Text>
              </View>
              <View
                style={{
                  flex: 7,
                  justifyContent: 'center',
                  width: '100%',
                }}>
                {replyMessage.msg_type === 'image' &&
                replyMessage.message !== null ? (
                  <RoundedImage
                    source={{uri: replyMessage.message}}
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
                {/* <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: Fonts.regular,
                    fontWeight: '300',
                    fontSize: 15,
                  }}>
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
    var urlRE = new RegExp(
      '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+',
    );
    const url = text.match(urlRE);
    return url;
  };

  openUrl = (text) => {
    var urlRE = new RegExp(
      '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+',
    );
    const url = text.match(urlRE);
    Linking.openURL(url[0]);
  };

  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
    this.setState({visible: false});
  };

  showMenu = () => {
    this._menu.show();
    this.setState({visible: true});
  };

  render() {
    const {
      message,
      isUser,
      onMessageReply,
      onMessagePress,
      longPressMenu,
      closeMenu,
      openMenu,
      isChannel,
      selectedMessageId,
      onMessageTranslate,
      onEditMessage,
      onDownloadMessage,
      onDelete,
      onUnSend,
      audioPlayingId,
      perviousPlayingAudioId,
      onAudioPlayPress,
      isMultiSelect,
    } = this.props;
    const {showImage, images} = this.state;
    const msgTime = new Date(message.created);
    const isEditable = new Date(msgTime);

    isEditable.setDate(isEditable.getDate() + 1);

    if (!message.message_body && !message.is_unsent) {
      return null;
    }
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
              <View
                style={[
                  styles.talkBubble,
                  message.hyperlink ? {marginVertical: 5} : {},
                ]}>
                <View style={{marginLeft: 5}}>
                  {message.hyperlink ? null : (
                    <View
                      style={[
                        styles.talkBubbleAbsoluteLeft,
                        message.is_unsent && {borderRightColor: Colors.gray},
                      ]}
                    />
                  )}
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
                  ) : (
                    <TouchableOpacity
                      disabled={isMultiSelect}
                      activeOpacity={0.8}
                      style={[
                        message.hyperlink
                          ? {marginLeft: -15}
                          : {
                              minHeight: 40,
                              backgroundColor: Colors.white,
                              borderRadius: borderRadius,
                              justifyContent: 'center',
                              paddingHorizontal:
                                message.msg_type === 'image' ? 5 : 10,
                              paddingVertical:
                                message.msg_type === 'image' ? 5 : 10,
                            },
                        message.msg_type === 'audio' && {minWidth: '100%'},
                      ]}
                      onLongPress={(id) => {
                        onMessagePress(message.id);
                        this.showMenu();
                      }}
                      onPress={() =>
                        message.msg_type === 'doc'
                          ? this.onDocumentPress(message.message_body)
                          : message.msg_type === 'image'
                          ? message.hyperlink
                            ? Linking.openURL(message.hyperlink)
                            : this.onImagePress(
                                message.thumbnail === ''
                                  ? message.message_body
                                  : message.thumbnail,
                              )
                          : null
                      }>
                      {message.reply_to && this.renderReplyMessage(message)}
                      {message.message_body && message.msg_type === 'image' ? (
                        <ScalableImage
                          src={
                            message.thumbnail === null
                              ? message.message_body
                              : message.thumbnail
                          }
                          isHyperlink={message.hyperlink}
                          borderRadius={message.hyperlink ? 0 : borderRadius}
                        />
                      ) : message.msg_type === 'video' ? (
                        <VideoPlayerCustom url={message.message_body} />
                      ) : message.msg_type === 'audio' ? (
                        <AudioPlayerCustom
                          audioPlayingId={audioPlayingId}
                          perviousPlayingAudioId={perviousPlayingAudioId}
                          onAudioPlayPress={(id) => onAudioPlayPress(id)}
                          postId={message.id}
                          url={message.message_body}
                          isSmall={true}
                        />
                      ) : message.msg_type === 'doc' ? (
                        <Fragment>
                          <Text
                            style={{
                              fontFamily: Fonts.regular,
                              fontWeight: '300',
                              fontSize: 15,
                            }}>
                            {message.message_body
                              .split('/')
                              .pop()
                              .split('%2')
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
                                marginLeft: 5,
                                fontFamily: Fonts.regular,
                                fontWeight: '300',
                                fontSize: 15,
                              }}>
                              File
                            </Text>
                          </View>
                        </Fragment>
                      ) : this.isContainUrl(message.message_body) ? (
                        <TouchableOpacity
                          // onPress={() => this.openUrl(message.message_body)}
                          onLongPress={(id) => {
                            onMessagePress(message.id);
                          }}>
                          <HyperLink
                            onPress={(url, text) => {
                              onPressHyperlink(url);
                            }}
                            onLongPress={() => {
                              onMessagePress(message.id);
                              this.showMenu();
                            }}
                            linkStyle={{
                              color: Colors.link_color,
                              textDecorationLine: 'underline',
                            }}>
                            <Text
                              style={{
                                fontFamily: Fonts.regular,
                                fontWeight: '400',
                                fontSize: Platform.isPad
                                  ? normalize(7.5)
                                  : normalize(12),
                              }}>
                              {message.message_body}
                            </Text>
                          </HyperLink>
                        </TouchableOpacity>
                      ) : (
                        <Text
                          style={{
                            fontFamily: Fonts.regular,
                            fontWeight: '400',
                            fontSize: Platform.isPad
                              ? normalize(7.5)
                              : normalize(12),
                          }}>
                          {message.message_body}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.talkBubble,
                  message.msg_type === 'image' ? {marginVertical: 5} : {},
                ]}>
                {message.msg_type === 'image' ? null : (
                  <View
                    style={[
                      styles.talkBubbleAbsoluteRight,
                      message.is_unsent && {borderLeftColor: Colors.gray},
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
                          message.msg_type === 'image'
                            ? 'transparent'
                            : Colors.pink_chat,
                        // padding: 5,
                      },
                      message.msg_type === 'audio' && {minWidth: '100%'},
                    ]}>
                    <TouchableOpacity
                      disabled={isMultiSelect}
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        paddingHorizontal:
                          message.msg_type === 'image' ? 0 : 10,
                        paddingVertical: message.msg_type === 'image' ? 0 : 10,
                      }}
                      onLongPress={() => {
                        onMessagePress(message.id);
                        this.showMenu();
                      }}
                      onPress={() =>
                        message.msg_type === 'doc'
                          ? this.onDocumentPress(message.message_body)
                          : message.msg_type === 'image'
                          ? this.onImagePress(
                              message.thumbnail === ''
                                ? message.message_body
                                : message.thumbnail,
                            )
                          : null
                      }
                      activeOpacity={0.8}>
                      {message.reply_to &&
                        message.reply_to &&
                        this.renderReplyMessage(message)}
                      {message.message_body && message.msg_type === 'image' ? (
                        <ScalableImage
                          src={
                            message.thumbnail === null
                              ? message.message_body
                              : message.thumbnail
                          }
                          isHyperlink={message.hyperlink}
                          // borderRadius={message.hyperlink ? 0 : borderRadius}
                        />
                      ) : message.msg_type === 'video' ? (
                        <VideoPlayerCustom url={message.message_body} />
                      ) : message.msg_type === 'audio' ? (
                        <AudioPlayerCustom
                          audioPlayingId={audioPlayingId}
                          perviousPlayingAudioId={perviousPlayingAudioId}
                          onAudioPlayPress={(id) => onAudioPlayPress(id)}
                          postId={message.id}
                          url={message.message_body}
                          isSmall={true}
                        />
                      ) : message.msg_type === 'doc' ? (
                        <Fragment>
                          <Text
                            style={{
                              color: Colors.black,
                              fontSize: 15,
                              fontWeight: '300',
                              fontFamily: Fonts.regular,
                            }}>
                            {message.message_body
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
                                marginLeft: 5,
                                fontSize: 15,
                                fontWeight: '300',
                                fontFamily: Fonts.regular,
                              }}>
                              File
                            </Text>
                          </View>
                        </Fragment>
                      ) : this.isContainUrl(message.message_body) ? (
                        <TouchableOpacity
                          // onPress={() => this.openUrl(message.message_body)}
                          onLongPress={(id) => {
                            onMessagePress(message.id);
                          }}>
                          <HyperLink
                            onPress={(url, text) => {
                              onPressHyperlink(url);
                            }}
                            onLongPress={() => {
                              onMessagePress(message.id);
                              this.showMenu();
                            }}
                            linkStyle={{
                              color: Colors.link_color,
                              textDecorationLine: 'underline',
                            }}>
                            <Text
                              style={{
                                color: Colors.black,
                                fontSize: Platform.isPad
                                  ? normalize(7.5)
                                  : normalize(12),
                                fontWeight: '300',
                                fontFamily: Fonts.regular,
                              }}>
                              {message.message_body}
                            </Text>
                          </HyperLink>
                        </TouchableOpacity>
                      ) : (
                        <Text
                          style={{
                            color: Colors.black,
                            fontSize: Platform.isPad
                              ? normalize(7.5)
                              : normalize(12),
                            fontWeight: '300',
                            fontFamily: Fonts.regular,
                          }}>
                          {message.message_body}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )
          }>
          {message.msg_type === 'text' && (
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
              customComponent={
                <View style={{flex: 1, flexDirection: 'row', margin: 15}}>
                  <FontAwesome5
                    name={'language'}
                    size={20}
                    color={Colors.white}
                  />
                  <Text style={{marginLeft: 10, color: '#fff'}}>
                    {translate('common.translate')}
                  </Text>
                </View>
              }
              // title={translate('common.translate')}
              // titleStyle={{marginLeft: -25, color: Colors.white}}
            />
          )}

          <MenuItem
            // icon={() => (
            //   <FontAwesome5
            //     name={'language'}
            //     size={20}
            //     color={Colors.white}
            //   />
            // )}
            onPress={() => {
              console.log('selectedMessageId', selectedMessageId);

              onMessageReply(selectedMessageId);
              // closeMenu();
              this.hideMenu();
            }}
            customComponent={
              <View style={{flex: 1, flexDirection: 'row', margin: 15}}>
                <FontAwesome5
                  style={{flex: 1}}
                  name={'reply'}
                  size={20}
                  color={Colors.white}
                />
                <Text style={{flex: 2, marginLeft: 10, color: '#fff'}}>
                  {translate('common.reply')}
                </Text>
              </View>
            }
            // title={translate('common.reply')}
            // titleStyle={{marginLeft: -25, color: Colors.white}}
          />
          {isUser && isEditable > new Date() && message.msg_type === 'text' && (
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
                <View style={{flex: 1, flexDirection: 'row', margin: 15}}>
                  <FontAwesome5
                    name={'pencil-alt'}
                    size={20}
                    color={Colors.white}
                    style={{flex: 1}}
                  />
                  <Text style={{flex: 2, marginLeft: 10, color: '#fff'}}>
                    {translate('common.edit')}
                  </Text>
                </View>
              }
            />
          )}
          <MenuItem
            icon={() => (
              <FontAwesome name={'trash'} size={20} color={Colors.white} />
            )}
            onPress={() => {
              onDelete(selectedMessageId);
              // closeMenu();
              this.hideMenu();
            }}
            // title={translate('common.delete')}
            // titleStyle={{marginLeft: -25, color: Colors.white}}
            customComponent={
              <View style={{flex: 1, flexDirection: 'row', margin: 15}}>
                <FontAwesome5
                  name={'trash'}
                  size={20}
                  color={Colors.white}
                  style={{flex: 1}}
                />
                <Text style={{flex: 2, marginLeft: 10, color: '#fff'}}>
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
                <View style={{flex: 1, flexDirection: 'row', margin: 15}}>
                  <FontAwesome5
                    name={'minus-circle'}
                    size={20}
                    color={Colors.white}
                    style={{flex: 1}}
                  />
                  <Text style={{flex: 2, marginLeft: 10, color: '#fff'}}>
                    {translate('common.unsend')}
                  </Text>
                </View>
              }
            />
          )}
          {message.msg_type === 'text' && (
            <MenuItem
              // icon={() => (
              //   <FontAwesome5 name={'copy'} size={20} color={Colors.white} />
              // )}
              onPress={() => {
                this.onCopy(message.message_body);
                // closeMenu();
                this.hideMenu();
              }}
              // title={translate('common.copy')}
              // titleStyle={{marginLeft: -25, color: Colors.white}}
              customComponent={
                <View style={{flex: 1, flexDirection: 'row', margin: 15}}>
                  <FontAwesome5
                    name={'copy'}
                    size={20}
                    color={Colors.white}
                    style={{flex: 1}}
                  />
                  <Text style={{flex: 2, marginLeft: 10, color: '#fff'}}>
                    {translate('common.copy')}
                  </Text>
                </View>
              }
            />
          )}
          {message.msg_type !== 'text' && (
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
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginVertical: 5,
                    padding: message.msg_type !== 'text' && 10,
                  }}>
                  <FontAwesome5
                    name={'download'}
                    size={20}
                    color={Colors.white}
                  />
                  <Text style={{marginLeft: 10, color: '#fff'}}>
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
    marginBottom: 5,
    // marginTop: 10
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
    // borderLeftColor: Colors.gradient_3,
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
});

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageBubble);
