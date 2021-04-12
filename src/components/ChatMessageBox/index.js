import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../../constants';
import NavigationService from '../../navigation/NavigationService';
import {translate} from '../../redux/reducers/languageReducer';
import {globalStyles} from '../../styles';
import {getAvatar, normalize} from '../../utils';
import ChatMessageBubble from '../ChatMessageBubble';
import styles from './styles';

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
    await Image.getSize(url, (iWidth, height) => {
      this.setState({
        isPortrait: height > iWidth,
      });
    });
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
            style={styles.translateMessageActionContainer}
            onPress={() => {
              this.props.onMessageTranslateClose(this.props.message.id);
            }}>
            <FontAwesome name={'times-circle'} color={Colors.gray_dark} />
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
      is_read,
      onMessageReply,
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
      isMultiSelect,
      showOpenLoader,
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

    const hyperlinkStyle = [
      styles.hyperlinkIcon,
      {
        borderRadius: isChannel ? 0 : 20,
      },
    ];

    return !isUser ? (
      <Animated.View style={[animatedStyle]}>
        <View
          style={[
            styles.container,
            {
              maxWidth:
                message.msg_type === 'text'
                  ? isMultiSelect
                    ? width * 0.6
                    : width * 0.67
                  : message.msg_type === 'image'
                  ? isMultiSelect
                    ? width - 90
                    : width - 50
                  : width * 0.65,
            },
            styles.containerWidth,
          ]}>
          <View style={styles.subContainer}>
            <View style={styles.row}>
              {/* <RoundedImage
              source={getAvatar(message.from_user.avatar)}
              size={50}
              resizeMode={'cover'}
            /> */}
              <View>
                <TouchableOpacity
                  onPress={() => {
                    if (isChannel) {
                      NavigationService.navigate('ChannelInfo');
                    } else {
                      NavigationService.navigate('FriendNotes');
                    }
                  }}>
                  {isChannel &&
                  (currentChannel.channel_picture == null ||
                    currentChannel.channel_picture === '') ? (
                    message.hyperlink ? null : (
                      <LinearGradient
                        start={{x: 0.1, y: 0.7}}
                        end={{x: 0.5, y: 0.2}}
                        locations={[0.1, 0.6, 1]}
                        colors={[
                          Colors.gradient_1,
                          Colors.gradient_2,
                          Colors.gradient_3,
                        ]}
                        style={[
                          styles.squareImage,
                          styles.linearGradientStyle,
                        ]}>
                        <Text
                          style={[
                            globalStyles.normalRegularText15,
                            styles.channelName,
                          ]}>
                          {currentChannel.name &&
                          currentChannel.name.indexOf(' ') === -1
                            ? currentChannel.name.charAt(0).toUpperCase()
                            : currentChannel.name.charAt(0).toUpperCase() +
                              currentChannel.name
                                .charAt(currentChannel.name.indexOf(' ') + 1)
                                .toUpperCase()}
                          {/* {secondUpperCase} */}
                        </Text>
                      </LinearGradient>
                    )
                  ) : message.hyperlink ? null : (
                    <Image
                      source={
                        isChannel
                          ? getAvatar(currentChannel.channel_picture)
                          : getAvatar(message.from_user.avatar)
                      }
                      style={hyperlinkStyle}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.imageMessageContainer}>
                <View
                  style={
                    message.msg_type !== 'image'
                      ? {}
                      : {maxWidth: width - normalize(80)}
                  }>
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
                    showOpenLoader={showOpenLoader}
                    isMultiSelect={isMultiSelect}
                    currentChannel={currentChannel}
                    onMediaPlay={this.props.onMediaPlay}
                  />
                </View>
                <View style={styles.statusContainer}>
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
            {message.translated &&
              this.renderTranslatedMessage(message.translated)}
          </View>
        </View>
      </Animated.View>
    ) : (
      <Animated.View style={animatedStyle}>
        <View>
          <View
            style={[
              styles.containerSelf,
              {
                maxWidth:
                  message.msg_type === 'text'
                    ? isMultiSelect
                      ? width * 0.8
                      : width * 0.9
                    : message.msg_type === 'image'
                    ? isMultiSelect
                      ? width - 80
                      : width
                    : width * 0.75,
              },
              message.msg_type === 'image'
                ? styles.imageMessageTypeContainer
                : styles.notImageMessageTypeContainer,
            ]}>
            <View
              style={[
                message.msg_type !== 'image' &&
                  styles.notImageMessageTypeSubContainer,
              ]}>
              <View style={styles.row}>
                {/* {message.msg_type !== 'image' ? ( */}
                <View style={styles.readContainer}>
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
                {/* ) : null} */}
                <View
                  style={
                    message.msg_type !== 'image'
                      ? {}
                      : {maxWidth: width - normalize(60)}
                  }>
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
                    showOpenLoader={showOpenLoader}
                    isMultiSelect={isMultiSelect}
                    currentChannel={currentChannel}
                    onMediaPlay={this.props.onMediaPlay}
                  />
                </View>
                {/* {message.msg_type === 'image' ? (
                  <View
                    style={{
                      marginHorizontal: '1.5%',
                      alignItems: 'center',
                      // marginVertical: 15,
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
                ) : null} */}
              </View>
              {message.translated &&
                this.renderTranslatedMessage(message.translated)}
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }
}
