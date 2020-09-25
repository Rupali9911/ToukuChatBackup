import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
  Keyboard,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import GroupChatMessageBox from './GroupChatMessageBox';
import ChatInput from './TextInputs/ChatInput';
import {translate} from '../redux/reducers/languageReducer';
import {Colors, Fonts, Images, Icons} from '../constants';
import NoData from './NoData';
import {isIphoneX} from '../utils';
const {width, height} = Dimensions.get('window');

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
    const {memberCount} = this.props;
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
            memberCount={memberCount}
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

  searchItemIndex = (data, id, idx) => {
    var result = idx;
    data.map((item, index) => {
      if (item.msg_id === id) {
        result = index;
      }
    });
    return result;
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
      memberCount,
    } = this.props;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{flex: 1}}
        showsVerticalScrollIndicator={false}
        bounces={false}
        ref={(view) => {
          this.keyboardAwareScrollView = view;
        }}
        keyboardShouldPersistTaps={'always'}
        onKeyboardWillShow={(contentWidth, contentHeight) => {
          this.keyboardAwareScrollView.scrollToEnd({animated: false});
        }}
        keyboardOpeningTime={1500}
        extraHeight={200}>
        <View
          style={[
            chatStyle.messageAreaConatiner,
            {
              flex: Platform.OS==='ios'?0.95:1,
              paddingBottom:
                Platform.OS === 'android'
                  ? orientation === 'PORTRAIT'
                    ? height * 0
                    : height * 0.05
                  : orientation === 'PORTRAIT'
                  ? height * 0
                  : height * 0.03,
            },
          ]}>
          <Fragment>
            <FlatList
              style={{}}
              contentContainerStyle={[
                chatStyle.messareAreaScroll,
                isReply && {paddingBottom: '20%'},
              ]}
              ref={(view) => {
                this.scrollView = view;
              }}
              onContentSizeChange={(contentWidth, contentHeight) => {
                if (this.props.translatedMessageId) {
                } else {
                  // this.scrollView.scrollToEnd({ animated: false });
                }
              }}
              // getItemLayout={(data, index) => (
              //   {length: 250, offset: 250 * index, index}
              // )}
              onScrollBeginDrag={() => {
                this.closeMenu();
              }}
              onScrollEndDrag={() => {
                this.closeMenuFalse();
              }}
              data={messages}
              inverted={true}
              renderItem={({item, index}) => {
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
                return (
                  <Fragment key={index}>
                    <GroupChatMessageBox
                      ref={(view) => {
                        this[`message_box_${item.msg_id}`] = view;
                      }}
                      key={item.msg_id}
                      message={item}
                      isUser={
                        item.sender_id === this.props.userData.id ? true : false
                      }
                      time={new Date(item.timestamp)}
                      isRead={
                        item.read_count && item.read_count > 0 ? true : false
                      }
                      memberCount={memberCount}
                      onMessageReply={(id) => this.props.onMessageReply(id)}
                      orientation={this.props.orientation}
                      onMessageTranslate={(msg) =>
                        this.props.onMessageTranslate(msg)
                      }
                      onMessageTranslateClose={
                        this.props.onMessageTranslateClose
                      }
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
                      onReplyPress={(id) => {
                        this.scrollView.scrollToIndex({
                          animated: true,
                          index: this.searchItemIndex(messages, id, index),
                        });
                        this[`message_box_${id}`] &&
                          this[`message_box_${id}`].callBlinking(id);
                      }}
                    />
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
                  </Fragment>
                );
              }}
              ListEmptyComponent={() => (
                <NoData
                  title={translate('pages.xchat.startANewConversationHere')}
                  source={Images.image_conversation}
                  imageColor={Colors.primary}
                  imageAvailable
                  style={{transform: [{rotate: '180deg'}]}}
                  textStyle={{transform: [{rotateY: '180deg'}]}}
                />
              )}
            />
          </Fragment>
          {/* <ScrollView
            contentContainerStyle={[
              chatStyle.messareAreaScroll,
              isReply && { paddingBottom: '20%' },
            ]}
            ref={(view) => {
              this.scrollView = view;
            }}
            onContentSizeChange={(contentWidth, contentHeight) => {
              if(this.props.translatedMessageId){}else{
                this.scrollView.scrollToEnd({ animated: false });
              }
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
          </ScrollView> */}
          {isReply ? (
            <View
              style={{
                height: 80,
                width: '100%',
                backgroundColor: '#FFDBE9',
                // position: 'absolute',
                padding: 10,
                bottom: Platform.OS=='ios'?20:30,
                borderTopColor: Colors.gradient_1,
                borderTopWidth: 1,
              }}>
              <View
                style={{
                  flex: 3,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{flex: 8}}>
                  <Text numberOfLines={2} style={{color: Colors.gradient_1}}>
                    {repliedMessage.sender_id === this.props.userData.id
                      ? 'You'
                      : repliedMessage.sender_username}
                  </Text>
                </View>
                <View style={{flex: 2, alignItems: 'flex-end'}}>
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
                    onPress={cancelReply}>
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
              <View style={{flex: 7, justifyContent: 'center', width: '95%'}}>
                <Text numberOfLines={2} style={{fontFamily: Fonts.extralight}}>
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
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.light_pink,
    marginBottom: isIphoneX() ? 70 : 50,
  },
  messareAreaScroll: {flexGrow: 1, paddingBottom: 20},
  messageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messageDateCntainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  messageDate: {
    // backgroundColor: Colors.orange_light,
    // paddingVertical: 3,
    // paddingHorizontal: 11,
    // borderRadius: 18,
  },
  messageDateText: {
    color: Colors.dark_pink,
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
