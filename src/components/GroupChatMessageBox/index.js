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
import { isEqual } from 'lodash';

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
    this.props.message.type === 'image' &&
      this.props.message.text && this.isPortrait(this.props.message.text);
  }

  callBlinking = (id) => {
    console.log('blink bubble id',id);
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
              this.props.onMessageTranslateClose(this.props.message);
            }}>
            <FontAwesome name="times-circle" color={Colors.gray_dark} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  shouldComponentUpdate(nextProps, nextState){
    if (
      !isEqual(this.props.message, nextProps.message) ||
      !isEqual(this.props.audioPlayingId, nextProps.audioPlayingId) ||
      !isEqual(this.props.perviousPlayingAudioId, nextProps.perviousPlayingAudioId) ||
      !isEqual(this.props.isMultiSelect, nextProps.isMultiSelect) ||
      !isEqual(this.props.isRead, nextProps.isRead)
    ) {
      return true;
    } else if (!isEqual(this.state, nextState)) {
      return true;
    }
    return false;
  }

  render() {
    const {longPressMenu, selectedMessageId} = this.state;
    const {
      message,
      isRead,
      onMessageReply,
      onDelete,
      onUnSend,
      onMessageTranslate,
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

    if (!message.text && !message.is_unsent) {
      return null;
    }

    // if (!message.text) {
    //   return null;
    // }

    if (closeMenu) {
      this._closeMenu();
    }

    const animatedStyle = {
      opacity: this.state.animation,
    };

    return !message.isMyMessage ? (
      <Animated.View style={[animatedStyle]}>
        <View
          style={[
            styles.container,
            styles.containerJustification,
            {
              maxWidth:
                message.type === 'text'
                  ? isMultiSelect
                    ? width * 0.6
                    : width * 0.67
                  : message.type === 'image'
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
                onPress={this.navigateToUserProfile.bind(this,message.user_by.id)}>
                <Image
                  source={message.user_by.picture}
                  style={styles.senderAvatar}
                />
              </TouchableOpacity>
              <View>
                <Text style={styles.senderUsername}>
                  {message.user_by.name}
                </Text>
                <View style={styles.chatContentContainer}>
                  <View
                    style={
                      message.type !== 'image'
                        ? {}
                        : {maxWidth: width - normalize(80)}
                    }>
                    <GroupChatMessageBubble
                      ref={(view) => {
                        this[`bubble_box_${message.id}`] = view;
                      }}
                      message={message}
                      onMessageReply={onMessageReply}
                      openMenu={this._openMenu}
                      closeMenu={this._closeMenu}
                      selectedMessageId={selectedMessageId}
                      onMessageTranslate={onMessageTranslate}
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
                      addFriendByReferralCode={this.props.addFriendByReferralCode}
                      setActiveTimelineTab={this.props.setActiveTimelineTab}
                      setSpecificPostId={this.props.setSpecificPostId}
                      userData={this.props.userData}
                    />
                  </View>
                  <View style={styles.time}>
                    {/*<Text style={styles.statusText}>{status}</Text>*/}
                    <Text style={styles.statusText}>
                      {message.time}
                    </Text>
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
                message.type === 'text'
                  ? isMultiSelect
                    ? width * 0.8
                    : width * 0.9
                  : message.type === 'image'
                  ? isMultiSelect
                    ? width - 40
                    : width
                  : width * 0.75,
            },
            message.type === 'image'
              ? styles.imageContainer
              : styles.ifNotImageContainer,
          ]}>
          <View
            style={[
              message.type === 'image'
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
                  {message.time}
                </Text>
              </View>
              {/* ) : null} */}
              <View
                style={
                  message.type !== 'image'
                    ? {}
                    : {maxWidth: width - normalize(60)}
                }>
                <GroupChatMessageBubble
                  ref={(view) => {
                    // console.log(`bubble_box_${message.msg_id}`);
                    this[`bubble_box_${message.id}`] = view;
                  }}
                  message={message}
                  onMessageReply={onMessageReply}
                  // onMessagePress={this.onMessagePress.bind(this)}
                  longPressMenu={longPressMenu}
                  openMenu={this._openMenu}
                  closeMenu={this._closeMenu}
                  selectedMessageId={selectedMessageId}
                  onMessageTranslate={onMessageTranslate}
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
                  addFriendByReferralCode={this.props.addFriendByReferralCode}
                  setActiveTimelineTab={this.props.setActiveTimelineTab}
                  setSpecificPostId={this.props.setSpecificPostId}
                  userData={this.props.userData}
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
