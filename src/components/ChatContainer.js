import React, {Component, Fragment} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import ChatMessageBox from './ChatMessageBox';
import ChatInput from './TextInputs/ChatInput';
import {translate} from '../redux/reducers/languageReducer';
import {Colors, Fonts, Images, Icons} from '../constants';
import {isIphoneX} from '../../src/utils';
import NoData from './NoData';

import RoundedImage from './RoundedImage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import VideoThumbnailPlayer from './VideoThumbnailPlayer';
import CheckBox from './CheckBox';
import Button from './Button';

const {height} = Dimensions.get('window');

class ChatContainer extends Component {
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
      yesterday.setDate(today.getDate() - 1);
      const msgDate = new Date(date);
      if (
        today.getDate() === msgDate.getDate() &&
        today.getMonth() === today.getMonth()
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
        <Fragment>
          {(messages[index + 1] &&
            new Date(item.created).getDate() !==
              new Date(messages[index + 1].created).getDate()) ||
          index === conversationLength - 1 ? (
            item.message_body == null && !item.is_unsent ? null : (
              <Fragment>
                <View style={chatStyle.messageDateCntainer}>
                  <View style={chatStyle.messageDate}>
                    <Text style={chatStyle.messageDateText}>
                      {getDate(item.created)}
                    </Text>
                  </View>
                </View>
              </Fragment>
            )
          ) : null}
          <ChatMessageBox
            key={item.id}
            message={item}
            isUser={
              item.from_user.id == this.props.userData.id ||
              item.from_user == this.props.userData.id
                ? true
                : false
            }
            time={new Date(item.created)}
            isChannel={this.props.isChannel}
            currentChannel={this.props.currentChannel}
            is_read={item.is_read}
            onMessageReply={(id) => this.props.onMessageReply(id)}
            onMessageTranslate={(msg) => this.props.onMessageTranslate(msg)}
            onMessageTranslateClose={this.props.onMessageTranslateClose}
            onEditMessage={(msg) => this.props.onEditMessage(msg)}
            onDownloadMessage={(msg) => {
              this.props.onDownloadMessage(msg);
            }}
            translatedMessage={this.props.translatedMessage}
            translatedMessageId={this.props.translatedMessageId}
            onDelete={(id) => this.props.onDelete(id)}
            onUnSend={(id) => this.props.onUnSendMsg(id)}
            orientation={this.props.orientation}
            audioPlayingId={this.state.audioPlayingId}
            closeMenu={this.state.closeMenu}
            perviousPlayingAudioId={this.state.perviousPlayingAudioId}
            onAudioPlayPress={(id) => {
              this.setState({
                audioPlayingId: id,
                perviousPlayingAudioId: this.state.audioPlayingId,
              });
            }}
            showOpenLoader={this.props.showOpenLoader}
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
      if (item.id === id) {
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
      currentChannel,
      sendEnable,
      isMultiSelect,
      onSelect,
      selectedIds,
      onSelectedCancel,
      onSelectedDelete,
      currentFriend,
      isChatDisable
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
        scrollEnabled={false}
        extraHeight={200}>
        <View
          style={[
            chatStyle.messageAreaConatiner,
            {
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
              onContentSizeChange={() => {
                if (this.props.translatedMessageId) {
                } else {
                  // messages.length>0 && this.scrollView.scrollToIndex({index:0, animated: false });
                }
              }}
              // getItemLayout={(data, index) => (
              //   {length: 250, offset: 250 * index, index}
              // )}
              automaticallyAdjustContentInsets
              contentInsetAdjustmentBehavior={'automatic'}
              decelerationRate={'normal'}
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
                  yesterday.setDate(today.getDate() - 1);
                  const msgDate = new Date(date);
                  if (
                    today.getDate() === msgDate.getDate() &&
                    today.getMonth() === today.getMonth()
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
                let isSelected = selectedIds.includes(item.id + '');
                return (
                  <Fragment>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      {isMultiSelect && !item.is_unsent ? (
                        <CheckBox
                          isChecked={isSelected}
                          onCheck={() => onSelect(item.id)}
                        />
                      ) : null}
                      <TouchableOpacity
                        style={{flex: 1}}
                        disabled={!isMultiSelect}
                        onPress={() => {
                          isMultiSelect && !item.is_unsent && onSelect(item.id);
                        }}>
                        <ChatMessageBox
                          ref={(view) => {
                            this[`message_box_${item.id}`] = view;
                          }}
                          key={item.id}
                          message={item}
                          isUser={
                            item.from_user.id == this.props.userData.id ||
                            item.from_user == this.props.userData.id
                              ? item.to_user &&
                                item.to_user.id == this.props.userData.id
                                ? false
                                : item.schedule_post
                                ? false
                                : true
                              : false
                          }
                          time={new Date(item.created)}
                          isChannel={this.props.isChannel}
                          currentChannel={this.props.currentChannel}
                          is_read={item.is_read}
                          onMessageReply={(id) => this.props.onMessageReply(id)}
                          onMessageTranslate={(msg) =>
                            this.props.onMessageTranslate(msg)
                          }
                          onMessageTranslateClose={
                            this.props.onMessageTranslateClose
                          }
                          onEditMessage={(msg) => this.props.onEditMessage(msg)}
                          onDownloadMessage={(msg) => {
                            this.props.onDownloadMessage(msg);
                          }}
                          translatedMessage={this.props.translatedMessage}
                          translatedMessageId={this.props.translatedMessageId}
                          onDelete={(id) => this.props.onDelete(id)}
                          onUnSend={(id) => this.props.onUnSendMsg(id)}
                          orientation={this.props.orientation}
                          audioPlayingId={this.state.audioPlayingId}
                          closeMenu={this.state.closeMenu}
                          perviousPlayingAudioId={
                            this.state.perviousPlayingAudioId
                          }
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
                          showOpenLoader={this.props.showOpenLoader}
                          isMultiSelect={isMultiSelect}
                        />
                      </TouchableOpacity>
                    </View>
                    {(messages[index + 1] &&
                      new Date(item.created).getDate() !==
                        new Date(messages[index + 1].created).getDate()) ||
                    index === conversationLength - 1 ? (
                      item.message_body == null && !item.is_unsent ? null : (
                        <Fragment>
                          <View style={chatStyle.messageDateCntainer}>
                            <View style={chatStyle.messageDate}>
                              <Text style={chatStyle.messageDateText}>
                                {getDate(item.created)}
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
            onContentSizeChange={() => {
              if(this.props.translatedMessageId){

              }else{
                this.scrollView.scrollToEnd({ animated: false });
              }
            }}
            automaticallyAdjustContentInsets
            contentInsetAdjustmentBehavior={'automatic'}
            decelerationRate={'fast'}
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
                height: repliedMessage.msg_type !== 'text' ? 100 : 80,
                width: '100%',
                backgroundColor: '#FFDBE9',
                // position: 'absolute',
                padding: 10,
                // bottom: Platform.OS=='ios'?20:30,
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
                    {this.props.isChannel ||
                    repliedMessage.from_user.id === this.props.userData.id
                      ? repliedMessage.from_user.id === this.props.userData.id
                        ? 'You'
                        : repliedMessage.from_user.display_name
                        ? repliedMessage.from_user.display_name
                        : repliedMessage.from_user.username
                      : currentFriend.display_name
                      ? currentFriend.display_name
                      : currentFriend.username}
                  </Text>
                </View>
                <View style={{flex: 2, alignItems: 'flex-end'}}>
                  <TouchableOpacity
                    style={{
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
                {repliedMessage.msg_type === 'image' &&
                repliedMessage.message_body !== null ? (
                  <RoundedImage
                    source={{url: repliedMessage.message_body}}
                    isRounded={false}
                    size={50}
                  />
                ) : repliedMessage.msg_type === 'video' ? (
                  <VideoThumbnailPlayer url={repliedMessage.message_body} />
                ) : repliedMessage.msg_type === 'audio' ? (
                  <Fragment>
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 15,
                        fontWeight: '500',
                        fontFamily: Fonts.light,
                      }}>
                      {repliedMessage.message_body
                        .split('/')
                        .pop()
                        .split('%2F')
                        .pop()}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 5,
                      }}>
                      <FontAwesome
                        name={'volume-up'}
                        size={15}
                        color={Colors.black_light}
                      />
                      <Text
                        style={{
                          color: Colors.dark_gray,
                          fontSize: 13,
                          marginLeft: 5,
                          fontFamily: Fonts.light,
                        }}>
                        Audio
                      </Text>
                    </View>
                  </Fragment>
                ) : repliedMessage.msg_type === 'doc' ? (
                  <Fragment>
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 15,
                        fontWeight: '500',
                        fontFamily: Fonts.light,
                      }}>
                      {repliedMessage.message_body
                        .split('/')
                        .pop()
                        .split('%2F')
                        .pop()}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 5,
                      }}>
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
                        }}>
                        File
                      </Text>
                    </View>
                  </Fragment>
                ) : (
                  <Text numberOfLines={2} style={{fontFamily: Fonts.regular}}>
                    {repliedMessage.message_body}
                  </Text>
                )}
                {/* <Text numberOfLines={2} style={{fontFamily: Fonts.regular}}>
                  {repliedMessage.message_body}
                </Text> */}
              </View>
            </View>
          ) : null}
        </View>
        {isMultiSelect ? (
          <View
            style={{
              backgroundColor: Colors.light_pink,
              flexDirection: 'row',
              borderTopColor: Colors.pink_chat,
              borderTopWidth: 3,
              paddingBottom: 20,
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <View style={{flex: 1}}>
              <Button
                title={translate(`common.cancel`)}
                onPress={onSelectedCancel}
                isRounded={true}
                type={'secondary'}
                fontType={'smallRegularText'}
                height={40}
              />
            </View>
            <View style={{flex: 0.3}} />
            <View style={{flex: 1}}>
              <Button
                title={translate(`common.delete`) + ` (${selectedIds.length})`}
                onPress={onSelectedDelete}
                isRounded={true}
                fontType={'smallRegularText'}
                height={40}
              />
            </View>
          </View>
        ) : (
          isChatDisable?null:<ChatInput
            onAttachmentPress={() => onAttachmentPress()}
            onCameraPress={() => onCameraPress()}
            onGalleryPress={() => onGalleryPress()}
            onChangeText={(message) => handleMessage(message)}
            onSend={() => {
              onMessageSend();
              messages.length > 0 &&
                this.scrollView &&
                this.scrollView.scrollToIndex({index: 0, animated: false});
            }}
            value={newMessageText}
            sendEnable={sendEnable}
            placeholder={translate('pages.xchat.enterMessage')}
            sendingImage={sendingImage}
          />
        )}
      </KeyboardAwareScrollView>
    );
  }
}

const chatStyle = StyleSheet.create({
  messageAreaConatiner: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.light_pink,
    // marginBottom: isIphoneX() ? 70 : 50,
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
    // backgroundColor: Colors.orange_header,
    // paddingVertical: 4,
    // paddingHorizontal: 11,
    // borderRadius: 18,
  },
  messageDateText: {
    color: Colors.dark_pink,
    fontFamily: Fonts.medium,
    fontSize: 13,
    fontWeight: '300',
  },
});

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
    currentChannel: state.channelReducer.currentChannel,
    currentFriend: state.friendReducer.currentFriend,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);
