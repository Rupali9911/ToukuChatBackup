import React, { Fragment, Component } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Clipboard,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Menu, Divider } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import OpenFile from 'react-native-doc-viewer';

import { Colors, Icons, Fonts, Images } from '../constants';
import { translate, setI18nConfig } from '../redux/reducers/languageReducer';
import ScalableImage from './ScalableImage';
import AudioPlayerCustom from './AudioPlayerCustom';
import VideoPlayerCustom from './VideoPlayerCustom';
import Toast from '../components/Toast';
import ImageView from "react-native-image-viewing";
let borderRadius = 20;

class GroupChatMessageBubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioPlayingId: null,
      perviousPlayingAudioId: null,
        showImage: false,
        images: null,
        animation : new Animated.Value(1),
    };
  }
    hideImage(){
        console.log('hideImage called')
        this.setState({showImage: false})
    }
    onImagePress= (url) => {
        let images = [{
            uri: url
        }]
        this.setState({showImage: true, images: images})
    }

  startAnimation=()=>{
    this.animInterval = setInterval(()=>{
      Animated.timing(this.state.animation, {
        toValue : 0,
        timing : 400,
        useNativeDriver: true,
      }).start(()=>{
        Animated.timing(this.state.animation,{
          toValue : 1,
          duration : 400,
          useNativeDriver: true,
        }).start();
      })
    },800);
  }

  callBlinkAnimation = () => {
    setTimeout(()=>{
      clearInterval(this.animInterval);
    },3200);
    this.startAnimation();
    console.log('animation start');
  }

  onCopy = (message) => {
    Clipboard.setString(message.text);
  };

  onUnSend = (selectedMessageId) => {
    this.props.onUnSend(selectedMessageId);
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
    // console.log('reply_render',replyMessage.message);
    if (replyMessage.message) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onReplyPress && this.props.onReplyPress(replyMessage.id);
        }}
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
              : replyMessage.display_name}
          </Text>
        </View>
        <View
          style={{
            flex: 7,
            justifyContent: 'center',
            width: '95%',
            marginTop: 5,
          }}
        >
          <Text numberOfLines={2} style={{ fontFamily: Fonts.extralight }}>
            {replyMessage.message}
          </Text>
        </View>
      </TouchableOpacity>
      );
    }
  };

  isContainUrl = (text) => {
    if(text==null)return;
    var urlRE = new RegExp(
      '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+'
    );
    const url = text.match(urlRE);
    return url;
  };

  openUrl = (text) => {
    if(text==null)return;
    var urlRE = new RegExp(
      '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+'
    );
    const url = text.match(urlRE);
    Linking.openURL(url[0]);
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
      selectedMessageId,
      onMessageTranslate,
      onDelete,
      onUnSend,
      onEditMessage,
      onDownloadMessage,
      audioPlayingId,
      perviousPlayingAudioId,
      onAudioPlayPress,
    } = this.props;
      const {showImage, images} = this.state
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

    const msgTime = new Date(message.timestamp);
    const isEditable = new Date(msgTime);

    isEditable.setDate(isEditable.getDate() + 1);

    const animatedStyle ={
      opacity : this.state.animation
    }

    return (
        <View>
      <Menu
        contentStyle={{
          backgroundColor: Colors.gradient_3,
          opacity: 0.9,
        }}
        visible={longPressMenu}
        onDismiss={closeMenu}
        anchor={
          !isUser ? (
            <Animated.View style={[styles.talkBubble,animatedStyle]}>
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
                          message.message_body.type === 'image' ? 5 : 10,
                        paddingVertical:
                          message.message_body.type === 'image' ? 5 : 10,
                      },
                      message.message_body.type === 'audio' && {
                        minWidth: '100%',
                      },
                    ]}
                    onLongPress={(msg_id) => {
                      onMessagePress(message.msg_id);
                    }}
                    onPress={() =>
                      message.message_body.type === 'doc'
                        ? this.onDocumentPress(message.message_body.text)
                          : message.message_body.type === 'image' ? this.onImagePress(message.message_body.text) : null
                    }
                  >
                    {message.reply_to &&
                      // Object.keys(message.reply_to).length !== 0 &&
                      // message.reply_to.constructor === Object &&
                      this.renderReplyMessage(message.reply_to)
                      }

                    {message.message_body.type === 'image' &&
                    message.message_body.text !== null ? (
                      <ScalableImage
                        src={message.message_body.text}
                        borderRadius={borderRadius}
                      />
                    ) : message.message_body.type === 'video' ? (
                      <VideoPlayerCustom url={message.message_body.text} />
                    ) : message.message_body.type === 'audio' ? (
                      <AudioPlayerCustom
                        audioPlayingId={audioPlayingId}
                        perviousPlayingAudioId={perviousPlayingAudioId}
                        onAudioPlayPress={(id) => onAudioPlayPress(id)}
                        postId={message.msg_id}
                        url={message.message_body.text}
                        isSmall={true}
                      />
                    ) : message.message_body.type === 'doc' ? (
                      <Fragment>
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: Fonts.light,
                            fontWeight: '500',
                          }}
                        >
                          {message.message_body.text
                            .split('/')
                            .pop()
                            .split('%2F')
                            .pop()}
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
                    ) : this.isContainUrl(message.message_body.text) ? (
                      <TouchableOpacity
                        onPress={() => this.openUrl(message.message_body.text)}
                        onLongPress={(msg_id) => {
                          onMessagePress(message.msg_id);
                        }}
                      >
                        <HyperLink linkStyle={{color: Colors.link_color}}>
                        <Text style={{ fontSize: 15, fontFamily: Fonts.light }}>
                          {message.message_body.text}
                        </Text>
                        </HyperLink>
                      </TouchableOpacity>
                    ) : (
                      <Text style={{ fontSize: 15, fontFamily: Fonts.light }}>
                        {message.message_body.text}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          ) : (
            <Animated.View style={[styles.talkBubble,animatedStyle]}>
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
                    message.message_body.type === 'audio' && {
                      minWidth: '100%',
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      paddingHorizontal:
                        message.message_body.type === 'image' ? 5 : 10,
                      paddingVertical:
                        message.message_body.type === 'image' ? 5 : 10,
                    }}
                    onLongPress={(msg_id) => {
                      onMessagePress(message.msg_id);
                    }}
                    onPress={() =>
                      message.message_body.type === 'doc'
                        ? this.onDocumentPress(message.message_body.text)
                          : message.message_body.type === 'image' ? this.onImagePress(message.message_body.text) : null
                    }
                    activeOpacity={0.8}
                  >
                    {
                    (message.reply_to
                      // &&
                      // Object.keys(message.reply_to).length !== 0 &&
                      // message.reply_to.constructor === Object
                      ) &&
                      this.renderReplyMessage(message.reply_to)
                      }

                    {message.message_body.type === 'image' &&
                    message.message_body.text !== null ? (
                      <ScalableImage
                        src={message.message_body.text}
                        borderRadius={borderRadius}
                      />
                    ) : message.message_body.type === 'video' ? (
                      <VideoPlayerCustom url={message.message_body.text} />
                    ) : message.message_body.type === 'audio' ? (
                      <AudioPlayerCustom
                        audioPlayingId={audioPlayingId}
                        perviousPlayingAudioId={perviousPlayingAudioId}
                        onAudioPlayPress={(id) => onAudioPlayPress(id)}
                        postId={message.msg_id}
                        url={message.message_body.text}
                        isSmall={true}
                      />
                    ) : message.message_body.type === 'doc' ? (
                      <Fragment>
                        <Text
                          style={{
                            color: Colors.white,
                            fontSize: 15,
                            fontWeight: '500',
                          }}
                        >
                          {message.message_body.text
                            .split('/')
                            .pop()
                            .split('%2F')
                            .pop()}
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
                    ) : this.isContainUrl(message.message_body.text) ? (
                      <TouchableOpacity
                        onPress={() => this.openUrl(message.message_body.text)}
                        onLongPress={(msg_id) => {
                          onMessagePress(message.msg_id);
                        }}
                      >
                        <HyperLink linkStyle={{color: Colors.link_color}}>
                        <Text style={{ color: 'white', fontSize: 15 }}>
                          {message.message_body.text}
                        </Text>
                        </HyperLink>
                      </TouchableOpacity>
                    ) : (
                      <Text style={{ color: 'white', fontSize: 15 }}>
                        {message.message_body.text}
                      </Text>
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              )}
            </Animated.View>
          )
        }
      >
        {message.message_body && message.message_body.type === 'text' && (
          <Menu.Item
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
        <Menu.Item
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
        {isUser &&
          isEditable > new Date() &&
          message.message_body &&
          message.message_body.type === 'text' && (
            <Menu.Item
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
            icon={() => (
              <FontAwesome5
                name={'minus-circle'}
                size={20}
                color={Colors.white}
              />
            )}
            onPress={() => {
              this.onUnSend(selectedMessageId);
              closeMenu();
            }}
            title={translate('common.unsend')}
            titleStyle={{ marginLeft: -25, color: Colors.white }}
          />
        )}
        {message.message_body && message.message_body.type === 'text' && (
          <Menu.Item
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
        {message.message_body && message.message_body.type !== 'text' && (
          <Menu.Item
            icon={() => (
              <FontAwesome name={'download'} size={20} color={Colors.white} />
            )}
            onPress={() => {
              onDownloadMessage(message);
              closeMenu();
            }}
            title={translate('pages.setting.download')}
            titleStyle={{ marginLeft: -25, color: Colors.white }}
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
    marginBottom: 15,
    marginTop: 5,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupChatMessageBubble);
