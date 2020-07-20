import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import ChatMessageBubble from './ChatMessageBubble';
import { Colors, Fonts } from '../constants';
import { translate } from '../redux/reducers/languageReducer';
import RoundedImage from './RoundedImage';
import { getAvatar } from '../utils';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const { width } = Dimensions.get('window');

export default class ChatMessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      longPressMenu: false,
      selectedMessageId: null,
      isPortrait: false,
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

  _openMenu = () => this.setState({ longPressMenu: true });

  _closeMenu = () => {
    if (this.state.longPressMenu) {
      this.setState({ longPressMenu: false });
    }
  };

  layoutChange = (event) => {
    var { x, y, width, height } = event.nativeEvent.layout;
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
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.light,
            fontSize: 14,
          }}
        >
          {this.props.translatedMessage}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.extralight,
              fontSize: 12,
              color: Colors.gray_dark,
            }}
          >
            {translate('common.translatedMessage')}
          </Text>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              this.props.onMessageTranslateClose();
            }}
          >
            <FontAwesome name="times-circle" color={Colors.gray_dark} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  render() {
    const { longPressMenu, selectedMessageId, isPortrait } = this.state;
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
    } = this.props;
    if (!message.message_body && !message.is_unsent) {
      return null;
    }

    if (closeMenu) {
      this._closeMenu();
    }
    return !isUser ? (
      <View
        style={[
          styles.container,
          {
            justifyContent: 'flex-start',
          },
        ]}
      >
        <View
          style={{
            alignItems: 'flex-start',
            marginVertical: 5,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            {/* <RoundedImage
              source={getAvatar(message.from_user.avatar)}
              size={50}
              resizeMode={'cover'}
            /> */}
            <Image
              source={getAvatar(message.from_user.avatar)}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                resizeMode: 'cover',
              }}
            />
            <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
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
              />
              <View
                style={{
                  marginHorizontal: '1.5%',
                  alignItems: 'center',
                  marginVertical: 15,
                  alignSelf: 'flex-end',
                  paddingBottom: 5,
                }}
              >
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
    ) : (
      <View>
        <View
          style={[
            styles.container,
            {
              alignItems: 'flex-end',
              alignSelf: 'flex-end',
            },
          ]}
        >
          <View
            style={{
              alignItems: 'flex-end',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  marginHorizontal: '1.5%',
                  alignItems: 'center',
                  marginVertical: 15,
                  alignSelf: 'flex-end',
                  paddingBottom: 5,
                }}
              >
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
              />
            </View>
            {translatedMessageId &&
              message.id === translatedMessageId &&
              this.renderTransltedMessage()}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxWidth: width * 0.65,
    paddingHorizontal: '3%',
  },
  statusText: {
    color: Colors.gradient_1,
    fontFamily: Fonts.light,
    fontSize: 9,
  },
});
