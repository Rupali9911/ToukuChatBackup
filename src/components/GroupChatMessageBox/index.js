import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../../constants';
import NavigationService from '../../navigation/NavigationService';
import {setCurrentFriend} from '../../redux/reducers/friendReducer';
import {translate} from '../../redux/reducers/languageReducer';
import {store} from '../../redux/store';
import {getUserFriendByUserId} from '../../storage/Service';
import {getAvatar, getUserName, normalize} from '../../utils';
import GroupChatMessageBubble from '../GroupChatMessageBubble';
import styles from './styles';

const {width} = Dimensions.get('window');

export default class GroupChatMessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      longPressMenu: false,
      selectedMessageId: null,
      isPortrait: false,
      animation: new Animated.Value(1),
    };
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
    this.props.message.msg_type === 'image' &&
      this.props.message.message_body &&
      this.isPortrait(this.props.message.message_body);
  }

  callBlinking = () => {
    this.callBlinkAnimation();
    // this[`bubble_box_${id}`] && this[`bubble_box_${id}`].callBlinkAnimation();
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
    }, 2200);
    this.startAnimation();
    console.log('animation start');
  };

  _openMenu = () => this.setState({longPressMenu: true});

  _closeMenu = () => {
    if (this.state.longPressMenu) {
      this.setState({longPressMenu: false});
    }
  };

  onMessagePress = (id) => {
    this.setState({selectedMessageId: id});
    this._openMenu();
  };

  isPortrait = async (url) => {
    if (!url) {
      return;
    }
    await Image.getSize(url, (w, h) => {
      this.setState({
        isPortrait: h > w,
      });
    });
  };

  navigateToUserProfile = (sender_id) => {
    let friendObj = getUserFriendByUserId(sender_id);
    if (friendObj.length > 0) {
      console.log('friendObj[0]', friendObj[0]);
      let friend = JSON.parse(JSON.stringify(friendObj[0]));
      store.dispatch(setCurrentFriend(friend));
      NavigationService.navigate('FriendNotes');
    } else {
      NavigationService.navigate('FriendNotes', {id: sender_id});
    }
  };

  renderTranslatedMessage = (msg) => {
    return (
      <View style={styles.translatedMessageContainer}>
        <Text style={styles.translatedMessage}>
          {/* {this.props.translatedMessage} */}
          {msg}
        </Text>
        <View style={styles.translatedMessageSubContainer}>
          <Text style={styles.translatedMessageLabel}>
            {translate('common.translatedMessage')}
          </Text>
          <TouchableOpacity
            style={styles.translatedMessageIcon}
            onPress={() => {
              this.props.onMessageTranslateClose(this.props.message.msg_id);
            }}>
            <FontAwesome name="times-circle" color={Colors.gray_dark} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const {longPressMenu, selectedMessageId} = this.state;
    const {
      message,
      isUser,
      time,
      isRead,
      onMessageReply,
      onDelete,
      onUnSend,
      onMessageTranslate,
      translatedMessage,
      translatedMessageId,
      onEditMessage,
      onDownloadMessage,
      audioPlayingId,
      perviousPlayingAudioId,
      onAudioPlayPress,
      closeMenu,
      onReplyPress,
      groupMembers,
      isMultiSelect,
      showOpenLoader,
    } = this.props;

    if (!message.message_body && !message.is_unsent) {
      return null;
    }

    if (
      message.message_body &&
      message.message_body.text &&
      !message.message_body.text
    ) {
      return null;
    }

    if (closeMenu) {
      this._closeMenu();
    }

    const animatedStyle = {
      opacity: this.state.animation,
    };

    return !isUser ? (
      <Animated.View style={[animatedStyle]}>
        <View
          style={[
            styles.container,
            styles.containerJustification,
            {
              maxWidth:
                message.message_body && message.message_body.type === 'text'
                  ? isMultiSelect
                    ? width * 0.6
                    : width * 0.67
                  : message.message_body &&
                    message.message_body.type === 'image'
                  ? isMultiSelect
                    ? width - 90
                    : width - 50
                  : width * 0.65,
            },
          ]}>
          {/* <View
          style={[
            styles.container,
            {
              justifyContent: 'flex-start',
            },
          ]}> */}
          <View style={styles.contentContainer}>
            <View style={styles.row}>
              {/* <RoundedImage
              source={getAvatar(message.sender_picture)}
              size={50}
              resizeMode={'cover'}
            /> */}
              <TouchableOpacity
                onPress={() => {
                  console.log('message', message);
                  this.navigateToUserProfile(message.sender_id);
                }}>
                <Image
                  source={getAvatar(message.sender_picture)}
                  style={styles.senderAvatar}
                />
              </TouchableOpacity>
              <View>
                <Text style={styles.senderUsername}>
                  {getUserName(message.sender_id) ||
                    message.sender_display_name}
                </Text>
                <View style={styles.chatContentContainer}>
                  <View
                    style={
                      message.message_body &&
                      message.message_body.type !== 'image'
                        ? {}
                        : {maxWidth: width - normalize(80)}
                    }>
                    <GroupChatMessageBubble
                      ref={(view) => {
                        this[`bubble_box_${message.msg_id}`] = view;
                      }}
                      message={message}
                      isUser={isUser}
                      onMessageReply={onMessageReply}
                      onMessagePress={(msg_id) => this.onMessagePress(msg_id)}
                      longPressMenu={longPressMenu}
                      openMenu={this._openMenu}
                      closeMenu={this._closeMenu}
                      selectedMessageId={selectedMessageId}
                      onMessageTranslate={onMessageTranslate}
                      translatedMessage={translatedMessage}
                      translatedMessageId={translatedMessageId}
                      onDelete={onDelete}
                      onUnSend={onUnSend}
                      onEditMessage={onEditMessage}
                      onDownloadMessage={onDownloadMessage}
                      audioPlayingId={audioPlayingId}
                      perviousPlayingAudioId={perviousPlayingAudioId}
                      onAudioPlayPress={onAudioPlayPress}
                      onReplyPress={onReplyPress}
                      groupMembers={groupMembers}
                      showOpenLoader={showOpenLoader}
                      isMultiSelect={isMultiSelect}
                      onMediaPlay={this.props.onMediaPlay}
                    />
                  </View>
                  <View style={styles.time}>
                    {/*<Text style={styles.statusText}>{status}</Text>*/}
                    <Text style={styles.statusText}>{`${time.getHours()}:${
                      time.getMinutes() < 10
                        ? '0' + time.getMinutes()
                        : time.getMinutes()
                    }`}</Text>
                  </View>
                </View>
              </View>
            </View>
            {message.translated &&
              this.renderTranslatedMessage(message.translated)}
          </View>
        </View>
      </Animated.View>
    ) : (
      <Animated.View style={animatedStyle}>
        <View
          style={[
            styles.container,
            {
              maxWidth:
                message.message_body && message.message_body.type === 'text'
                  ? isMultiSelect
                    ? width * 0.8
                    : width * 0.9
                  : message.message_body &&
                    message.message_body.type === 'image'
                  ? isMultiSelect
                    ? width - 40
                    : width
                  : width * 0.75,
            },
            message.message_body && message.message_body.type === 'image'
              ? styles.imageContainer
              : styles.ifNotImageContainer,
          ]}>
          <View
            style={[
              message.message_body && message.message_body.type === 'image'
                ? {}
                : styles.ifNotImageSubContainer,
            ]}>
            <View style={styles.row}>
              {/* {message.message_body && message.message_body.type !== 'image' ? ( */}
              <View style={styles.dateSubContainer}>
                {isRead && (
                  <Text style={styles.statusText}>
                    {message.read_count &&
                      translate('pages.xchat.read') + '  ' + message.read_count}
                  </Text>
                )}
                <Text style={styles.statusText}>
                  {`${time.getHours()}:${
                    time.getMinutes() < 10
                      ? '0' + time.getMinutes()
                      : time.getMinutes()
                  }`}
                </Text>
              </View>
              {/* ) : null} */}
              <View
                style={
                  message.message_body && message.message_body.type !== 'image'
                    ? {}
                    : {maxWidth: width - normalize(60)}
                }>
                <GroupChatMessageBubble
                  ref={(view) => {
                    console.log(`bubble_box_${message.msg_id}`);
                    this[`bubble_box_${message.msg_id}`] = view;
                  }}
                  message={message}
                  isUser={isUser}
                  onMessageReply={onMessageReply}
                  onMessagePress={(msg_id) => this.onMessagePress(msg_id)}
                  longPressMenu={longPressMenu}
                  openMenu={this._openMenu}
                  closeMenu={this._closeMenu}
                  selectedMessageId={selectedMessageId}
                  onMessageTranslate={onMessageTranslate}
                  translatedMessage={translatedMessage}
                  translatedMessageId={translatedMessageId}
                  onDelete={onDelete}
                  onUnSend={onUnSend}
                  onEditMessage={onEditMessage}
                  onDownloadMessage={onDownloadMessage}
                  audioPlayingId={audioPlayingId}
                  perviousPlayingAudioId={perviousPlayingAudioId}
                  onAudioPlayPress={onAudioPlayPress}
                  onReplyPress={onReplyPress}
                  groupMembers={groupMembers}
                  showOpenLoader={showOpenLoader}
                  isMultiSelect={isMultiSelect}
                  onMediaPlay={this.props.onMediaPlay}
                />
              </View>
              {/* {message.message_body && message.message_body.type === 'image' ? (
                <View
                  style={{
                    marginHorizontal: '1.5%',
                    alignItems: 'center',
                    // marginVertical: 15,
                    alignSelf: 'flex-end',
                    paddingBottom: 5,
                  }}>
                  {isRead && (
                    <Text style={styles.statusText}>
                        {message.read_count &&
                        translate('pages.xchat.read') +
                        '  ' +
                        message.read_count}
                    </Text>
                  )}
                  <Text style={styles.statusText}>
                    {`${time.getHours()}:${
                      time.getMinutes() < 10
                        ? '0' + time.getMinutes()
                        : time.getMinutes()
                    }`}
                  </Text>
                </View>
              ) : null} */}
            </View>
            {message.translated &&
              this.renderTranslatedMessage(message.translated)}
          </View>
        </View>
      </Animated.View>
    );
  }
}
