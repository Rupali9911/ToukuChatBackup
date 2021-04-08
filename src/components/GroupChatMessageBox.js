import React, {Component} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import GroupChatMessageBubble from './GroupChatMessageBubble';
import {Colors, Fonts} from '../constants';
import RoundedImage from './RoundedImage';
import {getAvatar, normalize, getUserName} from '../utils';
import {translate} from '../redux/reducers/languageReducer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationService from "../navigation/NavigationService";
import {getUserFriendByUserId} from "../storage/Service";
import {store} from "../redux/store";
import {setCurrentFriend} from "../redux/reducers/friendReducer";
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

  navigateToUserProfile = (sender_id) =>{
      let friendObj = getUserFriendByUserId(sender_id);
      if (friendObj.length > 0) {
          console.log('friendObj[0]', friendObj[0])
          let friend = JSON.parse(JSON.stringify(friendObj[0]));
          store.dispatch(setCurrentFriend(friend));
          NavigationService.navigate('FriendNotes');
      }else{
          NavigationService.navigate('FriendNotes', {id: sender_id});
      }
  }

  renderTransltedMessage = (msg) => {
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
          {/* {this.props.translatedMessage} */}
          {msg}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Text
            style={{
              fontFamily: Fonts.regular,
              fontSize: 12,
              color: Colors.gray_dark,
            }}>
            {translate('common.translatedMessage')}
          </Text>
          <TouchableOpacity
            style={{marginLeft: 10}}
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
                  ? isMultiSelect
                    ? width * 0.60
                    : width * 0.67
                  : message.message_body &&
                    message.message_body.type === 'image'
                    ? isMultiSelect
                      ? width - 90
                      : width - 50
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
              // marginVertical:
              //   message.message_body && message.message_body.type === 'image'
              //     ? 0
              //     : 2,
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
                <TouchableOpacity
                    onPress={() => {
                        //console.log('message', message)
                       this.navigateToUserProfile(message.sender_id)
                    }}>
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
                </TouchableOpacity>
              <View>
                <Text
                  style={{
                    fontSize: Platform.isPad ? normalize(5.5) : normalize(9),
                    fontFamily: Fonts.regular,
                    color: Colors.primary,
                    textAlign: 'left',
                    marginStart: 10,
                    fontWeight: '300',
                  }}>
                  {getUserName(message.sender_id) || message.sender_display_name}
                </Text>
                <View
                style={{
                  alignItems: 'flex-end',
                  flexDirection: 'row',
                    // message.message_body &&
                    // message.message_body.type === 'image'
                    //   ? 'column'
                    //   : 'row',
                }}>
                  <View style={
                    message.message_body && message.message_body.type !== 'image' ? {} : { maxWidth: width - normalize(80) }
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
                <View
                  style={{
                    // marginHorizontal: '1.5%',
                    alignItems: 'center',
                    // marginVertical:
                    //   message.message_body &&
                    //   message.message_body.type === 'image'
                    //     ? 0
                    //     : 15,
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
            </View>
            {message.translated &&
              this.renderTransltedMessage(message.translated)}
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
              ? {
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  // paddingHorizontal: 0,
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
                flexDirection: 'row',
                  // message.message_body && message.message_body.type === 'image'
                  //   ? 'column'
                  //   : 'row',
              }}>
              {/* {message.message_body && message.message_body.type !== 'image' ? ( */}
                <View
                  style={{
                    marginHorizontal: '1.5%',
                    alignItems: 'center',
                    // marginTop: 15,
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
              {/* ) : null} */}
              <View style={
                message.message_body && message.message_body.type !== 'image' ? {} : { maxWidth: width - normalize(60) }
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
              this.renderTransltedMessage(message.translated)}
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
    fontSize: Platform.isPad ? normalize(5) : normalize(8),
    marginLeft: Platform.isPad ? 15 : 7,
  },
});
