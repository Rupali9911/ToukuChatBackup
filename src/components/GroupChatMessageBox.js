import React, {Component} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import GroupChatMessageBubble from './GroupChatMessageBubble';

import {Colors, Fonts} from '../constants';
import RoundedImage from './RoundedImage';
import {getAvatar, normalize} from '../utils';
import {translate} from '../redux/reducers/languageReducer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const {width, height} = Dimensions.get('window');

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

  callBlinking = (id) => {
    console.log('buuble_box', this[`bubble_box_${id}`], id);
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

  layoutChange = (event) => {
    var {x, y, width, height} = event.nativeEvent.layout;
    borderRadius = height / 2;
    if (height > 40) {
      borderRadius = height / 2;
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
    await Image.getSize(url, (width, height) => {
      this.setState({
        isPortrait: height > width,
      });
    });
  };

  renderTransltedMessage = () => {
    return (
      <View
        style={{
          minHeight: 40,
          backgroundColor: Colors.gray,
          borderRadius: 5,
          justifyContent: 'center',
          paddingHorizontal: 20,
          paddingVertical: 10,
          marginBottom: 15,
        }}>
        <Text
          style={{
            fontFamily: Fonts.light,
            fontSize: 14,
          }}>
          {this.props.translatedMessage}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Text
            style={{
              fontFamily: Fonts.extralight,
              fontSize: 12,
              color: Colors.gray_dark,
            }}>
            {translate('common.translatedMessage')}
          </Text>
          <TouchableOpacity
            style={{marginLeft: 10}}
            onPress={() => {
              this.props.onMessageTranslateClose();
            }}>
            <FontAwesome name="times-circle" color={Colors.gray_dark} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const {longPressMenu, selectedMessageId, isPortrait, bg_color} = this.state;
    const {
      message,
      isUser,
      time,
      isRead,
      onMessageReply,
      orientation,
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
      memberCount,
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
      message.message_body.text === null
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
            {
              maxWidth:
                message.message_body && message.message_body.type === 'text'
                  ? width * 0.77
                  : message.message_body &&
                    message.message_body.type === 'image'
                  ? width - 40
                  : width * 0.65,
              justifyContent: 'flex-start',
            },
          ]}>
          {/* <View
          style={[
            styles.container,
            {
              justifyContent: 'flex-start',
            },
          ]}> */}
          <View
            style={{
              alignItems: 'flex-start',
              marginVertical:
                message.message_body && message.message_body.type === 'image'
                  ? 0
                  : 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              {/* <RoundedImage
              source={getAvatar(message.sender_picture)}
              size={50}
              resizeMode={'cover'}
            /> */}
              <Image
                source={getAvatar(message.sender_picture)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  resizeMode: 'cover',
                  marginRight: 5,
                }}
              />
              <View
                style={{
                  alignItems: 'flex-end',
                  flexDirection:
                    message.message_body &&
                    message.message_body.type === 'image'
                      ? 'column'
                      : 'row',
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: normalize(9),
                      fontFamily: Fonts.regular,
                      color: Colors.primary,
                      textAlign: 'left',
                      marginStart: 10,
                      fontWeight: '300',
                    }}>
                    {message.sender_display_name}
                  </Text>
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
                  />
                </View>
                <View
                  style={{
                    marginHorizontal: '1.5%',
                    alignItems: 'center',
                    marginVertical:
                      message.message_body &&
                      message.message_body.type === 'image'
                        ? 0
                        : 15,
                    alignSelf: 'flex-end',
                    paddingBottom: 5,
                  }}>
                  {/*<Text style={styles.statusText}>{status}</Text>*/}
                  <Text style={styles.statusText}>{`${time.getHours()}:${
                    time.getMinutes() < 10
                      ? '0' + time.getMinutes()
                      : time.getMinutes()
                  }`}</Text>
                </View>
              </View>
            </View>
            {translatedMessageId &&
              message.msg_id === translatedMessageId &&
              this.renderTransltedMessage()}
          </View>
        </View>
      </Animated.View>
    ) : (
      <Animated.View style={[animatedStyle]}>
        <View
          style={[
            styles.container,
            {
              maxWidth:
                message.message_body && message.message_body.type === 'text'
                  ? width * 0.9
                  : message.message_body &&
                    message.message_body.type === 'image'
                  ? width
                  : width * 0.75,
            },
            message.message_body && message.message_body.type === 'image'
              ? {
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  paddingHorizontal: 0,
                }
              : {
                  alignItems: 'flex-end',
                  alignSelf: 'flex-end',
                },
          ]}>
          <View
            style={[
              message.message_body && message.message_body.type === 'image'
                ? {}
                : {
                    alignItems: 'flex-end',
                  },
            ]}>
            <View
              style={{
                flexDirection:
                  message.message_body && message.message_body.type === 'image'
                    ? 'column'
                    : 'row',
              }}>
              {message.message_body && message.message_body.type !== 'image' ? (
                <View
                  style={{
                    marginHorizontal: '1.5%',
                    alignItems: 'center',
                    marginVertical: 15,
                    alignSelf: 'flex-end',
                    paddingBottom: 5,
                  }}>
                  {isRead && (
                    <Text style={styles.statusText}>
                      {message.read_count &&
                      message.read_count >= memberCount - 1
                        ? translate('pages.xchat.read')
                        : translate('pages.xchat.read') +
                          ' - ' +
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
              ) : null}
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
              />
              {message.message_body && message.message_body.type === 'image' ? (
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
                      message.read_count >= memberCount - 1
                        ? translate('pages.xchat.read')
                        : translate('pages.xchat.read') +
                          ' - ' +
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
              ) : null}
            </View>
            {translatedMessageId &&
              message.msg_id === translatedMessageId &&
              this.renderTransltedMessage()}
          </View>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // maxWidth: width * 0.65,
    paddingHorizontal: '1.5%',
  },
  statusText: {
    color: Colors.dark_pink,
    fontFamily: Fonts.light,
    fontSize: normalize(8),
  },
});
