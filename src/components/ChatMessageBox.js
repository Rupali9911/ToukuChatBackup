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
import ChatMessageBubble from './ChatMessageBubble';
import {Colors, Fonts} from '../constants';
import {translate} from '../redux/reducers/languageReducer';
import {globalStyles} from '../styles';
import RoundedImage from './RoundedImage';
import {getAvatar, normalize} from '../utils';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
const {width} = Dimensions.get('window');

export default class ChatMessageBox extends Component {
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
    this.setState({
      selectedMessageId: id,
    });
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
    const {longPressMenu, selectedMessageId, isPortrait} = this.state;
    const {
      message,
      isUser,
      time,
      is_read,
      onMessageReply,
      orientation,
      isChannel,
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
      currentChannel,
      onReplyPress,
    } = this.props;

    if (!message.message_body && !message.is_unsent) {
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
            maxWidth: message.msg_type==='text' ? width * 0.80 : width * 0.65,
            justifyContent: 'flex-start',
          },
        ]}>
        <View
          style={{
            alignItems: 'flex-start',
            marginVertical: 5,
          }}>
          <View style={{flexDirection: 'row'}}>
            {/* <RoundedImage
              source={getAvatar(message.from_user.avatar)}
              size={50}
              resizeMode={'cover'}
            /> */}
            {isChannel &&
            (currentChannel.channel_picture == null ||
              currentChannel.channel_picture == '') ? (
              message.hyperlink?null:<LinearGradient
                start={{x: 0.1, y: 0.7}}
                end={{x: 0.5, y: 0.2}}
                locations={[0.1, 0.6, 1]}
                colors={[
                  Colors.gradient_1,
                  Colors.gradient_2,
                  Colors.gradient_3,
                ]}
                style={styles.squareImage}>
                <Text style={globalStyles.normalRegularText15}>
                  {currentChannel.name &&
                    currentChannel.name.charAt(0).toUpperCase()}
                  {/* {secondUpperCase} */}
                </Text>
              </LinearGradient>
            ) : (
              message.hyperlink?null:
              <Image
                source={
                  isChannel
                    ? getAvatar(currentChannel.channel_picture)
                    : getAvatar(message.from_user.avatar)
                }
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  resizeMode: 'cover',
                  marginTop: 15,
                }}
              />
            )}
            <View style={{alignItems: 'flex-end', flexDirection: message.hyperlink?'column':'row'}}>
              <ChatMessageBubble
                message={message}
                isUser={isUser}
                onMessageReply={onMessageReply}
                onMessagePress={(id) => this.onMessagePress(id)}
                longPressMenu={longPressMenu}
                openMenu={this._openMenu}
                closeMenu={this._closeMenu}
                selectedMessageId={selectedMessageId}
                isChannel={isChannel}
                onMessageTranslate={onMessageTranslate}
                onEditMessage={onEditMessage}
                onDownloadMessage={onDownloadMessage}
                translatedMessage={translatedMessage}
                translatedMessageId={translatedMessageId}
                onDelete={onDelete}
                onUnSend={onUnSend}
                audioPlayingId={audioPlayingId}
                perviousPlayingAudioId={perviousPlayingAudioId}
                onAudioPlayPress={onAudioPlayPress}
                onReplyPress={onReplyPress}
              />
              <View
                style={{
                  marginHorizontal: '1.5%',
                  alignItems: 'center',
                  marginVertical: message.hyperlink?0:15,
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
          {/* )} */}
          {translatedMessageId &&
            message.id === translatedMessageId &&
            this.renderTransltedMessage()}
        </View>
      </View>
      </Animated.View>
    ) : (
      <Animated.View style={[animatedStyle]}>
      <View>
        <View
          style={[
            styles.containerSelf,
            {
              maxWidth: message.msg_type === 'text' ? width * 0.93 : width * 0.75,
              alignItems: 'flex-end',
              alignSelf: 'flex-end',
            },
          ]}>
          <View
            style={{
              alignItems: 'flex-end',
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  marginHorizontal: '1.5%',
                  alignItems: 'center',
                  marginVertical: 15,
                  alignSelf: 'flex-end',
                  paddingBottom: 5,
                }}>
                {is_read && (
                  <Text style={styles.statusText}>
                    {translate('pages.xchat.read')}
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
              <ChatMessageBubble
                message={message}
                isUser={isUser}
                onMessageReply={onMessageReply}
                onMessagePress={(id) => this.onMessagePress(id)}
                longPressMenu={longPressMenu}
                openMenu={this._openMenu}
                closeMenu={this._closeMenu}
                selectedMessageId={selectedMessageId}
                isChannel={isChannel}
                onMessageTranslate={onMessageTranslate}
                onEditMessage={onEditMessage}
                onDownloadMessage={onDownloadMessage}
                translatedMessage={translatedMessage}
                translatedMessageId={translatedMessageId}
                onDelete={onDelete}
                onUnSend={onUnSend}
                audioPlayingId={audioPlayingId}
                perviousPlayingAudioId={perviousPlayingAudioId}
                onAudioPlayPress={onAudioPlayPress}
                onReplyPress={onReplyPress}
              />
            </View>
            {translatedMessageId &&
              message.id === translatedMessageId &&
              this.renderTransltedMessage()}
          </View>
        </View>
      </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // maxWidth: width * 0.65,
    paddingHorizontal: '3%',
  },
  containerSelf: {
    // maxWidth: width * 0.75,
    paddingHorizontal: '3%',
  },
  statusText: {
    color: Colors.dark_pink,
    fontFamily: Fonts.light,
    fontSize: normalize(8),
  },
  squareImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});
