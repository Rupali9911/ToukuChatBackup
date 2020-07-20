import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import GroupChatMessageBox from './GroupChatMessageBox';
import ChatInput from './TextInputs/ChatInput';
import { translate } from '../redux/reducers/languageReducer';
import { Colors, Fonts, Images, Icons } from '../constants';
import NoData from './NoData';
import { isIphoneX } from '../utils';
const { width, height } = Dimensions.get('window');

class GroupChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioPlayingId: null,
      perviousPlayingAudioId: null,
      closeMenu: false,
    };
  }

  renderMessage = (messages) => {
    if (!messages || !messages.length) {
      return (
        <NoData
          title={translate('pages.xchat.startANewConversationHere')}
          source={Images.image_conversation}
          imageColor={Colors.primary}
          imageAvailable
        />
      );
    }

    getDate = (date) => {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const msgDate = new Date(date);
      if (
        today.getDate() === msgDate.getDate() &&
        today.getMonth() === msgDate.getMonth()
      )
        return translate('common.today');
      if (
        yesterday.getDate() === msgDate.getDate() &&
        yesterday.getMonth() === msgDate.getMonth()
      )
        return translate('common.yesterday');
      return moment(msgDate).format('MM/DD');
    };

    const conversationLength = messages.length;
    const msg = messages.map((item, index) => {
      return (
        <Fragment key={index}>
          {(messages[index + 1] &&
            new Date(item.timestamp).getDate() !==
              new Date(messages[index + 1].timestamp).getDate()) ||
          index === conversationLength - 1 ? (
            item.message_body == null ? null : (
              <Fragment>
                <View style={chatStyle.messageDateCntainer}>
                  <View style={chatStyle.messageDate}>
                    <Text style={chatStyle.messageDateText}>
                      {getDate(item.timestamp)}
                    </Text>
                  </View>
                </View>
              </Fragment>
            )
          ) : null}
          <GroupChatMessageBox
            key={item.msg_id}
            message={item}
            isUser={item.sender_id === this.props.userData.id ? true : false}
            time={new Date(item.timestamp)}
            isRead={item.read_count && item.read_count > 0 ? true : false}
            onMessageReply={(id) => this.props.onMessageReply(id)}
            orientation={this.props.orientation}
            onMessageTranslate={(msg) => this.props.onMessageTranslate(msg)}
            onMessageTranslateClose={this.props.onMessageTranslateClose}
            translatedMessage={this.props.translatedMessage}
            translatedMessageId={this.props.translatedMessageId}
            onDelete={(id) => this.props.onDelete(id)}
            onUnSend={(id) => this.props.onUnSendMsg(id)}
            onEditMessage={(msg) => this.props.onEditMessage(msg)}
            onDownloadMessage={(msg) => {
              this.props.onDownloadMessage(msg);
            }}
            audioPlayingId={this.state.audioPlayingId}
            perviousPlayingAudioId={this.state.perviousPlayingAudioId}
            closeMenu={this.state.closeMenu}
            onAudioPlayPress={(id) => {
              this.setState({
                audioPlayingId: id,
                perviousPlayingAudioId: this.state.audioPlayingId,
              });
            }}
          />
        </Fragment>
      );
    });

    return <Fragment>{msg.reverse()}</Fragment>;
  };

  closeMenu = () => {
    if (!this.state.closeMenu) {
      this.setState({
        closeMenu: true,
      });
    }
  };

  closeMenuFalse = () => {
    if (this.state.closeMenu) {
      this.setState({
        closeMenu: false,
      });
    }
  };

  render() {
    const {
      orientation,
      isReply,
      messages,
      repliedMessage,
      handleMessage,
      onMessageSend,
      newMessageText,
      cancelReply,
      onCameraPress,
      onGalleryPress,
      onAttachmentPress,
      sendingImage,
    } = this.props;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        ref={(view) => {
          this.keyboardAwareScrollView = view;
        }}
        keyboardShouldPersistTaps={'always'}
        onKeyboardWillShow={(contentWidth, contentHeight) => {
          this.keyboardAwareScrollView.scrollToEnd({ animated: false });
        }}
        keyboardOpeningTime={1500}
        extraHeight={200}
      >
        <View
          style={[
            chatStyle.messageAreaConatiner,
            {
              paddingBottom:
                Platform.OS === 'android'
                  ? orientation === 'PORTRAIT'
                    ? height * 0.03
                    : height * 0.05
                  : orientation === 'PORTRAIT'
                  ? height * 0.01
                  : height * 0.03,
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={[
              chatStyle.messareAreaScroll,
              isReply && { paddingBottom: '20%' },
            ]}
            ref={(view) => {
              this.scrollView = view;
            }}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: false });
            }}
            onScrollBeginDrag={() => {
              this.closeMenu();
            }}
            onScrollEndDrag={() => {
              this.closeMenuFalse();
            }}
          >
            <View style={chatStyle.messageContainer}>
              {this.renderMessage(messages)}
            </View>
          </ScrollView>
          {isReply ? (
            <View
              style={{
                height: '12%',
                width: '100%',
                backgroundColor: '#FFDBE9',
                position: 'absolute',
                padding: 10,
                bottom: 20,
                borderTopColor: Colors.gradient_1,
                borderTopWidth: 1,
              }}
            >
              <View
                style={{
                  flex: 3,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 8 }}>
                  <Text numberOfLines={2} style={{ color: Colors.gradient_1 }}>
                    {repliedMessage.sender_id === this.props.userData.id
                      ? 'You'
                      : repliedMessage.sender_username}
                  </Text>
                </View>
                <View style={{ flex: 2, alignItems: 'flex-end' }}>
                  <TouchableOpacity
                    style={{
                      //   paddingHorizontal: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '70%',
                      width: '18%',
                      borderRadius: 100,
                      backgroundColor: Colors.gradient_1,
                    }}
                    onPress={cancelReply}
                  >
                    <Image
                      source={Icons.icon_close}
                      style={{
                        tintColor: Colors.white,
                        height: '50%',
                        width: '100%',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flex: 7, justifyContent: 'center', width: '95%' }}>
                <Text
                  numberOfLines={2}
                  style={{ fontFamily: Fonts.extralight }}
                >
                  {repliedMessage.message_body.text}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        <ChatInput
          onAttachmentPress={() => onAttachmentPress()}
          onCameraPress={() => onCameraPress()}
          onGalleryPress={() => onGalleryPress()}
          onChangeText={(message) => handleMessage(message)}
          onSend={onMessageSend}
          value={newMessageText}
          placeholder={translate('pages.xchat.enterMessage')}
          sendingImage={sendingImage}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const chatStyle = StyleSheet.create({
  messageAreaConatiner: {
    flex: 0.95,
    justifyContent: 'flex-end',
  },
  messareAreaScroll: { flexGrow: 1, paddingBottom: 20 },
  messageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messageDateCntainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  messageDate: {
    backgroundColor: Colors.orange_light,
    paddingVertical: 3,
    paddingHorizontal: 11,
    borderRadius: 18,
  },
  messageDateText: {
    color: Colors.white,
    fontFamily: Fonts.regular,
    fontSize: 13,
    fontWeight: '300',
  },
});

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GroupChatContainer);
