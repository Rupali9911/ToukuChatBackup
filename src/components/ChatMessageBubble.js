import linkify from 'linkify-it';
import React, {Component} from 'react';
import {
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
import HyperLink from 'react-native-hyperlink';
import ImageView from 'react-native-image-viewing';
import {Divider} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {CardStyleInterpolators} from 'react-navigation-stack';
import {connect} from 'react-redux';
import Menu from '../components/Menu/Menu';
import MenuItem from '../components/Menu/MenuItem';
import Toast from '../components/Toast';
import {
  Colors,
  Environment,
  EnvironmentStage,
  Fonts,
  registerUrl,
  registerUrlStage,
} from '../constants';
import {staging} from '../helpers/api';
import NavigationService from '../navigation/NavigationService';
import {addFriendByReferralCode} from '../redux/reducers/friendReducer';
import {translate} from '../redux/reducers/languageReducer';
import {
  setActiveTimelineTab,
  setSpecificPostId,
} from '../redux/reducers/timelineReducer';
import {getChannelIdAndReferral, getUserName, normalize} from '../utils';
import AudioPlayerCustom from './AudioPlayerCustom';
import LinkPreviewComponent from './LinkPreviewComponent';
import RoundedImage from './RoundedImage';
import ScalableImage from './ScalableImage';
import VideoPlayerCustom from './VideoPlayerCustom';
import VideoThumbnailPlayer from './VideoThumbnailPlayer';

let borderRadius = 20;

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

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

  renderReplyMessage = (message, isUser) => {
    const {currentChannel, isChannel} = this.props;
    let replyMessage = message.reply_to;
    // console.log('replyMessage', message)

    const replyMessageActionContainer = [
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
            style={replyMessageActionContainer}>
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
            <View>
              <View style={styles.replyUserTitleContainer}>
                <Text numberOfLines={2} style={{color: Colors.gradient_1}}>
                  {replyMessage.sender_id === this.props.userData.id
                    ? isChannel && isUser
                      ? translate('pages.xchat.you')
                      : translate('pages.xchat.you')
                    : isChannel
                    ? currentChannel.name
                    : getUserName(replyMessage.sender_id) ||
                      (replyMessage.display_name &&
                      replyMessage.display_name !== ''
                        ? replyMessage.display_name
                        : replyMessage.name)}
                </Text>
              </View>
              <View style={styles.replyMessageContainer}>
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
                  <>
                    <Text style={styles.mediaMessage}>
                      {replyMessage.message.split('/').pop().split('%2F').pop()}
                    </Text>
                    <View style={styles.mediaLabelContainer}>
                      <FontAwesome
                        name={'volume-up'}
                        size={15}
                        color={Colors.black_light}
                      />
                      <Text style={styles.mediaLabel}>Audio</Text>
                    </View>
                  </>
                ) : replyMessage.msg_type === 'doc' ? (
                  <>
                    <Text style={styles.mediaMessage}>
                      {replyMessage.message.split('/').pop().split('%2F').pop()}
                    </Text>
                    <View style={styles.mediaLabelContainer}>
                      <FontAwesome
                        name={'file-o'}
                        size={15}
                        color={Colors.black_light}
                      />
                      <Text style={styles.mediaLabel}>File</Text>
                    </View>
                  </>
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

  renderLinkMedia = (text) => {
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

  hyperlinkPressed = (url) => {
    let match_url = staging
      ? 'touku.angelium.net/invite/'
      : 'touku.net/invite/';
    if (url.includes(match_url)) {
      let params = getChannelIdAndReferral(url);
      console.log('params', params);
      NavigationService.navigate('ChannelInfo', {channelItem: params});
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
    if (invitationCode) {
      let data = {invitation_code: invitationCode};
      this.props.addFriendByReferralCode(data).then((res) => {
        console.log('addFriendByReferralCode response', res);
      });
    }
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

  render() {
    const {
      message,
      isUser,
      onMessageReply,
      onMessagePress,
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

    const imageActionContainer = [
      {
        paddingHorizontal: message.msg_type === 'image' ? 8 : 10,
        paddingVertical: message.msg_type === 'image' ? 8 : 10,
      },
      styles.imageActionContainer,
    ];

    return (
      <View>
        <Menu
          ref={(ref) => {
            this._menu = ref;
          }}
          style={styles.menuContainer}
          tabHeight={110}
          headerHeight={80}
          button={
            !isUser ? (
              <View
                style={[
                  styles.talkBubble,
                  message.hyperlink ? styles.talkBubbleContainer : {},
                ]}>
                <View style={styles.contentContainer}>
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
                        message.hyperlink
                          ? styles.hyperlinkMessage
                          : [
                              styles.imageMessage,
                              {
                                borderRadius,
                                paddingHorizontal:
                                  message.msg_type === 'image' ? 8 : 10,
                                paddingVertical:
                                  message.msg_type === 'image' ? 8 : 10,
                              },
                            ],
                        message.msg_type === 'audio' && styles.audioMessage,
                      ]}
                      onLongPress={() => {
                        console.log('On LOng Press tapped');
                        onMessagePress(message.id);
                        this.showMenu();
                      }}
                      onPress={() =>
                        message.msg_type === 'doc'
                          ? this.onDocumentPress(message.message_body)
                          : message.msg_type === 'image'
                          ? message.hyperlink
                            ? this.checkUrlAndNavigate(message.hyperlink)
                            : this.onImagePress(
                                message.thumbnail === ''
                                  ? message.message_body
                                  : message.thumbnail,
                              )
                          : null
                      }>
                      {message.reply_to &&
                        this.renderReplyMessage(message, false)}
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
                          onPlay={() => {
                            this.props.onMediaPlay &&
                              this.props.onMediaPlay(true);
                          }}
                          onPause={() => {
                            this.props.onMediaPlay &&
                              this.props.onMediaPlay(false);
                          }}
                          postId={message.id}
                          url={message.message_body}
                          isSmall={true}
                        />
                      ) : message.msg_type === 'doc' ? (
                        <>
                          <Text style={styles.docMessageBody}>
                            {message.message_body
                              .split('/')
                              .pop()
                              .split('%2')
                              .pop()}
                          </Text>
                          <View style={styles.mediaLabelContainer}>
                            <FontAwesome
                              name={'file-o'}
                              size={15}
                              color={Colors.black_light}
                            />
                            <Text style={styles.docMessage}>File</Text>
                          </View>
                        </>
                      ) : this.isContainUrl(message.message_body) ? (
                        <TouchableOpacity
                          // onPress={() => this.openUrl(message.message_body)}
                          onLongPress={(id) => {
                            onMessagePress(message.id);
                            this.showMenu();
                          }}>
                          <HyperLink
                            onPress={(url, text) => {
                              this.hyperlinkPressed(url);
                            }}
                            onLongPress={() => {
                              onMessagePress(message.id);
                              this.showMenu();
                            }}
                            linkStyle={styles.linkStyle}>
                            <Text style={styles.messageBody}>
                              {message.message_body}
                            </Text>
                          </HyperLink>

                          {this.renderLinkMedia(message.message_body)}
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.messageBody}>
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
                  message.msg_type === 'image'
                    ? styles.talkBubbleContainer
                    : {},
                ]}>
                {/* {message.msg_type === 'image' ? null :
                ( */}
                <View
                  style={[
                    styles.talkBubbleAbsoluteRight,
                    message.is_unsent && {borderLeftColor: Colors.gray},
                  ]}
                />
                {/* )} */}
                {message.is_unsent ? (
                  <View style={[styles.messageUnsentContainer, {borderRadius}]}>
                    <View style={styles.messageUnsentSubContainer}>
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
                      {
                        borderRadius,
                      },
                      styles.audioMessageStyle,
                      message.msg_type === 'audio' && styles.audioMessageWidth,
                    ]}>
                    <TouchableOpacity
                      disabled={isMultiSelect}
                      style={imageActionContainer}
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
                        this.renderReplyMessage(message, true)}
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
                          onPlay={() => {
                            this.props.onMediaPlay &&
                              this.props.onMediaPlay(true);
                          }}
                          onPause={() => {
                            this.props.onMediaPlay &&
                              this.props.onMediaPlay(false);
                          }}
                          postId={message.id}
                          url={message.message_body}
                          isSmall={true}
                        />
                      ) : message.msg_type === 'doc' ? (
                        <>
                          <Text style={styles.docMessageContainer}>
                            {message.message_body
                              .split('/')
                              .pop()
                              .split('%2F')
                              .pop()}
                          </Text>
                          <View style={styles.mediaLabelContainer}>
                            <FontAwesome
                              name={'file-o'}
                              size={15}
                              color={Colors.black_light}
                            />
                            <Text style={styles.docMessageLabel}>File</Text>
                          </View>
                        </>
                      ) : this.isContainUrl(message.message_body) ? (
                        <TouchableOpacity
                          // onPress={() => this.openUrl(message.message_body)}
                          onLongPress={(id) => {
                            onMessagePress(message.id);
                            this.showMenu();
                          }}>
                          <HyperLink
                            onPress={(url, text) => {
                              this.hyperlinkPressed(url);
                            }}
                            onLongPress={() => {
                              onMessagePress(message.id);
                              this.showMenu();
                            }}
                            linkStyle={styles.linkStyle}>
                            <Text style={styles.hyperlinkText}>
                              {message.message_body}
                            </Text>
                          </HyperLink>

                          {this.renderLinkMedia(message.message_body)}
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.hyperlinkText}>
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
                <View style={styles.translateContainer}>
                  <FontAwesome5
                    name={'language'}
                    size={20}
                    color={Colors.white}
                  />
                  <Text style={styles.translateText}>
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
              <View style={styles.translateContainer}>
                <FontAwesome5
                  style={styles.singleFlex}
                  name={'reply'}
                  size={20}
                  color={Colors.white}
                />
                <Text style={styles.iconLabel}>
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
                <View style={styles.translateContainer}>
                  <FontAwesome5
                    name={'pencil-alt'}
                    size={20}
                    color={Colors.white}
                    style={styles.singleFlex}
                  />
                  <Text style={styles.iconLabel}>
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
              <View style={styles.translateContainer}>
                <FontAwesome5
                  name={'trash'}
                  size={20}
                  color={Colors.white}
                  style={styles.singleFlex}
                />
                <Text style={styles.iconLabel}>
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
                <View style={styles.translateContainer}>
                  <FontAwesome5
                    name={'minus-circle'}
                    size={20}
                    color={Colors.white}
                    style={styles.singleFlex}
                  />
                  <Text style={styles.iconLabel}>
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
                <View style={styles.translateContainer}>
                  <FontAwesome5
                    name={'copy'}
                    size={20}
                    color={Colors.white}
                    style={styles.singleFlex}
                  />
                  <Text style={styles.iconLabel}>
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
                  style={[
                    styles.downloadContainer,
                    {padding: message.msg_type !== 'text' && 10},
                  ]}>
                  <FontAwesome5
                    name={'download'}
                    size={20}
                    color={Colors.white}
                  />
                  <Text style={styles.translateText}>
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
  replyMessageActionContainer: {
    padding: 5,
    width: '100%',
    borderRadius: 5,
    marginBottom: 5,
    flexDirection: 'row',
  },
  replyUserTitleContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyMessageContainer: {
    flex: 7,
    justifyContent: 'center',
    width: '100%',
  },
  mediaMessage: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: Fonts.light,
  },
  mediaLabelContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  mediaLabel: {
    color: Colors.dark_gray,
    fontSize: 13,
    marginLeft: 5,
    fontFamily: Fonts.light,
  },
  menuContainer: {
    marginTop: 25,
    marginLeft: -20,
    backgroundColor: Colors.gradient_3,
    opacity: 0.9,
  },
  talkBubbleContainer: {
    marginVertical: 5,
  },
  contentContainer: {
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
  hyperlinkMessage: {
    marginLeft: -15,
  },
  imageMessage: {
    minHeight: 40,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  audioMessage: {
    minWidth: '100%',
  },
  docMessageBody: {
    fontFamily: Fonts.regular,
    fontWeight: '300',
    fontSize: 15,
  },
  docMessage: {
    color: Colors.dark_gray,
    marginLeft: 5,
    fontFamily: Fonts.regular,
    fontWeight: '300',
    fontSize: 15,
  },
  linkStyle: {
    color: Colors.link_color,
    textDecorationLine: 'underline',
  },
  messageBody: {
    fontFamily: Fonts.regular,
    fontWeight: '400',
    fontSize: Platform.isPad ? normalize(7.5) : normalize(12),
  },
  messageUnsentContainer: {
    minHeight: 40,
    backgroundColor: Colors.gray,
  },
  messageUnsentSubContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  audioMessageStyle: {
    minHeight: 40,
    backgroundColor: Colors.pink_chat,
  },
  audioMessageWidth: {
    minWidth: '100%',
  },
  imageActionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  docMessageContainer: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: '300',
    fontFamily: Fonts.regular,
  },
  docMessageLabel: {
    color: Colors.dark_gray,
    marginLeft: 5,
    fontSize: 15,
    fontWeight: '300',
    fontFamily: Fonts.regular,
  },
  hyperlinkText: {
    color: Colors.black,
    fontSize: Platform.isPad ? normalize(7.5) : normalize(12),
    fontWeight: '300',
    fontFamily: Fonts.regular,
  },
  translateContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 15,
  },
  translateText: {
    marginLeft: 10,
    color: '#fff',
  },
  singleFlex: {
    flex: 1,
  },
  iconLabel: {
    flex: 2,
    marginLeft: 10,
    color: '#fff',
  },
  downloadContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 5,
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageBubble);
