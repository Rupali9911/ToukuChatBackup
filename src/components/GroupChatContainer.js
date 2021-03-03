import React, {Component, Fragment} from 'react';
import {
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
import {KeyboardAwareScrollView, KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import GroupChatMessageBox from './GroupChatMessageBox';
import ChatInput from './TextInputs/ChatInput';
import {translate} from '../redux/reducers/languageReducer';
import {Colors, Fonts, Images, Icons} from '../constants';
import NoData from './NoData';
import {isIphoneX, getUserName, getUser_ActionFromUpdateText, normalize} from '../utils';
import RoundedImage from './RoundedImage';
import VideoPlayerCustom from './VideoPlayerCustom';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import VideoThumbnailPlayer from './VideoThumbnailPlayer';
import CheckBox from './CheckBox';
import Button from './Button';

import Menu from '../components/Menu/Menu';
import MenuItem from '../components/Menu/MenuItem';
import { ListLoader } from './Loaders';
import Toast from './Toast';

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
    const {memberCount, groupMembers} = this.props;
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
            groupMembers={groupMembers}
            showOpenLoader={this.props.showOpenLoader}
          />
        </Fragment>
      );
    });

    return <Fragment>{msg.reverse()}</Fragment>;
  };

  renderGroupUpdate = (message) => {
    let update_text = '';
    if(message && message.message_body.type === 'update'){
      let update_obj = getUser_ActionFromUpdateText(message.message_body.text);
      let update_by = message.sender_id == this.props.userData.id ? translate('pages.xchat.you') : getUserName(message.sender_id) || message.sender_display_name || message.sender_username;
      let update_to = update_obj.user_id == this.props.userData.id ? translate('pages.xchat.you') : getUserName(update_obj.user_id) || update_obj.user_name;
      // console.log('update_to',update_obj);
      if(update_obj.action==='left'){
        update_text = translate('common.leftGroup',{username: update_by});
      }else if(update_obj.action==='added'){
        update_text = translate('common.addedInGroup',{username: update_by,toUsername: update_to});
      }else if(update_obj.action==='removed'){
        update_text = translate('common.removedToGroup',{username: update_by,toUsername: update_to});
      }
      return update_text;
    }
  }

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

  hideMenu = (id) => {
    this[`_menu_${id}`] && this[`_menu_${id}`].hide();
    this.setState({ visible: false });
  };

  showMenu = (id) => {
    this[`_menu_${id}`] && this[`_menu_${id}`].show();
    this.setState({ visible: true });
  };

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
      groupMembers,
      isMultiSelect,
      onSelect,
      selectedIds,
      onSelectedCancel,
      onSelectedDelete,
      isChatDisable,
      groupLoading,
      onLoadMore,
      loading,
      isLoadMore
    } = this.props;
    // console.log('isChatDisable', isChatDisable);
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
            <KeyboardAwareFlatList
              style={{}}
              enableResetScrollToCoords={false}
              contentContainerStyle={[
                chatStyle.messareAreaScroll,
                isReply && {paddingBottom: '20%'},
              ]}
              innerRef={(view) => {
                this.scrollView = view;
              }}
              onContentSizeChange={(contentWidth, contentHeight) => {
                if (this.props.translatedMessageId) {
                } else {
                  // messages.length>0 && this.scrollView.scrollToIndex({index:0, animated: false });
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
              extraData={this.state}
              data={messages}
              inverted={true}
              onEndReached={()=>{
                console.log('onEndReached',groupLoading);
                if(messages.length>0 && messages.length % 20 === 0 && isLoadMore &&!groupLoading){
                  console.log('load more');
                  onLoadMore && onLoadMore(messages[messages.length - 1]);
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={()=>(messages.length % 20 === 0 && isLoadMore)?<ListLoader />:null}
              renderItem={({item, index}) => {
                const conversationLength = messages.length;
                let isSelected = selectedIds.includes(item.msg_id + '');
                return (
                  <Fragment key={`${index}`}>
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                      {isMultiSelect && !item.is_unsent ? (
                        <CheckBox
                          isChecked={isSelected}
                          onCheck={() => onSelect(item.msg_id)}
                        />
                      ) : null}
                      {(item.message_body && item.message_body.type && item.message_body.type === 'update') ?
                        <TouchableOpacity
                          style={{ width:'100%', marginLeft: isMultiSelect?-35:0}}
                          onPress={() => {
                            isMultiSelect &&
                              !item.is_unsent &&
                              onSelect(item.msg_id);
                          }}>
                          <Menu
                            ref={(ref) => {
                              this[`_menu_${item.msg_id}`] = ref;
                            }}
                            style={{
                              marginTop: 15,
                              marginLeft: 20,
                              backgroundColor: Colors.gradient_3,
                              opacity: 0.9,
                            }}
                            tabHeight={110}
                            headerHeight={80}
                            button={
                              <TouchableOpacity
                                disabled={isMultiSelect}
                                onLongPress={() => {
                                  this.showMenu(item.msg_id);
                                }}
                                style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                                <View style={{maxWidth: '90%', backgroundColor: Colors.update_bg, padding: normalize(5), paddingHorizontal: normalize(8), borderRadius: 12 }}>
                                  <Text style={[chatStyle.messageDateText]}>
                                    {this.renderGroupUpdate(item)}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            }>
                            <MenuItem
                              onPress={() => {
                                this.props.onDelete(item.msg_id);
                                this.hideMenu(item.msg_id);
                              }}
                              customComponent={
                                <View style={{ flex: 1, flexDirection: 'row', margin: 15 }}>
                                  <FontAwesome5 name={'trash'} size={20} color={Colors.white} />
                                  <Text style={{ marginLeft: 10, color: '#fff' }}>
                                    {translate('common.delete')}
                                  </Text>
                                </View>
                              }
                            />
                          </Menu>
                        </TouchableOpacity>
                    :
                      <TouchableOpacity
                        style={{flex: 1}}
                        disabled={!isMultiSelect}
                        onPress={() => {
                          isMultiSelect &&
                            !item.is_unsent &&
                            onSelect(item.msg_id);
                        }}>
                        <GroupChatMessageBox
                          ref={(view) => {
                            this[`message_box_${item.msg_id}`] = view;
                          }}
                          key={item.msg_id}
                          message={item}
                          isUser={
                            item.sender_id === this.props.userData.id
                              ? true
                              : false
                          }
                          time={new Date(item.created)}
                          isRead={
                            item.read_count && item.read_count > 0
                              ? true
                              : false
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
                          perviousPlayingAudioId={
                            this.state.perviousPlayingAudioId
                          }
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
                          groupMembers={groupMembers}
                          showOpenLoader={this.props.showOpenLoader}
                          isMultiSelect={isMultiSelect}
                        />
                      </TouchableOpacity>}
                    </View>
                    {(messages[index + 1] &&
                      new Date(item.created).getDate() !==
                        new Date(messages[index + 1].created).getDate()) ||
                    index === conversationLength - 1 ? (
                      item.message_body == null ? null : (
                        <Fragment>
                          <View style={chatStyle.messageDateCntainer}>
                            <View style={chatStyle.messageDate}>
                              <Text style={chatStyle.messageDateText}>
                                {this.getDate(item.created)}
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
                height: repliedMessage.message_body.type !== 'text' ? 100 : 80,
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
                    {repliedMessage.sender_id === this.props.userData.id
                      ? translate('pages.xchat.you')
                      : repliedMessage.sender_display_name
                      ? repliedMessage.sender_display_name
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
                {repliedMessage.message_body.type === 'image' &&
                repliedMessage.message_body.text !== null ? (
                  <RoundedImage
                    source={{url: repliedMessage.message_body.text}}
                    isRounded={false}
                    size={50}
                  />
                ) : repliedMessage.message_body.type === 'video' ? (
                  <VideoThumbnailPlayer
                    url={repliedMessage.message_body.text}
                    showPlayButton
                  />
                ) : repliedMessage.message_body.type === 'audio' ? (
                  <Fragment>
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 15,
                        fontWeight: '500',
                        fontFamily: Fonts.light,
                      }}>
                      {repliedMessage.message_body.text
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
                ) : repliedMessage.message_body.type === 'doc' ? (
                  <Fragment>
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 15,
                        fontWeight: '500',
                        fontFamily: Fonts.light,
                      }}>
                      {repliedMessage.message_body.text
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
                    {repliedMessage.message_body.text}
                  </Text>
                )}
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
                title={translate(`common.delete`) + (selectedIds.length?` (${selectedIds.length})`:'')}
                onPress={()=>{
                  if(selectedIds.length){
                    onSelectedDelete();
                  }else{
                    Toast.show({
                      title: translate('pages.xchat.touku'),
                      text: translate('pages.xchat.invalidMsgDelete'),
                      type: 'primary'
                    });
                  }
                }}
                isRounded={true}
                fontType={'smallRegularText'}
                height={40}
              />
            </View>
          </View>
        ) : isChatDisable === false ? null : (
          <ChatInput
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
            groupMembers={groupMembers}
            currentUserData={this.props.userData}
            useMentionsFunctionality={this.props.useMentionsFunctionality}
            onSelectMention={this.props.onSelectMention}
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
    groupLoading: state.groupReducer.loading
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GroupChatContainer);
