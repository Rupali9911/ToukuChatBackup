import React, { Component, Fragment } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Clipboard,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Menu } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import OpenFile from 'react-native-doc-viewer';

import { Colors, Fonts, Images, Icons } from '../constants';
import { translate } from '../redux/reducers/languageReducer';
import ScalableImage from './ScalableImage';
import VideoPlayerCustom from './VideoPlayerCustom';
import AudioPlayerCustom from './AudioPlayerCustom';
import Toast from '../components/Toast';
let borderRadius = 20;
class ChatMessageBubble extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onCopy = (message) => {
    Clipboard.setString(message);
  };

  onDocumentPress = (url) => {
    if (Platform.OS === 'ios') {
      OpenFile.openDoc(
        [
          {
            url: url,
            fileNameOptional: 'test filename',
          },
        ],
        (error, url) => {
          if (error) {
            Toast.show({
              title: 'Touku',
              text: translate('common.somethingWentWrong'),
              type: 'primary',
            });
          } else {
            console.log(url);
          }
        }
      );
    } else {
      OpenFile.openDoc(
        [
          {
            url: url,
            fileName: 'sample',
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
          } else {
            console.log(url);
          }
        }
      );
    }
  };

  renderReplyMessage = (replyMessage) => {
    return (
      <View
        style={{
          backgroundColor: this.props.isUser ? '#FFDBE9' : Colors.gray,
          padding: 5,
          width: '100%',
          borderRadius: 5,
          marginBottom: 5,
        }}
      >
        <View
          style={{
            flex: 3,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text numberOfLines={2} style={{ color: Colors.gradient_1 }}>
            {replyMessage.sender_id === this.props.userData.id
              ? 'You'
              : replyMessage.name}
          </Text>
        </View>
        <View
          style={{
            flex: 7,
            justifyContent: 'center',
            width: '95%',
          }}
        >
          <Text numberOfLines={2} style={{ fontFamily: Fonts.extralight }}>
            {replyMessage.message}
          </Text>
        </View>
      </View>
    );
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
      onDelete,
      onUnSend,
      audioPlayingId,
      perviousPlayingAudioId,
      onAudioPlayPress,
    } = this.props;
    const msgTime = new Date(message.created);
    const isEditable = new Date(msgTime);

    isEditable.setDate(isEditable.getDate() + 1);

    if (!message.message_body && !message.is_unsent) {
      return null;
    }
    return (
      <Menu
        contentStyle={{
          backgroundColor: Colors.gradient_3,
          opacity: 0.9,
        }}
        visible={longPressMenu}
        onDismiss={closeMenu}
        anchor={
          !isUser ? (
            <View style={styles.talkBubble}>
              <View style={{ marginLeft: 5 }}>
                <View
                  style={[
                    styles.talkBubbleAbsoluteLeft,
                    message.is_unsent && { borderRightColor: Colors.gray },
                  ]}
                />
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
                    ]}
                  >
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 12,
                        fontFamily: Fonts.extralight,
                      }}
                    >
                      {translate('pages.xchat.messageUnsent')}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      {
                        minHeight: 40,
                        backgroundColor: Colors.white,
                        borderRadius: borderRadius,
                        justifyContent: 'center',
                        paddingHorizontal:
                          message.msg_type === 'image' ? 5 : 10,
                        paddingVertical: message.msg_type === 'image' ? 5 : 10,
                      },
                      message.msg_type === 'audio' && { minWidth: '100%' },
                    ]}
                    onLongPress={(id) => {
                      onMessagePress(message.id);
                    }}
                    onPress={() =>
                      message.msg_type === 'doc'
                        ? this.onDocumentPress(message.message_body)
                        : null
                    }
                  >
                    {message.reply_to &&
                      this.renderReplyMessage(message.reply_to)}
                    {message.msg_type === 'image' ? (
                      <ScalableImage
                        src={message.message_body}
                        borderRadius={borderRadius}
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
                            fontSize: 15,
                            fontFamily: Fonts.light,
                            fontWeight: '500',
                          }}
                        >
                          {message.message_body.split('/').pop()}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 5,
                          }}
                        >
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
                            }}
                          >
                            File
                          </Text>
                        </View>
                      </Fragment>
                    ) : (
                      <Text style={{ fontSize: 15, fontFamily: Fonts.light }}>
                        {message.message_body}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.talkBubble}>
              <View
                style={[
                  styles.talkBubbleAbsoluteRight,
                  message.is_unsent && { borderLeftColor: Colors.gray },
                ]}
              />
              {message.is_unsent ? (
                <View
                  style={[
                    {
                      minHeight: 40,
                      borderRadius: borderRadius,
                      backgroundColor: Colors.gray,
                    },
                  ]}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 12,
                        fontFamily: Fonts.extralight,
                      }}
                    >
                      {translate('pages.xchat.messageUnsent')}
                    </Text>
                  </View>
                </View>
              ) : (
                <LinearGradient
                  colors={[
                    Colors.gradient_3,
                    Colors.gradient_2,
                    Colors.gradient_1,
                  ]}
                  style={[
                    {
                      minHeight: 40,
                      borderRadius: borderRadius,
                    },
                    message.msg_type === 'audio' && { minWidth: '100%' },
                  ]}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      paddingHorizontal: message.msg_type === 'image' ? 5 : 10,
                      paddingVertical: message.msg_type === 'image' ? 5 : 10,
                    }}
                    onLongPress={() => {
                      onMessagePress(message.id);
                    }}
                    onPress={() =>
                      message.msg_type === 'doc'
                        ? this.onDocumentPress(message.message_body)
                        : null
                    }
                    activeOpacity={0.8}
                  >
                    {message.reply_to &&
                      this.renderReplyMessage(message.reply_to)}
                    {message.msg_type === 'image' ? (
                      <ScalableImage
                        src={message.message_body}
                        borderRadius={borderRadius}
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
                            color: Colors.white,
                            fontSize: 15,
                            fontWeight: '500',
                          }}
                        >
                          {message.message_body.split('/').pop()}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 5,
                          }}
                        >
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
                            }}
                          >
                            File
                          </Text>
                        </View>
                      </Fragment>
                    ) : (
                      <Text style={{ color: Colors.white, fontSize: 15 }}>
                        {message.message_body}
                      </Text>
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              )}
            </View>
          )
        }
      >
        {message.msg_type === 'text' && (
          <Menu.Item
            titleStyle={{ color: Colors.white }}
            icon={() => (
              <FontAwesome5 name={'language'} size={20} color={Colors.white} />
            )}
            onPress={() => {
              onMessageTranslate(message);
              closeMenu();
            }}
            title={translate('common.translate')}
            titleStyle={{ marginLeft: -25, color: Colors.white }}
          />
        )}
        {!isChannel && (
          <Menu.Item
            titleStyle={{ color: Colors.white }}
            icon={() => (
              <FontAwesome5 name={'language'} size={20} color={Colors.white} />
            )}
            onPress={() => {
              onMessageReply(selectedMessageId);
              closeMenu();
            }}
            title={translate('common.reply')}
            titleStyle={{ marginLeft: -25, color: Colors.white }}
          />
        )}
        {isUser && isEditable > new Date() && message.msg_type === 'text' && (
          <Menu.Item
            titleStyle={{ color: Colors.white }}
            icon={() => (
              <FontAwesome5
                name={'pencil-alt'}
                size={20}
                color={Colors.white}
              />
            )}
            onPress={() => {
              onEditMessage(message);
              closeMenu();
            }}
            title={translate('common.edit')}
            titleStyle={{ marginLeft: -25, color: Colors.white }}
          />
        )}
        <Menu.Item
          titleStyle={{ color: Colors.white }}
          icon={() => (
            <FontAwesome name={'trash'} size={20} color={Colors.white} />
          )}
          onPress={() => {
            onDelete(selectedMessageId);
            closeMenu();
          }}
          title={translate('common.delete')}
          titleStyle={{ marginLeft: -25, color: Colors.white }}
        />
        {isUser && isEditable > new Date() && (
          <Menu.Item
            titleStyle={{ color: Colors.white }}
            icon={() => (
              <FontAwesome5
                name={'minus-circle'}
                size={20}
                color={Colors.white}
              />
            )}
            onPress={() => {
              onUnSend(selectedMessageId);
              closeMenu();
            }}
            title={translate('common.unsend')}
            titleStyle={{ marginLeft: -25, color: Colors.white }}
          />
        )}
        {message.msg_type === 'text' && (
          <Menu.Item
            titleStyle={{ color: Colors.white }}
            icon={() => (
              <FontAwesome5 name={'copy'} size={20} color={Colors.white} />
            )}
            onPress={() => {
              this.onCopy(message.message_body);
              closeMenu();
            }}
            title={translate('common.copy')}
            titleStyle={{ marginLeft: -25, color: Colors.white }}
          />
        )}
        {message.msg_type !== 'text' && (
          <Menu.Item
            titleStyle={{ color: Colors.white }}
            icon={() => (
              <FontAwesome name={'download'} size={20} color={Colors.white} />
            )}
            onPress={() => {
              closeMenu();
            }}
            title={translate('pages.setting.download')}
            titleStyle={{ marginLeft: -25, color: Colors.white }}
          />
        )}
      </Menu>
    );
  }
}

const styles = StyleSheet.create({
  talkBubble: {
    justifyContent: 'flex-end',
    marginVertical: 15,
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
    borderLeftColor: Colors.gradient_3,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
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
    transform: [{ rotate: '90deg' }],
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
