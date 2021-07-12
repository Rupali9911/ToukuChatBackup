import linkify from 'linkify-it';
import React, {Component} from 'react';
import {
  Clipboard,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import OpenFile from 'react-native-doc-viewer';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import HyperLink from 'react-native-hyperlink';
import ImageView from 'react-native-image-viewing';
import {Divider} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import Menu from '../../components/Menu/Menu';
import MenuItem from '../../components/Menu/MenuItem';
import Toast from '../../components/Toast';
import {
  Colors,
  Environment,
  EnvironmentStage,
  Fonts,
  registerUrl,
  registerUrlStage,
} from '../../constants';
import {staging} from '../../helpers/api';
import NavigationService from '../../navigation/NavigationService';
import {addFriendByReferralCode} from '../../redux/reducers/friendReducer';
import {translate} from '../../redux/reducers/languageReducer';
import {
  setActiveTimelineTab,
  setSpecificPostId,
} from '../../redux/reducers/timelineReducer';
import {
  checkDeepLinkUrl,
  getChannelIdAndReferral,
  getUserName,
} from '../../utils';
import AudioPlayerCustom from '../AudioPlayerCustom';
import LinkPreviewComponent from '../LinkPreviewComponent';
import RoundedImage from '../RoundedImage';
import ScalableImage from '../ScalableImage';
import VideoPlayerCustom from '../VideoPlayerCustom';
import VideoThumbnailPlayer from '../VideoThumbnailPlayer';
import MediaGridList from '../MediaGridList';
import styles from './styles';
import NormalImage from '../NormalImage';
import GifImage from '../GifImage';
import {
  realm
} from '../../storage/Service';

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
      message: this.props.message
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

  async componentDidMount() {
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

    if(!this.props.isChannel && this.props.message.id){
      this.resultObject = realm.objectForPrimaryKey(
        'chat_conversation_friend',
        this.props.message.id
      );
      if(this.resultObject){
        this.resultObject.addListener((chat,changes)=>{
          // console.log('chat changes',changes,chat);
          this.setState({message: chat});
        });
      }
    }else if(this.props.message.id && this.props.isChannel){
      this.resultObject = realm.objectForPrimaryKey(
        'chat_conversation',
        this.props.message.id
      );
      if(this.resultObject){
        this.resultObject.addListener((chat,changes)=>{
          // console.log('chat changes',changes,chat);
          this.setState({message: chat});
        });
      }
    }
  }

  componentWillUnmount() {
    //this.eventEmitter.removeListener();
    // this.resultObject && this.resultObject.removeListener((chat,changes)=>{
    //   console.log('chat changes',changes,chat);
    // });
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

  navigateToNotes = () => {
    NavigationService.navigate('FriendNotes', {isNotes: true});
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
        if (checkDeepLinkUrl(item.url)) {
          return null;
        }
        return <View style={styles.linkPreviewContainer}>
          <LinkPreviewComponent text={item.text} url={item.url} />
        </View>
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
      this.props.setActiveTimelineTab('following');
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

  renderMemoText = (message) => {
    let update_text = '';
    if (message && message.msg_type === 'update') {
      let user_id = '';
      let text = '';
      let action = '';

      let split_txt = message.message_body.split(',');
      if (split_txt.length > 0) {
        user_id = split_txt[0].trim();
        action = split_txt[1].trim();
        text = split_txt[2].trim();
      }

      let update_by =
        message.from_user.id == this.props.userData.id
          ? translate('pages.xchat.you')
          : getUserName(message.from_user.id) ||
            message.from_user.display_name ||
            message.from_user.username;
      // let update_by = user_id == this.props.userData.id ? translate('pages.xchat.you') : getUserName(user_id);
      // let update_to = update_obj.user_id == this.props.userData.id ? translate('pages.xchat.you') : getUserName(update_obj.user_id) || update_obj.user_name;
      // console.log('update_to',update_obj);

      update_text = text;

      return {update_text, update_by};
    }
  };

  renderMemoMedia = (media) => {
    return (
      <MediaGridList media={media} />
      // <></>
    );
  };

  renderDisplayNameText = (text) => {
    const {isChannel, message, UserDisplayName} = this.props;
    if (isChannel) {
      if (text.includes('{Display Name}')) {
        let update_txt = text.replace(/{Display Name}/g, UserDisplayName);
        return update_txt;
      } else {
        return text;
      }
    } else {
      return text;
    }
  };

  onMessageLongPress = () => {
    const {message, onMessagePress} = this.props;
    console.log('On Long Press tapped');
    onMessagePress(message.id);
    this.showMenu();
  }

  onMessageClick = () => {
    const {message} = this.state;
    if(message.msg_type === 'update') {
      this.navigateToNotes()
    }
    else if (message.msg_type === 'doc') {
      this.onDocumentPress(message.message_body)
    }
    // else if (message.msg_type === 'image'){
    //   if(message.hyperlink){
    //     this.checkUrlAndNavigate(message.hyperlink)
    //   }else{
    //     this.onImagePress(
    //       message.thumbnail === ''
    //         ? message.message_body
    //         : message.thumbnail,
    //     );
    //   }
    // }
  }

  menuRef = (ref) => {
    this._menu = ref;
  }

  onAudioPlay = () => {
    this.props.onMediaPlay &&
      this.props.onMediaPlay(true);
  }

  onAudioPause = () => {
    this.props.onMediaPlay &&
      this.props.onMediaPlay(false);
  }

  render() {
    const {
      // message,
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
    const {showImage, images, message} = this.state;
    const msgTime = new Date(message.created);
    const isEditable = new Date(msgTime);

    isEditable.setDate(isEditable.getDate() + 1);

    if (!message.message_body && !message.is_unsent) {
      return null;
    }

    const imageActionContainer = [
      {
        paddingHorizontal:
          message.msg_type === 'update'
            ? 0
            : message.msg_type === 'image'
            ? message.message_body && message.message_body.includes('.giphy.com/media/') && message.reply_to == null ? 0 : 8
            : 10,
        paddingVertical: message.msg_type === 'image' ? message.message_body && message.message_body.includes('.giphy.com/media/') && message.reply_to == null ? 0 : 8 : 10,
      },
      styles.imageActionContainer,
    ];

    return (
      <View>
        <Menu
          ref={this.menuRef}
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
                  {message.hyperlink || (message.msg_type === 'image' && message.message_body && message.message_body.includes('.giphy.com/media/')) && message.reply_to == null ? null : (
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
                            message.message_body && message.message_body.includes('.giphy.com/media/') && message.reply_to == null ? {} : styles.imageMessage,
                              {
                                borderRadius,
                                paddingHorizontal:
                                  message.msg_type === 'update'
                                    ? 0
                                    : message.msg_type === 'image'
                                    ? message.message_body && message.message_body.includes('.giphy.com/media/') && message.reply_to == null ? 0 : 8
                                    : 10,
                                paddingVertical:
                                  message.msg_type === 'image' ? message.message_body && message.message_body.includes('.giphy.com/media/') && message.reply_to == null ? 0 : 8 : 10,
                              },
                            ],
                        message.msg_type === 'audio' && styles.audioMessage,
                      ]}
                      onLongPress={this.onMessageLongPress}
                      onPress={this.onMessageClick}>
                      {message.reply_to &&
                        this.renderReplyMessage(message, false)}
                      {message.message_body && message.msg_type === 'image' ? (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onLongPress={this.onMessageLongPress}
                            onPress={this.onImagePress.bind(this,
                              message.thumbnail === ''
                                ? message.message_body
                                : message.thumbnail,
                            )
                            }>
                            {message.message_body.includes('.giphy.com/media/') ?
                              <GifImage src={message.thumbnail === null
                                ? message.message_body
                                : message.thumbnail}
                                isGif={message.message_body.includes('&ct=g')} />
                              : <ScalableImage
                                src={
                                  message.thumbnail === null
                                    ? message.message_body
                                    : message.thumbnail
                                }
                                isHyperlink={message.hyperlink}
                                borderRadius={message.hyperlink ? 0 : borderRadius}
                              />}
                          </TouchableOpacity>
                      ) : message.msg_type === 'video' ? (
                        <VideoPlayerCustom url={message.message_body} />
                      ) : message.msg_type === 'audio' ? (
                        <AudioPlayerCustom
                          audioPlayingId={audioPlayingId}
                          perviousPlayingAudioId={perviousPlayingAudioId}
                          onAudioPlayPress={onAudioPlayPress}
                          onPlay={this.onAudioPlay}
                          onPause={this.onAudioPause}
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
                      ) : message.msg_type && message.msg_type === 'update' ? (
                        <View>
                          <View style={styles.noteContainer}>
                            {message.media &&
                              message.media.length > 0 &&
                              this.renderMemoMedia(message.media)}
                            {this.renderMemoText(message).update_text.length >
                              0 && (
                              <Text style={styles.noteText} numberOfLines={3}>
                                {this.renderMemoText(message).update_text}
                              </Text>
                            )}
                          </View>
                          <View style={styles.noteDivider} />
                          <TouchableOpacity
                            style={styles.noteLink}
                            onPress={this.navigateToNotes}>
                            <Text style={styles.noteLinkText}>
                              {translate('pages.xchat.notes')}
                            </Text>
                            <FontAwesome
                              name={'angle-right'}
                              size={20}
                              color={Colors.black_light}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : this.isContainUrl(message.message_body) ? (
                        <TouchableOpacity
                          // onPress={() => this.openUrl(message.message_body)}
                          onLongPress={this.onMessageLongPress}>
                          <HyperLink
                            onPress={this.hyperlinkPressed}
                            onLongPress={this.onMessageLongPress}
                            linkStyle={styles.linkStyle}>
                            <Text style={styles.messageBody}>
                              {this.renderDisplayNameText(message.message_body)}
                            </Text>
                          </HyperLink>

                          {this.renderLinkMedia(message.message_body)}
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.messageBody}>
                          {this.renderDisplayNameText(message.message_body)}
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
                {message.msg_type === 'image' && message.message_body && message.message_body.includes('.giphy.com/media/') && message.reply_to == null ? null :
                (
                <View
                  style={[
                    styles.talkBubbleAbsoluteRight,
                    message.is_unsent && {borderLeftColor: Colors.gray},
                  ]}
                />
                )}
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
                      message.message_body && message.message_body.includes('.giphy.com/media/') && message.reply_to == null ? {} : styles.audioMessageStyle,
                      message.msg_type === 'audio' && styles.audioMessageWidth,
                    ]}>
                    <TouchableOpacity
                      disabled={isMultiSelect}
                      style={imageActionContainer}
                      onLongPress={this.onMessageLongPress}
                      onPress={this.onMessageClick}
                      activeOpacity={0.8}>
                      {message.reply_to &&
                        message.reply_to &&
                        this.renderReplyMessage(message, true)}
                      {message.message_body && message.msg_type === 'image' ? (
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onLongPress={this.onMessageLongPress}
                              onPress={this.onImagePress.bind(this,
                                      message.thumbnail === ''
                                        ? message.message_body
                                        : message.thumbnail,
                                    )
                              }>
                              {message.message_body.includes('.giphy.com/media/') ?
                                <GifImage src={message.thumbnail === null
                                  ? message.message_body
                                  : message.thumbnail}
                                  isGif={message.message_body.includes('&ct=g')} />
                                : <ScalableImage
                                  src={
                                    message.thumbnail === null
                                      ? message.message_body
                                      : message.thumbnail
                                  }
                                  isHyperlink={message.hyperlink}
                                  borderRadius={message.hyperlink ? 0 : borderRadius}
                                // isEmotion={true}
                                />}
                            </TouchableOpacity>
                      ) : message.msg_type === 'video' ? (
                        <VideoPlayerCustom url={message.message_body} />
                      ) : message.msg_type === 'audio' ? (
                        <AudioPlayerCustom
                          audioPlayingId={audioPlayingId}
                          perviousPlayingAudioId={perviousPlayingAudioId}
                          onAudioPlayPress={onAudioPlayPress}
                          onPlay={this.onAudioPlay}
                          onPause={this.onAudioPause}
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
                      ) : message.msg_type && message.msg_type === 'update' ? (
                        <View>
                          <View style={styles.noteContainer}>
                            {message.media &&
                              message.media.length > 0 &&
                              this.renderMemoMedia(message.media)}
                            {this.renderMemoText(message).update_text.length >
                              0 && (
                              <Text style={styles.noteText} numberOfLines={3}>
                                {this.renderMemoText(message).update_text}
                              </Text>
                            )}
                          </View>
                          <View style={styles.noteDivider} />
                          <TouchableOpacity
                            style={styles.noteLink}
                            onPress={this.navigateToNotes}>
                            <Text style={styles.noteLinkText}>
                              {translate('pages.xchat.notes')}
                            </Text>
                            <FontAwesome
                              name={'angle-right'}
                              size={20}
                              color={Colors.black_light}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : this.isContainUrl(message.message_body) ? (
                        <TouchableOpacity
                          // onPress={() => this.openUrl(message.message_body)}
                          onLongPress={this.onMessageLongPress}>
                          <HyperLink
                            onPress={this.hyperlinkPressed}
                            onLongPress={this.onMessageLongPress}
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

          {message.msg_type && message.msg_type !== 'update' && (
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
                    // style={styles.singleFlex}
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
          )}

          {isUser &&
            isEditable > new Date() &&
            message.msg_type === 'text' &&
            message.msg_type !== 'update' && (
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
                      // style={styles.singleFlex}
                    />
                    <Text style={styles.iconLabel}>
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
              <View style={styles.translateContainer}>
                <FontAwesome5
                  name={'trash'}
                  size={20}
                  color={Colors.white}
                  // style={styles.singleFlex}
                />
                <Text style={styles.iconLabel}>
                  {translate('common.delete')}
                </Text>
              </View>
            }
          />
          {isUser && isEditable > new Date() && message.msg_type !== 'update' && (
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
                    // style={styles.singleFlex}
                  />
                  <Text style={styles.iconLabel}>
                    {translate('common.unsend')}
                  </Text>
                </View>
              }
            />
          )}
          {message.msg_type === 'text' && message.msg_type !== 'update' && (
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
                    // style={styles.singleFlex}
                  />
                  <Text style={styles.iconLabel}>
                    {translate('common.copy')}
                  </Text>
                </View>
              }
            />
          )}
          {message.msg_type !== 'text' && message.msg_type !== 'update' && (
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
